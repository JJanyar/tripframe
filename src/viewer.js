// Full-screen viewer: plays every camera of one moment in sync, steps frame by
// frame, saves the current frame, and follows the GPS track on a map.

import { readInfo } from './mp4.js';
import { startRecording, canRecord } from './record.js';
import { ROUTE_FORMATS } from './route.js';
import { t, locale } from './i18n.js';
import { transition } from './theme.js';
import {
  $, h, icon, setButton, toast, camLabel, typeLabel,
  formatDuration, formatDay, formatTime,
} from './ui.js';

const DEFAULT_FPS = 30;
const DRIFT = 0.12; // seconds before a follower camera is re-aligned

let cur = null; // { moment, list, views, layout, main, fps, gps, urls, tile }
let returnFocus = null;
let scrubbing = false;
let raf = 0;
let mapState = null;
let mapOn = localStorage.getItem('map') !== '0';
let volume = Number(localStorage.getItem('volume') ?? 1);
let muted = localStorage.getItem('muted') === '1';
let recording = null; // { rec, started, stampTime, moment, layout, map, timer }

function renderChrome() {
  setButton($('viewer-close'), 'back', t('v.back'));
  setButton($('prev-moment'), 'prev', t('v.prevClip'), { iconOnly: true });
  setButton($('next-moment'), 'next', t('v.nextClip'), { iconOnly: true });
  setButton($('frame-back'), 'stepBack', t('v.frameBack'), { iconOnly: true });
  setButton($('frame-fwd'), 'stepFwd', t('v.frameFwd'), { iconOnly: true });
  setButton($('swap'), 'swap', t('v.swap'));
  setButton($('save-frame'), 'save', t('v.save'));
  setPlayIcon(master() && !master().paused);
  renderVolume();
  renderRecord();
  renderKeys();
  $('keys-toggle').replaceChildren(icon('keys'));
  $('keys-close').replaceChildren(icon('close'));
}

function setPlayIcon(playing) {
  setButton($('play'), playing ? 'pause' : 'play', t(playing ? 'v.pause' : 'v.play'), { iconOnly: true });
}

function videos() {
  return cur ? cur.views.filter((v) => v.media.tagName === 'VIDEO').map((v) => v.media) : [];
}

function master() {
  return cur?.views.find((v) => v.cam === cur.main)?.media;
}

// Names the tile's pictures so a view transition can morph them into the players.
function nameTile(tile, moment, on) {
  if (!tile) return;
  const main = tile.querySelector('.thumb-main');
  const inset = tile.querySelector('.thumb-inset');
  if (main) main.style.viewTransitionName = on ? `cam-${moment.cameras[0]}` : '';
  if (inset) inset.style.viewTransitionName = on ? `cam-${moment.cameras[1]}` : '';
}

export function openViewer(moment, list, tile) {
  const viewer = $('viewer');
  if (!viewer.hidden) return show(moment, list);
  returnFocus = document.activeElement;
  nameTile(tile, moment, true);
  transition(
    () => {
      nameTile(tile, moment, false);
      viewer.hidden = false;
      $('app').inert = true;
      document.addEventListener('keydown', onKey, true);
      show(moment, list, tile);
    },
    { types: ['open'] },
  ).then(() => $('viewer-close').focus());
  raf = requestAnimationFrame(tick);
}

function closeViewer() {
  if (recording) stopRec();
  const moment = cur?.moment;
  const tile = moment && document.querySelector(`.tile[data-id="${moment.id}"]`);
  // Keep the playing state's picture in the tile while the morph runs.
  transition(
    () => {
      teardown();
      $('viewer').hidden = true;
      $('app').inert = false;
      if (tile && moment) {
        tile.scrollIntoView({ block: 'nearest' });
        nameTile(tile, moment, true);
      }
    },
    { types: ['close'] },
  ).then(() => {
    if (tile && moment) nameTile(tile, moment, false);
  });
  document.removeEventListener('keydown', onKey, true);
  cancelAnimationFrame(raf);
  (tile || returnFocus)?.focus?.({ preventScroll: true });
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

let clickTimer = 0;

function show(moment, list, tile) {
  const layout = cur?.layout || localStorage.getItem('layout') || 'side';
  const rate = Number($('speed').value);
  teardown();

  // Thumbnails already shown in the library become the posters, so the player never flashes black.
  const tileEl = tile || document.querySelector(`.tile[data-id="${moment.id}"]`);
  const posters = [tileEl?.querySelector('.thumb-main img')?.src, tileEl?.querySelector('.thumb-inset img')?.src];

  const urls = [];
  const views = moment.cameras.map((cam, i) => {
    const clip = moment.files[cam];
    const url = URL.createObjectURL(clip.file);
    urls.push(url);
    const media = clip.isPhoto
      ? h('img', { src: url, alt: t('v.photo', { cam: camLabel(cam) }) })
      : h('video', { src: url, preload: 'auto', playsinline: true, poster: posters[i] || null });
    if (!clip.isPhoto) {
      media.muted = muted || cam !== moment.cameras[0];
      media.volume = volume;
      media.playbackRate = rate;
    }
    const fig = h('figure', { class: 'view', dataset: { cam }, style: `view-transition-name: cam-${cam}` },
      media,
      h('figcaption', {}, camLabel(cam)),
    );
    if (!clip.isPhoto) {
      const save = h('button', { type: 'button', class: 'view-save', onclick: (e) => {
        e.stopPropagation();
        saveFrame([cam]);
      } });
      save.title = t('v.saveOne', { cam: camLabel(cam).toLowerCase() });
      setButton(save, 'save', save.title, { iconOnly: true });
      fig.append(save);
      media.addEventListener('error', () => {
        fig.classList.add('unplayable');
        fig.append(h('div', { class: 'view-error' },
          icon('warn', 24),
          h('p', {}, t('v.cantPlay')),
          h('p', { class: 'muted' }, t('v.cantPlayHint')),
        ));
      });
    }
    // One click plays or pauses; a double click swaps which camera is large.
    fig.addEventListener('click', () => {
      clearTimeout(clickTimer);
      clickTimer = setTimeout(togglePlay, 220);
    });
    fig.addEventListener('dblclick', (e) => {
      e.preventDefault();
      clearTimeout(clickTimer);
      if (cur.layout === 'pip' && cam !== cur.main) swapTo(cam);
      else swap();
    });
    return { cam, clip, media, fig };
  });

  cur = { moment, list, views, urls, layout, main: moment.cameras[0], fps: DEFAULT_FPS, gps: [] };
  for (const v of views) if (!v.clip.isPhoto || views.length > 1) v.fig.append(pipHandle());
  $('stage').replaceChildren(...views.map((v) => v.fig), splitHandle());
  applySizes();
  $('viewer').classList.toggle('photo-mode', moment.isPhoto);

  // Every camera reports, but only the one currently in the main slot drives the controls.
  for (const v of videos()) {
    const ifMaster = (fn) => () => v === master() && fn();
    v.addEventListener('play', ifMaster(() => setPlayIcon(true)));
    v.addEventListener('pause', ifMaster(() => setPlayIcon(false)));
    v.addEventListener('ended', ifMaster(onEnded));
    v.addEventListener('seeked', ifMaster(updateTime));
    v.addEventListener('timeupdate', ifMaster(updateTime));
    v.addEventListener('loadedmetadata', ifMaster(() => ($('time-total').textContent = formatDuration(v.duration))));
  }

  renderHeading();
  renderLayoutSwitch();
  setLayout(moment.cameras.length > 1 ? layout : 'single', cur.main);
  $('scrubber').value = 0;
  $('time-total').textContent = '0:00';
  $('time-now').textContent = formatDuration(0, true);
  $('frame-no').textContent = '';
  setPlayIcon(false);

  const token = cur;
  if (!moment.isPhoto) {
    readInfo(moment.primary.file).then((info) => {
      if (cur !== token) return;
      cur.fps = info.fps || DEFAULT_FPS;
      cur.gps = info.gps || [];
      renderMap();
    });
    cur.autostart = !!list.autostartNext;
    list.autostartNext = false;
    Promise.all(videos().map((v) => new Promise((r) => (v.readyState >= 2 ? r() : v.addEventListener('loadeddata', r, { once: true })))))
      .then(() => cur === token && token.autostart && playAll());
  } else renderMap();
}

function renderHeading() {
  const { moment, list } = cur;
  $('viewer-title').textContent = `${formatDay(moment.date)}, ${formatTime(moment.date)}`;
  const tag = moment.type === 'event' || moment.type === 'parking' ? h('span', { class: `tag tag-${moment.type}` }, typeLabel(moment.type)) : null;
  $('viewer-sub').replaceChildren(...[tag, h('span', {}, moment.cameras.map((c) => moment.files[c].name).join(', '))].filter(Boolean));
  const i = list.indexOf(moment);
  $('prev-moment').disabled = i <= 0;
  $('next-moment').disabled = i < 0 || i >= list.length - 1;
  $('swap').hidden = moment.cameras.length < 2 || cur.layout === 'side';
}

/** Re-labels everything after a language change. */
export function refreshViewer() {
  renderChrome();
  if (!cur) return;
  renderHeading();
  renderLayoutSwitch();
  for (const v of cur.views) v.fig.querySelector('figcaption').textContent = camLabel(v.cam);
  renderMap();
  updateTime();
}

// ---------- volume ----------

function applyVolume() {
  for (const v of videos()) {
    v.volume = volume;
    v.muted = muted || v !== master();
  }
}

function renderVolume() {
  const silent = muted || volume === 0;
  setButton($('mute'), silent ? 'muted' : volume < 0.5 ? 'volumeLow' : 'volume', t(silent ? 'v.unmute' : 'v.mute'), { iconOnly: true });
  const slider = $('volume');
  slider.value = Math.round((muted ? 0 : volume) * 100);
  slider.style.setProperty('--progress', `${slider.value}%`);
}

function setVolume(next, { unmute = true } = {}) {
  volume = Math.max(0, Math.min(1, next));
  if (unmute && volume > 0) muted = false;
  localStorage.setItem('volume', volume);
  localStorage.setItem('muted', muted ? '1' : '0');
  applyVolume();
  renderVolume();
}

function toggleMute() {
  muted = !muted;
  if (!muted && volume === 0) volume = 0.5;
  setVolume(volume, { unmute: false });
}

$('mute').addEventListener('click', toggleMute);
$('volume').addEventListener('input', (e) => setVolume(e.target.value / 100));

// ---------- keyboard shortcuts card ----------

const KEYS = [
  [['Space', 'K'], 'k.play'],
  [[',', '.'], 'k.frame'],
  [['←', '→'], 'k.seek'],
  [['Shift', '← →'], 'k.seekFine'],
  [['↑', '↓'], 'k.clip'],
  [['W'], 'k.swap'],
  [['1', '2', '3'], 'k.layout'],
  [['M'], 'k.mute'],
  [['−', '+'], 'k.volume'],
  [['G'], 'k.map'],
  [['S'], 'k.save'],
  [['R'], 'k.record'],
  [['?'], 'k.keys'],
  [['Esc'], 'k.back'],
];

function renderKeys() {
  $('keys-list').replaceChildren(
    ...KEYS.flatMap(([keys, label]) => [
      h('dt', {}, keys.map((k) => h('kbd', {}, k))),
      h('dd', {}, t(label)),
    ]),
  );
}

// ---------- save video of the current view ----------

function renderRecord() {
  const btn = $('record');
  btn.classList.toggle('recording', !!recording);
  btn.hidden = !canRecord();
  if (recording) {
    const sec = Math.floor((performance.now() - recording.started) / 1000);
    btn.replaceChildren(icon('stop'), h('span', {}, `${t('v.stopRec')} ${formatDuration(sec)}`));
    btn.setAttribute('aria-label', t('v.recording', { time: formatDuration(sec) }));
  } else {
    setButton(btn, 'rec', t('v.record'));
    btn.removeAttribute('aria-label');
  }
}

function startRec() {
  if (!cur || cur.moment.isPhoto) return;
  if (!canRecord()) return toast(t('v.recUnsupported'));
  const rec = startRecording({
    stage: $('stage'),
    mapPanel: $('map-panel'),
    audioSource: () => (muted ? null : master()),
    mapInfo: () =>
      mapState && cur?.gps.length > 1
        ? {
            map: mapState.map,
            points: cur.gps.map((p) => [p.lat, p.lon]),
            doneIndex: Math.max(0, mapState.idx),
            speed: document.getElementById('gps-speed')?.textContent,
            unit: t('v.kmh'),
            pos: document.getElementById('gps-pos')?.textContent,
          }
        : null,
  });
  recording = {
    rec,
    started: performance.now(),
    stampTime: master()?.currentTime || 0,
    moment: cur.moment,
    layout: cur.layout,
    map: !$('map-panel').hidden,
  };
  recording.timer = setInterval(renderRecord, 500);
  renderRecord();
  playAll();
}

async function stopRec() {
  if (!recording) return;
  const r = recording;
  recording = null;
  clearInterval(r.timer);
  renderRecord();
  const { blob, ext } = await r.rec.stop();
  const d = new Date(r.moment.date.getTime() + r.stampTime * 1000);
  const p = (n) => String(n).padStart(2, '0');
  const name = `tripframe_${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}_${r.layout}${r.map ? '-map' : ''}.${ext}`;
  saveBlob(blob, name);
  toast(t('v.recSaved', { name }));
}

$('record').addEventListener('click', () => (recording ? stopRec() : startRec()));

// ---------- resizing the small picture and the side-by-side split ----------

let pipWidth = Number(localStorage.getItem('pipW')) || 30; // percent of the stage width
let split = Number(localStorage.getItem('split')) || 0.5; // share of the first camera

function applySizes() {
  const stage = $('stage');
  stage.style.setProperty('--pip-w', `${pipWidth}%`);
  stage.style.setProperty('--col-a', `${split}fr`);
  stage.style.setProperty('--col-b', `${1 - split}fr`);
  placeSplitHandle();
}

function placeSplitHandle() {
  const stage = $('stage');
  const handle = stage.querySelector('.split-handle');
  if (!handle) return;
  const figs = [...stage.querySelectorAll('.view')];
  const show = cur?.layout === 'side' && figs.length === 2;
  handle.hidden = !show;
  if (!show) return;
  const s = stage.getBoundingClientRect();
  const a = figs[0].getBoundingClientRect();
  handle.style.left = `${a.right - s.left + 4}px`;
}

function dragResize(e, onMove) {
  e.preventDefault();
  e.stopPropagation();
  const target = e.currentTarget;
  target.setPointerCapture(e.pointerId);
  document.body.classList.add('resizing');
  const move = (ev) => onMove(ev, $('stage').getBoundingClientRect());
  const up = () => {
    target.removeEventListener('pointermove', move);
    target.removeEventListener('pointerup', up);
    target.removeEventListener('pointercancel', up);
    document.body.classList.remove('resizing');
    localStorage.setItem('pipW', pipWidth);
    localStorage.setItem('split', split);
  };
  target.addEventListener('pointermove', move);
  target.addEventListener('pointerup', up);
  target.addEventListener('pointercancel', up);
}

function pipHandle() {
  const handle = h('span', { class: 'pip-handle', role: 'separator', 'aria-label': t('v.resize'), title: t('v.resize') });
  handle.addEventListener('click', (e) => e.stopPropagation());
  handle.addEventListener('dblclick', (e) => e.stopPropagation());
  handle.addEventListener('pointerdown', (e) =>
    dragResize(e, (ev, s) => {
      // The small picture is anchored bottom right; its top-left corner sets the size.
      pipWidth = Math.max(14, Math.min(70, ((s.right - 16 - ev.clientX) / s.width) * 100));
      applySizes();
    }),
  );
  return handle;
}

function splitHandle() {
  const handle = h('span', { class: 'split-handle', role: 'separator', 'aria-orientation': 'vertical', 'aria-label': t('v.resize'), title: t('v.resize') });
  handle.addEventListener('pointerdown', (e) =>
    dragResize(e, (ev, s) => {
      split = Math.max(0.2, Math.min(0.8, (ev.clientX - s.left) / s.width));
      applySizes();
    }),
  );
  handle.addEventListener('dblclick', () => {
    split = 0.5;
    localStorage.setItem('split', split);
    applySizes();
  });
  return handle;
}

window.addEventListener('resize', placeSplitHandle);

// ---------- layout ----------

function renderLayoutSwitch() {
  const cams = cur.moment.cameras;
  const sw = $('layout-switch');
  sw.hidden = cams.length < 2;
  if (cams.length < 2) return sw.replaceChildren();
  const opt = (layout, cam, iconName, label) => {
    const b = h('button', { type: 'button', role: 'radio', class: 'seg', dataset: { layout, cam: cam || '' }, title: label, onclick: () => transition(() => setLayout(layout, cam || cur.main)) });
    if (iconName) b.append(icon(iconName, 16));
    b.append(h('span', {}, label));
    return b;
  };
  sw.replaceChildren(
    h('span', { class: 'seg-pill', 'aria-hidden': 'true' }),
    opt('side', null, 'sideBySide', t('v.side')),
    opt('pip', null, 'pip', t('v.pip')),
    ...cams.map((c) => opt('single', c, null, camLabel(c))),
  );
  markLayout();
}

function markLayout() {
  const sw = $('layout-switch');
  let active = null;
  for (const b of sw.querySelectorAll('.seg')) {
    const on = b.dataset.layout === cur.layout && (cur.layout !== 'single' || b.dataset.cam === cur.main);
    b.setAttribute('aria-checked', String(on));
    if (on) active = b;
  }
  const pill = sw.querySelector('.seg-pill');
  if (pill && active) {
    const total = pill.offsetWidth;
    pill.style.setProperty('--pill-l', `${active.offsetLeft - 3}px`);
    pill.style.setProperty('--pill-r', `${total - (active.offsetLeft - 3) - active.offsetWidth}px`);
  }
}

function setLayout(layout, main) {
  if (!cur) return;
  cur.layout = cur.moment.cameras.length < 2 ? 'single' : layout;
  if (main && main !== cur.main) {
    const t0 = master()?.currentTime || 0;
    const wasPlaying = master() && !master().paused;
    cur.main = main;
    applyVolume();
    const m = master();
    if (m?.tagName === 'VIDEO') {
      if (Math.abs(m.currentTime - t0) > DRIFT) m.currentTime = t0;
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
  const handle = stage.querySelector('.split-handle');
  if (handle) stage.append(handle);
  markLayout();
  $('swap').hidden = cur.moment.cameras.length < 2 || cur.layout === 'side';
  requestAnimationFrame(placeSplitHandle);
}

function swapTo(cam) {
  transition(() => setLayout(cur.layout, cam));
}

function swap() {
  if (!cur || cur.moment.cameras.length < 2) return;
  const cams = cur.moment.cameras;
  swapTo(cams[(cams.indexOf(cur.main) + 1) % cams.length]);
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

function seek(time) {
  for (const v of videos()) {
    const d = Number.isFinite(v.duration) ? v.duration : time;
    v.currentTime = Math.max(0, Math.min(time, d - 0.001));
  }
}

function stepFrame(n) {
  const m = master();
  if (!m || m.tagName !== 'VIDEO') return;
  pauseAll();
  const frame = Math.floor(m.currentTime * cur.fps + 0.001);
  // Aim at the middle of the target frame so rounding never lands on its neighbour.
  seek(Math.max(0, (frame + n + 0.5) / cur.fps));
}

function onEnded() {
  if (!$('autoplay').checked || !cur) return;
  const next = cur.list[cur.list.indexOf(cur.moment) + 1];
  if (next && !next.isPhoto) {
    cur.list.autostartNext = true;
    go(1);
  }
}

function go(dir) {
  if (!cur) return;
  const target = cur.list[cur.list.indexOf(cur.moment) + dir];
  if (!target) return;
  const list = cur.list;
  transition(() => show(target, list), { types: ['clip', dir > 0 ? 'next' : 'prev'] });
}

function updateTime() {
  const m = master();
  if (!cur || !m || m.tagName !== 'VIDEO') return;
  const time = m.currentTime;
  const d = m.duration;
  if (!scrubbing && Number.isFinite(d) && d > 0) $('scrubber').value = Math.round((time / d) * 1000);
  $('scrubber').style.setProperty('--progress', `${$('scrubber').value / 10}%`);
  $('time-now').textContent = formatDuration(time, true);
  const clock = new Date(cur.moment.date.getTime() + time * 1000);
  $('frame-no').textContent = `${formatTime(clock)}, ${t('v.frame')} ${Math.floor(time * cur.fps + 0.001) + 1}`;
  if (mapState && cur.gps.length > 1 && !$('map-panel').hidden) followMap(time);
}

let lastSync = 0;
function tick(now) {
  raf = requestAnimationFrame(tick);
  const m = master();
  if (!cur || !m || m.tagName !== 'VIDEO') return;
  if (!m.paused) updateTime();
  if (!m.paused && now - lastSync > 400) {
    lastSync = now;
    const time = m.currentTime;
    for (const v of videos()) {
      if (v === m || v.readyState < 2) continue;
      if (time < v.duration && Math.abs(v.currentTime - time) > DRIFT) v.currentTime = time;
      if (v.paused && time < v.duration) v.play().catch(() => {});
    }
  }
}

const scrubber = $('scrubber');
scrubber.addEventListener('pointerdown', () => (scrubbing = true));
scrubber.addEventListener('pointerup', () => (scrubbing = false));
scrubber.addEventListener('input', () => {
  const d = master()?.duration;
  scrubber.style.setProperty('--progress', `${scrubber.value / 10}%`);
  if (Number.isFinite(d)) seek((scrubber.value / 1000) * d);
});

$('play').addEventListener('click', togglePlay);
$('frame-back').addEventListener('click', () => stepFrame(-1));
$('frame-fwd').addEventListener('click', () => stepFrame(1));
$('viewer-close').addEventListener('click', closeViewer);
$('prev-moment').addEventListener('click', () => go(-1));
$('next-moment').addEventListener('click', () => go(1));
$('swap').addEventListener('click', swap);
$('speed').addEventListener('change', (e) => videos().forEach((v) => (v.playbackRate = Number(e.target.value))));
$('save-frame').addEventListener('click', () => saveFrame());
$('map-toggle').addEventListener('click', () => {
  mapOn = !mapOn;
  localStorage.setItem('map', mapOn ? '1' : '0');
  transition(() => renderMap());
});

function onKey(e) {
  const tag = e.target.tagName;
  if (tag === 'SELECT' && /Arrow/.test(e.key)) return;
  if (tag === 'INPUT' && e.target.type === 'range' && /Arrow/.test(e.key)) return;
  const card = $('keys-card');
  if (e.key === 'Escape' && card.matches(':popover-open')) {
    e.preventDefault();
    e.stopPropagation();
    card.hidePopover();
    return;
  }
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
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
    r: () => $('record').click(),
    g: () => $('map-toggle').click(),
    m: toggleMute,
    '-': () => setVolume(volume - 0.1),
    '=': () => setVolume(volume + 0.1),
    '+': () => setVolume(volume + 0.1),
    w: swap,
    1: () => cur?.moment.cameras.length > 1 && transition(() => setLayout('side', cur.main)),
    2: () => cur?.moment.cameras.length > 1 && transition(() => setLayout('pip', cur.main)),
    3: () => cur?.moment.cameras.length > 1 && transition(() => setLayout('single', cur.main)),
    '?': () => card.togglePopover(),
  }[key];
  if (!handled || e.ctrlKey || e.metaKey || e.altKey) return;
  // Space plays and pauses wherever the focus is, instead of pressing the focused button.
  e.preventDefault();
  e.stopPropagation();
  handled();
}

// ---------- save frame ----------

function saveBlob(blob, name) {
  const a = h('a', { href: URL.createObjectURL(blob), download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

function stamp(time) {
  const d = new Date(cur.moment.date.getTime() + time * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}-${p(Math.floor((time % 1) * 100))}`;
}

function saveFrame(only) {
  if (!cur || cur.moment.isPhoto) return;
  const cams = only || (cur.layout === 'single' ? [cur.main] : cur.views.map((v) => v.cam));
  const vids = cams.map((c) => cur.views.find((v) => v.cam === c)).filter((v) => v && v.media.videoWidth);
  if (!vids.length) return toast(t('v.noFrame'));
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

  const name = `tripframe_${stamp(master().currentTime)}_${vids.map((v) => camLabel(v.cam).toLowerCase()).join('-')}.png`;
  canvas.toBlob((blob) => {
    saveBlob(blob, name);
    toast(t('v.saved', { name }));
  }, 'image/png');
  // A short flash on the saved pictures confirms what went into the file.
  for (const v of vids) {
    v.fig.classList.remove('flash');
    void v.fig.offsetWidth;
    v.fig.classList.add('flash');
  }
}

// ---------- map ----------

const INK = '#17191e';

async function renderMap() {
  const panel = $('map-panel');
  const toggle = $('map-toggle');
  const hasGps = !!cur && cur.gps.length > 1;
  toggle.disabled = !hasGps;
  toggle.title = hasGps ? t('v.mapTitle') : t('v.noGpsTitle');
  setButton(toggle, hasGps ? 'map' : 'noGps', hasGps ? t('v.map') : t('v.noGps'));
  toggle.setAttribute('aria-pressed', String(mapOn && hasGps));
  panel.hidden = !mapOn || !hasGps;
  $('viewer').classList.toggle('with-map', !panel.hidden);
  if (panel.hidden) return;

  if (!mapState) {
    const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
    const map = L.map('map', { zoomControl: true, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
      crossOrigin: 'anonymous',
    }).addTo(map);
    const casing = L.polyline([], { color: '#ffffff', weight: 9, opacity: 0.9 }).addTo(map);
    const line = L.polyline([], { color: '#8c919a', weight: 5, opacity: 1 }).addTo(map);
    const done = L.polyline([], { color: INK, weight: 5, opacity: 1 }).addTo(map);
    const marker = L.circleMarker([0, 0], { radius: 8, color: INK, weight: 3, fillColor: '#ffc21a', fillOpacity: 1 }).addTo(map);
    const pick = (e) => {
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
    };
    line.on('click', pick);
    casing.on('click', pick);
    mapState = { map, line, casing, done, marker, key: null, idx: -1 };
  }
  const { map, line, casing, marker, done } = mapState;
  const latlngs = cur.gps.map((p) => [p.lat, p.lon]);
  if (mapState.key !== cur.moment) {
    mapState.key = cur.moment;
    mapState.idx = -1;
    line.setLatLngs(latlngs);
    casing.setLatLngs(latlngs);
    done.setLatLngs([]);
    marker.setLatLng(latlngs[0]);
    map.fitBounds(line.getBounds(), { padding: [24, 24], maxZoom: 17, animate: false });
    requestAnimationFrame(() => {
      map.invalidateSize();
      map.fitBounds(line.getBounds(), { padding: [24, 24], maxZoom: 17 });
    });
  } else requestAnimationFrame(() => map.invalidateSize());

  $('gps-readout').replaceChildren(
    h('div', { class: 'gps-speed' }, h('span', { id: 'gps-speed' }, '0'), h('span', { class: 'unit' }, t('v.kmh'))),
    h('p', { id: 'gps-pos', class: 'gps-pos' }),
    h(
      'div',
      { class: 'gps-export' },
      h('span', {}, t('v.export')),
      ...Object.keys(ROUTE_FORMATS).map((ext) => h('button', { class: 'btn btn-ghost', type: 'button', 'data-route': ext }, ext.toUpperCase())),
    ),
    h('p', { class: 'gps-note' }, t('v.mapNote')),
  );
  followMap(master()?.currentTime || 0, true);
}

$('gps-readout').addEventListener('click', (e) => {
  const ext = e.target.closest('[data-route]')?.dataset.route;
  if (!ext || !cur?.gps.length) return;
  const name = `tripframe_${stamp(0).slice(0, 19)}_route.${ext}`;
  const { make, type } = ROUTE_FORMATS[ext];
  saveBlob(new Blob([make(cur.gps, `Tripframe ${stamp(0).slice(0, 19)}`)], { type }), name);
  toast(t('v.saved', { name }));
});

const coord = (v) => Math.abs(v).toLocaleString(locale(), { minimumFractionDigits: 5, maximumFractionDigits: 5 });

function followMap(time, force) {
  const pts = cur.gps;
  let i = pts.findIndex((p) => p.t > time) - 1;
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
  if (pos) pos.textContent = `${coord(p.lat)}° ${t(p.lat >= 0 ? 'dir.N' : 'dir.S')}  ${coord(p.lon)}° ${t(p.lon >= 0 ? 'dir.E' : 'dir.W')}`;
  if (mapState.map._loaded && !mapState.map.getBounds().pad(-0.1).contains([p.lat, p.lon])) mapState.map.panTo([p.lat, p.lon], { animate: true });
}

renderChrome();
