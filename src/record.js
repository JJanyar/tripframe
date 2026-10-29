// Records the viewer as it looks on screen: every visible camera in its
// current layout (side by side, picture in picture, one camera), zoomed as
// shown, with the driving-data overlay and the map panel when they are open.
// Frames are composed on a canvas; live recording encodes them with
// MediaRecorder, and the reverse export (clip.js) encodes them frame by frame.

const TYPES = [
  'video/mp4;codecs=avc1.640028,mp4a.40.2',
  'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm',
];

export const canRecord = () =>
  typeof MediaRecorder !== 'undefined' && !!HTMLCanvasElement.prototype.captureStream && TYPES.some((t) => MediaRecorder.isTypeSupported(t));

function containRect(box, w, h) {
  if (!w || !h) return box;
  const s = Math.min(box.width / w, box.height / h);
  const width = w * s;
  const height = h * s;
  return { x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height };
}

const visible = (el) => !!el && el.offsetParent !== null && getComputedStyle(el).display !== 'none';

/**
 * A canvas that redraws the stage (and map panel) on every draw() call.
 * @param {object} o
 * @param {HTMLElement} o.stage      the element holding the camera views
 * @param {HTMLElement} o.mapPanel   the map panel (drawn when visible)
 * @param {() => object|null} o.mapInfo  { map, points, colors, doneIndex, speed, unit, pos } for the route overlay
 */
export function createComposer({ stage, mapPanel, mapInfo }) {
  const area = () => {
    const rects = [stage.getBoundingClientRect()];
    if (visible(mapPanel)) rects.push(mapPanel.getBoundingClientRect());
    const left = Math.min(...rects.map((r) => r.left));
    const top = Math.min(...rects.map((r) => r.top));
    const right = Math.max(...rects.map((r) => r.right));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    return { left, top, width: right - left, height: bottom - top };
  };

  // Size is fixed at the start; later layout changes are drawn inside it.
  const a0 = area();
  const scale = Math.min(2, Math.max(1, 1920 / a0.width));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round((a0.width * scale) / 2) * 2;
  canvas.height = Math.round((a0.height * scale) / 2) * 2;
  const ctx = canvas.getContext('2d');

  const draw = () => {
    const a = area();
    const sx = canvas.width / a.width;
    const sy = canvas.height / a.height;
    const map = (r) => ({ x: (r.left - a.left) * sx, y: (r.top - a.top) * sy, width: r.width * sx, height: r.height * sy });

    ctx.fillStyle = '#0e0f12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const fig of stage.querySelectorAll('.view')) {
      if (!visible(fig)) continue;
      const box = map(fig.getBoundingClientRect());
      const media = fig.querySelector('video, img');
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(box.x, box.y, box.width, box.height, 6 * sx);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.clip();
      const w = media?.videoWidth || media?.naturalWidth;
      const h = media?.videoHeight || media?.naturalHeight;
      if (w) {
        // Same zoom and pan as the view on screen (see the zoom code in viewer.js).
        const z = Number(media.dataset.zs) || 1;
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        ctx.translate(cx + (Number(media.dataset.zx) || 0) * sx, cy + (Number(media.dataset.zy) || 0) * sy);
        ctx.scale(z, z);
        ctx.translate(-cx, -cy);
        ctx.drawImage(media, ...Object.values(containRect(box, w, h)));
      }
      ctx.restore();
      if (!fig.classList.contains('main') && stage.dataset.layout === 'pip') {
        ctx.lineWidth = 2 * sx;
        ctx.strokeStyle = '#0e0f12';
        ctx.beginPath();
        ctx.roundRect(box.x, box.y, box.width, box.height, 6 * sx);
        ctx.stroke();
      }
    }

    const hud = stage.querySelector('.hud');
    if (visible(hud)) drawHud(ctx, map(hud.getBoundingClientRect()), hud, sx);
    if (visible(mapPanel)) drawMap(ctx, map, mapPanel, mapInfo(), sx);
  };

  return { canvas, draw };
}

/**
 * @param {object} o  as createComposer, plus:
 * @param {() => HTMLMediaElement|null} o.audioSource  element whose sound is recorded, or null for none
 */
export function startRecording({ stage, mapPanel, mapInfo, audioSource }) {
  const type = TYPES.find((t) => MediaRecorder.isTypeSupported(t));
  const { canvas, draw } = createComposer({ stage, mapPanel, mapInfo });

  const stream = canvas.captureStream(30);
  const audioEl = audioSource();
  try {
    const capture = audioEl?.captureStream?.();
    capture?.getAudioTracks().forEach((track) => stream.addTrack(track));
  } catch {
    /* sound is optional */
  }

  const chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 8_000_000 });
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    draw();
  };
  recorder.start(500);
  loop();

  return {
    canvas,
    stop: () =>
      new Promise((resolve) => {
        cancelAnimationFrame(raf);
        recorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          resolve({ blob: new Blob(chunks, { type: type.split(';')[0] }), ext: type.startsWith('video/mp4') ? 'mp4' : 'webm' });
        };
        recorder.stop();
      }),
  };
}

function drawHud(ctx, box, hud, s) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(box.x, box.y, box.width, box.height, 6 * s);
  ctx.fillStyle = 'rgba(14, 15, 18, 0.72)';
  ctx.fill();
  ctx.textBaseline = 'top';
  for (const line of hud.children) {
    const r = line.getBoundingClientRect();
    const hr = hud.getBoundingClientRect();
    const style = getComputedStyle(line);
    ctx.fillStyle = style.color;
    ctx.font = `${style.fontWeight} ${parseFloat(style.fontSize) * s}px 'Manrope Variable', 'Segoe UI', sans-serif`;
    ctx.fillText(line.textContent, box.x + (r.left - hr.left) * s, box.y + (r.top - hr.top + (r.height - parseFloat(style.fontSize)) / 2) * s);
  }
  ctx.restore();
}

function drawMap(ctx, map, panel, info, s) {
  const panelBox = map(panel.getBoundingClientRect());
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(panelBox.x, panelBox.y, panelBox.width, panelBox.height, 6 * s);
  ctx.fillStyle = '#1e2026';
  ctx.fill();
  ctx.clip();

  const mapEl = panel.querySelector('.map');
  const mapRect = mapEl.getBoundingClientRect();
  const mapBox = map(mapRect);
  ctx.save();
  ctx.beginPath();
  ctx.rect(mapBox.x, mapBox.y, mapBox.width, mapBox.height);
  ctx.clip();
  // Tiles of every layer (map, satellite, labels), in the order Leaflet stacks them.
  for (const tile of mapEl.querySelectorAll('img.leaflet-tile-loaded')) {
    const b = map(tile.getBoundingClientRect());
    try {
      ctx.globalAlpha = Number(getComputedStyle(tile.closest('.leaflet-layer') || tile).opacity) || 1;
      ctx.drawImage(tile, b.x, b.y, b.width, b.height);
    } catch {
      /* a tile without CORS headers is skipped */
    }
  }
  ctx.globalAlpha = 1;
  if (info?.map && info.points.length > 1) {
    const toCanvas = ([lat, lon]) => {
      const p = info.map.latLngToContainerPoint([lat, lon]);
      return [mapBox.x + p.x * s, mapBox.y + p.y * s];
    };
    const pts = info.points.map(toCanvas);
    const line = (from, to, color, width) => {
      ctx.beginPath();
      pts.slice(from, to).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = color;
      ctx.lineWidth = width * s;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    };
    line(0, pts.length, '#ffffff', 9);
    if (info.colors) {
      for (let i = 0; i < pts.length - 1; i++) line(i, i + 2, info.colors[i], 5);
    } else {
      line(0, pts.length, '#8c919a', 5);
      line(0, info.doneIndex + 1, '#17191e', 5);
    }
    const [mx, my] = pts[info.doneIndex] || pts[0];
    // The car: an arrow pointing where it drives.
    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(((info.bearing || 0) * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -11 * s);
    ctx.lineTo(8 * s, 8 * s);
    ctx.lineTo(0, 4 * s);
    ctx.lineTo(-8 * s, 8 * s);
    ctx.closePath();
    ctx.fillStyle = '#ffc21a';
    ctx.fill();
    ctx.lineWidth = 2.5 * s;
    ctx.strokeStyle = '#17191e';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // Speed and position, as in the readout under the map.
  const readout = panel.querySelector('.gps-readout');
  if (readout && info) {
    const r = map(readout.getBoundingClientRect());
    const pad = 16 * s;
    ctx.fillStyle = '#f6f4ee';
    ctx.font = `700 ${30 * s}px 'Manrope Variable', 'Segoe UI', sans-serif`;
    ctx.textBaseline = 'top';
    const speed = String(info.speed ?? '');
    ctx.fillText(speed, r.x + pad, r.y + 14 * s);
    const w = ctx.measureText(speed).width;
    ctx.fillStyle = '#9a9ea6';
    ctx.font = `600 ${14 * s}px 'Manrope Variable', 'Segoe UI', sans-serif`;
    ctx.fillText(info.unit || '', r.x + pad + w + 6 * s, r.y + 28 * s);
    ctx.fillStyle = '#c9cbd0';
    ctx.font = `500 ${13 * s}px 'Manrope Variable', 'Segoe UI', sans-serif`;
    ctx.fillText(info.pos || '', r.x + pad, r.y + 52 * s);
  }
  ctx.restore();
}
