// Interface text in eleven languages. English ships with the page; the other
// languages load on demand from src/locales/. Static markup uses
// data-i18n="key" (text), data-i18n-html="key" and data-i18n-attr="attr:key;attr:key".

import en from './locales/en.js';
import { LANGS, NAMES, LOCALE } from './locales/langs.js';

const loaders = import.meta.glob(['./locales/*.js', '!./locales/en.js', '!./locales/langs.js']);

export { LANGS, NAMES };
const STRINGS = { en };

/** The homepage has a page per language (/fr/, /pl/ …); its path decides first. */
export function langFromPath(path = location.pathname) {
  const m = path.match(/^\/([a-z]{2})(\/|$)/);
  return m && LANGS.includes(m[1]) ? m[1] : null;
}

function detect() {
  const fromPath = langFromPath();
  if (fromPath) return fromPath;
  try {
    const saved = localStorage.getItem('lang');
    if (LANGS.includes(saved)) return saved;
  } catch {}
  for (const l of navigator.languages || [navigator.language || 'en']) {
    const code = l.slice(0, 2).toLowerCase();
    if (LANGS.includes(code)) return code;
  }
  return 'en';
}

let lang = 'en';
const listeners = new Set();

export const getLang = () => lang;
export const locale = () => LOCALE[lang];

export function t(key, vars) {
  let s = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
  if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
  return s;
}

export function plural(n, key) {
  const forms = t(key);
  const form = forms[new Intl.PluralRules(locale()).select(n)] ?? forms.other;
  const num = n.toLocaleString(locale());
  // Some languages put the number inside the word (Korean: "파일 {n}개").
  return form.includes('{n}') ? form.replace('{n}', num) : `${num} ${form}`;
}

export function applyI18n(root = document) {
  document.documentElement.lang = lang;
  for (const el of root.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of root.querySelectorAll('[data-i18n-html]')) el.innerHTML = t(el.dataset.i18nHtml);
  for (const el of root.querySelectorAll('[data-i18n-attr]')) {
    for (const pair of el.dataset.i18nAttr.split(';')) {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr.trim(), t(key.trim()));
    }
  }
}

export async function setLang(next, { remember = true } = {}) {
  if (!LANGS.includes(next)) return;
  if (!STRINGS[next]) STRINGS[next] = (await loaders[`./locales/${next}.js`]()).default;
  if (remember) {
    try {
      localStorage.setItem('lang', next);
    } catch {}
  }
  if (next === lang) return;
  lang = next;
  applyI18n();
  listeners.forEach((fn) => fn(lang));
}

export const onLangChange = (fn) => listeners.add(fn);

/** Resolves once the detected language is loaded and applied. */
export const ready = (() => {
  const want = detect();
  return want === 'en' ? Promise.resolve() : setLang(want, { remember: false });
})();

// Flag per language (Portuguese follows Brazil). SVGs from flag-icons, MIT.
const FLAG = { en: 'gb', nl: 'nl', de: 'de', fr: 'fr', es: 'es', it: 'it', pt: 'br', pl: 'pl', ru: 'ru', ko: 'kr', ja: 'jp' };
const flag = (l) => `<img class="flag" src="/flags/${FLAG[l]}.svg" alt="" width="20" height="15" loading="lazy" decoding="async">`;

let pickerCount = 0;

/**
 * Replaces the plain language <select> with a menu that shows each language's flag.
 * The select stays in the page (hidden) as the no-script fallback.
 */
export function bindLangSelect(select) {
  select.replaceChildren(...LANGS.map((l) => new Option(NAMES[l], l)));
  select.value = lang;
  select.addEventListener('change', () => setLang(select.value));
  const host = select.closest('label') || select;
  host.hidden = true;

  const id = `lang-menu-${++pickerCount}`;
  const wrap = document.createElement('div');
  wrap.className = 'lang-picker';
  wrap.innerHTML = `<button type="button" class="lang-btn" aria-haspopup="listbox" aria-expanded="false" popovertarget="${id}"></button>
    <ul class="lang-menu" id="${id}" role="listbox" popover>${LANGS.map(
      (l) => `<li><button type="button" role="option" data-lang="${l}" lang="${l}">${flag(l)}<span>${NAMES[l]}</span></button></li>`,
    ).join('')}</ul>`;
  host.after(wrap);
  const btn = wrap.querySelector('.lang-btn');
  const menu = wrap.querySelector('.lang-menu');

  const render = () => {
    btn.innerHTML = `${flag(lang).replace(' loading="lazy"', '')}<span>${NAMES[lang]}</span><svg class="chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.setAttribute('aria-label', `${t('lang.label')}: ${NAMES[lang]}`);
    for (const o of menu.querySelectorAll('[data-lang]')) o.setAttribute('aria-selected', String(o.dataset.lang === lang));
    select.value = lang;
  };
  render();
  onLangChange(render);

  // Open under the button, or above it when there is no room below (the app's sidebar foot).
  menu.addEventListener('toggle', (e) => {
    const open = e.newState === 'open';
    btn.setAttribute('aria-expanded', String(open));
    if (!open) return;
    const r = btn.getBoundingClientRect();
    const h = menu.offsetHeight;
    const below = innerHeight - r.bottom > h + 12;
    menu.style.top = `${below ? r.bottom + 6 : Math.max(8, r.top - h - 6)}px`;
    menu.style.left = `${Math.min(r.left, innerWidth - menu.offsetWidth - 8)}px`;
    menu.querySelector('[aria-selected="true"]')?.focus();
  });
  menu.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-lang]');
    if (!opt) return;
    menu.hidePopover();
    setLang(opt.dataset.lang);
    btn.focus();
  });
  menu.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const opts = [...menu.querySelectorAll('[data-lang]')];
    const i = opts.indexOf(document.activeElement);
    opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length].focus();
  });
}
