// Minimal MP4 reader: frame rate of the video track, the GPS track that
// dashcams embed, and the raw samples of the video and audio tracks. GPS
// comes from Novatek-based cameras (Viofo and many others: `gps ` index in
// moov pointing at `freeGPS` blocks), BlackVue (NMEA text in a top-level
// `gps ` box, with altitude and satellites from GGA lines) and GoPro (GPMF
// telemetry track, with altitude and the accelerometer). Only the needed byte
// ranges are read.

const ascii = (u8, a, b) => String.fromCharCode(...u8.subarray(a, b));

async function bytes(file, start, length) {
  return new Uint8Array(await file.slice(start, start + length).arrayBuffer());
}

async function topLevelBoxes(file) {
  const boxes = [];
  let pos = 0;
  while (pos + 8 <= file.size && boxes.length < 200) {
    const h = await bytes(file, pos, 16);
    const dv = new DataView(h.buffer);
    let size = dv.getUint32(0);
    const type = ascii(h, 4, 8);
    let header = 8;
    if (size === 1) {
      size = Number(dv.getBigUint64(8));
      header = 16;
    } else if (size === 0) size = file.size - pos;
    if (size < 8 || !/^[\x20-\x7e]{4}$/.test(type)) break;
    boxes.push({ type, start: pos, size, header });
    pos += size;
  }
  return boxes;
}

function* children(u8, start, end) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  let pos = start;
  while (pos + 8 <= end) {
    let size = dv.getUint32(pos);
    const type = ascii(u8, pos + 4, pos + 8);
    let header = 8;
    if (size === 1) {
      size = Number(dv.getBigUint64(pos + 8));
      header = 16;
    } else if (size === 0) size = end - pos;
    if (size < 8 || pos + size > end) return;
    yield { type, start: pos, end: pos + size, body: pos + header };
    pos += size;
  }
}

const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'udta', 'edts']);

function find(u8, start, end, type, out = []) {
  for (const box of children(u8, start, end)) {
    if (box.type === type) out.push(box);
    if (CONTAINERS.has(box.type)) find(u8, box.body, box.end, type, out);
  }
  return out;
}

/** Every track with its handler type ('vide', 'soun', 'meta' …) and first sample description. */
function tracks(u8, moov) {
  return find(u8, moov.body, moov.end, 'trak').map((trak) => {
    const hdlr = find(u8, trak.body, trak.end, 'hdlr')[0];
    const stsd = find(u8, trak.body, trak.end, 'stsd')[0];
    const entry = stsd ? children(u8, stsd.body + 8, stsd.end).next().value : null;
    return { trak, handler: hdlr ? ascii(u8, hdlr.body + 8, hdlr.body + 12) : '', entry };
  });
}

/**
 * Byte range, timing (in the track's timescale) and key-frame flag of every
 * sample of a track, in decode order.
 */
export function sampleTable(u8, trak) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const box = (type) => find(u8, trak.body, trak.end, type)[0];
  const mdhd = box('mdhd');
  const stsz = box('stsz');
  const stco = box('stco') || box('co64');
  const stsc = box('stsc');
  const stts = box('stts');
  if (!mdhd || !stsz || !stco || !stsc || !stts) return null;
  const timescale = dv.getUint32(mdhd.body + (u8[mdhd.body] === 1 ? 20 : 12));

  const fixed = dv.getUint32(stsz.body + 4);
  const count = dv.getUint32(stsz.body + 8);
  const sizes = Array.from({ length: count }, (_, i) => fixed || dv.getUint32(stsz.body + 12 + i * 4));

  const wide = stco.type === 'co64';
  const chunks = dv.getUint32(stco.body + 4);
  const chunkOffset = (c) => (wide ? Number(dv.getBigUint64(stco.body + 8 + c * 8)) : dv.getUint32(stco.body + 8 + c * 4));

  const samples = [];
  const runs = dv.getUint32(stsc.body + 4);
  for (let r = 0; r < runs; r++) {
    const first = dv.getUint32(stsc.body + 8 + r * 12) - 1;
    const perChunk = dv.getUint32(stsc.body + 12 + r * 12);
    const next = r + 1 < runs ? dv.getUint32(stsc.body + 8 + (r + 1) * 12) - 1 : chunks;
    for (let c = first; c < next && samples.length < count; c++) {
      let offset = chunkOffset(c);
      for (let s = 0; s < perChunk && samples.length < count; s++) {
        const size = sizes[samples.length];
        samples.push({ offset, size, dts: 0, cts: 0, dur: 0, key: true });
        offset += size;
      }
    }
  }

  let i = 0;
  let dts = 0;
  for (let e = 0, n = dv.getUint32(stts.body + 4); e < n; e++) {
    const runCount = dv.getUint32(stts.body + 8 + e * 8);
    const delta = dv.getUint32(stts.body + 12 + e * 8);
    for (let k = 0; k < runCount && i < samples.length; k++, i++) {
      samples[i].dts = samples[i].cts = dts;
      samples[i].dur = delta;
      dts += delta;
    }
  }
  const ctts = box('ctts');
  if (ctts) {
    const signed = u8[ctts.body] === 1;
    i = 0;
    for (let e = 0, n = dv.getUint32(ctts.body + 4); e < n; e++) {
      const runCount = dv.getUint32(ctts.body + 8 + e * 8);
      const off = signed ? dv.getInt32(ctts.body + 12 + e * 8) : dv.getUint32(ctts.body + 12 + e * 8);
      for (let k = 0; k < runCount && i < samples.length; k++, i++) samples[i].cts = samples[i].dts + off;
    }
  }
  const stss = box('stss');
  if (stss) {
    samples.forEach((s) => (s.key = false));
    for (let e = 0, n = dv.getUint32(stss.body + 4); e < n; e++) {
      const s = samples[dv.getUint32(stss.body + 8 + e * 4) - 1];
      if (s) s.key = true;
    }
  }
  return { timescale, samples, duration: dts };
}

function videoTiming(u8, moov) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  for (const { trak, handler } of tracks(u8, moov)) {
    if (handler !== 'vide') continue;
    const mdhd = find(u8, trak.body, trak.end, 'mdhd')[0];
    const stts = find(u8, trak.body, trak.end, 'stts')[0];
    if (!mdhd || !stts) continue;
    const v1 = u8[mdhd.body] === 1;
    const timescale = dv.getUint32(mdhd.body + (v1 ? 20 : 12));
    const duration = v1 ? Number(dv.getBigUint64(mdhd.body + 24)) : dv.getUint32(mdhd.body + 16);
    const entries = dv.getUint32(stts.body + 4);
    let samples = 0;
    for (let i = 0; i < entries; i++) samples += dv.getUint32(stts.body + 8 + i * 8);
    if (!timescale || !duration || !samples) continue;
    return { fps: samples / (duration / timescale), duration: duration / timescale };
  }
  return null;
}

const nmeaToDeg = (v) => {
  const d = Math.floor(v / 100);
  return d + (v - d * 100) / 60;
};

function parseNovatekBlock(u8) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  for (let i = 24; i < u8.length - 20; i++) {
    if (u8[i] !== 0x41) continue; // 'A' = valid fix
    const ns = u8[i + 1];
    const ew = u8[i + 2];
    if ((ns !== 0x4e && ns !== 0x53) || (ew !== 0x45 && ew !== 0x57)) continue;
    let lat = nmeaToDeg(dv.getFloat32(i + 4, true));
    let lon = nmeaToDeg(dv.getFloat32(i + 8, true));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180 || (lat === 0 && lon === 0)) continue;
    if (ns === 0x53) lat = -lat;
    if (ew === 0x57) lon = -lon;
    const [h, mi, s, y, mo, d] = [0, 1, 2, 3, 4, 5].map((k) => dv.getUint32(i - 24 + k * 4, true));
    const time = h < 24 && mi < 60 && s < 61 && mo >= 1 && mo <= 12 ? Date.UTC(y < 100 ? 2000 + y : y, mo - 1, d, h, mi, s) : null;
    return { lat, lon, speed: dv.getFloat32(i + 12, true) * 1.852, bearing: dv.getFloat32(i + 16, true), time };
  }
  return null;
}

async function novatekGps(file, u8, gpsBox) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const len = gpsBox.end - gpsBox.body;
  // Index of (offset, size) pairs, after an 8-byte version/date header on most firmwares.
  const read = (skip) => {
    const list = [];
    for (let p = gpsBox.body + skip; p + 8 <= gpsBox.end; p += 8) {
      const offset = dv.getUint32(p);
      const size = dv.getUint32(p + 4);
      if (offset && size && size < 65536 && offset + size <= file.size) list.push({ offset, size });
    }
    return list;
  };
  let index = read(8);
  if (!index.length && len >= 8) index = read(0);
  if (!index.length) return [];

  const points = [];
  for (let i = 0; i < index.length; i += 32) {
    const batch = await Promise.all(index.slice(i, i + 32).map(({ offset, size }) => bytes(file, offset, size)));
    for (const block of batch) {
      if (ascii(block, 4, 8) !== 'free' && ascii(block, 8, 12) !== 'GPS ') continue;
      const p = parseNovatekBlock(block);
      if (p) points.push(p);
    }
  }
  return withOffsets(points);
}

/** RMC lines give position and speed; GGA lines with the same time add altitude, satellites and HDOP. */
export function parseNmea(text) {
  const points = [];
  const extra = new Map();
  for (const line of text.split(/\r?\n/)) {
    const g = line.match(/\$G[NPL]GGA,(\d{6}(?:\.\d+)?),[^,]*,[NS]?,[^,]*,[EW]?,([1-9]),(\d*),([\d.]*),(-?[\d.]*),M/);
    if (g) {
      extra.set(g[1].slice(0, 6), { sats: g[3] === '' ? undefined : Number(g[3]), hdop: g[4] === '' ? undefined : Number(g[4]), alt: g[5] === '' ? undefined : Number(g[5]) });
      continue;
    }
    const ts = line.match(/^\[(\d+)\]/);
    const m = line.match(/\$G[NP]RMC,(\d{6}(?:\.\d+)?),A,(\d+\.\d+),([NS]),(\d+\.\d+),([EW]),([\d.]*),([\d.]*),(\d{6})/);
    if (!m) continue;
    let lat = nmeaToDeg(parseFloat(m[2]));
    let lon = nmeaToDeg(parseFloat(m[4]));
    if (m[3] === 'S') lat = -lat;
    if (m[5] === 'W') lon = -lon;
    const dd = m[8];
    const tt = m[1];
    const time = ts ? Number(ts[1]) : Date.UTC(2000 + +dd.slice(4, 6), +dd.slice(2, 4) - 1, +dd.slice(0, 2), +tt.slice(0, 2), +tt.slice(2, 4), +tt.slice(4, 6));
    points.push({ lat, lon, speed: (parseFloat(m[6]) || 0) * 1.852, bearing: parseFloat(m[7]) || 0, time, key: tt.slice(0, 6) });
  }
  for (const p of points) {
    const e = extra.get(p.key);
    if (e) for (const [k, v] of Object.entries(e)) if (Number.isFinite(v)) p[k] = v;
    delete p.key;
  }
  return withOffsets(points);
}

// Adds `t`: seconds since the first point, used to follow playback on the map.
function withOffsets(points) {
  const first = points.find((p) => p.time)?.time;
  points.forEach((p, i) => {
    p.t = first && p.time ? (p.time - first) / 1000 : i;
  });
  return points;
}

// ---------- GoPro GPMF telemetry ----------

const GPMF_SIZE = { b: 1, B: 1, c: 1, s: 2, S: 2, l: 4, L: 4, f: 4, d: 8, j: 8, J: 8 };

function gpmfValue(dv, p, type) {
  switch (type) {
    case 'b': return dv.getInt8(p);
    case 'B': return dv.getUint8(p);
    case 's': return dv.getInt16(p);
    case 'S': return dv.getUint16(p);
    case 'l': return dv.getInt32(p);
    case 'L': return dv.getUint32(p);
    case 'f': return dv.getFloat32(p);
    case 'd': return dv.getFloat64(p);
    case 'j': return Number(dv.getBigInt64(p));
    case 'J': return Number(dv.getBigUint64(p));
    default: return NaN;
  }
}

/** Reads one GPMF payload: GPS5 or GPS9 fixes (scaled) with GPSU/GPSF, and ACCL samples in m/s². */
export function parseGpmf(u8) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const out = { gps: [], accl: [] };
  const walk = (start, end) => {
    const ctx = {};
    let p = start;
    while (p + 8 <= end) {
      const key = ascii(u8, p, p + 4);
      const type = String.fromCharCode(u8[p + 4]);
      const structSize = u8[p + 5];
      const repeat = dv.getUint16(p + 6);
      const body = p + 8;
      const size = structSize * repeat;
      const next = body + Math.ceil(size / 4) * 4;
      if (next > end || !/^[\x20-\x7e]{4}$/.test(key)) break;
      // Each element is either a number type, or a struct described by TYPE ('?').
      const types = type === '?' ? ctx.type || '' : type.repeat(structSize / (GPMF_SIZE[type] || structSize));
      const rows = () => {
        const list = [];
        for (let r = 0; r < repeat; r++) {
          let q = body + r * structSize;
          const row = [];
          for (const t of types) {
            row.push(gpmfValue(dv, q, t));
            q += GPMF_SIZE[t] || 1;
          }
          list.push(row);
        }
        return list;
      };
      if (type === '\0') walk(body, body + size);
      else if (key === 'SCAL') ctx.scal = rows().flat();
      else if (key === 'TYPE') ctx.type = ascii(u8, body, body + size).replace(/\0+$/, '');
      else if (key === 'GPSF') ctx.fix = rows()[0][0];
      else if (key === 'GPSP') ctx.dop = rows()[0][0] / 100;
      else if (key === 'GPSU') ctx.utc = gpsu(ascii(u8, body, body + size));
      else if (key === 'GPS5' || key === 'GPS9') {
        const scale = (row) => row.map((v, i) => v / ((ctx.scal?.length > 1 ? ctx.scal[i] : ctx.scal?.[0]) || 1));
        const list = rows().map(scale);
        if (ctx.fix === undefined || ctx.fix >= 2) {
          for (const [lat, lon, alt, speed, , days, secs, dop, fix] of list) {
            if (key === 'GPS9' && fix < 2) continue;
            const time = key === 'GPS9' ? Date.UTC(2000, 0, 1) + days * 86400000 + secs * 1000 : null;
            out.gps.push({ lat, lon, alt, speed: speed * 3.6, time, hdop: key === 'GPS9' ? dop : ctx.dop });
          }
          if (key === 'GPS5') out.utc = ctx.utc;
        }
      } else if (key === 'ACCL') {
        const s = ctx.scal?.[0] || 1;
        for (const row of rows()) out.accl.push(row.map((v) => v / s));
      }
      p = next;
    }
  };
  walk(0, u8.length);
  return out;
}

function gpsu(s) {
  const m = s.match(/^(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d(?:\.\d+)?)/);
  return m ? Date.UTC(2000 + +m[1], +m[2] - 1, +m[3], +m[4], +m[5]) + Number(m[6]) * 1000 : null;
}

const toRad = (d) => (d * Math.PI) / 180;

function bearing(a, b) {
  const y = Math.sin(toRad(b.lon - a.lon)) * Math.cos(toRad(b.lat));
  const x = Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) - Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lon - a.lon));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

async function goproTelemetry(file, u8, trak) {
  const table = sampleTable(u8, trak);
  if (!table) return { gps: [], accel: [] };
  const gps = [];
  const accel = [];
  for (let i = 0; i < table.samples.length; i += 16) {
    const batch = table.samples.slice(i, i + 16);
    const payloads = await Promise.all(batch.map((s) => bytes(file, s.offset, s.size)));
    payloads.forEach((data, k) => {
      const s = batch[k];
      const start = s.dts / table.timescale;
      const dur = s.dur / table.timescale || 1;
      const { gps: fixes, accl, utc } = parseGpmf(data);
      // About five positions a second is plenty for the map and the graphs.
      const step = Math.max(1, Math.round(fixes.length / (dur * 5)));
      fixes.forEach((f, j) => {
        if (j % step) return;
        const frac = j / fixes.length;
        gps.push({ ...f, t: start + frac * dur, time: f.time ?? (utc ? utc + frac * dur * 1000 : null) });
      });
      // The accelerometer runs at about 200 Hz; keep the strongest reading of every 50 ms.
      const per = Math.max(1, Math.round(accl.length / (dur * 20)));
      for (let j = 0; j < accl.length; j += per) {
        let g = 0;
        for (const [x, y, z] of accl.slice(j, j + per)) g = Math.max(g, Math.hypot(x, y, z) / 9.80665);
        accel.push({ t: start + (j / accl.length) * dur, g });
      }
    });
  }
  gps.forEach((p, i) => (p.bearing = bearing(gps[Math.max(0, i - 1)], gps[Math.min(gps.length - 1, i + 1)])));
  return { gps, accel };
}

// ---------- audio and video tracks ----------

const AAC_RATES = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];

/** AudioSpecificConfig: object type, sample rate index and channel layout. */
export function parseAsc(asc) {
  let bit = 0;
  const read = (n) => {
    let v = 0;
    for (let i = 0; i < n; i++, bit++) v = (v << 1) | ((asc[bit >> 3] >> (7 - (bit & 7))) & 1);
    return v;
  };
  let aot = read(5);
  if (aot === 31) aot = 32 + read(6);
  const rateIndex = read(4);
  const rate = rateIndex === 15 ? read(24) : AAC_RATES[rateIndex];
  return { aot, rateIndex, rate, channels: read(4) };
}

/** A 7-byte ADTS header, so raw AAC frames can be decoded by decodeAudioData. */
export function adtsHeader(cfg, payloadLength) {
  const len = payloadLength + 7;
  return Uint8Array.of(
    0xff,
    0xf1,
    (((cfg.aot - 1) & 3) << 6) | ((cfg.rateIndex & 15) << 2) | ((cfg.channels >> 2) & 1),
    ((cfg.channels & 3) << 6) | ((len >> 11) & 3),
    (len >> 3) & 0xff,
    ((len & 7) << 5) | 0x1f,
    0xfc,
  );
}

function esdsConfig(u8, start, end) {
  let p = start + 4;
  const length = () => {
    let n = 0;
    let b;
    do {
      b = u8[p++];
      n = (n << 7) | (b & 0x7f);
    } while (b & 0x80 && p < end);
    return n;
  };
  while (p < end) {
    const tag = u8[p++];
    const size = length();
    if (tag === 3) {
      p += 2;
      const flags = u8[p++];
      if (flags & 0x80) p += 2;
      if (flags & 0x40) p += 1 + u8[p];
      if (flags & 0x20) p += 2;
    } else if (tag === 4) p += 13;
    else if (tag === 5) return u8.slice(p, p + size);
    else p += size;
  }
  return null;
}

function describeVideo(u8, entry) {
  if (!entry || !/^(avc1|avc3|hvc1|hev1)$/.test(entry.type)) return null;
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const want = entry.type.startsWith('avc') ? 'avcC' : 'hvcC';
  const box = [...children(u8, entry.body + 78, entry.end)].find((b) => b.type === want);
  if (!box) return null;
  return {
    codec: want === 'avcC' ? 'avc' : 'hevc',
    config: u8.slice(box.body, box.end),
    width: dv.getUint16(entry.body + 24),
    height: dv.getUint16(entry.body + 26),
  };
}

function describeAudio(u8, entry) {
  if (!entry || entry.type !== 'mp4a') return null;
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const version = dv.getUint16(entry.body + 8);
  const childStart = entry.body + 28 + (version === 1 ? 16 : version === 2 ? 36 : 0);
  const esds = [...children(u8, childStart, entry.end)].find((b) => b.type === 'esds');
  const config = esds && esdsConfig(u8, esds.body, esds.end);
  if (!config) return null;
  const asc = parseAsc(config);
  // ADTS (used to decode for loud-moment detection) only carries AAC Main/LC/SSR/LTP with a standard rate.
  return { codec: 'aac', config, ...asc, adts: asc.aot >= 1 && asc.aot <= 4 && asc.rateIndex < 13 };
}

async function readMoov(file) {
  if (!/\.(mp4|mov)$/i.test(file.name)) return null;
  const boxes = await topLevelBoxes(file);
  const moovBox = boxes.find((b) => b.type === 'moov');
  if (!moovBox || moovBox.size >= 64 * 1024 * 1024) return { boxes, u8: null, moov: null };
  const u8 = await bytes(file, moovBox.start, moovBox.size);
  return { boxes, u8, moov: { body: moovBox.header, end: moovBox.size } };
}

/**
 * The video and audio tracks of a file, with every sample's byte range and
 * timing, for joining clips without re-encoding and for reading the sound.
 */
export async function readTracks(file) {
  const m = await readMoov(file);
  if (!m?.u8) return null;
  const result = { video: null, audio: null };
  for (const { trak, handler, entry } of tracks(m.u8, m.moov)) {
    if (handler === 'vide' && !result.video) {
      const desc = describeVideo(m.u8, entry);
      const table = desc && sampleTable(m.u8, trak);
      if (table) result.video = { ...desc, ...table };
    } else if (handler === 'soun' && !result.audio) {
      const desc = describeAudio(m.u8, entry);
      const table = desc && sampleTable(m.u8, trak);
      if (table) result.audio = { ...desc, ...table };
    }
  }
  return result;
}

/** Clip length in seconds from the movie header, reading only a few kilobytes. */
export async function readDuration(file) {
  if (!/\.(mp4|mov)$/i.test(file.name)) return null;
  const moov = (await topLevelBoxes(file)).find((b) => b.type === 'moov');
  if (!moov) return null;
  const u8 = await bytes(file, moov.start + moov.header, Math.min(4096, moov.size - moov.header));
  const mvhd = children(u8, 0, u8.length).next().value;
  if (!mvhd || mvhd.type !== 'mvhd') return null;
  const dv = new DataView(u8.buffer);
  const v1 = u8[mvhd.body] === 1;
  const scale = dv.getUint32(mvhd.body + (v1 ? 20 : 12));
  const dur = v1 ? Number(dv.getBigUint64(mvhd.body + 24)) : dv.getUint32(mvhd.body + 16);
  return scale ? dur / scale : null;
}

const infoCache = new WeakMap();

/** @returns {Promise<{fps:number|null, duration:number|null, gps:Array, accel:Array}>} */
export function readInfo(file) {
  if (!infoCache.has(file)) infoCache.set(file, readInfoUncached(file).catch(() => ({ fps: null, duration: null, gps: [], accel: [] })));
  return infoCache.get(file);
}

async function readInfoUncached(file) {
  const result = { fps: null, duration: null, gps: [], accel: [] };
  const m = await readMoov(file);
  if (!m) return result;

  if (m.u8) {
    Object.assign(result, videoTiming(m.u8, m.moov) || {});
    const gopro = tracks(m.u8, m.moov).find((tr) => tr.handler === 'meta' && tr.entry?.type === 'gpmd');
    if (gopro) Object.assign(result, await goproTelemetry(file, m.u8, gopro.trak));
    const gps = !result.gps.length && find(m.u8, m.moov.body, m.moov.end, 'gps ')[0];
    if (gps) result.gps = await novatekGps(file, m.u8, gps);
  }

  if (!result.gps.length) {
    const top = m.boxes.find((b) => b.type === 'gps ');
    if (top && top.size < 8 * 1024 * 1024) {
      const u8 = await bytes(file, top.start + top.header, top.size - top.header);
      result.gps = parseNmea(new TextDecoder('latin1').decode(u8));
    }
  }
  return result;
}
