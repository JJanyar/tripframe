// Full-screen viewer: plays every camera of one moment in sync, steps frame by
// frame, saves the current frame, and follows the GPS track on a map.

import { readInfo } from './mp4.js';
import {
  $, h, icon, setButton, toast, CAMERA_LABEL, TYPE_LABEL,
  formatDuration, formatDay, formatTime,
} from './ui.js';

const DEFAULT_FPS = 30;
const DRIFT = 0.12; // seconds before a follower camera is re-aligned

let cur = null; // { moment, list, views, layout, main, fps, gps, urls }
let returnFocus = null;
let scrubbing = false;
let raf = 0;
let mapState = null;
let mapOn = localStorage.getItem('map') !== '0';

setButton($('viewer-close'), 'back', 'Overzicht');
setButton($('prev-moment'), 'up', 'Vorig moment', { iconOnly: true });
setButton($('next-moment'), 'down', 'Volgend moment', { iconOnly: true });
setButton($('map-toggle'), 'map', 'Kaart');
setButton($('frame-back'), 'stepBack', 'Eén frame terug', { iconOnly: true });
setButton($('frame-fwd'), 'stepFwd', 'Eén frame verder', { iconOnly: true });
setButton($('save-frame'), 'save', 'Frame opslaan');
setPlayIcon(false);

function setPlayIcon(playing) {
  setButton($('play'), playing ? 'pause' : 'play', playing ? 'Pauzeren' : 'Afspelen', { iconOnly: true });
}

const videos = () => (cur ? cur.views.filter((v) => v.media.tagName === 'VIDEO').map((v) => v.media) : []);
const master = () => cur?.views.find((v) => v.cam === cur.main)?.media;

export function openViewer(moment, list) {
  const viewer = $('viewer');
  if (viewer.hidden) {
    returnFocus = document.activeElement;
    viewer.hidden = false;
    $('app').inert = true;
    document.addEventListener('keydown', onKey, true);
    raf = requestAnimationFrame(tick);
    $('viewer-close').focus();
  }
  show(moment, list);
}

function closeViewer() {
  teardown();
  $('viewer').hidden = true;
  $('app').inert = false;
  document.removeEventListener('keydown', onKey, true);
  cancelAnimationFrame(raf);
  returnFocus?.focus?.();
}

function teardown() {
  if (!cur) return;
  for (const v of videos()) {
    v.pause();
    v.removeAttribute('src');
    v.load();
  }
  cur.urls.forEach(URL.revokeObjectURL);
  cur = null;
}

function show(moment, list) {
  const layout = cur?.layout || localStorage.getItem('layout') || 'side';
  const rate = Number($('speed').value);
  teardown();

  const urls = [];
  const views = moment.cameras.map((cam) => {
    const clip = moment.files[cam];
    const url = URL.createObjectURL(clip.file);
    urls.push(url);
    const media = clip.isPhoto
      ? h('img', { src: url, alt: `Foto ${CAMERA_LABEL[cam]}` })
      : h('video', { src: url, preload: 'auto', playsinline: true, muted: cam !== moment.cameras[0] });
    if (!clip.isPhoto) media.playbackRate = rate;
    const fig = h('figure', { class: 'view', dataset: { cam } },
      media,
      h('figcaption', {}, CAMERA_LABEL[cam]),
    );
    if (!clip.isPhoto) {
      const save = h('button', { type: 'button', class: 'view-save', title: `Frame van ${CAMERA_LABEL[cam].toLowerCase()} opslaan`, onclick: (e) => {
        e.stopPropagation();
        saveFrame([cam]);
      } });
      setButton(save, 'save', `Frame van ${CAMERA_LABEL[cam].toLowerCase()} opslaan`, { iconOnly: true });
      fig.append(save);
      media.addEventListener('error', () => {
        fig.classList.add('unplayable');
        fig.append(h('div', { class: 'view-error' },
          icon('warn', 24),
          h('p', {}, 'Deze browser kan dit videoformaat niet afspelen.'),
          h('p', { class: 'muted' }, 'Viofo en andere dashcams nemen vaak op in H.265 (HEVC). Gebruik Edge, of Chrome met HEVC-ondersteuning van Windows.'),
        ));
      });
    }
    fig.addEventListener('click', () => {
      if (cur.layout === 'pip' && cam !== cur.main) setLayout('pip', cam);
      else if (cur.views.length === 1 || cur.layout !== 'side') togglePlay();
    });
    return { cam, clip, media, fig };
  });

  cur = { moment, list, views, urls, layout, main: moment.cameras[0], fps: DEFAULT_FPS, gps: [] };
  $('stage').replaceChildren(...views.map((v) => v.fig));
  $('viewer').classList.toggle('photo-mode', moment.isPhoto);

  // Every camera reports, but only the one currently in the main slot drives the controls.
  for (const v of videos()) {
    const isMaster = (fn) => () => v === master() && fn();
    v.addEventListener('play', isMaster(() => setPlayIcon(true)));
    v.addEventListener('pause', isMaster(() => setPlayIcon(false)));
    v.addEventListener('ended', isMaster(onEnded));
    v.addEventListener('seeked', isMaster(updateTime));
    v.addEventListener('timeupdate', isMaster(updateTime));
    v.addEventListener('loadedmetadata', isMaster(() => ($('time-total').textContent = formatDuration(v.duration))));
  }

  // Heading
  $('viewer-title').textContent = `${formatDay(moment.date)}, ${formatTime(moment.date)}`;
  const sub = $('viewer-sub');
  const tag = moment.type === 'event' || moment.type === 'parking' ? h('span', { class: `tag tag-${moment.type}` }, TYPE_LABEL[moment.type]) : null;
  sub.replaceChildren(...[tag, h('span', {}, moment.cameras.map((c) => moment.files[c].name).join(', '))].filter(Boolean));

  const i = list.indexOf(moment);
  $('prev-moment').disabled = i <= 0;
  $('next-moment').disabled = i < 0 || i >= list.length - 1;

  renderLayoutSwitch();
  setLayout(moment.cameras.includes(cur.main) ? layout : 'side', cur.main);
  $('scrubber').value = 0;
  $('time-total').textContent = '0:00';
  $('frame-no').textContent = '';

  if (!moment.isPhoto) {
    const token = cur;
    readInfo(moment.primary.file).then((info) => {
      if (cur !== token) return;
      cur.fps = info.fps || DEFAULT_FPS;
      cur.gps = info.gps || [];
      renderMap();
    });
    Promise.all(videos().map((v) => new Promise((r) => (v.readyState >= 2 ? r() : v.addEventListener('loadeddata', r, { once: true })))))
      .then(() => cur === token && $('autoplay').checked && token.autostart && playAll());
    cur.autostart = !!list.autostartNext;
    list.autostartNext = false;
  } else {
    cur.gps = [];
    renderMap();
  }
}

// ---------- layout ----------

function renderLayoutSwitch() {
  const cams = cur.moment.cameras;
  const sw = $('layout-switch');
  sw.hidden = cams.length < 2;
  if (cams.length < 2) return sw.replaceChildren();
  const opt = (layout, cam, iconName, label) => {
    const b = h('button', { type: 'button', role: 'radio', class: 'seg', dataset: { layout, cam: cam || '' }, onclick: () => setLayout(layout, cam || cur.main) });
    if (iconName) b.append(icon(iconName, 16));
    b.append(h('span', {}, label));
    return b;
  };
  sw.replaceChildren(
    opt('side', null, 'sideBySide', 'Naast elkaar'),
    opt('pip', null, 'pip', 'Beeld in beeld'),
    ...cams.map((c) => opt('single', c, null, CAMERA_LABEL[c])),
  );
}

function setLayout(layout, main) {
  if (!cur) return;
  cur.layout = cur.moment.cameras.length < 2 ? 'single' : layout;
  if (main && main !== cur.main) {
    const t = master()?.currentTime || 0;
    const wasPlaying = master() && !master().paused;
    for (const v of videos()) v.muted = true;
    cur.main = main;
    const m = master();
    if (m?.tagName === 'VIDEO') {
      m.muted = false;
      if (Math.abs(m.currentTime - t) > DRIFT) m.currentTime = t;
      if (wasPlaying) playAll();
    }
  }
  if (cur.moment.cameras.length > 1 && layout !== 'single') localStorage.setItem('layout', layout);
  const stage = $('stage');
  stage.dataset.layout = cur.layout;
  stage.style.setProperty('--cams', cur.views.length);
  for (const v of cur.views) v.fig.classList.toggle('main', v.cam === cur.main);
  // Main camera first so it takes the large slot.
  for (const v of [...cur.views].sort((a, b) => (a.cam === cur.main ? -1 : b.cam === cur.main ? 1 : 0))) stage.append(v.fig);
  for (const b of $('layout-switch').querySelectorAll('.seg')) {
    const on = b.dataset.layout === cur.layout && (cur.layout !== 'single' || b.dataset.cam === cur.main);
    b.setAttribute('aria-checked', String(on));
  }
}

// ---------- playback ----------

function playAll() {
  const m = master();
  if (!m || m.tagName !== 'VIDEO') return;
  for (const v of videos()) {
    if (v !== m && Math.abs(v.currentTime - m.currentTime) > DRIFT) v.currentTime = Math.min(m.currentTime, v.duration || Infinity);
    v.play().catch(() => {});
  }
}

function pauseAll() {
  for (const v of videos()) v.pause();
}

function togglePlay() {
  const m = master();
  if (!m || m.tagName !== 'VIDEO') return;
  if (m.paused || m.ended) playAll();
  else pauseAll();
}

function seek(t) {
  for (const v of videos()) {
    const d = Number.isFinite(v.duration) ? v.duration : t;
    v.currentTime = Math.max(0, Math.min(t, d - 0.001));
  }
}

function stepFrame(n) {
  const m = master();
  if (!m || m.tagName !== 'VIDEO') return;
  pauseAll();
  const fps = cur.fps;
  const frame = Math.floor(m.currentTime * fps + 0.001);
  // Aim at the middle of the target frame so rounding never lands on its neighbour.
  seek(Math.max(0, (frame + n + 0.5) / fps));
}

function onEnded() {
  if (!$('autoplay').checked || !cur) return;
  const i = cur.list.indexOf(cur.moment);
  const next = cur.list[i + 1];
  if (next && !next.isPhoto) {
    cur.list.autostartNext = true;
    show(next, cur.list);
  }
}

function go(dir) {
  if (!cur) return;
  const i = cur.list.indexOf(cur.moment);
  const target = cur.list[i + dir];
  if (target) show(target, cur.list);
}

function updateTime() {
  const m = master();
  if (!cur || !m || m.tagName !== 'VIDEO') return;
  const t = m.currentTime;
  const d = m.duration;
  if (!scrubbing && Number.isFinite(d) && d > 0) $('scrubber').value = Math.round((t / d) * 1000);
  $('time-now').textContent = formatDuration(t, true);
  const clock = new Date(cur.moment.date.getTime() + t * 1000);
  $('frame-no').textContent = `${formatTime(clock)}, frame ${Math.floor(t * cur.fps + 0.001) + 1}`;
  if (mapState && cur.gps.length > 1 && !$('map-panel').hidden) followMap(t);
}

let lastSync = 0;
function tick(now) {
  raf = requestAnimationFrame(tick);
  const m = master();
  if (!cur || !m || m.tagName !== 'VIDEO') return;
  const t = m.currentTime;
  updateTime();

  if (!m.paused && now - lastSync > 400) {
    lastSync = now;
    for (const v of videos()) {
      if (v === m || v.readyState < 2) continue;
      if (t < v.duration && Math.abs(v.currentTime - t) > DRIFT) v.currentTime = t;
      if (v.paused && t < v.duration) v.play().catch(() => {});
    }
  }
}

const scrubber = $('scrubber');
scrubber.addEventListener('pointerdown', () => (scrubbing = true));
scrubber.addEventListener('pointerup', () => (scrubbing = false));
scrubber.addEventListener('input', () => {
  const d = master()?.duration;
  if (Number.isFinite(d)) seek((scrubber.value / 1000) * d);
});

$('play').addEventListener('click', togglePlay);
$('frame-back').addEventListener('click', () => stepFrame(-1));
$('frame-fwd').addEventListener('click', () => stepFrame(1));
$('viewer-close').addEventListener('click', closeViewer);
$('prev-moment').addEventListener('click', () => go(-1));
$('next-moment').addEventListener('click', () => go(1));
$('speed').addEventListener('change', (e) => videos().forEach((v) => (v.playbackRate = Number(e.target.value))));
$('save-frame').addEventListener('click', () => saveFrame());
$('map-toggle').addEventListener('click', () => {
  mapOn = !mapOn;
  localStorage.setItem('map', mapOn ? '1' : '0');
  renderMap();
});

function onKey(e) {
  if (e.target.tagName === 'SELECT' && /Arrow/.test(e.key)) return;
  const key = e.key;
  const handled = {
    ' ': togglePlay,
    k: togglePlay,
    ',': () => stepFrame(-1),
    '.': () => stepFrame(1),
    ArrowLeft: () => seek((master()?.currentTime || 0) - (e.shiftKey ? 1 : 5)),
    ArrowRight: () => seek((master()?.currentTime || 0) + (e.shiftKey ? 1 : 5)),
    ArrowUp: () => go(-1),
    ArrowDown: () => go(1),
    Escape: closeViewer,
    s: () => saveFrame(),
    m: () => $('map-toggle').click(),
  }[key];
  if (!handled || e.ctrlKey || e.metaKey || e.altKey) return;
  if (key === ' ' && e.target.tagName === 'BUTTON' && e.target.id !== 'play') {
    // Space on a focused button keeps its normal meaning.
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  handled();
}

// ---------- save frame ----------

function stamp(t) {
  const d = new Date(cur.moment.date.getTime() + t * 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}-${p(Math.floor((t % 1) * 100))}`;
}

function saveFrame(only) {
  if (!cur || cur.moment.isPhoto) return;
  const cams = only || (cur.layout === 'single' ? [cur.main] : cur.views.map((v) => v.cam));
  const vids = cams.map((c) => cur.views.find((v) => v.cam === c)).filter((v) => v && v.media.videoWidth);
  if (!vids.length) return toast('Er is nog geen beeld om op te slaan.');
  pauseAll();

  const height = Math.max(...vids.map((v) => v.media.videoHeight));
  const widths = vids.map((v) => Math.round(v.media.videoWidth * (height / v.media.videoHeight)));
  const canvas = document.createElement('canvas');
  canvas.width = widths.reduce((a, b) => a + b, 0);
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  let x = 0;
  vids.forEach((v, i) => {
    ctx.drawImage(v.media, x, 0, widths[i], height);
    x += widths[i];
  });

  const t = master().currentTime;
  const name = `dashcam_${stamp(t)}_${vids.map((v) => CAMERA_LABEL[v.cam].toLowerCase()).join('-')}.png`;
  canvas.toBlob((blob) => {
    const a = h('a', { href: URL.createObjectURL(blob), download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(`Opgeslagen als ${name}`);
  }, 'image/png');
}

// ---------- map ----------

async function renderMap() {
  const panel = $('map-panel');
  const toggle = $('map-toggle');
  const hasGps = !!cur && cur.gps.length > 1;
  toggle.disabled = !hasGps;
  toggle.title = hasGps ? 'Kaart tonen of verbergen (M)' : 'Deze opname bevat geen GPS-gegevens';
  setButton(toggle, hasGps ? 'map' : 'noGps', hasGps ? 'Kaart' : 'Geen GPS');
  toggle.setAttribute('aria-pressed', String(mapOn && hasGps));
  panel.hidden = !mapOn || !hasGps;
  $('viewer').classList.toggle('with-map', !panel.hidden);
  if (panel.hidden) return;

  const readout = $('gps-readout');

  if (!mapState) {
    const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
    const map = L.map('map', { zoomControl: true, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    const line = L.polyline([], { color: '#5b9dff', weight: 5, opacity: 0.9 }).addTo(map);
    const done = L.polyline([], { color: '#b9d3ff', weight: 5, opacity: 1 }).addTo(map);
    const marker = L.circleMarker([0, 0], { radius: 8, color: '#fff', weight: 3, fillColor: '#5b9dff', fillOpacity: 1 }).addTo(map);
    line.on('click', (e) => {
      let best = 0;
      let bestD = Infinity;
      cur.gps.forEach((p, i) => {
        const d = (p.lat - e.latlng.lat) ** 2 + (p.lon - e.latlng.lng) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      seek(cur.gps[best].t);
    });
    mapState = { L, map, line, done, marker, key: null, idx: -1 };
  }
  const { map, line, marker, done } = mapState;
  const latlngs = cur.gps.map((p) => [p.lat, p.lon]);
  if (mapState.key !== cur.moment) {
    mapState.key = cur.moment;
    mapState.idx = -1;
    line.setLatLngs(latlngs);
    done.setLatLngs([]);
    marker.setLatLng(latlngs[0]);
    requestAnimationFrame(() => {
      map.invalidateSize();
      map.fitBounds(line.getBounds(), { padding: [24, 24], maxZoom: 17 });
    });
  } else requestAnimationFrame(() => map.invalidateSize());

  readout.replaceChildren(
    h('div', { class: 'gps-speed' }, h('span', { id: 'gps-speed' }, '0'), h('span', { class: 'unit' }, 'km/u')),
    h('p', { id: 'gps-pos', class: 'gps-pos' }),
    h('p', { class: 'gps-note' }, 'Kaart van OpenStreetMap. Alleen de kaarttegels worden opgehaald; je beelden blijven lokaal.'),
  );
  followMap(master()?.currentTime || 0, true);
}

const coord = (v) => Math.abs(v).toLocaleString('nl-NL', { minimumFractionDigits: 5, maximumFractionDigits: 5 });

function followMap(t, force) {
  const pts = cur.gps;
  let i = pts.findIndex((p) => p.t > t) - 1;
  if (i < -1) i = pts.length - 1;
  if (i < 0) i = 0;
  if (i === mapState.idx && !force) return;
  mapState.idx = i;
  const p = pts[i];
  mapState.marker.setLatLng([p.lat, p.lon]);
  mapState.done.setLatLngs(pts.slice(0, i + 1).map((q) => [q.lat, q.lon]));
  const speed = document.getElementById('gps-speed');
  if (speed) speed.textContent = Math.round(p.speed);
  const pos = document.getElementById('gps-pos');
  if (pos) pos.textContent = `${coord(p.lat)}° ${p.lat >= 0 ? 'N' : 'Z'}  ${coord(p.lon)}° ${p.lon >= 0 ? 'O' : 'W'}`;
  if (!mapState.map.getBounds().pad(-0.1).contains([p.lat, p.lon])) mapState.map.panTo([p.lat, p.lon], { animate: true });
}
