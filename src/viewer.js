// Full-screen viewer: plays every camera of one moment in sync, steps frame by
// frame, zooms into the picture, saves frames and parts of the clip, and
// follows the GPS track on a map with the driving data next to it.

import { readInfo } from './mp4.js';
import { startRecording, createComposer, canRecord } from './record.js';
import { exportReverse, canReverse } from './clip.js';
import { mergeLayout, canLayout } from './merge.js';
import { ROUTE_FORMATS, toGpx, waypointsFromGpx, cumulativeKm, gradients } from './route.js';
import { STILL_FORMATS, canvasToBlob } from './stills.js';
import { findLoudMoments, knownLoudMoments } from './audio.js';
import { loadTags, saveTags, nearestIndex } from './geotags.js';
import { onlineOn, setOnline, fetchWeather, fetchAddress, weatherKind } from './online.js';
import { drawPlot, plotTime } from './plot.js';
import { getUnit, setUnit, speedIn, speedUnit, distanceIn, distanceUnit, altitudeIn, altitudeUnit } from './units.js';
import { t, locale, getLang, plural } from './i18n.js';
import { transition } from './theme.js';
import {
  $, h, icon, setButton, toast, camLabel, typeLabel, saveBlob,
  formatDuration, formatDay, formatTime,
} from './ui.js';

const DEFAULT_FPS = 30;
const DRIFT = 0.12; // seconds before a follower camera is re-aligned

let cur = null; // { moment, list, views, layout, main, fps, gps, accel, dist, grade, tags, loud, clipIn, clipOut, urls }
let returnFocus = null;
let scrubbing = false;
let raf = 0;
let mapState = null;
let mapOn = localStorage.getItem('map') !== '0';
let hudOn = localStorage.getItem('hud') === '1';
let mapStyle = localStorage.getItem('mapStyle') || 'road';
let speedColours = localStorage.getItem('speedColours') === '1';
let follow = localStorage.getItem('follow') !== '0';
let plotKey = localStorage.getItem('plot') || 'speed';
let stillFormat = STILL_FORMATS.includes(localStorage.getItem('still')) ? localStorage.getItem('still') : 'png';
let volume = Number(localStorage.getItem('volume') ?? 1);
let muted = localStorage.getItem('muted') === '1';
let recording = null; // { rec, started, stampTime, moment, layout, map, timer, stopAt, name }
let busy = null; // { kind: 'stills' | 'reverse' | 'save', abort: AbortController } while a frame-by-frame job runs

function renderChrome() {
  setButton($('viewer-close'), 'back', t('v.back'));
  setButton($('prev-moment'), 'prev', t('v.prevClip'), { iconOnly: true });
  setButton($('next-moment'), 'next', t('v.nextClip'), { iconOnly: true });
  setButton($('frame-back'), 'stepBack', t('v.frameBack'), { iconOnly: true });
  setButton($('frame-fwd'), 'stepFwd', t('v.frameFwd'), { iconOnly: true });
  setButton($('swap'), 'swap', t('v.swap'));
  setButton($('save-frame'), 'save', t('v.save'));
  setButton($('still-toggle'), 'more', t('s.options'), { iconOnly: true });
  setButton($('clip-toggle'), 'clip', t('c.title'), { iconOnly: true });
  setButton($('loud'), 'loud', t('a.find'), { iconOnly: true });
  setButton($('hud-toggle'), 'hud', t('v.hud'), { iconOnly: true });
  setButton($('map-colours'), 'colours', t('v.speedColours'), { iconOnly: true });
  setButton($('map-follow'), 'follow', t('v.follow'), { iconOnly: true });
  $('hud-toggle').setAttribute('aria-pressed', String(hudOn));
  $('map-colours').setAttribute('aria-pressed', String(speedColours));
  $('map-follow').setAttribute('aria-pressed', String(follow));
  $('save-frame').title = t('v.saveTitle', { format: stillFormat.toUpperCase() });
  for (const b of document.querySelectorAll('.card-close')) b.replaceChildren(icon('close'));
  setPlayIcon(master() && !master().paused);
  renderVolume();
  renderRecord();
  renderKeys();
  renderStillCard();
  renderMapStyle();
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
  busy?.abort.abort();
  for (const card of document.querySelectorAll('.tool-card:popover-open')) card.hidePopover();
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
  if (recording?.stopAt != null) stopRec();
  busy?.abort.abort();
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
    const view = { cam, clip, media, fig, zoom: { s: 1, x: 0, y: 0 } };
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
    const reset = h('button', { type: 'button', class: 'zoom-reset', onclick: (e) => {
      e.stopPropagation();
      setZoom(view, 1, 0, 0);
    } });
    setButton(reset, 'zoomOut', t('z.reset'));
    fig.append(reset);
    bindZoom(view);
    // One click plays or pauses; a double click swaps which camera is large.
    fig.addEventListener('click', () => {
      if (fig.dataset.dragged) return delete fig.dataset.dragged;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(togglePlay, 220);
    });
    fig.addEventListener('dblclick', (e) => {
      e.preventDefault();
      clearTimeout(clickTimer);
      if (cur.layout === 'pip' && cam !== cur.main) swapTo(cam);
      else swap();
    });
    return view;
  });

  cur = { moment, list, views, urls, layout, main: moment.cameras[0], fps: DEFAULT_FPS, gps: [], accel: [], dist: [], grade: [], tags: loadTags(moment), loud: null, clipIn: null, clipOut: null };
  for (const v of views) if (!v.clip.isPhoto || views.length > 1) v.fig.append(pipHandle());
  $('stage').replaceChildren(...views.map((v) => v.fig), splitHandle(), h('div', { class: 'hud', id: 'hud', hidden: !hudOn || moment.isPhoto, 'aria-live': 'off' }));
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
    v.addEventListener('loadedmetadata', ifMaster(() => {
      $('time-total').textContent = formatDuration(v.duration);
      renderMarks();
    }));
  }

  renderHeading();
  renderLayoutSwitch();
  setLayout(moment.cameras.length > 1 ? layout : 'single', cur.main);
  $('scrubber').value = 0;
  $('time-total').textContent = '0:00';
  $('time-now').textContent = formatDuration(0, true);
  $('frame-no').textContent = '';
  $('loud').disabled = moment.isPhoto;
  $('loud').classList.remove('found');
  renderMarks();
  renderClipCard();
  setPlayIcon(false);

  const token = cur;
  knownLoudMoments(moment.primary.file)?.then((found) => {
    if (cur !== token || !found) return;
    cur.loud = found;
    renderMarks();
    $('loud').classList.toggle('found', found.length > 0);
  }, () => {});
  if (!moment.isPhoto) {
    readInfo(moment.primary.file).then((info) => {
      if (cur !== token) return;
      cur.fps = info.fps || DEFAULT_FPS;
      cur.gps = info.gps || [];
      cur.accel = info.accel || [];
      cur.dist = cumulativeKm(cur.gps);
      cur.grade = gradients(cur.gps, cur.dist);
      renderMap();
      renderHud(0);
    });
    cur.autostart = !!list.autostartNext;
    list.autostartNext = false;
    Promise.all(videos().map((v) => new Promise((r) => (v.readyState >= 2 ? r() : v.addEventListener('loadeddata', r, { once: true })))))
      .then(() => cur === token && token.autostart && playAll());
  } else renderMap();
  renderHud(0);
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
  for (const v of cur.views) {
    v.fig.querySelector('figcaption').textContent = camLabel(v.cam);
    setButton(v.fig.querySelector('.zoom-reset'), 'zoomOut', t('z.reset'));
  }
  renderMap();
  renderMarks();
  renderClipCard();
  updateTime();
}

document.addEventListener('unitchange', () => {
  if (!cur) return;
  renderMap();
  renderHud(master()?.currentTime || 0);
});

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
  [['H'], 'k.hud'],
  [['T'], 'k.marker'],
  [['S'], 'k.save'],
  [['I', 'O'], 'k.inout'],
  [['R'], 'k.record'],
  [['0'], 'k.zoom'],
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

// ---------- saving files ----------

function stamp(time) {
  const d = new Date(cur.moment.date.getTime() + time * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}-${p(Math.floor((time % 1) * 100))}`;
}

/** Waits until every camera shows the frame at `time`. */
function seekTo(time) {
  return Promise.all(
    videos().map((v) => {
      const target = Math.max(0, Math.min(time, (Number.isFinite(v.duration) ? v.duration : time) - 0.001));
      if (Math.abs(v.currentTime - target) < 1e-4 && !v.seeking) return null;
      return new Promise((resolve) => {
        const done = () => {
          clearTimeout(timer);
          resolve();
        };
        const timer = setTimeout(done, 4000);
        v.addEventListener('seeked', done, { once: true });
        v.currentTime = target;
      });
    }),
  ).then(() => {
    if (mapState && cur?.gps.length > 1 && !$('map-panel').hidden) followMap(time, true);
    renderHud(time);
  });
}

// ---------- save video of the current view, and export part of a clip ----------

function renderRecord() {
  const btn = $('record');
  const saving = busy?.kind === 'save';
  btn.classList.toggle('recording', !!recording || saving);
  if (recording) {
    const sec = Math.floor((performance.now() - recording.started) / 1000);
    btn.replaceChildren(icon('stop'), h('span', {}, `${t('v.stopRec')} ${formatDuration(sec)}`));
    btn.setAttribute('aria-label', t('v.recording', { time: formatDuration(sec) }));
  } else if (saving) {
    btn.replaceChildren(icon('stop'), h('span', {}, t('v.saving', { pct: busy.pct })));
    btn.setAttribute('aria-label', `${t('v.saving', { pct: busy.pct })}. ${t('s.cancel')}`);
  } else {
    setButton(btn, 'download', t('v.record'));
    btn.removeAttribute('aria-label');
  }
}

// Save video: the clip as a file, in the layout on screen. One camera is the file itself;
// two are drawn into one picture (merge.js), the large or left one first, without sound of the other.
async function saveVideo() {
  if (!cur || cur.moment.isPhoto || busy) return;
  const m = cur.moment;
  const file = (c) => m.files[c].file;
  const other = cur.layout === 'single' ? null : m.cameras.find((c) => c !== cur.main && !m.files[c].isPhoto);
  if (!other) {
    const f = file(cur.main);
    const name = `tripframe_${stamp(0)}_${camLabel(cur.main).toLowerCase()}${f.name.slice(f.name.lastIndexOf('.'))}`;
    saveBlob(f, name);
    return toast(t('v.recSaved', { name }));
  }
  if (!canLayout()) return toast(t('tr.noEncode'));
  const name = `tripframe_${stamp(0)}_${cur.layout}.mp4`;
  const job = (busy = { kind: 'save', abort: new AbortController(), pct: 0 });
  renderRecord();
  try {
    const onProgress = (f) => {
      if (busy !== job) return;
      job.pct = Math.round(f * 100);
      renderRecord();
    };
    const blob = await mergeLayout([{ first: file(cur.main), second: file(other) }], { layout: cur.layout, name, picker: false, signal: job.abort.signal, onProgress });
    if (job.abort.signal.aborted) return;
    saveBlob(blob, name);
    toast(t('v.recSaved', { name }));
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error(e);
      toast(e.code ? t(`tr.${e.code}`, { name: e.file || '' }) : t('tr.failed', { error: e.message }));
    }
  } finally {
    if (busy === job) busy = null;
    renderRecord();
  }
}

// Stopping shows at once; the export ends at its next step and saves nothing.
function stopSave() {
  busy.abort.abort();
  busy = null;
  renderRecord();
  toast(t('v.saveStopped'));
}

function mapInfo() {
  if (!mapState || !(cur?.gps.length > 1)) return null;
  const p = cur.gps[Math.max(0, mapState.idx)];
  return {
    map: mapState.map,
    points: cur.gps.map((q) => [q.lat, q.lon]),
    colors: speedColours ? cur.gps.map((q) => speedColour(q.speed)) : null,
    doneIndex: Math.max(0, mapState.idx),
    bearing: p?.bearing,
    speed: document.getElementById('gps-speed')?.textContent,
    unit: speedUnit(),
    pos: document.getElementById('gps-pos')?.textContent,
  };
}

/** @param {{ sound?: boolean, stopAt?: number, name?: string }} [opts] */
function startRec(opts = {}) {
  if (!cur || cur.moment.isPhoto || recording) return;
  if (!canRecord()) return toast(t('v.recUnsupported'));
  const sound = opts.sound ?? !muted;
  const rec = startRecording({ stage: $('stage'), mapPanel: $('map-panel'), audioSource: () => (sound ? master() : null), mapInfo });
  recording = {
    rec,
    started: performance.now(),
    stampTime: master()?.currentTime || 0,
    moment: cur.moment,
    layout: cur.layout,
    map: !$('map-panel').hidden,
    stopAt: opts.stopAt ?? null,
    name: opts.name ?? null,
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
  if (r.stopAt != null) {
    pauseAll();
    for (const v of videos()) v.playbackRate = Number($('speed').value);
    $('clip-status').textContent = '';
  }
  const d = new Date(r.moment.date.getTime() + r.stampTime * 1000);
  const p = (n) => String(n).padStart(2, '0');
  const name = r.name ? `${r.name}.${ext}` : `tripframe_${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}_${r.layout}${r.map ? '-map' : ''}.${ext}`;
  saveBlob(blob, name);
  toast(t('v.recSaved', { name }));
}

$('record').addEventListener('click', () => {
  if (recording) stopRec();
  else if (busy?.kind === 'save') stopSave();
  else saveVideo();
});

function clipRange() {
  const d = master()?.duration;
  const from = cur.clipIn ?? 0;
  const to = cur.clipOut ?? (Number.isFinite(d) ? d : 0);
  return { from: Math.min(from, to), to: Math.max(from, to) };
}

function setClipEdge(edge, time) {
  if (!cur || cur.moment.isPhoto) return;
  cur[edge] = Math.max(0, time);
  renderClipCard();
  renderMarks();
  toast(t(edge === 'clipIn' ? 'c.inSet' : 'c.outSet', { time: formatDuration(time, true) }));
}

function renderClipCard() {
  if (!cur) return;
  const { from, to } = clipRange();
  $('clip-in').textContent = formatDuration(from, true);
  $('clip-out').textContent = formatDuration(to, true);
  $('clip-clear').hidden = cur.clipIn == null && cur.clipOut == null;
  const reverse = document.querySelector('input[name="clip-dir"]:checked')?.value === 'reverse';
  $('clip-sound').disabled = reverse;
  $('clip-sound').closest('label').classList.toggle('disabled', reverse);
}

$('clip-set-in').addEventListener('click', () => setClipEdge('clipIn', master()?.currentTime || 0));
$('clip-clear').addEventListener('click', () => {
  if (!cur) return;
  cur.clipIn = cur.clipOut = null;
  renderClipCard();
  renderMarks();
});
$('clip-set-out').addEventListener('click', () => setClipEdge('clipOut', master()?.currentTime || 0));
for (const r of document.querySelectorAll('input[name="clip-dir"]')) r.addEventListener('change', renderClipCard);
$('clip-card').addEventListener('toggle', (e) => e.newState === 'open' && renderClipCard());

$('clip-run').addEventListener('click', async () => {
  if (!cur || cur.moment.isPhoto) return;
  if (busy) return busy.abort.abort();
  if (recording) return stopRec();
  const { from, to } = clipRange();
  if (to - from < 0.1) return toast(t('c.tooShort'));
  const speed = Number($('clip-speed').value);
  const reverse = document.querySelector('input[name="clip-dir"]:checked').value === 'reverse';
  const name = `tripframe_${stamp(from)}_clip${reverse ? '-reverse' : ''}${speed !== 1 ? `-${speed}x` : ''}`;
  const status = $('clip-status');

  if (!reverse) {
    if (!canRecord()) return toast(t('v.recUnsupported'));
    pauseAll();
    await seekTo(from);
    for (const v of videos()) v.playbackRate = speed;
    status.textContent = t('c.recording');
    // Start recording once the picture moves, so the file does not open on a still frame.
    const m = master();
    const playing = new Promise((r) => m.addEventListener('playing', r, { once: true }));
    playAll();
    await playing;
    startRec({ sound: $('clip-sound').checked, stopAt: to, name });
    return;
  }

  if (!canReverse()) return toast(t('c.unsupported'));
  pauseAll();
  const abort = new AbortController();
  busy = { kind: 'reverse', abort };
  $('clip-run').textContent = t('s.cancel');
  try {
    const blob = await exportReverse({
      composer: createComposer({ stage: $('stage'), mapPanel: $('map-panel'), mapInfo }),
      seekTo,
      from,
      to,
      fps: Math.min(60, Math.round(cur.fps) || DEFAULT_FPS),
      speed,
      signal: abort.signal,
      onProgress: (f) => (status.textContent = t('c.exporting', { pct: Math.round(f * 100) })),
    });
    if (blob) {
      saveBlob(blob, `${name}.mp4`);
      toast(t('v.recSaved', { name: `${name}.mp4` }));
    }
  } catch (e) {
    console.error(e);
    toast(e.message === 'unsupported' ? t('c.unsupported') : t('c.failed', { error: e.message }));
  } finally {
    busy = null;
    status.textContent = '';
    $('clip-run').textContent = t('c.export');
  }
});

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

// ---------- zoom and pan inside a picture ----------

function setZoom(view, s, x, y) {
  const r = view.fig.getBoundingClientRect();
  s = Math.max(1, Math.min(8, s));
  const maxX = ((s - 1) * r.width) / 2;
  const maxY = ((s - 1) * r.height) / 2;
  x = Math.max(-maxX, Math.min(maxX, x));
  y = Math.max(-maxY, Math.min(maxY, y));
  if (s === 1) x = y = 0;
  view.zoom = { s, x, y };
  view.media.style.transform = s === 1 ? '' : `translate(${x}px, ${y}px) scale(${s})`;
  // record.js reads these to draw the same crop into saved videos.
  Object.assign(view.media.dataset, { zs: s, zx: x, zy: y });
  view.fig.classList.toggle('zoomed', s > 1);
}

function bindZoom(view) {
  const { fig } = view;
  fig.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const r = fig.getBoundingClientRect();
      const px = e.clientX - (r.left + r.width / 2);
      const py = e.clientY - (r.top + r.height / 2);
      const { s, x, y } = view.zoom;
      const next = Math.max(1, Math.min(8, s * Math.exp(-e.deltaY * 0.0015)));
      // Keep the point under the pointer where it is.
      setZoom(view, next, px - ((px - x) * next) / s, py - ((py - y) * next) / s);
    },
    { passive: false },
  );
  fig.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || view.zoom.s === 1 || e.target.closest('button, .pip-handle')) return;
    const start = { x: e.clientX, y: e.clientY, zx: view.zoom.x, zy: view.zoom.y };
    let moved = false;
    fig.setPointerCapture(e.pointerId);
    fig.classList.add('panning');
    const move = (ev) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      setZoom(view, view.zoom.s, start.zx + dx, start.zy + dy);
    };
    const up = () => {
      fig.removeEventListener('pointermove', move);
      fig.removeEventListener('pointerup', up);
      fig.removeEventListener('pointercancel', up);
      fig.classList.remove('panning');
      if (moved) fig.dataset.dragged = '1';
    };
    fig.addEventListener('pointermove', move);
    fig.addEventListener('pointerup', up);
    fig.addEventListener('pointercancel', up);
  });
}

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
  markSegments(sw, (b) => b.dataset.layout === cur.layout && (cur.layout !== 'single' || b.dataset.cam === cur.main));
}

function markSegments(sw, isOn) {
  let active = null;
  for (const b of sw.querySelectorAll('.seg')) {
    const on = isOn(b);
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
  markSegments($('layout-switch'), (b) => b.dataset.layout === cur.layout && (cur.layout !== 'single' || b.dataset.cam === cur.main));
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
  if (!m || m.tagName !== 'VIDEO' || busy) return;
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
  if (recording?.stopAt != null) return stopRec();
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
  renderHud(time);
}

let lastSync = 0;
function tick(now) {
  raf = requestAnimationFrame(tick);
  const m = master();
  if (!cur || !m || m.tagName !== 'VIDEO') return;
  if (!m.paused) updateTime();
  if (recording?.stopAt != null && m.currentTime >= recording.stopAt) stopRec();
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
$('hud-toggle').addEventListener('click', () => {
  hudOn = !hudOn;
  localStorage.setItem('hud', hudOn ? '1' : '0');
  $('hud-toggle').setAttribute('aria-pressed', String(hudOn));
  renderHud(master()?.currentTime || 0);
});

function onKey(e) {
  const tag = e.target.tagName;
  if (tag === 'SELECT' && /Arrow/.test(e.key)) return;
  if (tag === 'INPUT' && e.target.type === 'range' && /Arrow/.test(e.key)) return;
  // Typing a marker name or a number must not trigger shortcuts.
  if ((tag === 'INPUT' && /^(text|number|search)$/.test(e.target.type)) || tag === 'TEXTAREA') return;
  const open = document.querySelector('.keys-card:popover-open');
  if (e.key === 'Escape' && open) {
    e.preventDefault();
    e.stopPropagation();
    open.hidePopover();
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
    h: () => $('hud-toggle').click(),
    t: addTag,
    i: () => setClipEdge('clipIn', master()?.currentTime || 0),
    o: () => setClipEdge('clipOut', master()?.currentTime || 0),
    0: () => cur?.views.forEach((v) => setZoom(v, 1, 0, 0)),
    m: toggleMute,
    '-': () => setVolume(volume - 0.1),
    '=': () => setVolume(volume + 0.1),
    '+': () => setVolume(volume + 0.1),
    w: swap,
    1: () => cur?.moment.cameras.length > 1 && transition(() => setLayout('side', cur.main)),
    2: () => cur?.moment.cameras.length > 1 && transition(() => setLayout('pip', cur.main)),
    3: () => cur?.moment.cameras.length > 1 && transition(() => setLayout('single', cur.main)),
    '?': () => $('keys-card').togglePopover(),
  }[key];
  if (!handled || e.ctrlKey || e.metaKey || e.altKey) return;
  // Space plays and pauses wherever the focus is, instead of pressing the focused button.
  e.preventDefault();
  e.stopPropagation();
  handled();
}

// ---------- still frames ----------

function frameCanvas(only) {
  const cams = only || (cur.layout === 'single' ? [cur.main] : cur.views.map((v) => v.cam));
  const vids = cams.map((c) => cur.views.find((v) => v.cam === c)).filter((v) => v && v.media.videoWidth);
  if (!vids.length) return null;
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
  return { canvas, vids, label: vids.map((v) => camLabel(v.cam).toLowerCase()).join('-') };
}

async function saveFrame(only) {
  if (!cur || cur.moment.isPhoto) return;
  pauseAll();
  const frame = frameCanvas(only);
  if (!frame) return toast(t('v.noFrame'));
  // A short flash on the saved pictures confirms what went into the file.
  for (const v of frame.vids) {
    v.fig.classList.remove('flash');
    void v.fig.offsetWidth;
    v.fig.classList.add('flash');
  }
  const name = `tripframe_${stamp(master().currentTime)}_${frame.label}.${stillFormat}`;
  saveBlob(await canvasToBlob(frame.canvas, stillFormat), name);
  toast(t('v.saved', { name }));
}

function renderStillCard() {
  $('still-format').replaceChildren(
    ...STILL_FORMATS.map((f) =>
      h('label', {}, h('input', { type: 'radio', name: 'still-format', value: f, checked: f === stillFormat, onchange: () => {
        stillFormat = f;
        localStorage.setItem('still', f);
        $('save-frame').title = t('v.saveTitle', { format: f.toUpperCase() });
      } }), ` ${f.toUpperCase()}`),
    ),
  );
  if (!busy) $('still-run').textContent = t('s.start');
}

$('still-run').addEventListener('click', async () => {
  if (!cur || cur.moment.isPhoto) return;
  if (busy) return busy.abort.abort();
  const every = Number($('still-every').value);
  if (!(every >= 0.1)) return toast(t('s.badEvery'));
  const { from, to } = clipRange();
  const times = [];
  for (let x = from; x <= to + 1e-6; x += every) times.push(x);
  let dir = null;
  if (window.showDirectoryPicker) {
    try {
      dir = await window.showDirectoryPicker({ id: 'tripframe-stills', mode: 'readwrite' });
    } catch (e) {
      if (e.name === 'AbortError') return;
    }
  }
  pauseAll();
  const abort = new AbortController();
  busy = { kind: 'stills', abort };
  $('still-run').textContent = t('s.cancel');
  const status = $('still-status');
  let saved = 0;
  try {
    for (let i = 0; i < times.length && !abort.signal.aborted; i++) {
      status.textContent = t('s.saving', { n: i + 1, total: times.length });
      await seekTo(times[i]);
      const frame = frameCanvas();
      if (!frame) continue;
      const name = `tripframe_${stamp(times[i])}_${frame.label}.${stillFormat}`;
      const blob = await canvasToBlob(frame.canvas, stillFormat);
      if (dir) {
        const w = await (await dir.getFileHandle(name, { create: true })).createWritable();
        await w.write(blob);
        await w.close();
      } else {
        saveBlob(blob, name);
        await new Promise((r) => setTimeout(r, 300));
      }
      saved++;
    }
    toast(plural(saved, 'n.saved'));
  } catch (e) {
    console.error(e);
    toast(t('c.failed', { error: e.message }));
  } finally {
    busy = null;
    status.textContent = '';
    $('still-run').textContent = t('s.start');
  }
});

// ---------- loud moments ----------

function renderMarks() {
  const box = $('loud-marks');
  const d = master()?.duration;
  const ok = cur && Number.isFinite(d) && d > 0;
  box.replaceChildren(
    ...(ok && cur.loud
      ? cur.loud.map((m) =>
          h('button', {
            type: 'button',
            class: 'loud-mark',
            style: `left: ${(m.t / d) * 100}%`,
            title: t('a.at', { time: formatDuration(m.t) }),
            'aria-label': t('a.at', { time: formatDuration(m.t) }),
            onclick: () => seek(Math.max(0, m.t - 2)),
          }),
        )
      : []),
  );
  const range = $('clip-range');
  range.hidden = !ok || (cur.clipIn == null && cur.clipOut == null);
  if (!range.hidden) {
    const { from, to } = clipRange();
    range.style.left = `${(from / d) * 100}%`;
    range.style.width = `${((to - from) / d) * 100}%`;
  }
}

$('loud').addEventListener('click', async () => {
  if (!cur || cur.moment.isPhoto) return;
  const token = cur;
  const btn = $('loud');
  btn.disabled = true;
  btn.classList.add('working');
  toast(t('a.searching'));
  try {
    const found = await findLoudMoments(cur.moment.primary.file);
    if (cur !== token) return;
    if (!found) return toast(t('a.noAudio'));
    cur.loud = found;
    renderMarks();
    btn.classList.toggle('found', found.length > 0);
    toast(found.length ? plural(found.length, 'n.loud') : t('a.none'));
  } catch (e) {
    console.error(e);
    toast(t('a.noAudio'));
  } finally {
    btn.disabled = false;
    btn.classList.remove('working');
  }
});

// ---------- driving data on the video ----------

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const compass = (deg) => t(`dir.${COMPASS[Math.round((((deg % 360) + 360) % 360) / 45) % 8]}`);
const coord = (v) => Math.abs(v).toLocaleString(locale(), { minimumFractionDigits: 5, maximumFractionDigits: 5 });
const position = (p) => `${coord(p.lat)}° ${t(p.lat >= 0 ? 'dir.N' : 'dir.S')}  ${coord(p.lon)}° ${t(p.lon >= 0 ? 'dir.E' : 'dir.W')}`;
const num = (v, d = 0) => v.toLocaleString(locale(), { minimumFractionDigits: d, maximumFractionDigits: d });

function pointAt(time) {
  const pts = cur?.gps || [];
  if (!pts.length) return -1;
  let i = pts.findIndex((p) => p.t > time) - 1;
  if (i < -1) i = pts.length - 1;
  return Math.max(0, i);
}

function renderHud(time) {
  const hud = document.getElementById('hud');
  if (!hud || !cur) return;
  hud.hidden = !hudOn || cur.moment.isPhoto;
  if (hud.hidden) return;
  const clock = new Date(cur.moment.date.getTime() + time * 1000);
  const day = new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'short', year: 'numeric' }).format(clock);
  const lines = [`${day}  ${formatTime(clock)}`];
  const i = pointAt(time);
  if (i >= 0) {
    const p = cur.gps[i];
    lines.push(`${num(speedIn(p.speed))} ${speedUnit()}   ${compass(p.bearing)} ${num(p.bearing)}°   ${num(distanceIn(cur.dist[i]), 2)} ${distanceUnit()}`);
    const extra = [position(p)];
    if (Number.isFinite(p.alt)) extra.push(`${num(altitudeIn(p.alt))} ${altitudeUnit()}`);
    if (Number.isFinite(p.sats)) extra.push(`${t('d.sats')} ${p.sats}`);
    lines.push(extra.join('  ·  '));
  }
  if (hud.childElementCount !== lines.length) hud.replaceChildren(...lines.map((_, k) => h('span', { class: k ? 'hud-line' : 'hud-line hud-time' })));
  lines.forEach((text, k) => {
    if (hud.children[k].textContent !== text) hud.children[k].textContent = text;
  });
}

// ---------- map ----------

const INK = '#17191e';
const SPEED_STEPS = { kmh: [30, 60, 90, 120], mph: [20, 40, 55, 75] };
const SPEED_COLOURS = ['#ffe08a', '#ffc21a', '#ff9a1a', '#f2603a', '#c81e3c'];

function speedColour(kmh) {
  const v = speedIn(kmh);
  const i = SPEED_STEPS[getUnit()].findIndex((s) => v < s);
  return SPEED_COLOURS[i < 0 ? SPEED_COLOURS.length - 1 : i];
}

const STYLES = ['road', 'satellite', 'hybrid'];

function renderMapStyle() {
  const sw = $('map-style');
  sw.replaceChildren(
    h('span', { class: 'seg-pill', 'aria-hidden': 'true' }),
    ...STYLES.map((s) => h('button', { type: 'button', role: 'radio', class: 'seg', dataset: { style: s }, onclick: () => setMapStyle(s) }, h('span', {}, t(`v.map.${s}`)))),
  );
  requestAnimationFrame(() => markSegments(sw, (b) => b.dataset.style === mapStyle));
}

function setMapStyle(style) {
  mapStyle = style;
  localStorage.setItem('mapStyle', style);
  markSegments($('map-style'), (b) => b.dataset.style === mapStyle);
  if (!mapState) return;
  const { map, layers } = mapState;
  for (const layer of Object.values(layers)) layer.remove();
  // Hybrid: satellite pictures with roads and place names on top.
  const want = { road: ['road'], satellite: ['imagery'], hybrid: ['imagery', 'roads', 'labels'] }[style];
  want.forEach((k, i) => layers[k].addTo(map).setZIndex(i + 1));
}

$('map-colours').addEventListener('click', () => {
  speedColours = !speedColours;
  localStorage.setItem('speedColours', speedColours ? '1' : '0');
  $('map-colours').setAttribute('aria-pressed', String(speedColours));
  drawRoute();
});

$('map-follow').addEventListener('click', () => {
  follow = !follow;
  localStorage.setItem('follow', follow ? '1' : '0');
  $('map-follow').setAttribute('aria-pressed', String(follow));
  if (follow && cur?.gps.length > 1) followMap(master()?.currentTime || 0, true);
});

function drawRoute() {
  if (!mapState || !cur?.gps.length) return;
  const { L, line, done, speedLayer } = mapState;
  speedLayer.clearLayers();
  line.setStyle({ opacity: speedColours ? 0 : 1 });
  done.setStyle({ opacity: speedColours ? 0 : 1 });
  const legend = $('map-legend');
  legend.hidden = !speedColours;
  if (!speedColours) return;
  // Consecutive points of the same colour share one line.
  let run = [[cur.gps[0].lat, cur.gps[0].lon]];
  let colour = speedColour(cur.gps[0].speed);
  for (let i = 1; i < cur.gps.length; i++) {
    const p = cur.gps[i];
    run.push([p.lat, p.lon]);
    const c = speedColour(p.speed);
    if (c !== colour || i === cur.gps.length - 1) {
      L.polyline(run, { color: colour, weight: 5, opacity: 1, interactive: false }).addTo(speedLayer);
      run = [[p.lat, p.lon]];
      colour = c;
    }
  }
  const steps = SPEED_STEPS[getUnit()];
  legend.replaceChildren(
    ...SPEED_COLOURS.map((c, i) =>
      h('span', { class: 'legend-item' }, h('i', { style: `background:${c}` }), i === 0 ? `< ${steps[0]}` : i === steps.length ? `${steps.at(-1)}+` : `${steps[i - 1]}–${steps[i]}`),
    ),
    h('span', { class: 'legend-unit' }, speedUnit()),
  );
}

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
    const esri = (path, attribution) => L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/${path}/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 19, maxNativeZoom: 18, attribution, crossOrigin: 'anonymous' });
    const layers = {
      road: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap', crossOrigin: 'anonymous' }),
      imagery: esri('World_Imagery', 'Imagery &copy; Esri, Maxar, Earthstar Geographics'),
      roads: esri('Reference/World_Transportation', ''),
      labels: esri('Reference/World_Boundaries_and_Places', ''),
    };
    const casing = L.polyline([], { color: '#ffffff', weight: 9, opacity: 0.9 }).addTo(map);
    const line = L.polyline([], { color: '#8c919a', weight: 5, opacity: 1 }).addTo(map);
    const done = L.polyline([], { color: INK, weight: 5, opacity: 1, interactive: false }).addTo(map);
    const speedLayer = L.layerGroup().addTo(map);
    const tagLayer = L.layerGroup().addTo(map);
    const marker = L.marker([0, 0], {
      icon: L.divIcon({ className: 'car-marker', html: '<span class="car-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 19.5 20 12 15.5 4.5 20Z"/></svg></span>', iconSize: [28, 28], iconAnchor: [14, 14] }),
      interactive: false,
      keyboard: false,
      zIndexOffset: 1000,
    }).addTo(map);
    const pick = (e) => seek(cur.gps[nearestIndex(cur.gps, e.latlng.lat, e.latlng.lng)].t);
    line.on('click', pick);
    casing.on('click', pick);
    mapState = { L, map, layers, line, casing, done, speedLayer, tagLayer, marker, key: null, idx: -1 };
    setMapStyle(mapStyle);
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
    cur.weather = undefined;
  } else requestAnimationFrame(() => map.invalidateSize());
  drawRoute();
  drawTags();
  renderReadout();
  followMap(master()?.currentTime || 0, true);
}

// ---------- the data under the map ----------

function seriesList() {
  const g = cur.gps;
  const xs = g.map((p) => p.t);
  const all = {
    speed: { xs, ys: g.map((p) => speedIn(p.speed)), fmt: (v) => `${num(v)} ${speedUnit()}` },
    distance: { xs, ys: cur.dist.map(distanceIn), fmt: (v) => `${num(v, v < 10 ? 2 : 1)} ${distanceUnit()}` },
    heading: { xs, ys: g.map((p) => p.bearing), fmt: (v) => `${num(v)}°` },
    altitude: { xs, ys: g.map((p) => (Number.isFinite(p.alt) ? altitudeIn(p.alt) : null)), fmt: (v) => `${num(v)} ${altitudeUnit()}` },
    grade: { xs, ys: cur.grade, fmt: (v) => `${num(v, 1)}%` },
    gforce: { xs: cur.accel.map((a) => a.t), ys: cur.accel.map((a) => a.g), fmt: (v) => `${num(v, 2)} g` },
    sats: { xs, ys: g.map((p) => (Number.isFinite(p.sats) ? p.sats : null)), fmt: (v) => num(v) },
    hdop: { xs, ys: g.map((p) => (Number.isFinite(p.hdop) ? p.hdop : null)), fmt: (v) => num(v, 1) },
  };
  return Object.fromEntries(Object.entries(all).filter(([, s]) => s.ys.filter((v) => v != null && Number.isFinite(v)).length >= 2));
}

function renderReadout() {
  const list = seriesList();
  if (!list[plotKey]) plotKey = 'speed';
  const hasAlt = cur.gps.some((p) => Number.isFinite(p.alt));
  const hasSats = cur.gps.some((p) => Number.isFinite(p.sats));
  const stat = (label, id) => h('div', {}, h('dt', {}, label), h('dd', { id }));
  const tableOn = $('gps-readout').dataset.table === '1';
  $('gps-readout').replaceChildren(
    h('div', { class: 'gps-speed' },
      h('span', { id: 'gps-speed' }, '0'),
      h('button', { type: 'button', class: 'unit', id: 'unit-btn', title: t('v.unitsTitle'), onclick: () => setUnit(getUnit() === 'mph' ? 'kmh' : 'mph') }, speedUnit()),
    ),
    h('dl', { class: 'gps-stats' },
      stat(t('d.heading'), 'gps-heading'),
      stat(t('d.distance'), 'gps-distance'),
      hasAlt ? stat(t('d.altitude'), 'gps-alt') : null,
      hasSats ? stat(t('d.sats'), 'gps-sats') : null,
    ),
    h('p', { id: 'gps-pos', class: 'gps-pos' }),
    h('section', { class: 'panel-sec' },
      h('div', { class: 'sec-head' },
        h('label', { class: 'select compact' },
          h('span', { class: 'visually-hidden' }, t('d.graph')),
          h('select', { id: 'plot-select', onchange: (e) => {
            plotKey = e.target.value;
            localStorage.setItem('plot', plotKey);
            renderReadout();
            followMap(master()?.currentTime || 0, true);
          } }, Object.keys(list).map((k) => h('option', { value: k, selected: k === plotKey }, t(`d.${k}`)))),
        ),
        h('button', { type: 'button', class: 'btn btn-ghost small', 'aria-pressed': String(tableOn), onclick: () => {
          $('gps-readout').dataset.table = tableOn ? '0' : '1';
          renderReadout();
          followMap(master()?.currentTime || 0, true);
        } }, icon('table', 15), h('span', {}, t('d.table'))),
      ),
      tableOn ? dataTable() : h('canvas', { class: 'plot', id: 'plot', role: 'img', 'aria-label': t(`d.${plotKey}`), onclick: (e) => seek(plotTime(e.currentTarget, e.clientX, plotDuration())) }),
    ),
    tagSection(),
    onlineSection(),
    h('div', { class: 'gps-export' },
      h('span', {}, t('v.export')),
      ...Object.keys(ROUTE_FORMATS).map((ext) => h('button', { class: 'btn btn-ghost', type: 'button', 'data-route': ext }, ext === 'geojson' ? 'GeoJSON' : ext.toUpperCase())),
    ),
    h('p', { class: 'gps-note' }, t('v.mapNote')),
  );
}

const plotDuration = () => {
  const d = master()?.duration;
  return Number.isFinite(d) && d > 0 ? d : cur.gps.at(-1)?.t || 1;
};

let plotPx = null;
function drawCurrentPlot(time, force) {
  const canvas = document.getElementById('plot');
  if (!canvas) return;
  // Redraw only when the cursor moves a whole pixel.
  const px = Math.round((time / plotDuration()) * canvas.clientWidth);
  if (px === plotPx && !force) return;
  plotPx = px;
  const s = seriesList()[plotKey];
  if (s) drawPlot(canvas, { xs: s.xs, ys: s.ys, duration: plotDuration(), cursor: time, format: s.fmt });
}

function dataTable() {
  const rows = cur.gps.map((p, i) =>
    h('tr', { dataset: { i }, onclick: () => seek(p.t) },
      h('td', {}, formatTime(new Date(cur.moment.date.getTime() + p.t * 1000))),
      h('td', {}, num(speedIn(p.speed))),
      h('td', {}, num(p.bearing)),
      h('td', {}, Number.isFinite(p.alt) ? num(altitudeIn(p.alt)) : '–'),
      h('td', {}, num(p.lat, 5)),
      h('td', {}, num(p.lon, 5)),
    ),
  );
  return h('div', { class: 'data-table', id: 'data-table' },
    h('table', {},
      h('thead', {}, h('tr', {},
        h('th', {}, t('d.time')),
        h('th', {}, speedUnit()),
        h('th', {}, '°'),
        h('th', {}, altitudeUnit()),
        h('th', {}, t('d.lat')),
        h('th', {}, t('d.lon')),
      )),
      h('tbody', {}, rows),
    ),
  );
}

$('gps-readout').addEventListener('click', (e) => {
  const ext = e.target.closest('[data-route]')?.dataset.route;
  if (!ext || !cur?.gps.length) return;
  const name = `tripframe_${stamp(0).slice(0, 19)}_route.${ext}`;
  const { make, type } = ROUTE_FORMATS[ext];
  saveBlob(new Blob([make(cur.gps, `Tripframe ${stamp(0).slice(0, 19)}`)], { type }), name);
  toast(t('v.saved', { name }));
});

function followMap(time, force) {
  const pts = cur.gps;
  const i = pointAt(time);
  if (i < 0) return;
  if (i !== mapState.idx || force) {
    mapState.idx = i;
    const p = pts[i];
    mapState.marker.setLatLng([p.lat, p.lon]);
    const arrow = mapState.marker.getElement()?.querySelector('.car-arrow');
    if (arrow) arrow.style.transform = `rotate(${p.bearing || 0}deg)`;
    mapState.done.setLatLngs(pts.slice(0, i + 1).map((q) => [q.lat, q.lon]));
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    set('gps-speed', num(speedIn(p.speed)));
    set('gps-heading', `${compass(p.bearing)} ${num(p.bearing)}°`);
    set('gps-distance', `${num(distanceIn(cur.dist[i]), 2)} ${distanceUnit()}`);
    set('gps-alt', Number.isFinite(p.alt) ? `${num(altitudeIn(p.alt))} ${altitudeUnit()}` : '–');
    set('gps-sats', Number.isFinite(p.sats) ? String(p.sats) : '–');
    set('gps-pos', position(p));
    const table = document.getElementById('data-table');
    if (table) {
      table.querySelector('tr.current')?.classList.remove('current');
      table.querySelector(`tr[data-i="${i}"]`)?.classList.add('current');
    }
    if (follow && mapState.map._loaded && !mapState.map.getBounds().pad(-0.1).contains([p.lat, p.lon])) mapState.map.panTo([p.lat, p.lon], { animate: true });
  }
  drawCurrentPlot(time, force);
}

// ---------- markers (geotags) ----------

function tagSection() {
  const list = [...cur.tags].sort((a, b) => a.t - b.t);
  const file = h('input', { type: 'file', accept: '.gpx,application/gpx+xml', hidden: true, onchange: importTags });
  return h('section', { class: 'panel-sec tags' },
    h('div', { class: 'sec-head' },
      h('h3', {}, t('g.title')),
      h('button', { type: 'button', class: 'btn btn-ghost small', title: t('g.addTitle'), onclick: addTag }, icon('addMarker', 15), h('span', {}, t('g.add'))),
      h('button', { type: 'button', class: 'btn btn-ghost small icon-only', title: t('g.export'), 'aria-label': t('g.export'), disabled: !list.length, onclick: exportTags }, icon('download', 15)),
      h('button', { type: 'button', class: 'btn btn-ghost small icon-only', title: t('g.import'), 'aria-label': t('g.import'), onclick: () => file.click() }, icon('upload', 15)),
      file,
    ),
    list.length
      ? h('ol', { class: 'tag-list' }, list.map((tag) =>
          h('li', {},
            h('button', { type: 'button', class: 'tag-go', title: t('g.go'), onclick: () => seek(tag.t) }, formatDuration(tag.t), h('span', {}, `${num(speedIn(tag.speed))} ${speedUnit()}`)),
            h('input', { type: 'text', value: tag.name, 'aria-label': t('g.name'), onchange: (e) => {
              tag.name = e.target.value;
              saveTags(cur.moment, cur.tags);
              drawTags();
            } }),
            h('button', { type: 'button', class: 'btn btn-ghost small icon-only', title: t('g.delete'), 'aria-label': t('g.delete'), onclick: () => {
              cur.tags = cur.tags.filter((x) => x !== tag);
              saveTags(cur.moment, cur.tags);
              drawTags();
              renderReadout();
              followMap(master()?.currentTime || 0, true);
            } }, icon('trash', 15)),
            tag.address ? h('p', { class: 'tag-addr' }, tag.address) : null,
          ),
        ))
      : h('p', { class: 'gps-note' }, t('g.empty')),
  );
}

function drawTags() {
  if (!mapState) return;
  const { L, tagLayer } = mapState;
  tagLayer.clearLayers();
  for (const tag of cur.tags) {
    L.circleMarker([tag.lat, tag.lon], { radius: 7, color: '#17191e', weight: 2.5, fillColor: '#f6f4ee', fillOpacity: 1 })
      .bindTooltip(tag.name || formatDuration(tag.t), { direction: 'top', offset: [0, -6] })
      .on('click', () => seek(tag.t))
      .addTo(tagLayer);
  }
}

function addTag() {
  if (!cur || cur.gps.length < 2) return toast(t('g.noGps'));
  const time = master()?.currentTime || 0;
  const p = cur.gps[pointAt(time)];
  const tag = { id: Date.now(), t: time, lat: p.lat, lon: p.lon, speed: p.speed, time: p.time, name: t('g.default', { n: cur.tags.length + 1 }) };
  cur.tags.push(tag);
  saveTags(cur.moment, cur.tags);
  if (!$('map-panel').hidden) {
    drawTags();
    renderReadout();
    followMap(time, true);
  }
  toast(t('g.added', { time: formatDuration(time) }));
  if (onlineOn()) {
    const token = cur;
    fetchAddress(p.lat, p.lon, getLang())
      .then((address) => {
        tag.address = address;
        saveTags(token.moment, token.tags);
        if (cur === token && !$('map-panel').hidden) {
          renderReadout();
          followMap(master()?.currentTime || 0, true);
        }
      })
      .catch(() => {});
  }
}

function exportTags() {
  const name = `tripframe_${stamp(0).slice(0, 19)}_markers.gpx`;
  saveBlob(new Blob([toGpx([], name, cur.tags)], { type: 'application/gpx+xml' }), name);
  toast(t('v.saved', { name }));
}

async function importTags(e) {
  const file = e.target.files[0];
  if (!file || !cur) return;
  const found = waypointsFromGpx(await file.text());
  if (!found.length) return toast(t('g.none'));
  for (const w of found) {
    const p = cur.gps[nearestIndex(cur.gps, w.lat, w.lon)];
    cur.tags.push({ id: Date.now() + Math.random(), t: p.t, lat: w.lat, lon: w.lon, speed: p.speed, time: w.time ?? p.time, name: w.name, address: w.address || undefined });
  }
  saveTags(cur.moment, cur.tags);
  drawTags();
  renderReadout();
  followMap(master()?.currentTime || 0, true);
  toast(plural(found.length, 'n.imported'));
}

// ---------- weather and addresses (optional, online) ----------

function onlineSection() {
  const on = onlineOn();
  const weather = h('p', { class: 'weather', id: 'weather' });
  if (on) showWeather(weather);
  return h('section', { class: 'panel-sec' },
    h('label', { class: 'toggle' },
      h('input', { type: 'checkbox', checked: on, onchange: (e) => {
        setOnline(e.target.checked);
        renderReadout();
        followMap(master()?.currentTime || 0, true);
      } }),
      h('span', {}, t('o.toggle')),
    ),
    h('p', { class: 'gps-note' }, t('o.note')),
    on ? weather : null,
  );
}

function showWeather(el) {
  const p = cur.gps.find((q) => q.time) || cur.gps[0];
  const ms = p.time || cur.moment.date.getTime();
  const render = (w) => {
    if (w === null) return (el.textContent = t('w.failed'));
    const temp = getUnit() === 'mph' ? `${num((w.temp * 9) / 5 + 32)} °F` : `${num(w.temp)} °C`;
    const parts = [temp, t(`w.${weatherKind(w.code)}`)];
    if (w.precip > 0) parts.push(`${num(w.precip, 1)} mm`);
    parts.push(t('w.wind', { speed: `${num(speedIn(w.wind))} ${speedUnit()}` }));
    el.textContent = parts.join(', ');
  };
  if (cur.weather !== undefined) return render(cur.weather);
  el.textContent = t('w.loading');
  const token = cur;
  fetchWeather(p.lat, p.lon, ms)
    .then((w) => w, () => null)
    .then((w) => {
      token.weather = w;
      if (cur === token && el.isConnected) render(w);
    });
}

renderChrome();
