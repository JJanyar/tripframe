import './base.css';
import './landing.css';
import { animate, inView, stagger } from 'motion';
import { applyI18n, bindLangSelect, onLangChange, t, locale, getLang } from './i18n.js';
import { mountThemeSwitch, transition, reducedMotion } from './theme.js';
import { mountLogos } from './logo.js';

mountLogos();

const setTitle = () => {
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
};
applyI18n();
setTitle();
bindLangSelect(document.getElementById('lang'));
mountThemeSwitch(document.getElementById('theme-switch'));

// ---------- file names decoded ----------

// Each name is split into the parts the app reads; `kind` links a part to its meaning.
const NAMES = [
  { brand: 'Viofo', parts: [['2024_1212', 'date'], ['_'], ['104137', 'time'], ['_000123'], ['F', 'cam'], ['.MP4']], date: [2024, 11, 12, 10, 41, 37], cam: 'front', type: 'normal' },
  { brand: 'BlackVue', parts: [['20241212', 'date'], ['_'], ['104201', 'time'], ['_'], ['E', 'type'], ['R', 'cam'], ['.mp4']], date: [2024, 11, 12, 10, 42, 1], cam: 'rear', type: 'event' },
  { brand: 'Thinkware', parts: [['REC', 'type'], ['_'], ['2024_12_12', 'date'], ['_'], ['10_43_05', 'time'], ['_'], ['F', 'cam'], ['.MP4']], date: [2024, 11, 12, 10, 43, 5], cam: 'front', type: 'normal' },
  { brand: '70mai', parts: [['PA', 'type'], ['20241212', 'date'], ['-'], ['224410', 'time'], ['-000124'], ['F', 'cam'], ['.mp4']], date: [2024, 11, 12, 22, 44, 10], cam: 'front', type: 'parking' },
  { brand: 'Nextbase', parts: [['241212', 'date'], ['_'], ['104512', 'time'], ['_001_'], ['F', 'cam'], ['H.MP4']], date: [2024, 11, 12, 10, 45, 12], cam: 'front', type: 'normal' },
];

function renderDecode() {
  const list = document.getElementById('decode');
  const dayFmt = new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeFmt = new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  list.replaceChildren(
    ...NAMES.map((n) => {
      const d = new Date(...n.date);
      const li = document.createElement('li');
      li.className = 'decode-row';
      const raw = document.createElement('p');
      raw.className = 'decode-raw';
      for (const [text, kind] of n.parts) {
        const s = document.createElement('span');
        s.textContent = text;
        if (kind) s.dataset.kind = kind;
        raw.append(s);
      }
      const read = document.createElement('p');
      read.className = 'decode-read';
      const piece = (kind, text) => {
        const s = document.createElement('span');
        s.dataset.kind = kind;
        s.textContent = text;
        return s;
      };
      read.append(
        piece('date', dayFmt.format(d).replace(/\./g, '')),
        piece('time', timeFmt.format(d)),
        piece('cam', t(`cam.${n.cam}`)),
      );
      if (n.type !== 'normal') read.append(piece('type', t(`type.${n.type}`)));
      const brand = document.createElement('p');
      brand.className = 'decode-brand';
      brand.textContent = n.brand;
      li.append(brand, raw, read);
      return li;
    }),
  );
  return list;
}

// The signature move: each name lights up part by part, and the readable moment appears beside it.
function playDecode(row, delay = 0) {
  const parts = [...row.querySelectorAll('.decode-raw [data-kind]')];
  const reads = [...row.querySelectorAll('.decode-read [data-kind]')];
  if (reducedMotion()) {
    row.classList.add('decoded');
    return;
  }
  parts.forEach((p, i) => setTimeout(() => {
    p.classList.add('lit');
    const match = reads.find((r) => r.dataset.kind === p.dataset.kind);
    if (match) animate(match, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, ease: [0.22, 1, 0.36, 1] });
  }, delay + i * 160));
  setTimeout(() => row.classList.add('decoded'), delay + parts.length * 160 + 200);
}

renderDecode();
inView('#decode', (el) => {
  [...el.children].forEach((row, i) => playDecode(row, i * 260));
}, { amount: 0.35 });

// ---------- hero demo: a working fragment of the app ----------

const DEMO = [
  { time: [10, 41, 37], front: 'georgia-i75nb-mm86-2-dashcam', rear: 'sb-madison-highway-road-junction-ga-376' },
  { time: [10, 44, 2], front: 'sb-ne-colin-kelley-highway-at-ne', rear: 'sb-madison-highway-road-junction-ga-376', type: 'event' },
  { time: [10, 46, 40], front: 'sb-madison-highway-directional-road-sign-ga', rear: 'georgia-i75nb-mm86-2-dashcam' },
  { time: [10, 49, 15], front: 'sb-madison-highway-directional-road-sign-ga', rear: 'georgia-i75nb-mm86-2-dashcam' },
  { time: [10, 51, 3], front: 'sb-madison-highway-road-junction-ga-376', rear: 'sb-madison-highway-directional-road-sign-ga' },
  { time: [22, 15, 0], front: 'sb-madison-highway-road-junction-ga-376', type: 'parking' },
];
const photo = (name) => `/photos/${name}.jpg`;
const demoTime = (m) => new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(2024, 11, 12, ...m.time));
let demoOpen = null;
let demoMain = 'front';
let tickTimer = 0;

function renderDemo() {
  const day = new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(2024, 11, 12));
  document.getElementById('demo-day').textContent = day.charAt(0).toUpperCase() + day.slice(1);
  const grid = document.getElementById('demo-grid');
  grid.replaceChildren(
    ...DEMO.map((m, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'demo-tile';
      b.dataset.i = i;
      b.innerHTML = `
        <span class="demo-thumb">
          <img class="demo-front" src="${photo(m.front)}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async" />
          ${m.rear ? `<img class="demo-rear" src="${photo(m.rear)}" alt="" loading="lazy" decoding="async" />` : ''}
          ${m.type ? `<span class="tag tag-${m.type}">${t(`type.${m.type}`)}</span>` : ''}
        </span>
        <span class="demo-meta"><span>${demoTime(m)}</span><span class="demo-cams">${t('cam.front')}${m.rear ? `, ${t('cam.rear')}` : ''}</span></span>`;
      b.setAttribute('aria-label', `${demoTime(m)}, ${t('cam.front')}${m.rear ? ` ${t('and')} ${t('cam.rear')}` : ''}`);
      b.addEventListener('click', () => openDemo(i, b));
      return b;
    }),
  );
}

function setNames(tile, on) {
  tile.querySelector('.demo-front').style.viewTransitionName = on ? 'demo-front' : '';
  const rear = tile.querySelector('.demo-rear');
  if (rear) rear.style.viewTransitionName = on ? 'demo-rear' : '';
}

function renderStage() {
  const m = DEMO[demoOpen];
  const stage = document.getElementById('demo-stage');
  const big = demoMain === 'rear' && m.rear ? 'rear' : 'front';
  const small = big === 'front' ? 'rear' : 'front';
  stage.innerHTML = `
    <img class="demo-big" src="${photo(m[big])}" alt="" style="view-transition-name: demo-${big}" />
    ${m.rear ? `<img class="demo-small" src="${photo(m[small])}" alt="" style="view-transition-name: demo-${small}" />` : ''}
    <span class="demo-label">${t(`cam.${big}`)}</span>`;
  document.getElementById('demo-swap').hidden = !m.rear;
}

function openDemo(i, tile) {
  demoOpen = i;
  demoMain = 'front';
  setNames(tile, true);
  transition(() => {
    setNames(tile, false);
    document.getElementById('demo-library').hidden = true;
    document.getElementById('demo-player').hidden = false;
    renderStage();
  }).then(() => document.getElementById('demo-back').focus());
  startClock();
}

function closeDemo() {
  const tile = document.querySelector(`.demo-tile[data-i="${demoOpen}"]`);
  clearInterval(tickTimer);
  transition(() => {
    document.getElementById('demo-player').hidden = true;
    document.getElementById('demo-library').hidden = false;
    // The tile picture morphs back from whichever camera was large.
    if (tile) setNames(tile, true);
  }).then(() => {
    if (tile) {
      setNames(tile, false);
      tile.focus({ preventScroll: true });
    }
  });
}

function swapDemo() {
  if (!DEMO[demoOpen]?.rear) return;
  transition(() => {
    demoMain = demoMain === 'front' ? 'rear' : 'front';
    renderStage();
  });
}

function startClock() {
  const m = DEMO[demoOpen];
  let s = 0;
  const out = document.getElementById('demo-time');
  const show = () => {
    const d = new Date(2024, 11, 12, m.time[0], m.time[1], m.time[2] + s);
    out.textContent = new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(d);
  };
  show();
  clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    s++;
    show();
  }, 1000);
}

document.getElementById('demo-back').addEventListener('click', closeDemo);
document.getElementById('demo-swap').addEventListener('click', swapDemo);
document.getElementById('demo-stage').addEventListener('dblclick', swapDemo);
document.getElementById('demo').addEventListener('keydown', (e) => {
  if (demoOpen == null || document.getElementById('demo-player').hidden) return;
  if (e.key === 'Escape') closeDemo();
  if (e.key.toLowerCase() === 'w') swapDemo();
});
renderDemo();

// ---------- route card ----------

function animateRoute(el) {
  const path = el.querySelector('.route-path');
  const dot = el.querySelector('.route-dot');
  const speed = document.getElementById('route-speed');
  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len}`;
  if (reducedMotion()) {
    path.style.strokeDashoffset = 0;
    const end = path.getPointAtLength(len);
    dot.setAttribute('cx', end.x);
    dot.setAttribute('cy', end.y);
    speed.textContent = 88;
    return;
  }
  animate(0, 1, {
    duration: 3.2,
    ease: [0.45, 0, 0.2, 1],
    onUpdate: (p) => {
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      const pt = path.getPointAtLength(len * p);
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      speed.textContent = Math.round(48 + 40 * Math.sin(p * Math.PI * 0.9));
    },
  });
}



onLangChange((l) => {
  setTitle();
  const target = l === 'en' ? '/' : `/${l}/`;
  if (location.pathname !== target) history.replaceState(null, '', target + location.hash);
  renderDecode().querySelectorAll('.decode-row').forEach((r) => r.classList.add('decoded'));
  renderDemo();
  if (demoOpen != null && !document.getElementById('demo-player').hidden) renderStage();
});

// ---------- motion ----------

const ease = [0.22, 1, 0.36, 1];
if (!reducedMotion()) {
  animate('.hero .display, .hero .lead, .hero-actions, .hero-note', { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, delay: stagger(0.08), ease });
  animate('.hero-video', { opacity: [0, 1], y: [40, 0], scale: [0.97, 1] }, { duration: 0.9, delay: 0.2, ease });

  // Every section brings in its heading, then its text, then its picture.
  for (const section of document.querySelectorAll('main > section:not(.hero)')) {
    const parts = section.querySelectorAll('.headline, .display, .display-2, .body-l, .keys, .feature-media, .private-list li, .step-list li, .steps-photo, details, .btn, .demo, .decode');
    parts.forEach((p) => (p.style.opacity = 0));
    inView(section, () => {
      animate(parts, { opacity: [0, 1], y: [28, 0] }, { duration: 0.7, delay: stagger(0.075), ease });
    }, { amount: 0.2 });
  }

  // Pictures drift slowly against the scroll, like footage still rolling.
  for (const img of document.querySelectorAll('.feature-media img, .steps-photo img')) {
    img.style.willChange = 'transform';
  }
  const drift = () => {
    for (const img of document.querySelectorAll('.feature-media img, .steps-photo img')) {
      const r = img.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `scale(1.08) translateY(${(-p * 22).toFixed(1)}px)`;
    }
  };
  addEventListener('scroll', () => requestAnimationFrame(drift), { passive: true });
  drift();
}

inView('.route-card', (el) => animateRoute(el), { amount: 0.6 });

// The navigation gets a background once the page scrolls under it.
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

// ---------- hero video ----------

const video = document.getElementById('hero-video');
const videoToggle = document.getElementById('video-toggle');
function renderVideoToggle() {
  const playing = !video.paused;
  videoToggle.setAttribute('aria-label', t(playing ? 'h.video.pause' : 'h.video.play'));
  videoToggle.title = t(playing ? 'h.video.pause' : 'h.video.play');
  videoToggle.dataset.state = playing ? 'playing' : 'paused';
}
videoToggle.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
video.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
video.addEventListener('play', renderVideoToggle);
video.addEventListener('pause', renderVideoToggle);
onLangChange(renderVideoToggle);
// Only play while it is on screen, and never on its own for reduced motion.
if (!reducedMotion()) {
  new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), { threshold: 0.25 }).observe(video);
}
renderVideoToggle();
