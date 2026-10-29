// Shared by every page of the website (not the app): logo, theme switch,
// language menu, the navigation background on scroll, small icons and the
// way sections come into view.

import './base.css';
import './landing.css';
import './blog.css';
import './pages.css';
import { animate, inView, stagger } from 'motion';
import { bindLangSelect, getLang, onLangChange, ready, setLang } from './i18n.js';
import { mountThemeSwitch, reducedMotion } from './theme.js';
import { mountLogos } from './logo.js';
import { icon } from './ui.js';

mountLogos();
mountThemeSwitch(document.getElementById('theme-switch'));
for (const el of document.querySelectorAll('[data-icon]')) {
  try {
    el.replaceChildren(icon(el.dataset.icon, 22));
  } catch {
    /* an unknown icon name leaves the space empty */
  }
}

const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

// ---------- language ----------

// Every page is built once per language; the build lists the translations as hreflang links.
const pageLang = document.documentElement.lang;
const translation = (l) => {
  const link = document.querySelector(`link[rel="alternate"][hreflang="${l}"]`);
  return link && new URL(link.href).pathname;
};

ready.then(() => {
  bindLangSelect(document.getElementById('lang'));
  // The development server only has the English pages, translated in place; so is the 404 page.
  if (import.meta.env.DEV || document.body.hasAttribute('data-client-i18n')) return;
  // A reader who chose another language before goes to that translation.
  if (getLang() !== pageLang) {
    const path = translation(getLang());
    if (path && path !== location.pathname) return location.replace(path + location.hash);
    setLang(pageLang, { remember: false });
  }
  onLangChange((l) => {
    const path = translation(l);
    if (path && path !== location.pathname) location.href = path + location.hash;
  });
});

// ---------- motion on the inner pages ----------

if (document.body.classList.contains('page') && !reducedMotion()) {
  const ease = [0.22, 1, 0.36, 1];
  animate('.page-head > *, .faq-intro > *', { opacity: [0, 1], y: [18, 0] }, { duration: 0.6, delay: stagger(0.07), ease });
  for (const group of document.querySelectorAll('.fe-block, .info-grid, .dc-table-wrap, .doc, .steps, .faq-list, main > .close')) {
    const parts = group.querySelectorAll(':scope > *, .fe-copy > *, .fe-list li, .step-list li, details');
    parts.forEach((p) => (p.style.opacity = 0));
    inView(group, () => {
      animate(parts, { opacity: [0, 1], y: [22, 0] }, { duration: 0.6, delay: stagger(0.05), ease });
    }, { amount: 0.15 });
  }
}
