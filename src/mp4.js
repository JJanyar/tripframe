// Minimal MP4 reader: frame rate of the video track, and the GPS track that
// dashcams embed. Supports Novatek-based cameras (Viofo and many others:
// `gps ` index in moov pointing at `freeGPS` blocks) and BlackVue (NMEA text
// in a top-level `gps ` box). Only the needed byte ranges are read.

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

function videoTiming(u8, moov) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  for (const trak of find(u8, moov.body, moov.end, 'trak')) {
    const hdlr = find(u8, trak.body, trak.end, 'hdlr')[0];
    if (!hdlr || ascii(u8, hdlr.body + 8, hdlr.body + 12) !== 'vide') continue;
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

function parseNmea(text) {
  const points = [];
  for (const line of text.split(/\r?\n/)) {
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
    points.push({ lat, lon, speed: (parseFloat(m[6]) || 0) * 1.852, bearing: parseFloat(m[7]) || 0, time });
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

const infoCache = new WeakMap();

/** @returns {Promise<{fps:number|null, duration:number|null, gps:Array}>} */
export function readInfo(file) {
  if (!infoCache.has(file)) infoCache.set(file, readInfoUncached(file).catch(() => ({ fps: null, duration: null, gps: [] })));
  return infoCache.get(file);
}

async function readInfoUncached(file) {
  const result = { fps: null, duration: null, gps: [] };
  if (!/\.(mp4|mov)$/i.test(file.name)) return result;
  const boxes = await topLevelBoxes(file);

  const moovBox = boxes.find((b) => b.type === 'moov');
  if (moovBox && moovBox.size < 64 * 1024 * 1024) {
    const u8 = await bytes(file, moovBox.start, moovBox.size);
    const moov = { body: moovBox.header, end: moovBox.size };
    Object.assign(result, videoTiming(u8, moov) || {});
    const gps = find(u8, moov.body, moov.end, 'gps ')[0];
    if (gps) result.gps = await novatekGps(file, u8, gps);
  }

  if (!result.gps.length) {
    const top = boxes.find((b) => b.type === 'gps ');
    if (top && top.size < 8 * 1024 * 1024) {
      const u8 = await bytes(file, top.start + top.header, top.size - top.header);
      result.gps = parseNmea(new TextDecoder('latin1').decode(u8));
    }
  }
  return result;
}
