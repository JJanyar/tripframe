// Checks the interface translations against English: every key present, and
// every {placeholder} kept. `npm run i18n:check` for all languages, or
// `npm run i18n:check -- nl de` for some. Lists what is wrong and exits with 1.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { LANGS } from '../src/locales/langs.js';

const root = resolve(import.meta.dirname, '..');
const load = async (l) => (await import(pathToFileURL(resolve(root, `src/locales/${l}.js`)).href)).default;
const holes = (s) => JSON.stringify((String(s).match(/\{\w+\}/g) || []).sort());

const en = await load('en');
const langs = process.argv.slice(2).length ? process.argv.slice(2) : LANGS.filter((l) => l !== 'en');
let problems = 0;
for (const lang of langs) {
  const tr = await load(lang);
  const missing = Object.keys(en).filter((k) => !(k in tr));
  // Plural entries have a shape of their own per language, so only plain strings are compared.
  const broken = Object.keys(en).filter((k) => k in tr && typeof en[k] === 'string' && holes(en[k]) !== holes(tr[k]));
  const extra = Object.keys(tr).filter((k) => !(k in en));
  if (missing.length) console.log(`${lang}: missing ${missing.join(' ')}`);
  if (broken.length) console.log(`${lang}: placeholders differ in ${broken.join(' ')}`);
  if (extra.length) console.log(`${lang}: not in English ${extra.join(' ')}`);
  problems += missing.length + broken.length + extra.length;
  if (!missing.length && !broken.length && !extra.length) console.log(`${lang}: ok (${Object.keys(tr).length} keys)`);
}
process.exit(problems ? 1 : 0);
