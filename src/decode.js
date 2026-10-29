// Dashcam file names, decoded part by part into a readable moment (homepage and the dashcams page).

import { animate, inView } from 'motion';
import { onLangChange, t, locale } from './i18n.js';
import { reducedMotion } from './theme.js';

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

/** Fills #decode and plays the decoding once it scrolls into view. */
export function mountDecode() {
  if (!document.getElementById('decode')) return;
  renderDecode();
  inView('#decode', (el) => {
    [...el.children].forEach((row, i) => playDecode(row, i * 260));
  }, { amount: 0.35 });
  onLangChange(() => renderDecode().querySelectorAll('.decode-row').forEach((r) => r.classList.add('decoded')));
}
