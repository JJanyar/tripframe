import './base.css';
import './landing.css';
import './blog.css';
import { bindLangSelect, getLang, onLangChange, ready, setLang } from './i18n.js';
import { mountThemeSwitch, reducedMotion } from './theme.js';
import { mountLogos } from './logo.js';

mountLogos();
mountThemeSwitch(document.getElementById('theme-switch'));

const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

// ---------- language ----------

// Each page is written in one language; the build lists its translations as hreflang links.
const pageLang = document.documentElement.lang;
const translation = (l) => {
  const link = document.querySelector(`link[rel="alternate"][hreflang="${l}"]`);
  return link && new URL(link.href).pathname;
};

ready.then(() => {
  // A reader who chose another language before goes to that translation when there is one.
  if (getLang() !== pageLang) {
    const path = translation(getLang());
    if (path) return location.replace(path + location.hash);
    setLang(pageLang, { remember: false });
  }
  bindLangSelect(document.getElementById('lang'));
  onLangChange((l) => {
    const path = translation(l);
    if (path && path !== location.pathname) location.href = path;
  });
});

// ---------- table of contents ----------

const toc = document.querySelector('.toc');
if (toc) {
  const links = [...toc.querySelectorAll('a')];
  const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
  const bar = toc.querySelector('.toc-indicator');
  let active = null;

  // The current section is the last one whose heading has passed the top third of the screen.
  const update = () => {
    let i = -1;
    heads.forEach((h, k) => {
      if (h && h.getBoundingClientRect().top < innerHeight * 0.3) i = k;
    });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) i = heads.length - 1;
    if (i === active) return;
    active = i;
    links.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    bar.classList.toggle('on', i >= 0);
    if (i < 0) return;
    bar.style.transform = `translateY(${links[i].offsetTop}px)`;
    bar.style.height = `${links[i].offsetHeight}px`;
  };
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }, { passive: true });
  addEventListener('resize', () => {
    active = null;
    update();
  });
  update();

  // Jump smoothly to a section, unless the reader prefers less motion.
  toc.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    document.getElementById(decodeURIComponent(a.hash.slice(1)))?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.hash);
  });
}
