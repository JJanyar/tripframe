// Light / dark / system theme, plus the shared view-transition helper.

import { t, onLangChange } from './i18n.js';

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs a DOM update inside a view transition when the browser supports it,
 * so state changes morph instead of jumping. `types` become classes on <html>
 * for the duration, letting CSS pick the right animation.
 */
export function transition(update, { types = [] } = {}) {
  if (!document.startViewTransition || reducedMotion() || document.hidden) {
    update();
    return Promise.resolve();
  }
  const root = document.documentElement;
  types.forEach((c) => root.classList.add(`vt-${c}`));
  const vt = document.startViewTransition(update);
  vt.finished.finally(() => types.forEach((c) => root.classList.remove(`vt-${c}`)));
  return vt.finished.catch(() => {});
}

const MODES = ['system', 'light', 'dark'];
let mode = (() => {
  try {
    return MODES.includes(localStorage.getItem('theme')) ? localStorage.getItem('theme') : 'system';
  } catch {
    return 'system';
  }
})();

function apply() {
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.dataset.theme = mode;
  const dark = mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  root.style.colorScheme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#141414' : '#fafafa');
}
apply();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply);

const ICONS = {
  system: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  dark: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
};

/** Renders a three-way theme switch into `el`. */
export function mountThemeSwitch(el) {
  el.classList.add('theme-switch');
  el.setAttribute('role', 'radiogroup');
  const render = () => {
    el.setAttribute('aria-label', t('theme.label'));
    el.replaceChildren(
      ...MODES.map((m) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', String(m === mode));
        b.setAttribute('aria-label', t(`theme.${m}`));
        b.title = t(`theme.${m}`);
        b.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[m]}</svg>`;
        b.addEventListener('click', (e) => setMode(m, e.currentTarget));
        return b;
      }),
    );
  };
  render();
  onLangChange(render);
  document.addEventListener('themechange', render);
}

function setMode(next, origin) {
  if (next === mode) return;
  const r = origin.getBoundingClientRect();
  const root = document.documentElement;
  root.style.setProperty('--vt-x', `${r.left + r.width / 2}px`);
  root.style.setProperty('--vt-y', `${r.top + r.height / 2}px`);
  transition(
    () => {
      mode = next;
      try {
        localStorage.setItem('theme', mode);
      } catch {}
      apply();
      document.dispatchEvent(new Event('themechange'));
    },
    { types: ['theme'] },
  );
}
