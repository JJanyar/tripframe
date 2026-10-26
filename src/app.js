import './base.css';
import './styles.css';
import { animate, stagger } from 'motion';
import { parseClip, groupMoments, dayKey } from './parse.js';
import { scanHandle, scanFileList, scanEntry, supportsPicker, idbGet, idbSet } from './scan.js';
import { requestThumb, prioritize } from './thumbs.js';
import { openViewer, refreshViewer } from './viewer.js';
import { t, plural, applyI18n, bindLangSelect, onLangChange, locale } from './i18n.js';
import { mountThemeSwitch, transition, reducedMotion } from './theme.js';
import { mountLogos } from './logo.js';
import {
  $, h, icon, setButton, camLabel, typeLabel,
  formatSize, formatDuration, formatDay, formatDayShort, formatTime, formatRange,
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
};

mountLogos();
applyI18n();
bindLangSelect($('lang'));
mountThemeSwitch($('theme-switch'));

function renderStatic() {
  setButton($('open-folder'), 'folder', t('app.openOther'));
  if (state.lastDir) setButton($('reopen'), 'reopen', t('app.reopen', { name: state.lastDir.name }));
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
    let list = days.get(k);
    if (state.sort === 'desc') list = [...list].reverse();
    const daySize = list.reduce((s, m) => s + m.size, 0);
    const events = list.filter((m) => m.type === 'event').length;
    return h(
      'section',
      { class: 'day', id: `day-${k}`, dataset: { day: k }, 'aria-labelledby': `dayh-${k}` },
      h('header', { class: 'day-head' },
        h('h2', { id: `dayh-${k}` }, formatDay(list[0].date)),
        h('p', {},
          [plural(list.length, 'n.moment'), events ? plural(events, 'n.event') : null, formatSize(daySize)].filter(Boolean).join(', '),
        ),
      ),
      h('div', { class: 'grid' }, list.map(tile)),
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
  return h(
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
    ),
  );
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
