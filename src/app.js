import './base.css';
import './styles.css';
import { animate, stagger } from 'motion';
import { parseClip, groupMoments, dayKey } from './parse.js';
import { scanHandle, scanFileList, scanEntry, supportsPicker, idbGet, idbSet } from './scan.js';
import { requestThumb, prioritize } from './thumbs.js';
import { openViewer, refreshViewer } from './viewer.js';
import { readDuration, readInfo } from './mp4.js';
import { findLoudMoments } from './audio.js';
import { mergeClips } from './merge.js';
import { toGpx } from './route.js';
import { speedIn, speedUnit } from './units.js';
import { t, plural, applyI18n, bindLangSelect, onLangChange, locale } from './i18n.js';
import { mountThemeSwitch, transition, reducedMotion } from './theme.js';
import { mountLogos } from './logo.js';
import {
  $, h, icon, setButton, camLabel, typeLabel, saveBlob,
  formatSize, formatDuration, formatDay, formatDayShort, formatTime, formatRange, formatSpan,
} from './ui.js';

const state = {
  moments: [],
  fileCount: 0,
  folder: '',
  camera: new Set(),
  type: new Set(),
  sort: localStorage.getItem('sort') || 'desc',
  visible: [],
  lastDir: null,
  load: 0, // increases with every folder, so work for an older folder can tell it is stale
  durations: new Map(), // moment id → seconds
  tripsReady: false,
  loud: new Map(), // moment id → loud moments found by the scan
  loudOnly: false,
  scanning: null,
  merging: false,
};

mountLogos();
applyI18n();
bindLangSelect($('lang'));
mountThemeSwitch($('theme-switch'));

function renderStatic() {
  setButton($('open-folder'), 'folder', t('app.openOther'));
  if (state.lastDir) setButton($('reopen'), 'reopen', t('app.reopen', { name: state.lastDir.name }));
  setButton($('loud-scan'), state.scanning ? 'stop' : 'loud', t(state.scanning ? 'lib.cancel' : 'lib.loud'));
}
renderStatic();

onLangChange(() => {
  renderStatic();
  if (state.moments.length) {
    renderFilters();
    render({ animateIn: false });
  }
  refreshViewer();
});

// ---------- opening a folder ----------

async function pickFolder() {
  if (!supportsPicker) return $('folder-input').click();
  try {
    const dir = await window.showDirectoryPicker({ id: 'dashcam', mode: 'read' });
    idbSet('kv', 'lastDir', dir);
    await load(dir.name, (p) => scanHandle(dir, p));
  } catch (e) {
    if (e.name !== 'AbortError') showError(e);
  }
}

$('open-folder').addEventListener('click', pickFolder);
$('open-folder-big').addEventListener('click', pickFolder);

$('folder-input').addEventListener('change', (e) => {
  const files = e.target.files;
  if (!files.length) return;
  const name = (files[0].webkitRelativePath || '').split('/')[0] || 'DCIM';
  load(name, async () => scanFileList(files));
  e.target.value = '';
});

(async function offerReopen() {
  if (!supportsPicker) return;
  const dir = await idbGet('kv', 'lastDir');
  if (!dir) return;
  state.lastDir = dir;
  renderStatic();
  $('reopen').hidden = false;
  $('reopen').addEventListener('click', async () => {
    try {
      if ((await dir.requestPermission({ mode: 'read' })) !== 'granted') return;
      await load(dir.name, (p) => scanHandle(dir, p));
    } catch (e) {
      showError(e);
    }
  });
})();

// Drag a folder anywhere onto the window.
let dragDepth = 0;
window.addEventListener('dragenter', (e) => {
  if (![...e.dataTransfer.types].includes('Files')) return;
  dragDepth++;
  document.body.classList.add('dragging');
});
window.addEventListener('dragleave', () => {
  if (--dragDepth <= 0) {
    dragDepth = 0;
    document.body.classList.remove('dragging');
  }
});
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', async (e) => {
  e.preventDefault();
  dragDepth = 0;
  document.body.classList.remove('dragging');
  const item = [...e.dataTransfer.items].find((i) => i.kind === 'file');
  if (!item) return;
  const entry = item.webkitGetAsEntry?.();
  const handlePromise = item.getAsFileSystemHandle?.();
  try {
    const handle = await handlePromise;
    if (handle?.kind === 'directory') {
      idbSet('kv', 'lastDir', handle);
      return load(handle.name, (p) => scanHandle(handle, p));
    }
    if (entry) return load(entry.name, (p) => scanEntry(entry, p));
  } catch (err) {
    showError(err);
  }
});

function show(section) {
  for (const id of ['empty', 'loading', 'library']) $(id).hidden = id !== section;
  $('toolbar').hidden = section !== 'library';
}

function hint(text) {
  const el = $('drop-hint');
  el.removeAttribute('data-i18n');
  el.textContent = text;
  el.classList.add('error');
}

function showError(e) {
  console.error(e);
  show('empty');
  hint(t('empty.error', { error: e.message || e }));
}

async function load(name, scan) {
  show('loading');
  $('loading-text').textContent = t('loading.reading', { name });
  const found = await scan((n) => ($('loading-text').textContent = t('loading.found', { count: plural(n, 'n.file') })));
  const clips = found.map(({ path, file }) => parseClip(path, file));

  if (!clips.length) {
    show('empty');
    hint(t('empty.none', { name }));
    return;
  }

  state.folder = name;
  state.fileCount = clips.length;
  state.moments = groupMoments(clips);
  const token = ++state.load;
  state.durations = new Map();
  state.tripsReady = false;
  if (state.scanning) state.scanning.stop = true;
  state.loud = new Map();
  state.loudOnly = false;
  $('loud-only').checked = false;
  $('loud-only-wrap').hidden = true;
  $('loud-status').textContent = '';
  state.camera = new Set(state.moments.flatMap((m) => m.cameras));
  state.type = new Set(state.moments.map((m) => m.type));
  $('folder-name').textContent = name;
  $('folder-name').hidden = false;
  $('filters').hidden = false;
  document.body.classList.add('has-library');
  renderFilters();
  render({ animateIn: true });
  show('library');
  $('main').scrollTop = 0;
  if (!reducedMotion()) animate('.filters, .folder-name', { opacity: [0, 1], y: [8, 0] }, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
  measureDurations(token);
}

// ---------- trips ----------

// Reads every clip's length from its header (a few kilobytes each), then groups the clips into trips.
async function measureDurations(token) {
  const list = state.moments.filter((m) => !m.isPhoto);
  let next = 0;
  const worker = async () => {
    while (next < list.length && state.load === token) {
      const m = list[next++];
      const d = await readDuration(m.primary.file).catch(() => null);
      if (d) state.durations.set(m.id, d);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  if (state.load !== token) return;
  state.tripsReady = true;
  render({ animateIn: false });
}

const TRIP_GAP = 60; // seconds between two clips that still belong to one trip
const UNKNOWN_LENGTH = 300; // assumed when a clip's length can't be read

/** Splits one day's moments (in time order) into trips, parked stretches and photos. */
function groupTrips(list) {
  const groups = [];
  for (const m of list) {
    const kind = m.isPhoto ? 'photo' : m.type === 'parking' ? 'parking' : 'drive';
    const last = groups.at(-1);
    const prev = last?.moments.at(-1);
    const prevEnd = prev && prev.date.getTime() + (state.durations.get(prev.id) ?? UNKNOWN_LENGTH) * 1000;
    if (last && last.kind === kind && (kind === 'photo' || m.date.getTime() - prevEnd <= TRIP_GAP * 1000)) last.moments.push(m);
    else groups.push({ kind, moments: [m] });
  }
  let n = 0;
  let prevEnd = null;
  for (const g of groups) {
    if (g.kind === 'photo') continue;
    const last = g.moments.at(-1);
    g.start = g.moments[0].date.getTime();
    g.end = last.date.getTime() + (state.durations.get(last.id) ?? 0) * 1000;
    if (g.kind === 'drive') g.n = ++n;
    g.gap = prevEnd == null ? null : g.start - prevEnd;
    prevEnd = g.end;
  }
  return groups;
}

function tripHead(g) {
  if (g.kind === 'photo') return null;
  const meta = [
    `${formatTime(new Date(g.start))}–${formatTime(new Date(Math.max(g.end, g.start)))}`,
    formatSpan((g.end - g.start) / 1000),
    plural(g.moments.length, 'n.clip'),
    g.gap > 0 ? t('tr.after', { time: formatSpan(g.gap / 1000) }) : null,
  ].filter(Boolean);
  const cams = ['front', 'rear', 'interior', 'other'].filter((c) => g.moments.some((m) => m.files[c] && !m.files[c].isPhoto));
  const status = h('p', { class: 'trip-status', role: 'status' });
  return h('header', { class: 'trip-head' },
    h('h3', {}, g.kind === 'parking' ? t('tr.parked') : t('tr.trip', { n: g.n })),
    h('p', {}, meta.join(', ')),
    g.moments.length > 1
      ? h('div', { class: 'trip-join' },
          icon('join', 15),
          h('span', {}, t('tr.join')),
          cams.map((c) => h('button', { type: 'button', class: 'btn btn-ghost small', title: t('tr.joinTitle', { cam: camLabel(c).toLowerCase() }), onclick: (e) => joinTrip(g, c, e.currentTarget, status) }, camLabel(c))),
        )
      : null,
    status,
  );
}

async function joinTrip(g, cam, btn, status) {
  if (state.merging) return;
  const files = g.moments.map((m) => m.files[cam]).filter((c) => c && !c.isPhoto).map((c) => c.file);
  const d = new Date(g.start);
  const p = (n) => String(n).padStart(2, '0');
  const name = `tripframe_${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}_trip-${camLabel(cam).toLowerCase()}.mp4`;
  state.merging = true;
  const label = btn.textContent;
  btn.disabled = true;
  status.textContent = t('tr.joining', { pct: 0 });
  try {
    const blob = await mergeClips(files, { name, onProgress: (f) => (status.textContent = t('tr.joining', { pct: Math.round(f * 100) })) });
    if (blob) saveBlob(blob, name);
    // The route of the whole trip as GPX, next to the video.
    const points = [];
    for (const f of files) points.push(...((await readInfo(f)).gps || []));
    if (points.length > 1) saveBlob(new Blob([toGpx(points, name.replace(/\.mp4$/, ''))], { type: 'application/gpx+xml' }), name.replace(/\.mp4$/, '.gpx'));
    status.textContent = t('tr.joined', { name });
  } catch (e) {
    if (e.name === 'AbortError') status.textContent = '';
    else {
      console.error(e);
      status.textContent = e.code ? t(`tr.${e.code}`, { name: e.file || '' }) : t('tr.failed', { error: e.message });
    }
  } finally {
    state.merging = false;
    btn.disabled = false;
    btn.textContent = label;
  }
}

// ---------- loud moments in every clip shown ----------

$('loud-scan').addEventListener('click', async () => {
  if (state.scanning) {
    state.scanning.stop = true;
    return;
  }
  const list = state.visible.filter((m) => !m.isPhoto && !state.loud.has(m.id));
  const job = { stop: false };
  state.scanning = job;
  renderStatic();
  let next = 0;
  let done = 0;
  const status = $('loud-status');
  const worker = async () => {
    while (!job.stop && next < list.length) {
      const m = list[next++];
      const found = await findLoudMoments(m.primary.file).catch(() => null);
      if (job.stop) return;
      if (found?.length) {
        state.loud.set(m.id, found);
        markLoud(document.querySelector(`.tile[data-id="${m.id}"]`));
      }
      status.textContent = t('lib.loudScanning', { done: ++done, total: list.length });
    }
  };
  await Promise.all([worker(), worker()]);
  if (state.scanning !== job) return;
  state.scanning = null;
  renderStatic();
  const hits = state.visible.filter((m) => state.loud.has(m.id)).length;
  status.textContent = hits ? plural(hits, 'n.loudClip') : t('lib.loudNone');
  $('loud-only-wrap').hidden = !state.loud.size;
});

$('loud-only').addEventListener('change', (e) => {
  transition(() => {
    state.loudOnly = e.target.checked;
    render({ animateIn: false });
  });
});

function markLoud(tileEl) {
  const thumb = tileEl?.querySelector('.thumb');
  if (!thumb || thumb.querySelector('.tag-loud')) return;
  thumb.append(h('span', { class: 'tag tag-loud' }, icon('loud', 13), t('lib.loudBadge')));
}

// ---------- top speed per clip ----------

const speedJobs = [];
let speedActive = 0;

function queueSpeed(m, el) {
  speedJobs.push({ m, el });
  pumpSpeed();
}

function pumpSpeed() {
  while (speedActive < 3 && speedJobs.length) {
    const { m, el } = speedJobs.shift();
    speedActive++;
    readInfo(m.primary.file)
      .then((info) => {
        let max = 0;
        for (const p of info.gps) max = Math.max(max, p.speed);
        if (info.gps.length > 1 && max > 0) {
          el.dataset.kmh = max;
          showSpeed(el);
        }
      })
      .finally(() => {
        speedActive--;
        pumpSpeed();
      });
  }
}

function showSpeed(el) {
  const text = `${Math.round(speedIn(Number(el.dataset.kmh)))} ${speedUnit()}`;
  el.textContent = text;
  el.title = t('lib.maxSpeed', { speed: text });
  el.hidden = false;
}

document.addEventListener('unitchange', () => document.querySelectorAll('.tile-speed[data-kmh]').forEach(showSpeed));

// ---------- filters ----------

function renderFilters() {
  const count = (pred) => state.moments.filter(pred).length;
  const chip = (set, key, label, n, group) =>
    h(
      'button',
      {
        type: 'button',
        class: `chip chip-${group}-${key}`,
        'aria-pressed': String(set.has(key)),
        onclick: (e) => {
          const btn = e.currentTarget;
          transition(() => {
            if (set.has(key) && set.size > 1) set.delete(key);
            else set.add(key);
            btn.setAttribute('aria-pressed', String(set.has(key)));
            render({ animateIn: false });
          });
        },
      },
      h('span', { class: 'chip-box', 'aria-hidden': 'true' }),
      h('span', {}, label),
      h('span', { class: 'chip-count' }, n.toLocaleString(locale())),
    );

  const cams = ['front', 'rear', 'interior', 'other'].filter((c) => state.moments.some((m) => m.files[c]));
  $('filter-camera').replaceChildren(...cams.map((c) => chip(state.camera, c, camLabel(c), count((m) => m.files[c]), 'cam')));
  const types = ['normal', 'event', 'parking', 'photo'].filter((k) => state.moments.some((m) => m.type === k));
  $('filter-type').replaceChildren(...types.map((k) => chip(state.type, k, typeLabel(k), count((m) => m.type === k), 'type')));
}

const zoom = $('zoom');
zoom.value = localStorage.getItem('zoom') || 260;
document.documentElement.style.setProperty('--tile', `${zoom.value}px`);
zoom.addEventListener('input', () => {
  document.documentElement.style.setProperty('--tile', `${zoom.value}px`);
  localStorage.setItem('zoom', zoom.value);
});

$('sort').value = state.sort;
$('sort').addEventListener('change', (e) => {
  transition(() => {
    state.sort = e.target.value;
    localStorage.setItem('sort', state.sort);
    render({ animateIn: false });
  });
});

// ---------- library ----------

let tileObserver;

function render({ animateIn }) {
  const visible = state.moments.filter((m) => state.type.has(m.type) && m.cameras.some((c) => state.camera.has(c)) && (!state.loudOnly || state.loud.has(m.id)));
  state.visible = visible; // chronological, used by the viewer for previous / next

  const days = new Map();
  for (const m of visible) {
    const k = dayKey(m.date);
    if (!days.has(k)) days.set(k, []);
    days.get(k).push(m);
  }
  let keys = [...days.keys()].sort();
  if (state.sort === 'desc') keys = keys.reverse();

  const all = state.moments;
  const size = all.reduce((s, m) => s + m.size, 0);
  $('library-title').textContent = state.folder;
  $('library-meta').textContent = [
    plural(all.length, 'n.moment'),
    plural(state.fileCount, 'n.file'),
    formatRange(all[0]?.date, all.at(-1)?.date),
    formatSize(size),
  ].filter(Boolean).join(', ');

  tileObserver?.disconnect();
  tileObserver = new IntersectionObserver(onTilesVisible, { rootMargin: '600px 0px' });

  const lib = $('library');
  if (!visible.length) {
    lib.replaceChildren(
      h('div', { class: 'no-results' },
        h('h2', {}, t('lib.noResults')),
        h('p', {}, t('lib.noResultsHint')),
      ),
    );
    $('day-list').replaceChildren();
    updateActiveDay();
    return;
  }

  const sections = keys.map((k) => {
    const day = days.get(k);
    const daySize = day.reduce((s, m) => s + m.size, 0);
    const events = day.filter((m) => m.type === 'event').length;
    let groups = state.tripsReady ? groupTrips(day) : [{ kind: 'all', moments: day }];
    if (state.sort === 'desc') groups = groups.reverse().map((g) => ({ ...g, moments: [...g.moments].reverse() }));
    return h(
      'section',
      { class: 'day', id: `day-${k}`, dataset: { day: k }, 'aria-labelledby': `dayh-${k}` },
      h('header', { class: 'day-head' },
        h('h2', { id: `dayh-${k}` }, formatDay(day[0].date)),
        h('p', {},
          [plural(day.length, 'n.moment'), events ? plural(events, 'n.event') : null, formatSize(daySize)].filter(Boolean).join(', '),
        ),
      ),
      groups.flatMap((g) => [g.kind === 'all' ? null : tripHead(g), h('div', { class: 'grid' }, g.moments.map(tile))]),
    );
  });
  lib.replaceChildren(...sections);
  lib.querySelectorAll('.tile').forEach((el) => tileObserver.observe(el));

  $('day-list').replaceChildren(
    ...keys.map((k) => {
      const list = days.get(k);
      return h('li', {},
        h('a', { href: `#day-${k}`, class: 'day-link', dataset: { day: k }, onclick: (e) => {
          e.preventDefault();
          scrollToDay(k);
        } },
          h('span', {}, formatDayShort(list[0].date)),
          h('span', { class: 'day-count' }, list.length.toLocaleString(locale())),
        ),
      );
    }),
  );
  activeDay = null;
  requestAnimationFrame(updateActiveDay);

  if (animateIn && !reducedMotion()) {
    const first = [...lib.querySelectorAll('.day-head, .tile')].slice(0, 28);
    animate(first, { opacity: [0, 1], y: [14, 0] }, { duration: 0.42, delay: stagger(0.025), ease: [0.22, 1, 0.36, 1] });
  }
}

function tile(m) {
  const second = m.cameras.length > 1 ? m.files[m.cameras[1]] : null;
  const label = `${formatTime(m.date)}, ${m.cameras.map(camLabel).join(` ${t('and')} `)}${m.type === 'event' || m.type === 'parking' ? `, ${typeLabel(m.type)}` : ''}`;
  const el = h(
    'button',
    { type: 'button', class: `tile type-${m.type}`, dataset: { id: m.id }, 'aria-label': label, onclick: (e) => openViewer(m, state.visible, e.currentTarget) },
    h('div', { class: 'thumb' },
      h('div', { class: 'thumb-main' }),
      second ? h('div', { class: 'thumb-inset' }) : null,
      m.type === 'event' ? h('span', { class: 'tag tag-event' }, typeLabel('event')) : null,
      m.type === 'parking' ? h('span', { class: 'tag tag-parking' }, typeLabel('parking')) : null,
      m.isPhoto ? null : h('span', { class: 'duration' }),
    ),
    h('div', { class: 'tile-meta' },
      h('span', { class: 'tile-time', title: m.dateFromFile ? t('lib.fileTime') : null }, formatTime(m.date)),
      h('span', { class: 'cams' }, m.cameras.map((c) => h('span', { class: `cam cam-${c}` }, camLabel(c)))),
      m.isPhoto ? null : h('span', { class: 'tile-speed', hidden: true }),
    ),
  );
  if (state.loud.has(m.id)) markLoud(el);
  return el;
}

function fill(el, clip, onDuration) {
  if (!el || el.dataset.loading) return;
  el.dataset.loading = '1';
  prioritize(clip);
  requestThumb(clip).then((th) => {
    if (th?.url) {
      const img = h('img', { src: th.url, alt: '', decoding: 'async' });
      img.addEventListener('load', () => el.classList.add('ready'), { once: true });
      el.replaceChildren(img);
    } else {
      el.classList.add('failed');
      el.replaceChildren(icon('warn', 20));
      el.title = t('lib.noPreview');
    }
    if (th?.duration && onDuration) onDuration(th.duration);
  });
}

function onTilesVisible(entries) {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    tileObserver.unobserve(e.target);
    const m = state.moments[Number(e.target.dataset.id)];
    const dur = e.target.querySelector('.duration');
    fill(e.target.querySelector('.thumb-main'), m.primary, (d) => dur && (dur.textContent = formatDuration(d)));
    if (m.cameras.length > 1) fill(e.target.querySelector('.thumb-inset'), m.files[m.cameras[1]]);
    const speed = e.target.querySelector('.tile-speed');
    if (speed) queueSpeed(m, speed);
  }
}

// ---------- the day list follows the scroll position ----------

let activeDay = null;
let scrollQueued = false;

function scroller() {
  return matchMedia('(max-width: 820px)').matches ? document.scrollingElement : $('main');
}

function scrollToDay(k) {
  const section = document.getElementById(`day-${k}`);
  const sc = scroller();
  const offset = sc === $('main') ? $('toolbar').offsetHeight : 0;
  const top = section.getBoundingClientRect().top - (sc === $('main') ? $('main').getBoundingClientRect().top : 0) + sc.scrollTop - offset + 2;
  sc.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

function updateActiveDay() {
  scrollQueued = false;
  const sections = [...document.querySelectorAll('.day')];
  if (!sections.length) return;
  const main = $('main');
  const line = main.getBoundingClientRect().top + $('toolbar').offsetHeight + 24;
  let current = sections[0];
  for (const s of sections) {
    if (s.getBoundingClientRect().top <= line) current = s;
    else break;
  }
  // At the very bottom the last day wins, even when it is too short to reach the line.
  if (main.scrollTop + main.clientHeight >= main.scrollHeight - 4) current = sections.at(-1);
  setActiveDay(current.dataset.day);
}

function setActiveDay(k) {
  if (k === activeDay) return;
  activeDay = k;
  const links = document.querySelectorAll('.day-link');
  let link = null;
  links.forEach((a) => {
    const on = a.dataset.day === k;
    a.toggleAttribute('aria-current', on);
    if (on) link = a;
  });
  const indicator = $('day-indicator');
  if (!link) return (indicator.style.opacity = 0);
  const y = link.offsetTop;
  const opts = reducedMotion() || indicator.style.opacity !== '1' ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 };
  animate(indicator, { y, height: link.offsetHeight }, opts);
  indicator.style.opacity = 1;

  // Keep the active day visible inside the sidebar list.
  const box = $('day-scroll');
  if (y < box.scrollTop + 8 || y + link.offsetHeight > box.scrollTop + box.clientHeight - 8) {
    box.scrollTo({ top: y - box.clientHeight / 2 + link.offsetHeight / 2, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }
}

const queueActive = () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateActiveDay);
  }
};
$('main').addEventListener('scroll', queueActive, { passive: true });
window.addEventListener('resize', queueActive);

// Development hook for testing without a real SD card.
if (import.meta.env.DEV) window.__loadFiles = (name, list) => load(name, async () => list);
