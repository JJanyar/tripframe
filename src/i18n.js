// Interface text in Dutch, English and German. Static markup uses
// data-i18n="key" (text) and data-i18n-attr="attr:key;attr:key".

const STRINGS = {
  nl: {
    'lang.name': 'Nederlands',
    'theme.label': 'Thema',
    'theme.system': 'Systeem',
    'theme.light': 'Licht',
    'theme.dark': 'Donker',
    'lang.label': 'Taal',

    'app.openOther': 'Andere map openen',
    'app.reopen': '{name} opnieuw openen',
    'app.filters': 'Map en filters',
    'app.camera': 'Camera',
    'app.type': 'Soort opname',
    'app.days': 'Dagen',
    'app.local': 'Je beelden blijven op deze computer. Er wordt niets geüpload.',
    'app.zoom': 'Grootte van de miniaturen',
    'app.sort': 'Sorteren',
    'app.sortDesc': 'Nieuwste eerst',
    'app.sortAsc': 'Oudste eerst',
    'app.home': 'Naar de homepage',
    'empty.title': 'Open de map van je dashcam',
    'empty.body': 'Kies de geheugenkaart of de map <strong>DCIM</strong>. Je ziet je opnames dan per dag en tijd, met de voor- en achtercamera als één moment.',
    'empty.choose': 'Map kiezen',
    'empty.hint': 'Of sleep de map hierheen. Werkt met Viofo, BlackVue, Thinkware, 70mai, Nextbase en andere merken. Je beelden blijven op deze computer.',
    'empty.none': "In {name} staan geen video's of foto's. Kies de map DCIM op de geheugenkaart, of de kaart zelf.",
    'empty.error': 'De map kon niet worden gelezen ({error}). Kies de map opnieuw.',
    'drop.release': 'Laat los om deze map te openen',
    'loading.reading': '{name} wordt gelezen',
    'loading.found': '{count} gevonden',
    'lib.noResults': 'Geen opnames met deze filters',
    'lib.noResultsHint': 'Zet een camera of soort opname weer aan in de zijbalk.',
    'lib.fileTime': 'Tijd uit de bestandsdatum, niet uit de naam',
    'lib.noPreview': 'Geen voorbeeld: deze browser kan dit videoformaat niet lezen',
    'n.moment': ['moment', 'momenten'],
    'n.file': ['bestand', 'bestanden'],
    'n.event': ['event', 'events'],
    'and': 'en',

    'cam.front': 'Voor',
    'cam.rear': 'Achter',
    'cam.interior': 'Binnen',
    'cam.other': 'Camera',
    'type.normal': 'Normaal',
    'type.event': 'Event',
    'type.parking': 'Parkeren',
    'type.photo': "Foto's",

    'v.back': 'Overzicht',
    'v.backTitle': 'Terug naar overzicht (Esc)',
    'v.layout': 'Weergave',
    'v.side': 'Naast elkaar',
    'v.pip': 'Beeld in beeld',
    'v.swap': 'Wissel',
    'v.swapTitle': 'Wissel voor en achter (W, of dubbelklik op het beeld)',
    'v.map': 'Kaart',
    'v.mapTitle': 'Kaart tonen of verbergen (M)',
    'v.noGps': 'Geen GPS',
    'v.noGpsTitle': 'Deze opname bevat geen GPS-gegevens',
    'v.prevClip': 'Vorige clip (pijl omhoog)',
    'v.nextClip': 'Volgende clip (pijl omlaag)',
    'v.frameBack': 'Eén frame terug (,)',
    'v.frameFwd': 'Eén frame verder (.)',
    'v.play': 'Afspelen',
    'v.pause': 'Pauzeren',
    'v.playTitle': 'Afspelen of pauzeren (spatie)',
    'v.position': 'Positie in de clip',
    'v.speed': 'Afspeelsnelheid',
    'v.autoplay': 'Doorspelen',
    'v.autoplayTitle': 'Speel na afloop de volgende clip af',
    'v.save': 'Frame opslaan',
    'v.saveTitle': 'Huidig frame opslaan als PNG (S)',
    'v.saveOne': 'Frame van {cam} opslaan',
    'v.saved': 'Opgeslagen als {name}',
    'v.noFrame': 'Er is nog geen beeld om op te slaan.',
    'v.frame': 'frame',
    'v.photo': 'Foto {cam}',
    'v.cantPlay': 'Deze browser kan dit videoformaat niet afspelen.',
    'v.cantPlayHint': 'Viofo en andere dashcams nemen vaak op in H.265 (HEVC). Gebruik Edge, of Chrome met HEVC-ondersteuning van Windows.',
    'v.kmh': 'km/u',
    'v.mapNote': 'Kaart van OpenStreetMap. Alleen de kaarttegels worden opgehaald; je beelden blijven lokaal.',
    'dir.N': 'N', 'dir.S': 'Z', 'dir.E': 'O', 'dir.W': 'W',
  },

  en: {
    'lang.name': 'English',
    'theme.label': 'Theme',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'lang.label': 'Language',

    'app.openOther': 'Open another folder',
    'app.reopen': 'Reopen {name}',
    'app.filters': 'Folder and filters',
    'app.camera': 'Camera',
    'app.type': 'Recording type',
    'app.days': 'Days',
    'app.local': 'Your footage stays on this computer. Nothing is uploaded.',
    'app.zoom': 'Thumbnail size',
    'app.sort': 'Sort',
    'app.sortDesc': 'Newest first',
    'app.sortAsc': 'Oldest first',
    'app.home': 'Go to the homepage',
    'empty.title': 'Open your dashcam folder',
    'empty.body': 'Choose the memory card or its <strong>DCIM</strong> folder. Your recordings appear by day and time, with front and rear camera together as one moment.',
    'empty.choose': 'Choose folder',
    'empty.hint': 'Or drag the folder here. Works with Viofo, BlackVue, Thinkware, 70mai, Nextbase and other brands. Your footage stays on this computer.',
    'empty.none': 'There are no videos or photos in {name}. Choose the DCIM folder on the memory card, or the card itself.',
    'empty.error': 'The folder could not be read ({error}). Choose the folder again.',
    'drop.release': 'Drop to open this folder',
    'loading.reading': 'Reading {name}',
    'loading.found': '{count} found',
    'lib.noResults': 'No recordings match these filters',
    'lib.noResultsHint': 'Turn a camera or recording type back on in the sidebar.',
    'lib.fileTime': 'Time taken from the file date, not the name',
    'lib.noPreview': 'No preview: this browser cannot read this video format',
    'n.moment': ['moment', 'moments'],
    'n.file': ['file', 'files'],
    'n.event': ['event', 'events'],
    'and': 'and',

    'cam.front': 'Front',
    'cam.rear': 'Rear',
    'cam.interior': 'Interior',
    'cam.other': 'Camera',
    'type.normal': 'Normal',
    'type.event': 'Event',
    'type.parking': 'Parking',
    'type.photo': 'Photos',

    'v.back': 'Library',
    'v.backTitle': 'Back to the library (Esc)',
    'v.layout': 'Layout',
    'v.side': 'Side by side',
    'v.pip': 'Picture in picture',
    'v.swap': 'Swap',
    'v.swapTitle': 'Swap front and rear (W, or double-click the video)',
    'v.map': 'Map',
    'v.mapTitle': 'Show or hide the map (M)',
    'v.noGps': 'No GPS',
    'v.noGpsTitle': 'This recording has no GPS data',
    'v.prevClip': 'Previous clip (arrow up)',
    'v.nextClip': 'Next clip (arrow down)',
    'v.frameBack': 'One frame back (,)',
    'v.frameFwd': 'One frame forward (.)',
    'v.play': 'Play',
    'v.pause': 'Pause',
    'v.playTitle': 'Play or pause (space)',
    'v.position': 'Position in the clip',
    'v.speed': 'Playback speed',
    'v.autoplay': 'Autoplay',
    'v.autoplayTitle': 'Play the next clip when this one ends',
    'v.save': 'Save frame',
    'v.saveTitle': 'Save the current frame as PNG (S)',
    'v.saveOne': 'Save {cam} frame',
    'v.saved': 'Saved as {name}',
    'v.noFrame': 'There is no picture to save yet.',
    'v.frame': 'frame',
    'v.photo': '{cam} photo',
    'v.cantPlay': 'This browser cannot play this video format.',
    'v.cantPlayHint': 'Viofo and other dashcams often record in H.265 (HEVC). Use Edge, or Chrome with the Windows HEVC extension, or Safari on a Mac.',
    'v.kmh': 'km/h',
    'v.mapNote': 'Map by OpenStreetMap. Only the map tiles are downloaded; your footage stays local.',
    'dir.N': 'N', 'dir.S': 'S', 'dir.E': 'E', 'dir.W': 'W',
  },

  de: {
    'lang.name': 'Deutsch',
    'theme.label': 'Design',
    'theme.system': 'System',
    'theme.light': 'Hell',
    'theme.dark': 'Dunkel',
    'lang.label': 'Sprache',

    'app.openOther': 'Anderen Ordner öffnen',
    'app.reopen': '{name} erneut öffnen',
    'app.filters': 'Ordner und Filter',
    'app.camera': 'Kamera',
    'app.type': 'Aufnahmeart',
    'app.days': 'Tage',
    'app.local': 'Deine Aufnahmen bleiben auf diesem Computer. Es wird nichts hochgeladen.',
    'app.zoom': 'Größe der Vorschaubilder',
    'app.sort': 'Sortieren',
    'app.sortDesc': 'Neueste zuerst',
    'app.sortAsc': 'Älteste zuerst',
    'app.home': 'Zur Startseite',
    'empty.title': 'Öffne den Ordner deiner Dashcam',
    'empty.body': 'Wähle die Speicherkarte oder ihren Ordner <strong>DCIM</strong>. Deine Aufnahmen erscheinen nach Tag und Uhrzeit, Front- und Heckkamera zusammen als ein Moment.',
    'empty.choose': 'Ordner wählen',
    'empty.hint': 'Oder ziehe den Ordner hierher. Funktioniert mit Viofo, BlackVue, Thinkware, 70mai, Nextbase und anderen Marken. Deine Aufnahmen bleiben auf diesem Computer.',
    'empty.none': 'In {name} sind keine Videos oder Fotos. Wähle den Ordner DCIM auf der Speicherkarte oder die Karte selbst.',
    'empty.error': 'Der Ordner konnte nicht gelesen werden ({error}). Wähle den Ordner erneut.',
    'drop.release': 'Loslassen, um diesen Ordner zu öffnen',
    'loading.reading': '{name} wird gelesen',
    'loading.found': '{count} gefunden',
    'lib.noResults': 'Keine Aufnahmen mit diesen Filtern',
    'lib.noResultsHint': 'Schalte in der Seitenleiste eine Kamera oder Aufnahmeart wieder ein.',
    'lib.fileTime': 'Zeit aus dem Dateidatum, nicht aus dem Namen',
    'lib.noPreview': 'Keine Vorschau: Dieser Browser kann dieses Videoformat nicht lesen',
    'n.moment': ['Moment', 'Momente'],
    'n.file': ['Datei', 'Dateien'],
    'n.event': ['Ereignis', 'Ereignisse'],
    'and': 'und',

    'cam.front': 'Vorne',
    'cam.rear': 'Hinten',
    'cam.interior': 'Innen',
    'cam.other': 'Kamera',
    'type.normal': 'Normal',
    'type.event': 'Ereignis',
    'type.parking': 'Parken',
    'type.photo': 'Fotos',

    'v.back': 'Übersicht',
    'v.backTitle': 'Zurück zur Übersicht (Esc)',
    'v.layout': 'Ansicht',
    'v.side': 'Nebeneinander',
    'v.pip': 'Bild im Bild',
    'v.swap': 'Tauschen',
    'v.swapTitle': 'Vorne und hinten tauschen (W, oder Doppelklick aufs Bild)',
    'v.map': 'Karte',
    'v.mapTitle': 'Karte ein- oder ausblenden (M)',
    'v.noGps': 'Kein GPS',
    'v.noGpsTitle': 'Diese Aufnahme enthält keine GPS-Daten',
    'v.prevClip': 'Vorheriger Clip (Pfeil hoch)',
    'v.nextClip': 'Nächster Clip (Pfeil runter)',
    'v.frameBack': 'Ein Bild zurück (,)',
    'v.frameFwd': 'Ein Bild vor (.)',
    'v.play': 'Abspielen',
    'v.pause': 'Pause',
    'v.playTitle': 'Abspielen oder pausieren (Leertaste)',
    'v.position': 'Position im Clip',
    'v.speed': 'Wiedergabegeschwindigkeit',
    'v.autoplay': 'Weiterspielen',
    'v.autoplayTitle': 'Danach den nächsten Clip abspielen',
    'v.save': 'Bild speichern',
    'v.saveTitle': 'Aktuelles Bild als PNG speichern (S)',
    'v.saveOne': 'Bild von {cam} speichern',
    'v.saved': 'Gespeichert als {name}',
    'v.noFrame': 'Es gibt noch kein Bild zum Speichern.',
    'v.frame': 'Bild',
    'v.photo': 'Foto {cam}',
    'v.cantPlay': 'Dieser Browser kann dieses Videoformat nicht abspielen.',
    'v.cantPlayHint': 'Viofo und andere Dashcams nehmen oft in H.265 (HEVC) auf. Nutze Edge oder Chrome mit der HEVC-Erweiterung von Windows.',
    'v.kmh': 'km/h',
    'v.mapNote': 'Karte von OpenStreetMap. Nur die Kartenkacheln werden geladen; deine Aufnahmen bleiben lokal.',
    'dir.N': 'N', 'dir.S': 'S', 'dir.E': 'O', 'dir.W': 'W',
  },
};

export const LANGS = ['en', 'nl', 'de'];
const LOCALE = { nl: 'nl-NL', en: 'en-GB', de: 'de-DE' };

function detect() {
  try {
    const saved = localStorage.getItem('lang');
    if (LANGS.includes(saved)) return saved;
  } catch {}
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS.includes(nav) ? nav : 'en';
}

let lang = detect();
const listeners = new Set();
const extra = {};

/** Pages add their own strings (the homepage copy) per language. */
export function addStrings(dict) {
  for (const [l, s] of Object.entries(dict)) extra[l] = { ...(extra[l] || {}), ...s };
}

export const getLang = () => lang;
export const locale = () => LOCALE[lang];

export function t(key, vars) {
  let s = extra[lang]?.[key] ?? STRINGS[lang][key] ?? extra.en?.[key] ?? STRINGS.en[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
  return s;
}

export function plural(n, key) {
  const [one, many] = t(key);
  return `${n.toLocaleString(locale())} ${n === 1 ? one : many}`;
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

export function setLang(next) {
  if (!LANGS.includes(next) || next === lang) return;
  lang = next;
  try {
    localStorage.setItem('lang', next);
  } catch {}
  applyI18n();
  listeners.forEach((fn) => fn(lang));
}

export const onLangChange = (fn) => listeners.add(fn);

/** Fills a <select> with the languages and keeps it in sync. */
export function bindLangSelect(select) {
  select.replaceChildren(...LANGS.map((l) => new Option(STRINGS[l]['lang.name'], l)));
  select.value = lang;
  select.addEventListener('change', () => setLang(select.value));
  onLangChange((l) => (select.value = l));
}
