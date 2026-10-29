// Exports part of a clip played backwards. Browsers cannot play video in
// reverse, so every frame is sought, drawn by the composer (record.js) and
// encoded with WebCodecs into an MP4. No sound: reversed sound is noise.

import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

export const canReverse = () => typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined';

export const CODECS = ['avc1.640033', 'avc1.4d0033', 'avc1.42003e'];

/**
 * @param {object} o
 * @param {{canvas: HTMLCanvasElement, draw: () => void}} o.composer
 * @param {(time: number) => Promise<void>} o.seekTo  shows the frame at `time` in every view
 * @param {number} o.from  start of the part, seconds
 * @param {number} o.to    end of the part, seconds
 * @param {number} o.fps   frame rate of the output
 * @param {number} o.speed 1 = real time, 2 = twice as fast …
 */
export async function exportReverse({ composer, seekTo, from, to, fps, speed, onProgress, signal }) {
  const { canvas, draw } = composer;
  let config = null;
  for (const codec of CODECS) {
    const cfg = { codec, width: canvas.width, height: canvas.height, bitrate: 8_000_000, framerate: fps };
    if ((await VideoEncoder.isConfigSupported(cfg).catch(() => ({}))).supported) {
      config = cfg;
      break;
    }
  }
  if (!config) throw new Error('unsupported');

  const muxer = new Muxer({ target: new ArrayBufferTarget(), fastStart: 'in-memory', video: { codec: 'avc', width: canvas.width, height: canvas.height } });
  let failed = null;
  const encoder = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => (failed = e) });
  encoder.configure(config);

  const step = speed / fps;
  const count = Math.max(1, Math.floor((to - from) / step) + 1);
  for (let i = 0; i < count; i++) {
    if (signal?.aborted) break;
    if (failed) throw failed;
    await seekTo(to - i * step);
    draw();
    const frame = new VideoFrame(canvas, { timestamp: Math.round((i * 1e6) / fps), duration: Math.round(1e6 / fps) });
    encoder.encode(frame, { keyFrame: i % Math.round(fps * 2) === 0 });
    frame.close();
    while (encoder.encodeQueueSize > 6) await new Promise((r) => setTimeout(r, 4));
    onProgress?.((i + 1) / count);
  }
  await encoder.flush();
  encoder.close();
  if (failed) throw failed;
  if (signal?.aborted) return null;
  muxer.finalize();
  return new Blob([muxer.target.buffer], { type: 'video/mp4' });
}
