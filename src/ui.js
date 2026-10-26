import {
  createElement,
  FolderOpen,
  Play,
  Pause,
  ArrowLeft,
  StepBack,
  StepForward,
  SkipBack,
  SkipForward,
  ArrowLeftRight,
  Map as MapIcon,
  ImageDown,
  Columns2,
  PictureInPicture2,
  RotateCcw,
  MapPinOff,
  TriangleAlert,
  Volume2,
  Volume1,
  VolumeX,
  Circle,
  Square,
  Keyboard,
  X,
} from 'lucide';
import { animate } from 'motion';
import { t, locale } from './i18n.js';
import { reducedMotion } from './theme.js';

const ICONS = {
  folder: FolderOpen,
  play: Play,
  pause: Pause,
  back: ArrowLeft,
  stepBack: StepBack,
  stepFwd: StepForward,
  prev: SkipBack,
  next: SkipForward,
  swap: ArrowLeftRight,
  map: MapIcon,
  save: ImageDown,
  sideBySide: Columns2,
  pip: PictureInPicture2,
  reopen: RotateCcw,
  noGps: MapPinOff,
  warn: TriangleAlert,
  volume: Volume2,
  volumeLow: Volume1,
  muted: VolumeX,
  rec: Circle,
  stop: Square,
  keys: Keyboard,
  close: X,
};

export function icon(name, size = 18) {
  const el = createElement(ICONS[name]);
  el.setAttribute('width', size);
  el.setAttribute('height', size);
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('stroke-width', '2');
  el.classList.add('icon');
  return el;
}

/** Sets a button's content to an icon plus optional label. */
export function setButton(btn, name, label, { iconOnly = false } = {}) {
  btn.replaceChildren(icon(name));
  if (label) {
    if (iconOnly) btn.setAttribute('aria-label', label);
    else {
      const span = document.createElement('span');
      span.textContent = label;
      btn.append(span);
    }
  }
}

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c);
  return el;
}

export const $ = (id) => document.getElementById(id);

export const camLabel = (c) => t(`cam.${c}`);
export const typeLabel = (k) => t(`type.${k}`);

export function formatSize(bytes) {
  const nf = new Intl.NumberFormat(locale(), { maximumFractionDigits: 1 });
  if (bytes >= 1e9) return `${nf.format(bytes / 1e9)} GB`;
  if (bytes >= 1e6) return `${Math.round(bytes / 1e6)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} kB`;
}

export function formatDuration(sec, centis = false) {
  if (!Number.isFinite(sec)) return '';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const base = `${m}:${String(s).padStart(2, '0')}`;
  const sep = (0.5).toLocaleString(locale()).charAt(1);
  return centis ? `${base}${sep}${String(Math.floor((sec % 1) * 100)).padStart(2, '0')}` : base;
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmt = (opts) => new Intl.DateTimeFormat(locale(), opts);
export const formatDay = (d) => cap(fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d));
export const formatDayShort = (d) => fmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(d).replace(/\./g, '').replace(/,/g, '');
export const formatTime = (d) => fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(d);
export function formatRange(a, b) {
  if (!a) return '';
  const f = fmt({ day: 'numeric', month: 'long', year: 'numeric' });
  return a.toDateString() === b.toDateString() ? f.format(a) : f.formatRange(a, b);
}

let toastTimer;
export function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  if (!reducedMotion()) animate(el, { opacity: [0, 1], y: [12, 0], scale: [0.96, 1] }, { type: 'spring', stiffness: 520, damping: 34 });
  toastTimer = setTimeout(async () => {
    if (!reducedMotion()) await animate(el, { opacity: 0, y: 6 }, { duration: 0.18 }).finished;
    el.hidden = true;
  }, 2600);
}
