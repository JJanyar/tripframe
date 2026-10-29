// Joins clips of one camera into a single MP4 without re-encoding: the
// compressed frames and sound are copied over with new timestamps. Chrome and
// Edge write straight to a file on disk; other browsers build it in memory.

import { Muxer, ArrayBufferTarget, FileSystemWritableFileStreamTarget } from 'mp4-muxer';
import { readTracks } from './mp4.js';

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

  let stream = null;
  let target;
  if (window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'MP4', accept: { 'video/mp4': ['.mp4'] } }] });
    stream = await handle.createWritable();
    target = new FileSystemWritableFileStreamTarget(stream);
  } else {
    if (total > MEMORY_LIMIT) throw new MergeError('tooLarge');
    target = new ArrayBufferTarget();
  }

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
