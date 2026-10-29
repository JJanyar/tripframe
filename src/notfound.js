// The page for unknown addresses. It is one static page for every language,
// so its text and links are switched to the reader's language here.

import './page.js';
import { applyI18n, getLang, onLangChange, ready } from './i18n.js';

const SITE_PATH = /^\/(?!app\/)([a-z-]+\/)?(#.*)?$/;

function localize() {
  applyI18n();
  const lang = getLang();
  for (const a of document.querySelectorAll('a[href^="/"]')) {
    a.dataset.href ??= a.getAttribute('href');
    const path = a.dataset.href;
    a.setAttribute('href', lang !== 'en' && (SITE_PATH.test(path) || path.startsWith('/blog/')) ? `/${lang}${path}` : path);
  }
}

ready.then(localize);
onLangChange(localize);
