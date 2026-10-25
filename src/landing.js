import './base.css';
import './landing.css';
import { animate, inView, stagger } from 'motion';
import { addStrings, applyI18n, bindLangSelect, onLangChange, t, locale } from './i18n.js';
import { mountThemeSwitch, transition, reducedMotion } from './theme.js';
import credits from './photo-credits.json';

addStrings({
  en: {
    'h.nav.how': 'How it works',
    'h.nav.privacy': 'Privacy',
    'h.nav.faq': 'Questions',
    'h.cta': 'Open your dashcam folder',
    'h.cta.short': 'Open the app',
    'h.hero.title': 'Your dashcam footage, sorted by the minute',
    'h.hero.lead': 'Put the SD card in your laptop and open it here. Every clip appears by day and time, front and rear together, ready to play, step through and save.',
    'h.hero.note': 'Free, no account, nothing is uploaded.',
    'h.demo.title': 'Thursday 12 December',
    'h.demo.back': 'Library',
    'h.demo.swap': 'Swap',
    'h.demo.caption': 'Try it: open a moment, then swap or double-click the picture. Demo with sample dashcam stills.',
    'h.moment.title': 'A moment, not a file name',
    'h.moment.body': 'Dashcams name every clip with a string of digits. The dashboard reads date, time, camera and recording type straight from those names, for the brands below and anything that writes a date into its file names.',
    'h.sync.title': 'Front and rear, in one picture',
    'h.sync.body': 'Clips recorded at the same second become one moment. They play in sync side by side or picture in picture, and a double-click swaps which camera is large.',
    'h.sync.key': 'swaps front and rear',
    'h.frame.title': 'Find the exact frame',
    'h.frame.body': 'Pause, then step one frame at a time to the second that matters: a plate, a brake light, a sign. Save that frame as a PNG, one camera or both side by side, named with the real date and time.',
    'h.frame.key1': 'step one frame',
    'h.frame.key2': 'saves it',
    'h.map.title': 'Where it happened',
    'h.map.body': 'Viofo and other Novatek cameras, and BlackVue, store GPS inside the video. The route appears on a map, the dot follows the playhead and the speed is shown alongside.',
    'h.private.title': 'Your footage never leaves your computer',
    'h.private.body': 'The dashboard is a web page that reads the folder you choose, inside your browser. There is no server behind it that receives your videos, and no account to make.',
    'h.private.p1': 'Files are read locally and never uploaded',
    'h.private.p2': 'Read-only: nothing on the SD card is changed',
    'h.private.p3': 'No account, no sign-up, no tracking',
    'h.private.p4': 'Only map tiles are fetched, when a clip has GPS',
    'h.steps.title': 'Three steps',
    'h.steps.1t': 'Insert the card',
    'h.steps.1': 'Take the microSD card out of the dashcam and put it in your laptop, or connect the camera by USB.',
    'h.steps.2t': 'Choose the folder',
    'h.steps.2': 'Open the app and pick the card or its <strong>DCIM</strong> folder. Chrome and Edge remember it for next time.',
    'h.steps.3t': 'Pick a moment',
    'h.steps.3': 'Filter on events or parking, jump to a day, open a moment and play.',
    'h.faq.title': 'Questions',
    'h.faq.q1': 'Are my videos uploaded anywhere?',
    'h.faq.a1': 'No. The browser reads the files on your own computer. The site only serves the app itself; your footage is never sent to it.',
    'h.faq.q2': 'Which dashcams work?',
    'h.faq.a2': 'Viofo, BlackVue, Thinkware, 70mai and Nextbase file names are recognised, including front, rear and interior cameras, events and parking mode. Other brands work when the file name contains a date; otherwise the file date is used.',
    'h.faq.q3': 'Which browsers can I use?',
    'h.faq.a3': 'Chrome and Edge on a laptop or desktop give the full experience, including remembering the last folder. Firefox and Safari work through a folder picker.',
    'h.faq.q4': 'My clips show an error instead of a picture',
    'h.faq.a4': 'Many dashcams record in H.265 (HEVC). Edge plays it on most Windows PCs; Chrome needs the HEVC Video Extension from the Microsoft Store; Safari on a Mac plays it out of the box.',
    'h.faq.q5': 'Does it cost anything?',
    'h.faq.a5': 'No. It is free to use, with no account and no ads.',
    'h.faq.q6': 'Can I save a still from a video?',
    'h.faq.a6': 'Yes. Pause, step to the right frame with the comma and full stop keys, and press S. The PNG is named after the date and time of that exact frame.',
    'h.close.title': 'Open the card. Find the moment.',
    'h.footer.local': 'Runs in your browser. Your footage stays on your computer.',
    'h.footer.photos': 'Sample dashcam photos from Wikimedia Commons:',
    'h.decode.date': 'date',
    'h.decode.time': 'time',
    'h.decode.cam': 'camera',
    'h.decode.type': 'type',
    'h.alt.highway': 'Dashcam view of a sunny four-lane interstate with a mile marker and a pickup truck alongside',
    'h.alt.divided': 'Dashcam view where a divided highway ends between trees',
    'h.alt.intersection': 'Dashcam view of a rural intersection with flashing amber signals under a grey sky',
    'h.alt.sign': 'Dashcam view of a highway junction with a green directional road sign',
    'h.alt.cams': 'Two dashcams mounted on a windscreen behind the rear-view mirror, both showing a live picture',
  },
  nl: {
    'h.nav.how': 'Zo werkt het',
    'h.nav.privacy': 'Privacy',
    'h.nav.faq': 'Vragen',
    'h.cta': 'Open je dashcam-map',
    'h.cta.short': 'Open de app',
    'h.hero.title': 'Je dashcambeelden, per minuut gesorteerd',
    'h.hero.lead': 'Stop de SD-kaart in je laptop en open hem hier. Elke clip staat op dag en tijd, voor en achter samen, klaar om af te spelen, door te stappen en op te slaan.',
    'h.hero.note': 'Gratis, geen account, er wordt niets geüpload.',
    'h.demo.title': 'Donderdag 12 december',
    'h.demo.back': 'Overzicht',
    'h.demo.swap': 'Wissel',
    'h.demo.caption': 'Probeer het: open een moment en wissel, of dubbelklik op het beeld. Demo met voorbeeldfoto’s van dashcams.',
    'h.moment.title': 'Een moment, geen bestandsnaam',
    'h.moment.body': 'Dashcams geven elke clip een reeks cijfers als naam. Het dashboard leest daar datum, tijd, camera en soort opname uit, voor de merken hieronder en alles wat een datum in de bestandsnaam zet.',
    'h.sync.title': 'Voor en achter in één beeld',
    'h.sync.body': 'Clips van dezelfde seconde worden één moment. Ze spelen synchroon naast elkaar of beeld-in-beeld, en met een dubbelklik wissel je welke camera groot is.',
    'h.sync.key': 'wisselt voor en achter',
    'h.frame.title': 'Vind het precieze frame',
    'h.frame.body': 'Pauzeer en stap frame voor frame naar de seconde die telt: een kenteken, een remlicht, een bord. Sla dat frame op als PNG, van één camera of allebei naast elkaar, met de echte datum en tijd in de naam.',
    'h.frame.key1': 'één frame verder',
    'h.frame.key2': 'slaat het op',
    'h.map.title': 'Waar het gebeurde',
    'h.map.body': 'Viofo en andere Novatek-camera’s, en BlackVue, bewaren GPS in de video. De route verschijnt op een kaart, de stip loopt mee met de video en de snelheid staat ernaast.',
    'h.private.title': 'Je beelden verlaten je computer niet',
    'h.private.body': 'Het dashboard is een webpagina die de map leest die jij kiest, in je eigen browser. Er is geen server die je video’s ontvangt, en je hoeft geen account te maken.',
    'h.private.p1': 'Bestanden worden lokaal gelezen en nooit geüpload',
    'h.private.p2': 'Alleen lezen: er verandert niets op de SD-kaart',
    'h.private.p3': 'Geen account, geen aanmelding, geen tracking',
    'h.private.p4': 'Alleen kaarttegels worden opgehaald, als een clip GPS heeft',
    'h.steps.title': 'Drie stappen',
    'h.steps.1t': 'Kaart erin',
    'h.steps.1': 'Haal de microSD-kaart uit de dashcam en stop hem in je laptop, of sluit de camera aan via USB.',
    'h.steps.2t': 'Map kiezen',
    'h.steps.2': 'Open de app en kies de kaart of de map <strong>DCIM</strong>. Chrome en Edge onthouden hem voor de volgende keer.',
    'h.steps.3t': 'Moment kiezen',
    'h.steps.3': 'Filter op events of parkeren, spring naar een dag, open een moment en speel af.',
    'h.faq.title': 'Vragen',
    'h.faq.q1': 'Worden mijn video’s ergens geüpload?',
    'h.faq.a1': 'Nee. Je browser leest de bestanden op je eigen computer. De site levert alleen de app zelf; je beelden worden er nooit naartoe gestuurd.',
    'h.faq.q2': 'Welke dashcams werken?',
    'h.faq.a2': 'Bestandsnamen van Viofo, BlackVue, Thinkware, 70mai en Nextbase worden herkend, inclusief voor-, achter- en binnencamera, events en parkeerstand. Andere merken werken als de naam een datum bevat; anders wordt de bestandsdatum gebruikt.',
    'h.faq.q3': 'Welke browsers kan ik gebruiken?',
    'h.faq.a3': 'Chrome en Edge op een laptop of desktop geven alles, ook het onthouden van de laatste map. Firefox en Safari werken via een mapkiezer.',
    'h.faq.q4': 'Mijn clips tonen een fout in plaats van beeld',
    'h.faq.a4': 'Veel dashcams nemen op in H.265 (HEVC). Edge speelt dat af op de meeste Windows-pc’s; Chrome heeft de HEVC-video-extensie uit de Microsoft Store nodig; Safari op een Mac speelt het direct af.',
    'h.faq.q5': 'Kost het iets?',
    'h.faq.a5': 'Nee. Het is gratis, zonder account en zonder advertenties.',
    'h.faq.q6': 'Kan ik een stilstaand beeld opslaan?',
    'h.faq.a6': 'Ja. Pauzeer, stap met de komma- en punttoets naar het juiste frame en druk op S. De PNG krijgt de datum en tijd van precies dat frame als naam.',
    'h.close.title': 'Open de kaart. Vind het moment.',
    'h.footer.local': 'Draait in je browser. Je beelden blijven op je computer.',
    'h.footer.photos': 'Voorbeeldfoto’s van dashcams via Wikimedia Commons:',
    'h.decode.date': 'datum',
    'h.decode.time': 'tijd',
    'h.decode.cam': 'camera',
    'h.decode.type': 'soort',
    'h.alt.highway': 'Dashcambeeld van een zonnige snelweg met een mijlpaal en een pick-up ernaast',
    'h.alt.divided': 'Dashcambeeld waar een gescheiden weg eindigt tussen de bomen',
    'h.alt.intersection': 'Dashcambeeld van een kruispunt met knipperende oranje lichten onder een grijze lucht',
    'h.alt.sign': 'Dashcambeeld van een kruising met een groen richtingbord',
    'h.alt.cams': 'Twee dashcams achter de binnenspiegel op een voorruit, allebei met live beeld',
  },
  de: {
    'h.nav.how': 'So funktioniert’s',
    'h.nav.privacy': 'Datenschutz',
    'h.nav.faq': 'Fragen',
    'h.cta': 'Dashcam-Ordner öffnen',
    'h.cta.short': 'App öffnen',
    'h.hero.title': 'Deine Dashcam-Aufnahmen, minutengenau sortiert',
    'h.hero.lead': 'Steck die SD-Karte in deinen Laptop und öffne sie hier. Jeder Clip erscheint nach Tag und Uhrzeit, vorne und hinten zusammen, bereit zum Abspielen, Durchsteppen und Speichern.',
    'h.hero.note': 'Kostenlos, kein Konto, nichts wird hochgeladen.',
    'h.demo.title': 'Donnerstag, 12. Dezember',
    'h.demo.back': 'Übersicht',
    'h.demo.swap': 'Tauschen',
    'h.demo.caption': 'Probier es aus: Öffne einen Moment und tausche, oder doppelklicke aufs Bild. Demo mit Beispielfotos von Dashcams.',
    'h.moment.title': 'Ein Moment, kein Dateiname',
    'h.moment.body': 'Dashcams benennen jeden Clip mit einer Ziffernfolge. Das Dashboard liest daraus Datum, Uhrzeit, Kamera und Aufnahmeart, für die Marken unten und alles, was ein Datum in den Dateinamen schreibt.',
    'h.sync.title': 'Vorne und hinten in einem Bild',
    'h.sync.body': 'Clips derselben Sekunde werden ein Moment. Sie laufen synchron nebeneinander oder als Bild im Bild, und ein Doppelklick tauscht, welche Kamera groß ist.',
    'h.sync.key': 'tauscht vorne und hinten',
    'h.frame.title': 'Finde das genaue Bild',
    'h.frame.body': 'Pausiere und gehe Bild für Bild zur entscheidenden Sekunde: ein Kennzeichen, ein Bremslicht, ein Schild. Speichere das Bild als PNG, eine Kamera oder beide nebeneinander, mit echtem Datum und Uhrzeit im Namen.',
    'h.frame.key1': 'ein Bild weiter',
    'h.frame.key2': 'speichert es',
    'h.map.title': 'Wo es passiert ist',
    'h.map.body': 'Viofo und andere Novatek-Kameras sowie BlackVue speichern GPS im Video. Die Route erscheint auf einer Karte, der Punkt folgt der Wiedergabe und die Geschwindigkeit steht daneben.',
    'h.private.title': 'Deine Aufnahmen verlassen deinen Computer nicht',
    'h.private.body': 'Das Dashboard ist eine Webseite, die den von dir gewählten Ordner in deinem Browser liest. Es gibt keinen Server, der deine Videos empfängt, und kein Konto.',
    'h.private.p1': 'Dateien werden lokal gelesen und nie hochgeladen',
    'h.private.p2': 'Nur lesen: Auf der SD-Karte wird nichts verändert',
    'h.private.p3': 'Kein Konto, keine Anmeldung, kein Tracking',
    'h.private.p4': 'Nur Kartenkacheln werden geladen, wenn ein Clip GPS hat',
    'h.steps.title': 'Drei Schritte',
    'h.steps.1t': 'Karte einstecken',
    'h.steps.1': 'Nimm die microSD-Karte aus der Dashcam und steck sie in deinen Laptop, oder verbinde die Kamera per USB.',
    'h.steps.2t': 'Ordner wählen',
    'h.steps.2': 'Öffne die App und wähle die Karte oder ihren Ordner <strong>DCIM</strong>. Chrome und Edge merken ihn sich.',
    'h.steps.3t': 'Moment wählen',
    'h.steps.3': 'Filtere nach Ereignissen oder Parken, springe zu einem Tag, öffne einen Moment und spiel ihn ab.',
    'h.faq.title': 'Fragen',
    'h.faq.q1': 'Werden meine Videos irgendwo hochgeladen?',
    'h.faq.a1': 'Nein. Dein Browser liest die Dateien auf deinem eigenen Computer. Die Seite liefert nur die App selbst; deine Aufnahmen werden nie dorthin gesendet.',
    'h.faq.q2': 'Welche Dashcams funktionieren?',
    'h.faq.a2': 'Dateinamen von Viofo, BlackVue, Thinkware, 70mai und Nextbase werden erkannt, inklusive Front-, Heck- und Innenkamera, Ereignissen und Parkmodus. Andere Marken funktionieren, wenn der Name ein Datum enthält; sonst wird das Dateidatum verwendet.',
    'h.faq.q3': 'Welche Browser kann ich nutzen?',
    'h.faq.a3': 'Chrome und Edge auf Laptop oder Desktop bieten alles, auch das Merken des letzten Ordners. Firefox und Safari funktionieren über eine Ordnerauswahl.',
    'h.faq.q4': 'Meine Clips zeigen einen Fehler statt eines Bildes',
    'h.faq.a4': 'Viele Dashcams nehmen in H.265 (HEVC) auf. Edge spielt das auf den meisten Windows-PCs ab; Chrome braucht die HEVC-Videoerweiterung aus dem Microsoft Store; Safari auf dem Mac spielt es direkt ab.',
    'h.faq.q5': 'Kostet es etwas?',
    'h.faq.a5': 'Nein. Es ist kostenlos, ohne Konto und ohne Werbung.',
    'h.faq.q6': 'Kann ich ein Standbild speichern?',
    'h.faq.a6': 'Ja. Pausiere, gehe mit Komma- und Punkttaste zum richtigen Bild und drücke S. Das PNG wird nach Datum und Uhrzeit genau dieses Bildes benannt.',
    'h.close.title': 'Karte öffnen. Moment finden.',
    'h.footer.local': 'Läuft in deinem Browser. Deine Aufnahmen bleiben auf deinem Computer.',
    'h.footer.photos': 'Beispielfotos von Dashcams über Wikimedia Commons:',
    'h.decode.date': 'Datum',
    'h.decode.time': 'Uhrzeit',
    'h.decode.cam': 'Kamera',
    'h.decode.type': 'Art',
    'h.alt.highway': 'Dashcam-Blick auf eine sonnige Autobahn mit Meilenschild und einem Pick-up daneben',
    'h.alt.divided': 'Dashcam-Blick, wo eine getrennte Fahrbahn zwischen Bäumen endet',
    'h.alt.intersection': 'Dashcam-Blick auf eine Kreuzung mit blinkenden gelben Ampeln unter grauem Himmel',
    'h.alt.sign': 'Dashcam-Blick auf eine Kreuzung mit grünem Wegweiser',
    'h.alt.cams': 'Zwei Dashcams hinter dem Innenspiegel an einer Windschutzscheibe, beide mit Livebild',
  },
});

const setTitle = () => (document.title = `Dashcam dashboard: ${t('h.hero.title').toLowerCase()}`);
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
  { time: [10, 41, 37], front: 'georgia-i75nb-mm86-2-dashcam', rear: 'eb-us-84-divided-highway-ends-brooks' },
  { time: [10, 44, 2], front: 'sb-ne-colin-kelley-highway-at-ne', rear: 'sb-madison-highway-road-junction-ga-376', type: 'event' },
  { time: [10, 46, 40], front: 'sb-madison-highway-directional-road-sign-ga', rear: 'georgia-i75nb-mm86-2-dashcam' },
  { time: [10, 49, 15], front: 'eb-us-84-divided-highway-ends-brooks', rear: 'sb-ne-colin-kelley-highway-at-ne' },
  { time: [10, 51, 3], front: 'sb-madison-highway-road-junction-ga-376', rear: 'sb-madison-highway-directional-road-sign-ga' },
  { time: [22, 15, 0], front: 'sb-madison-highway-road-junction-ga-376', type: 'parking' },
];
const photo = (name) => `/photos/${name}.jpg`;
const demoTime = (m) => new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(2024, 11, 12, ...m.time));
let demoOpen = null;
let demoMain = 'front';
let tickTimer = 0;

function renderDemo() {
  document.getElementById('demo-day').textContent = t('h.demo.title');
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

// ---------- credits ----------

function renderCredits() {
  document.getElementById('credits').replaceChildren(
    ...credits.map((c) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = c.page;
      a.textContent = c.title;
      a.rel = 'noopener';
      li.append(a, ` ${c.creator}, ${c.license}`);
      return li;
    }),
  );
}
renderCredits();

onLangChange(() => {
  setTitle();
  renderDecode().querySelectorAll('.decode-row').forEach((r) => r.classList.add('decoded'));
  renderDemo();
  if (demoOpen != null && !document.getElementById('demo-player').hidden) renderStage();
});

// ---------- motion ----------

const ease = [0.22, 1, 0.36, 1];
if (!reducedMotion()) {
  animate('.hero .display, .hero .lead, .hero-actions', { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, delay: stagger(0.08), ease });
  animate('.demo', { opacity: [0, 1], y: [40, 0], scale: [0.98, 1] }, { duration: 0.9, delay: 0.25, ease });
  animate('.demo-tile', { opacity: [0, 1], y: [12, 0] }, { duration: 0.5, delay: stagger(0.06, { startDelay: 0.55 }), ease });

  // Every section brings in its heading, then its text, then its picture.
  for (const section of document.querySelectorAll('main > section:not(.hero)')) {
    const parts = section.querySelectorAll('.headline, .display, .display-2, .body-l, .keys, .feature-media, .private-list li, .step-list li, .steps-photo, details, .btn');
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
