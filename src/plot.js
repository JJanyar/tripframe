// A small line graph of one value over the clip (speed, altitude, G-force …),
// with a cursor at the current time. Clicking it seeks.

const PAD = { left: 40, right: 8, top: 10, bottom: 18 };

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ xs: number[], ys: (number|null)[], duration: number, cursor: number, format: (v:number)=>string }} o
 */
export function drawPlot(canvas, { xs, ys, duration, cursor, format }) {
  const dpr = devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const css = getComputedStyle(canvas);
  const ink = css.getPropertyValue('--ink').trim() || '#f6f4ee';
  const muted = css.getPropertyValue('--ink-3').trim() || '#9a9ea6';
  const line = css.getPropertyValue('--raised').trim() || '#272a31';
  const accent = css.getPropertyValue('--signal').trim() || '#ffc21a';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const vals = ys.filter((v) => v != null && Number.isFinite(v));
  if (vals.length < 2) return;
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (max - min < 1e-6) {
    min -= 1;
    max += 1;
  }
  const span = duration || xs.at(-1) || 1;
  ctx.font = `600 10.5px ${css.fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  const ticks = [max, (min + max) / 2, min];
  // The widest label sets the left margin, so "112 km/h" is not cut off; plotTime reads it back.
  const left = Math.max(PAD.left, ...ticks.map((v) => Math.ceil(ctx.measureText(format(v)).width) + 10));
  canvas.dataset.left = left;
  const X = (x) => left + (x / span) * (w - left - PAD.right);
  const Y = (y) => PAD.top + (1 - (y - min) / (max - min)) * (h - PAD.top - PAD.bottom);

  for (const v of ticks) {
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, Math.round(Y(v)) + 0.5);
    ctx.lineTo(w - PAD.right, Math.round(Y(v)) + 0.5);
    ctx.stroke();
    ctx.fillStyle = muted;
    ctx.fillText(format(v), left - 6, Y(v));
  }

  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.75;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  let pen = false;
  xs.forEach((x, i) => {
    const y = ys[i];
    if (y == null || !Number.isFinite(y)) return (pen = false);
    if (pen) ctx.lineTo(X(x), Y(y));
    else ctx.moveTo(X(x), Y(y));
    pen = true;
  });
  ctx.stroke();

  if (Number.isFinite(cursor)) {
    const cx = Math.round(X(Math.min(cursor, span))) + 0.5;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, PAD.top - 4);
    ctx.lineTo(cx, h - PAD.bottom + 4);
    ctx.stroke();
  }
}

/** The clip time under a pointer position on the graph. */
export function plotTime(canvas, clientX, duration) {
  const r = canvas.getBoundingClientRect();
  const left = Number(canvas.dataset.left) || PAD.left;
  const frac = (clientX - r.left - left) / (r.width - left - PAD.right);
  return Math.max(0, Math.min(1, frac)) * duration;
}
