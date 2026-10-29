// Reads date, time, camera and recording type from dashcam file names.
// Covers Viofo, BlackVue, Thinkware, 70mai, Nextbase and a generic
// date pattern; anything else falls back to the file's modification time.

export const VIDEO_EXT = /\.(mp4|mov|ts|avi|mkv)$/i;
export const IMAGE_EXT = /\.(jpe?g|png)$/i;

const CAMERA_LETTER = { F: 'front', R: 'rear', B: 'rear', I: 'interior', T: 'interior' };

function date(y, mo, d, h, mi, s) {
  const yy = Number(y) < 100 ? 2000 + Number(y) : Number(y);
  const dt = new Date(yy, Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
  return Number.isNaN(dt.getTime()) || yy < 2000 || yy > 2100 ? null : dt;
}

function typeFromPath(path) {
  const dirs = path.split('/').slice(0, -1).join('/');
  if (/(^|\/)(ro|event\w*|emr|emer\w*|lock\w*|protect\w*|sos|evt|manual|incident|saved\w*)(\/|$)/i.test(dirs)) return 'event';
  if (/park|sentry/i.test(dirs)) return 'parking';
  if (/(photo|picture|snapshot|image)/i.test(dirs)) return 'photo';
  return null;
}

const PARSERS = [
  {
    // Viofo / Novatek: 2024_0315_143022_000123F.MP4, parking ..._0001PF, event ..._0001EF
    brand: 'Viofo',
    re: /^(\d{4})_(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_(\d+)([PE]?)([FRIT]?)$/i,
    map: (m) => ({
      date: date(m[1], m[2], m[3], m[4], m[5], m[6]),
      seq: m[7],
      type: { P: 'parking', E: 'event' }[m[8].toUpperCase()] || null,
      camera: CAMERA_LETTER[m[9].toUpperCase()] || null,
    }),
  },
  {
    // BlackVue: 20240315_143022_NF.mp4 (N normal, E event, P parking, M manual)
    brand: 'BlackVue',
    re: /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_([NEPMIOATBRXG])([FRI]?)[SL]?$/i,
    map: (m) => ({
      date: date(m[1], m[2], m[3], m[4], m[5], m[6]),
      type: { E: 'event', M: 'event', P: 'parking', I: 'event', O: 'event', A: 'event', T: 'parking', B: 'parking', R: 'event', X: 'parking', G: 'parking' }[m[7].toUpperCase()] || null,
      camera: CAMERA_LETTER[m[8].toUpperCase()] || 'front',
    }),
  },
  {
    // Thinkware: REC_2024_03_15_14_30_22_F.MP4, EVT_..., MOT_..., INF_2024_03_15-14_30_22_F
    brand: 'Thinkware',
    re: /^([A-Z]{3,4})_(\d{4})_(\d{2})_(\d{2})[-_](\d{2})_(\d{2})_(\d{2})_([FRI])$/i,
    map: (m) => ({
      date: date(m[2], m[3], m[4], m[5], m[6], m[7]),
      type: /^(EVT|MAN|SOS)$/i.test(m[1]) ? 'event' : /^(MOT|PARK|TL|PAR)$/i.test(m[1]) ? 'parking' : null,
      camera: CAMERA_LETTER[m[8].toUpperCase()],
    }),
  },
  {
    // 70mai: NO20240315-143022-000123F.mp4, EV..., PA...
    brand: '70mai',
    re: /^(NO|EV|PA|LO|EM)(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})-(\d+)([FRI]?)$/i,
    map: (m) => ({
      date: date(m[2], m[3], m[4], m[5], m[6], m[7]),
      seq: m[8],
      type: /^(EV|LO|EM)$/i.test(m[1]) ? 'event' : /^PA$/i.test(m[1]) ? 'parking' : null,
      camera: CAMERA_LETTER[m[9].toUpperCase()] || 'front',
    }),
  },
  {
    // Nextbase: 240315_143022_001_FH.MP4
    brand: 'Nextbase',
    re: /^(\d{2})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_(\d+)_?([FRI])?[HL]?$/i,
    map: (m) => ({
      date: date(m[1], m[2], m[3], m[4], m[5], m[6]),
      seq: m[7],
      camera: CAMERA_LETTER[(m[8] || 'F').toUpperCase()],
    }),
  },
];

const GENERIC = /(20\d{2})[-_.]?(\d{2})[-_.]?(\d{2})[-_T ]?(\d{2})[-_:.]?(\d{2})[-_:.]?(\d{2})/;

function genericCamera(base) {
  if (/(^|[_\-\s])(front|voor)([_\-\s.]|$)/i.test(base)) return 'front';
  if (/(^|[_\-\s])(rear|back|achter)([_\-\s.]|$)/i.test(base)) return 'rear';
  if (/(^|[_\-\s])(int|inside|interior|cabin|binnen)([_\-\s.]|$)/i.test(base)) return 'interior';
  const m = base.match(/[_\-]([FRI])$/i) || base.match(/\d([FRI])$/i);
  return m ? CAMERA_LETTER[m[1].toUpperCase()] : null;
}

/**
 * @param {string} path relative path inside the opened folder
 * @param {File} file
 */
export function parseClip(path, file) {
  const name = path.split('/').pop();
  const base = name.replace(/\.[^.]+$/, '');
  const isPhoto = IMAGE_EXT.test(name);
  let info = null;
  let brand = null;

  for (const p of PARSERS) {
    const m = base.match(p.re);
    if (m) {
      const r = p.map(m);
      if (r.date) {
        info = r;
        brand = p.brand;
        break;
      }
    }
  }

  if (!info) {
    const m = base.match(GENERIC);
    const d = m && date(m[1], m[2], m[3], m[4], m[5], m[6]);
    info = d ? { date: d, camera: genericCamera(base) } : { date: new Date(file.lastModified), camera: genericCamera(base), dateFromFile: true };
  }

  const pathType = typeFromPath(path);
  let type = isPhoto ? 'photo' : info.type || pathType || 'normal';
  if (pathType === 'event' && !isPhoto) type = 'event';

  return {
    path,
    name,
    file,
    size: file.size,
    date: info.date,
    dateFromFile: !!info.dateFromFile,
    camera: info.camera || 'other',
    type,
    seq: info.seq || null,
    brand,
    isPhoto,
  };
}

const CAMERA_ORDER = ['front', 'rear', 'interior', 'other'];

/**
 * Pairs front / rear / interior files recorded at the same moment into one
 * moment, then groups the moments per day.
 */
export function groupMoments(clips) {
  const sorted = [...clips].sort((a, b) => a.date - b.date || CAMERA_ORDER.indexOf(a.camera) - CAMERA_ORDER.indexOf(b.camera));
  const moments = [];
  const open = [];

  for (const c of sorted) {
    let target = null;
    for (let i = open.length - 1; i >= 0; i--) {
      const m = open[i];
      if (c.date - m.date > 3000) break;
      if (m.isPhoto === c.isPhoto && m.type === c.type && !m.files[c.camera] && (!c.seq || !m.seq || c.seq === m.seq || Math.abs(c.date - m.date) <= 1500)) {
        target = m;
        break;
      }
    }
    if (!target) {
      target = { id: moments.length, date: c.date, type: c.type, isPhoto: c.isPhoto, seq: c.seq, files: {}, size: 0, dateFromFile: c.dateFromFile };
      moments.push(target);
      open.push(target);
      while (open.length > 8) open.shift();
    }
    target.files[c.camera] = c;
    target.size += c.size;
  }

  for (const m of moments) {
    m.cameras = CAMERA_ORDER.filter((k) => m.files[k]);
    m.primary = m.files[m.cameras[0]];
  }
  return moments;
}

export function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
