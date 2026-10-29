import './page.js';
import { animate, inView, stagger } from 'motion';
import { onLangChange, t, ready, getLang } from './i18n.js';
import { reducedMotion } from './theme.js';
import { mountDecode } from './decode.js';

mountDecode();

// ---------- demo: the app itself, on sample clips ----------

const demo = document.getElementById('demo-app');
const demoSrc = () => (demo.src = `/app/?demo=${getLang()}`);
ready.then(demoSrc);
onLangChange(demoSrc);
const wait = async (ok, ms) => {
  for (let i = 0; i < ms / 100 && !ok(); i++) await new Promise((r) => setTimeout(r, 100));
  return ok();
};

// The shortcut keys shown on this page work on the demo, the same as in the app.
async function demoKey(key) {
  demo.loading = 'eager';
  const r = demo.getBoundingClientRect();
  if (r.top < 0 || r.bottom > innerHeight) demo.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
  const doc = () => demo.contentDocument;
  if (!(await wait(() => doc()?.querySelector('.tile'), 15000))) return;
  if (doc().getElementById('viewer').hidden) {
    doc().querySelector('.tile').click();
    if (!(await wait(() => doc().querySelector('#viewer video')?.readyState >= 2, 5000))) return;
  }
  doc().dispatchEvent(new demo.contentWindow.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

for (const b of document.querySelectorAll('.key')) b.addEventListener('click', () => demoKey(b.dataset.key));
addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || !document.querySelector(`.key[data-key="${CSS.escape(key)}"]`)) return;
  if (e.target.closest('input, select, textarea, [contenteditable]')) return;
  e.preventDefault();
  demoKey(key);
});

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

// ---------- motion ----------

const ease = [0.22, 1, 0.36, 1];
if (!reducedMotion()) {
  animate('.hero .display, .hero .lead, .hero-actions, .hero-note', { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, delay: stagger(0.08), ease });
  animate('.hero-video', { opacity: [0, 1], y: [40, 0], scale: [0.97, 1] }, { duration: 0.9, delay: 0.2, ease });

  // Every section brings in its heading, then its text, then its picture.
  for (const section of document.querySelectorAll('main > section:not(.hero)')) {
    const parts = section.querySelectorAll('.headline, .display, .display-2, .body-l, .keys, .feature-media, .private-list li, .more-grid li, .post-card, .brand-list li, .btn, .demo, .decode');
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
