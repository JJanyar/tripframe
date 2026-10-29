// Generates thumbnails locally from the first seconds of each clip, a few at a time,
// and caches them in IndexedDB so reopening the same card is instant.

import { idbGet, idbSet } from './scan.js';
import { readTracks } from './mp4.js';
import { codecString } from './merge.js';

const WIDTH = 480;
const MAX_ACTIVE = 3;
const memory = new Map();
const queue = [];
let active = 0;

const cacheKey = (clip) => `${clip.path}|${clip.size}|${clip.file.lastModified}`;

export function requestThumb(clip) {
  const key = cacheKey(clip);
  if (memory.has(key)) return memory.get(key);
  const p = new Promise((resolve) => queue.push({ clip, key, resolve }));
  memory.set(key, p);
  pump();
  return p;
}

// Thumbnails for tiles that scrolled into view jump ahead of the rest.
export function prioritize(clip) {
  const key = cacheKey(clip);
  const i = queue.findIndex((q) => q.key === key);
  if (i > 0) queue.unshift(...queue.splice(i, 1));
}

// Forgets thumbnails still waiting (not the ones being made), e.g. of clips a filter just hid.
export function dropQueued() {
  for (const q of queue) memory.delete(q.key);
  queue.length = 0;
}

function pump() {
  while (active < MAX_ACTIVE && queue.length) {
    const job = queue.shift();
    active++;
    build(job.clip, job.key)
      .then(job.resolve, () => job.resolve(null))
      .finally(() => {
        active--;
        pump();
      });
  }
}

async function build(clip, key) {
  const cached = await idbGet('thumbs', key);
  if (cached?.blob) return { url: URL.createObjectURL(cached.blob), duration: cached.duration };

  const result = clip.isPhoto ? await fromImage(clip.file) : ((await fromKeyframe(clip.file).catch(() => null)) ?? (await fromVideo(clip.file)));
  if (!result) return null;
  if (!result.blob) return { url: null, duration: result.duration };
  idbSet('thumbs', key, result);
  return { url: URL.createObjectURL(result.blob), duration: result.duration };
}

function toBlob(source, w, h) {
  const scale = WIDTH / w;
  const c = document.createElement('canvas');
  c.width = WIDTH;
  c.height = Math.round(h * scale);
  c.getContext('2d').drawImage(source, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob(res, 'image/jpeg', 0.78));
}

async function fromImage(file) {
  const bmp = await createImageBitmap(file);
  const blob = await toBlob(bmp, bmp.width, bmp.height);
  bmp.close();
  return { blob, duration: null };
}

// One keyframe near 1.5 s decoded on its own: reads the header and that frame (a few hundred KB)
// instead of playing the first seconds of the clip. Null when the browser or codec can't, so the
// <video> way below takes over.
async function fromKeyframe(file) {
  if (typeof VideoDecoder === 'undefined' || !/\.(mp4|mov)$/i.test(file.name)) return null;
  const v = (await readTracks(file))?.video;
  if (!v) return null;
  const duration = v.duration / v.timescale;
  const at = Math.min(1.5, duration / 4) * v.timescale;
  const s = v.samples.findLast((x) => x.key && x.cts <= at) ?? v.samples.find((x) => x.key);
  if (!s) return null;
  const data = new Uint8Array(await file.slice(s.offset, s.offset + s.size).arrayBuffer());
  const frames = [];
  const dec = new VideoDecoder({ output: (f) => frames.push(f), error: () => {} });
  try {
    dec.configure({ codec: codecString(v), description: v.config, codedWidth: v.width, codedHeight: v.height });
    dec.decode(new EncodedVideoChunk({ type: 'key', timestamp: 0, data }));
    await dec.flush();
  } finally {
    if (dec.state !== 'closed') dec.close();
  }
  const [frame, ...rest] = frames;
  rest.forEach((f) => f.close());
  if (!frame) return null;
  try {
    return { blob: await toBlob(frame, frame.displayWidth, frame.displayHeight), duration };
  } finally {
    frame.close();
  }
}

function once(el, ok, ms = 10000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    el.addEventListener(ok, () => (clearTimeout(t), resolve()), { once: true });
    el.addEventListener('error', () => (clearTimeout(t), reject(new Error('decode'))), { once: true });
  });
}

async function fromVideo(file) {
  const url = URL.createObjectURL(file);
  const v = document.createElement('video');
  v.muted = true;
  v.preload = 'auto';
  v.playsInline = true;
  try {
    v.src = url;
    await once(v, 'loadeddata');
    const duration = Number.isFinite(v.duration) ? v.duration : null;
    v.currentTime = Math.min(1.5, (duration || 4) / 4);
    await once(v, 'seeked');
    if (!v.videoWidth) return { blob: null, duration };
    const blob = await toBlob(v, v.videoWidth, v.videoHeight);
    return { blob, duration };
  } catch {
    return null;
  } finally {
    v.removeAttribute('src');
    v.load();
    URL.revokeObjectURL(url);
  }
}
