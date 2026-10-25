import './styles.css';
import { parseClip, groupMoments, dayKey } from './parse.js';
import { scanHandle, scanFileList, scanEntry, supportsPicker, idbGet, idbSet } from './scan.js';
import { requestThumb, prioritize } from './thumbs.js';
import { openViewer } from './viewer.js';
import {
  $, h, icon, setButton, CAMERA_LABEL, TYPE_LABEL,
  formatSize, formatDuration, formatDay, formatDayShort, formatTime, formatRange, plural,
} from './ui.js';

const state = {
  moments: [],
  fileCount: 0,
  folder: '',
  camera: new Set(),
  type: new Set(),
  sort: localStorage.getItem('sort') || 'desc',
  visible: [],
};

// ---------- opening a folder ----------

setButton($('open-folder'), 'folder', 'Andere map openen');
setButton($('reopen'), 'reopen', 'Laatste map');

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
  const name = (files[0].webkitRelativePath || '').split('/')[0] || 'Map';
  load(name, async () => scanFileList(files));
  e.target.value = '';
});

(async function offerReopen() {
  if (!supportsPicker) return;
  const dir = await idbGet('kv', 'lastDir');
  if (!dir) return;
  const btn = $('reopen');
  setButton(btn, 'reopen', `${dir.name} opnieuw openen`);
  btn.hidden = false;
  btn.addEventListener('click', async () => {
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

function showError(e) {
  console.error(e);
  show('empty');
  const hint = document.querySelector('.drop-hint');
  hint.textContent = `De map kon niet worden gelezen (${e.message || e}). Kies de map opnieuw.`;
  hint.classList.add('error');
}

async function load(name, scan) {
  show('loading');
  $('loading-text').textContent = `${name} wordt gelezen`;
  const found = await scan((n) => ($('loading-text').textContent = `${plural(n, 'bestand', 'bestanden')} gevonden`));
  const clips = found.map(({ path, file }) => parseClip(path, file));

  if (!clips.length) {
    show('empty');
    const hint = document.querySelector('.drop-hint');
    hint.textContent = `In ${name} staan geen video's of foto's. Kies de map DCIM op de geheugenkaart, of de kaart zelf.`;
    hint.classList.add('error');
    return;
  }

  state.folder = name;
  state.fileCount = clips.length;
  state.moments = groupMoments(clips);
  state.camera = new Set(state.moments.flatMap((m) => m.cameras));
  state.type = new Set(state.moments.map((m) => m.type));
  $('folder-name').textContent = name;
  $('folder-name').hidden = false;
  $('filters').hidden = false;
  document.body.classList.add('has-library');
  renderFilters();
  render();
  show('library');
}

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
          if (set.has(key) && set.size > 1) set.delete(key);
          else set.add(key);
          e.currentTarget.setAttribute('aria-pressed', String(set.has(key)));
          render();
        },
      },
      h('span', { class: 'chip-dot', 'aria-hidden': 'true' }),
      h('span', {}, label),
      h('span', { class: 'chip-count' }, n.toLocaleString('nl-NL')),
    );

  const cams = ['front', 'rear', 'interior', 'other'].filter((c) => state.moments.some((m) => m.files[c]));
  $('filter-camera').replaceChildren(...cams.map((c) => chip(state.camera, c, CAMERA_LABEL[c], count((m) => m.files[c]), 'cam')));
  const types = ['normal', 'event', 'parking', 'photo'].filter((t) => state.moments.some((m) => m.type === t));
  $('filter-type').replaceChildren(...types.map((t) => chip(state.type, t, TYPE_LABEL[t], count((m) => m.type === t), 'type')));
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
  state.sort = e.target.value;
  localStorage.setItem('sort', state.sort);
  render();
});

// ---------- library ----------

let tileObserver;
let dayObserver;

function render() {
  const visible = state.moments.filter((m) => state.type.has(m.type) && m.cameras.some((c) => state.camera.has(c)));
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
    plural(all.length, 'moment', 'momenten'),
    plural(state.fileCount, 'bestand', 'bestanden'),
    formatRange(all[0]?.date, all.at(-1)?.date),
    formatSize(size),
  ].filter(Boolean).join(', ');

  tileObserver?.disconnect();
  dayObserver?.disconnect();
  tileObserver = new IntersectionObserver(onTilesVisible, { rootMargin: '600px 0px' });

  const lib = $('library');
  if (!visible.length) {
    lib.replaceChildren(
      h('div', { class: 'no-results' },
        h('h2', {}, 'Geen opnames met deze filters'),
        h('p', {}, 'Zet een camera of soort opname weer aan in de zijbalk.'),
      ),
    );
    $('day-list').replaceChildren();
    return;
  }

  const sections = keys.map((k) => {
    let list = days.get(k);
    if (state.sort === 'desc') list = [...list].reverse();
    const daySize = list.reduce((s, m) => s + m.size, 0);
    const events = list.filter((m) => m.type === 'event').length;
    return h(
      'section',
      { class: 'day', id: `day-${k}`, 'aria-labelledby': `dayh-${k}` },
      h('header', { class: 'day-head' },
        h('h2', { id: `dayh-${k}` }, formatDay(list[0].date)),
        h('p', {},
          [plural(list.length, 'moment', 'momenten'), events ? plural(events, 'event', 'events') : null, formatSize(daySize)].filter(Boolean).join(', '),
        ),
      ),
      h('div', { class: 'grid' }, list.map(tile)),
    );
  });
  lib.replaceChildren(...sections);
  lib.querySelectorAll('.tile').forEach((t) => tileObserver.observe(t));

  // Day list in the sidebar, with the day in view highlighted.
  $('day-list').replaceChildren(
    ...keys.map((k) => {
      const list = days.get(k);
      return h('li', {},
        h('a', { href: `#day-${k}`, class: 'day-link', dataset: { day: k }, onclick: (e) => {
          e.preventDefault();
          document.getElementById(`day-${k}`).scrollIntoView({ block: 'start' });
        } },
          h('span', {}, formatDayShort(list[0].date)),
          h('span', { class: 'day-count' }, list.length.toLocaleString('nl-NL')),
        ),
      );
    }),
  );
  dayObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const k = e.target.id.slice(4);
        document.querySelectorAll('.day-link').forEach((a) => a.toggleAttribute('aria-current', a.dataset.day === k));
      }
    },
    { root: $('main'), rootMargin: '-10% 0px -80% 0px' },
  );
  lib.querySelectorAll('.day').forEach((s) => dayObserver.observe(s));
}

function tile(m) {
  const second = m.cameras.length > 1 ? m.files[m.cameras[1]] : null;
  const label = `${formatTime(m.date)}, ${m.cameras.map((c) => CAMERA_LABEL[c]).join(' en ')}${m.type !== 'normal' && m.type !== 'photo' ? `, ${TYPE_LABEL[m.type]}` : ''}`;
  return h(
    'button',
    { type: 'button', class: `tile type-${m.type}`, dataset: { id: m.id }, 'aria-label': label, onclick: () => openViewer(m, state.visible) },
    h('div', { class: 'thumb' },
      h('div', { class: 'thumb-main' }),
      second ? h('div', { class: 'thumb-inset' }) : null,
      m.type === 'event' ? h('span', { class: 'tag tag-event' }, 'Event') : null,
      m.type === 'parking' ? h('span', { class: 'tag tag-parking' }, 'Parkeren') : null,
      m.isPhoto ? null : h('span', { class: 'duration' }),
    ),
    h('div', { class: 'tile-meta' },
      h('span', { class: 'tile-time', title: m.dateFromFile ? 'Tijd uit de bestandsdatum, niet uit de naam' : null }, formatTime(m.date)),
      h('span', { class: 'cams' }, m.cameras.map((c) => h('span', { class: `cam cam-${c}` }, CAMERA_LABEL[c]))),
    ),
  );
}

function fill(el, clip, onDuration) {
  if (!el || el.dataset.loading) return;
  el.dataset.loading = '1';
  prioritize(clip);
  requestThumb(clip).then((t) => {
    if (t?.url) {
      const img = h('img', { src: t.url, alt: '', decoding: 'async' });
      img.addEventListener('load', () => el.classList.add('ready'), { once: true });
      el.replaceChildren(img);
    } else {
      el.classList.add('failed');
      el.replaceChildren(icon('warn', 20));
      el.title = 'Geen voorbeeld: deze browser kan dit videoformaat niet lezen';
    }
    if (t?.duration && onDuration) onDuration(t.duration);
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
  }
}

// Development hook for testing without a real SD card.
if (import.meta.env.DEV) window.__loadFiles = (name, list) => load(name, async () => list);
