// Joins the clips of a trip into a single MP4. One camera is joined without re-encoding: the
// compressed frames and sound are copied over with new timestamps. Both cameras in one
// picture (mergeLayout) are decoded, drawn and encoded again. Chrome and
// Edge write straight to a file on disk; other browsers build it in memory.

import { Muxer, ArrayBufferTarget, FileSystemWritableFileStreamTarget } from 'mp4-muxer';
import { readTracks } from './mp4.js';
import { CODECS } from './clip.js';

const MEMORY_LIMIT = 1.5e9;
const WINDOW = 16 * 1024 * 1024;

export class MergeError extends Error {
  constructor(code, file) {
    super(code);
    this.code = code;
    this.file = file;
  }
}

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

// Chrome and Edge stream to a file the user picks; elsewhere (or without picker) the file is built in memory.
async function openTarget(name, bytes, picker = true) {
  if (picker && window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'MP4', accept: { 'video/mp4': ['.mp4'] } }] });
    const stream = await handle.createWritable();
    return { stream, target: new FileSystemWritableFileStreamTarget(stream) };
  }
  if (bytes > MEMORY_LIMIT) throw new MergeError('tooLarge');
  return { stream: null, target: new ArrayBufferTarget() };
}

/**
 * @param {File[]} files in playing order
 * @returns {Promise<Blob|null>} the file in memory, or null when it was written to disk
 */
export async function mergeClips(files, { name, onProgress }) {
  const parts = [];
  for (const file of files) {
    const tr = await readTracks(file);
    if (!tr?.video) throw new MergeError('unreadable', file.name);
    parts.push({ file, ...tr });
  }
  const v0 = parts[0].video;
  for (const p of parts) {
    if (p.video.codec !== v0.codec || p.video.width !== v0.width || p.video.height !== v0.height || !same(p.video.config, v0.config)) throw new MergeError('different', p.file.name);
  }
  const a0 = parts[0].audio;
  const withAudio = !!a0 && parts.every((p) => p.audio && same(p.audio.config, a0.config));
  const total = files.reduce((n, f) => n + f.size, 0);
  const { stream, target } = await openTarget(name, total);

  try {
    const muxer = new Muxer({
      target,
      fastStart: stream ? false : 'in-memory',
      firstTimestampBehavior: 'offset',
      video: { codec: v0.codec, width: v0.width, height: v0.height },
      audio: withAudio ? { codec: 'aac', numberOfChannels: a0.channels, sampleRate: a0.rate } : undefined,
    });
    const videoMeta = { decoderConfig: { codec: v0.codec === 'avc' ? 'avc1' : 'hvc1', description: v0.config, codedWidth: v0.width, codedHeight: v0.height } };
    const audioMeta = withAudio ? { decoderConfig: { codec: 'mp4a.40.2', numberOfChannels: a0.channels, sampleRate: a0.rate, description: a0.config } } : null;

    let videoStart = 0; // µs where the current clip begins
    let audioEnd = 0;
    let done = 0;
    for (const p of parts) {
      const vs = p.video.timescale;
      const list = p.video.samples.map((s) => ({ s, video: true }));
      if (withAudio) list.push(...p.audio.samples.map((s) => ({ s, video: false })));
      list.sort((x, y) => x.s.offset - y.s.offset);
      // Sound of a clip may run slightly longer than its picture; never step back in time.
      const audioStart = Math.max(videoStart, audioEnd);

      let buf = null;
      let bufStart = 0;
      for (const { s, video } of list) {
        if (!buf || s.offset < bufStart || s.offset + s.size > bufStart + buf.length) {
          bufStart = s.offset;
          buf = new Uint8Array(await p.file.slice(s.offset, s.offset + Math.max(WINDOW, s.size)).arrayBuffer());
        }
        const data = buf.slice(s.offset - bufStart, s.offset - bufStart + s.size);
        if (video) {
          const ts = videoStart + (s.cts / vs) * 1e6;
          muxer.addVideoChunkRaw(data, s.key ? 'key' : 'delta', ts, (s.dur / vs) * 1e6, videoMeta, ((s.cts - s.dts) / vs) * 1e6);
        } else {
          const as = p.audio.timescale;
          const ts = audioStart + (s.dts / as) * 1e6;
          muxer.addAudioChunkRaw(data, 'key', ts, (s.dur / as) * 1e6, audioMeta);
          audioEnd = ts + (s.dur / as) * 1e6;
        }
      }
      videoStart += (p.video.duration / vs) * 1e6;
      done += p.file.size;
      onProgress?.(done / total);
    }
    muxer.finalize();
    if (stream) {
      await stream.close();
      return null;
    }
    return new Blob([target.buffer], { type: 'video/mp4' });
  } catch (e) {
    await stream?.abort?.().catch(() => {});
    throw e;
  }
}

// ---------- two cameras in one picture ----------

const hex = (n) => n.toString(16).padStart(2, '0');

/** The WebCodecs codec string for a track's avcC or hvcC box. */
export function codecString(v) {
  const c = v.config;
  if (v.codec === 'avc') return `avc1.${hex(c[1])}${hex(c[2])}${hex(c[3])}`;
  // hvc1.<space><profile>.<compatibility flags, bit-reversed>.<tier><level>.<constraint bytes>
  let compat = ((c[2] << 24) | (c[3] << 16) | (c[4] << 8) | c[5]) >>> 0;
  let reversed = 0;
  for (let i = 0; i < 32; i++, compat >>>= 1) reversed = ((reversed << 1) | (compat & 1)) >>> 0;
  const constraints = [...c.slice(6, 12)];
  while (constraints.length && !constraints.at(-1)) constraints.pop();
  return ['hvc1', ['', 'A', 'B', 'C'][c[1] >> 6] + (c[1] & 31), reversed.toString(16), ((c[1] >> 5) & 1 ? 'H' : 'L') + c[12], ...constraints.map((b) => b.toString(16).toUpperCase())].join('.');
}

export const canLayout = () => typeof VideoDecoder !== 'undefined' && typeof VideoEncoder !== 'undefined' && typeof OffscreenCanvas !== 'undefined';

// Reads samples of one file through a 16 MB window, as mergeClips does.
function reader(file) {
  let buf = null;
  let start = 0;
  return async (s) => {
    if (!buf || s.offset < start || s.offset + s.size > start + buf.length) {
      start = s.offset;
      buf = new Uint8Array(await file.slice(s.offset, s.offset + Math.max(WINDOW, s.size)).arrayBuffer());
    }
    return buf.subarray(s.offset - start, s.offset - start + s.size);
  };
}

// Decoded frames of a video track in playing order, a few at a time (the decoder runs out of frames otherwise).
async function* decoded(file, v) {
  const read = reader(file);
  const ready = [];
  let wake = () => {};
  let failed = null;
  let flushed = false;
  let flushing = null;
  const dec = new VideoDecoder({
    output: (f) => {
      ready.push(f);
      wake();
    },
    error: (e) => {
      failed = e;
      wake();
    },
  });
  dec.addEventListener('dequeue', () => wake());
  dec.configure({ codec: codecString(v), description: v.config, codedWidth: v.width, codedHeight: v.height });
  let i = 0;
  try {
    for (;;) {
      if (failed) throw failed;
      while (i < v.samples.length && ready.length < 3 && dec.decodeQueueSize < 6) {
        const s = v.samples[i++];
        const data = await read(s);
        dec.decode(new EncodedVideoChunk({ type: s.key ? 'key' : 'delta', timestamp: Math.round((s.cts / v.timescale) * 1e6), duration: Math.round((s.dur / v.timescale) * 1e6), data }));
      }
      if (i >= v.samples.length && !flushing) {
        flushing = dec.flush().then(
          () => {
            flushed = true;
            wake();
          },
          (e) => {
            failed = e;
            wake();
          },
        );
      }
      if (ready.length) yield ready.shift();
      else if (flushed) return;
      else await new Promise((r) => (wake = r));
    }
  } finally {
    for (const f of ready) f.close();
    if (dec.state !== 'closed') dec.close();
  }
}

const SIZE = { pip: [1920, 1080], side: [2560, 720] };

/**
 * Joins clips of two cameras into one picture: the second camera inset in the
 * first ('pip') or the two next to each other, first on the left ('side').
 * Every frame is decoded, drawn and encoded again, so this takes much longer
 * than mergeClips. The sound of the first camera is copied as it is.
 * @param {{first?: File, second?: File}[]} moments in playing order
 * @param {{layout: 'pip'|'side', name: string, onProgress?: (f: number) => void, signal?: AbortSignal, picker?: boolean}} o
 *   picker: false builds the file in memory instead of asking where to save it
 * @returns {Promise<Blob|null>} the file in memory, or null when it was written to disk
 */
export async function mergeLayout(moments, { layout, name, onProgress, signal, picker = true }) {
  const parts = [];
  const checked = new Set();
  for (const m of moments) {
    const p = {};
    for (const cam of ['first', 'second']) {
      if (!m[cam]) continue;
      const tr = await readTracks(m[cam]);
      if (!tr?.video) throw new MergeError('unreadable', m[cam].name);
      const codec = codecString(tr.video);
      if (!checked.has(codec)) {
        const cfg = { codec, description: tr.video.config, codedWidth: tr.video.width, codedHeight: tr.video.height };
        if (!(await VideoDecoder.isConfigSupported(cfg).catch(() => ({}))).supported) throw new MergeError('noDecode', m[cam].name);
        checked.add(codec);
      }
      p[cam] = { file: m[cam], ...tr };
    }
    if (p.first || p.second) parts.push({ ...p, main: p.first || p.second });
  }
  if (!parts.length) throw new MergeError('unreadable', '');

  const [W, H] = SIZE[layout];
  const v0 = parts[0].main.video;
  const fps = Math.min(60, Math.round(v0.samples.length / (v0.duration / v0.timescale)) || 30);
  const bitrate = 8e6; // about 3.6 GB per hour
  let config = null;
  for (const codec of CODECS) {
    const cfg = { codec, width: W, height: H, bitrate, framerate: fps };
    if ((await VideoEncoder.isConfigSupported(cfg).catch(() => ({}))).supported) {
      config = cfg;
      break;
    }
  }
  if (!config) throw new MergeError('noEncode');

  const seconds = parts.reduce((n, p) => n + p.main.video.duration / p.main.video.timescale, 0);
  const frames = parts.reduce((n, p) => n + p.main.video.samples.length, 0);
  const a0 = parts[0].main.audio;
  const withAudio = !!a0 && parts.every((p) => p.main.audio && same(p.main.audio.config, a0.config));
  const { stream, target } = await openTarget(name, (bitrate / 8) * seconds, picker);

  const canvas = new OffscreenCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const fit = (f, x, y, w, h) => {
    const s = Math.min(w / f.displayWidth, h / f.displayHeight);
    ctx.drawImage(f, x + (w - f.displayWidth * s) / 2, y + (h - f.displayHeight * s) / 2, f.displayWidth * s, f.displayHeight * s);
  };
  const draw = (first, second) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    if (layout === 'side') {
      if (first) fit(first, 0, 0, W / 2, H);
      if (second) fit(second, W / 2, 0, W / 2, H);
      return;
    }
    fit(first || second, 0, 0, W, H);
    if (!first || !second) return;
    // The second camera bottom right, like picture in picture in the viewer.
    const w = Math.round(W * 0.3);
    const h = Math.round((w * second.displayHeight) / second.displayWidth);
    const x = W - w - 30;
    const y = H - h - 30;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#0e0f12';
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(second, x, y, w, h);
    ctx.restore();
  };

  let failed = null;
  try {
    const muxer = new Muxer({
      target,
      fastStart: stream ? false : 'in-memory',
      firstTimestampBehavior: 'offset',
      video: { codec: 'avc', width: W, height: H, frameRate: fps },
      audio: withAudio ? { codec: 'aac', numberOfChannels: a0.channels, sampleRate: a0.rate } : undefined,
    });
    const audioMeta = withAudio ? { decoderConfig: { codec: 'mp4a.40.2', numberOfChannels: a0.channels, sampleRate: a0.rate, description: a0.config } } : null;
    const encoder = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => (failed = e) });
    encoder.configure(config);

    let start = 0; // µs where the current clip begins
    let audioEnd = 0;
    let n = 0;
    for (const p of parts) {
      if (withAudio) {
        const read = reader(p.main.file);
        const as = p.main.audio.timescale;
        const audioStart = Math.max(start, audioEnd);
        for (const s of p.main.audio.samples) {
          const ts = audioStart + (s.dts / as) * 1e6;
          muxer.addAudioChunkRaw((await read(s)).slice(), 'key', ts, (s.dur / as) * 1e6, audioMeta);
          audioEnd = ts + (s.dur / as) * 1e6;
        }
      }
      // The main camera sets the clock; the other shows its latest frame at that time.
      const other = p.first && p.second ? decoded(p.second.file, p.second.video) : null;
      let cur = null;
      let next = other ? (await other.next()).value : null;
      try {
        for await (const f of decoded(p.main.file, p.main.video)) {
          while (next && next.timestamp <= f.timestamp + 5000) {
            cur?.close();
            cur = next;
            next = (await other.next()).value ?? null;
          }
          if (failed) throw failed;
          if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
          draw(p.first ? f : null, p.first ? cur : f);
          const out = new VideoFrame(canvas, { timestamp: Math.round(start + f.timestamp), duration: Math.round(1e6 / fps) });
          f.close();
          encoder.encode(out, { keyFrame: n % (fps * 2) === 0 });
          out.close();
          n++;
          while (encoder.encodeQueueSize > 4) await new Promise((r) => setTimeout(r, 2));
          if (n % 10 === 0) onProgress?.(n / frames);
        }
      } finally {
        cur?.close();
        next?.close();
        await other?.return();
      }
      start += (p.main.video.duration / p.main.video.timescale) * 1e6;
    }
    await encoder.flush();
    encoder.close();
    if (failed) throw failed;
    muxer.finalize();
    onProgress?.(1);
    if (stream) {
      await stream.close();
      return null;
    }
    return new Blob([target.buffer], { type: 'video/mp4' });
  } catch (e) {
    await stream?.abort?.().catch(() => {});
    throw e;
  }
}
