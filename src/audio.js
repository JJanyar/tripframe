// Finds sudden loud sounds in a clip (a bump, a horn, a shout), by reading only
// the AAC audio samples and decoding them through ADTS headers.

import { readTracks, adtsHeader } from './mp4.js';

/** Mono samples at 8 kHz, or null when the clip has no AAC sound. */
export async function readSound(file) {
  const a = (await readTracks(file))?.audio;
  if (!a?.adts || !a.samples.length) return null;
  // Samples that follow each other in the file are read in one go.
  const runs = [];
  for (const s of a.samples) {
    const last = runs.at(-1);
    if (last && last.end === s.offset && last.end - last.start < 4 * 1024 * 1024) {
      last.end += s.size;
      last.list.push(s);
    } else runs.push({ start: s.offset, end: s.offset + s.size, list: [s] });
  }
  const out = new Uint8Array(a.samples.reduce((n, s) => n + s.size + 7, 0));
  let p = 0;
  for (const run of runs) {
    const buf = new Uint8Array(await file.slice(run.start, run.end).arrayBuffer());
    let q = 0;
    for (const s of run.list) {
      out.set(adtsHeader(a, s.size), p);
      out.set(buf.subarray(q, q + s.size), p + 7);
      p += s.size + 7;
      q += s.size;
    }
  }
  const decoded = await new OfflineAudioContext(1, 1, 8000).decodeAudioData(out.buffer);
  const mono = new Float32Array(decoded.length);
  for (let c = 0; c < decoded.numberOfChannels; c++) {
    const ch = decoded.getChannelData(c);
    for (let i = 0; i < mono.length; i++) mono[i] += ch[i] / decoded.numberOfChannels;
  }
  return { samples: mono, rate: decoded.sampleRate };
}

/**
 * Moments where the sound jumps well above what came just before.
 * Levels are measured over 50 ms; the background is the median of the
 * previous 3 seconds. Returns [{ t, rise }] in seconds and dB.
 */
export function loudMoments(samples, rate, { rise = 12, floor = -35, gap = 1.5 } = {}) {
  const win = Math.max(1, Math.round(rate * 0.05));
  const levels = [];
  for (let i = 0; i + win <= samples.length; i += win) {
    let sum = 0;
    for (let k = i; k < i + win; k++) sum += samples[k] * samples[k];
    levels.push(10 * Math.log10(sum / win + 1e-12));
  }
  const history = Math.round(3 / 0.05);
  const found = [];
  for (let i = 10; i < levels.length; i++) {
    const before = levels.slice(Math.max(0, i - history), i).sort((a, b) => a - b);
    const base = before[before.length >> 1];
    const up = levels[i] - base;
    if (levels[i] < floor || up < rise) continue;
    const t = (i * win) / rate;
    const last = found.at(-1);
    if (last && t - last.t < gap) {
      if (up > last.rise) Object.assign(last, { t, rise: up });
    } else found.push({ t, rise: up });
  }
  return found;
}

const cache = new WeakMap();

/** Cached per file: null when the clip has no readable sound. */
export function findLoudMoments(file) {
  if (!cache.has(file)) {
    const p = readSound(file).then((sound) => (sound ? loudMoments(sound.samples, sound.rate) : null));
    cache.set(file, p);
    p.catch(() => cache.delete(file));
  }
  return cache.get(file);
}

/** Results already found for a file, without starting a search. */
export const knownLoudMoments = (file) => cache.get(file);
