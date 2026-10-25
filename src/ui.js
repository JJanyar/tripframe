import {
  createElement,
  FolderOpen,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  StepBack,
  StepForward,
  Map as MapIcon,
  ImageDown,
  Columns2,
  PictureInPicture2,
  Square,
  RotateCcw,
  MapPinOff,
  TriangleAlert,
} from 'lucide';

const ICONS = {
  folder: FolderOpen,
  play: Play,
  pause: Pause,
  up: ChevronUp,
  down: ChevronDown,
  back: ArrowLeft,
  stepBack: StepBack,
  stepFwd: StepForward,
  map: MapIcon,
  save: ImageDown,
  sideBySide: Columns2,
  pip: PictureInPicture2,
  single: Square,
  reopen: RotateCcw,
  noGps: MapPinOff,
  warn: TriangleAlert,
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
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c);
  return el;
}

export const $ = (id) => document.getElementById(id);

export const CAMERA_LABEL = { front: 'Voor', rear: 'Achter', interior: 'Binnen', other: 'Camera' };
export const TYPE_LABEL = { normal: 'Normaal', event: 'Event', parking: 'Parkeren', photo: "Foto's" };

const nf1 = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 });
export function formatSize(bytes) {
  if (bytes >= 1e9) return `${nf1.format(bytes / 1e9)} GB`;
  if (bytes >= 1e6) return `${Math.round(bytes / 1e6)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} kB`;
}

export function formatDuration(sec, centis = false) {
  if (!Number.isFinite(sec)) return '';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const base = `${m}:${String(s).padStart(2, '0')}`;
  return centis ? `${base},${String(Math.floor((sec % 1) * 100)).padStart(2, '0')}` : base;
}

const dayFmt = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const dayShortFmt = new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
const timeFmt = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const rangeFmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const formatDay = (d) => cap(dayFmt.format(d));
export const formatDayShort = (d) => dayShortFmt.format(d).replace(/\./g, '');
export const formatTime = (d) => timeFmt.format(d);
export function formatRange(a, b) {
  if (!a) return '';
  return a.toDateString() === b.toDateString() ? rangeFmt.format(a) : rangeFmt.formatRange(a, b);
}

export function plural(n, one, many) {
  return `${n.toLocaleString('nl-NL')} ${n === 1 ? one : many}`;
}

let toastTimer;
export function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.hidden = false;
  el.classList.remove('out');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => (el.hidden = true), 200);
  }, 2600);
}
