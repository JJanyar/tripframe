// npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNmea, parseGpmf, parseAsc, adtsHeader, sampleTable } from './mp4.js';

const enc = (s) => [...s].map((c) => c.charCodeAt(0));
const u32 = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const u16 = (n) => [(n >> 8) & 255, n & 255];
const box = (type, ...parts) => {
  const body = parts.flat();
  return [...u32(body.length + 8), ...enc(type), ...body];
};

test('nmea: RMC position with altitude, satellites and HDOP from GGA', () => {
  const text = [
    '[1710513022000]$GPRMC,143022.00,A,5222.2129,N,00453.7101,E,27.0,90.5,150324,,,A*00',
    '[1710513022000]$GPGGA,143022.00,5222.2129,N,00453.7101,E,1,09,0.9,12.4,M,46.0,M,,*00',
    '[1710513023000]$GPRMC,143023.00,A,5222.2200,N,00453.7300,E,27.5,91.0,150324,,,A*00',
  ].join('\n');
  const [a, b] = parseNmea(text);
  assert.ok(Math.abs(a.lat - 52.370215) < 1e-5);
  assert.ok(Math.abs(a.speed - 27 * 1.852) < 1e-9);
  assert.equal(a.alt, 12.4);
  assert.equal(a.sats, 9);
  assert.equal(a.hdop, 0.9);
  assert.equal(a.time, 1710513022000);
  assert.equal(b.alt, undefined);
  assert.equal(b.t, 1);
});

// One DEVC with a GPS5 stream and an ACCL stream, laid out as a GoPro camera writes them.
function klv(key, type, structSize, repeat, data) {
  const pad = (4 - (data.length % 4)) % 4;
  return [...enc(key), type === 0 ? 0 : type.charCodeAt(0), structSize, ...u16(repeat), ...data, ...Array(pad).fill(0)];
}
const i32 = (n) => u32(n >>> 0);
const i16 = (n) => u16(n & 0xffff);

test('gpmf: GPS5 fixes are scaled, ACCL is in m/s²', () => {
  const gpsBody = [
    ...klv('GPSF', 'L', 4, 1, u32(3)),
    ...klv('GPSU', 'U', 16, 1, enc('240315143022.500')),
    ...klv('GPSP', 'S', 2, 1, u16(150)),
    ...klv('SCAL', 'l', 4, 5, [...i32(10000000), ...i32(10000000), ...i32(1000), ...i32(1000), ...i32(100)]),
    ...klv('GPS5', 'l', 20, 2, [
      ...i32(523702157), ...i32(48951679), ...i32(12400), ...i32(13889), ...i32(1400),
      ...i32(523702200), ...i32(48951800), ...i32(12500), ...i32(14000), ...i32(1410),
    ]),
  ];
  const strm1 = [...enc('STRM'), 0, 1, ...u16(gpsBody.length), ...gpsBody];
  const acclBody = [...klv('SCAL', 's', 2, 1, i16(418)), ...klv('ACCL', 's', 6, 2, [...i16(0), ...i16(0), ...i16(4100), ...i16(-4100), ...i16(0), ...i16(0)])];
  const strm2 = [...enc('STRM'), 0, 1, ...u16(acclBody.length), ...acclBody];
  const devcBody = [...strm1, ...strm2];
  const devc = [...enc('DEVC'), 0, 1, ...u16(devcBody.length), ...devcBody];

  const r = parseGpmf(new Uint8Array(devc));
  assert.equal(r.gps.length, 2);
  assert.ok(Math.abs(r.gps[0].lat - 52.3702157) < 1e-9);
  assert.ok(Math.abs(r.gps[0].lon - 4.8951679) < 1e-9);
  assert.equal(r.gps[0].alt, 12.4);
  assert.ok(Math.abs(r.gps[0].speed - 13.889 * 3.6) < 1e-9);
  assert.equal(r.gps[0].hdop, 1.5);
  assert.equal(r.utc, Date.UTC(2024, 2, 15, 14, 30, 22, 500));
  assert.equal(r.accl.length, 2);
  assert.ok(Math.abs(r.accl[0][2] - 4100 / 418) < 1e-9);
  assert.ok(Math.abs(r.accl[1][0] + 4100 / 418) < 1e-9);
});

test('gpmf: payload without a GPS fix gives no positions', () => {
  const body = [...klv('GPSF', 'L', 4, 1, u32(0)), ...klv('SCAL', 'l', 4, 1, i32(1)), ...klv('GPS5', 'l', 20, 1, Array(20).fill(0))];
  const strm = [...enc('STRM'), 0, 1, ...u16(body.length), ...body];
  assert.equal(parseGpmf(new Uint8Array(strm)).gps.length, 0);
});

test('aac: AudioSpecificConfig and ADTS header', () => {
  // AAC-LC, 48 kHz, stereo: 00010 0011 0010 000 = 0x11 0x90
  const cfg = parseAsc(Uint8Array.of(0x11, 0x90));
  assert.deepEqual(cfg, { aot: 2, rateIndex: 3, rate: 48000, channels: 2 });
  const h = adtsHeader(cfg, 100);
  assert.deepEqual([...h], [0xff, 0xf1, 0x4c, 0x80, 0x0d, 0x7f, 0xfc]);
  const len = ((h[3] & 3) << 11) | (h[4] << 3) | (h[5] >> 5);
  assert.equal(len, 107);
});

test('sample table: offsets from stsc/stco, timing from stts/ctts, key frames from stss', () => {
  const fb = (type, ...parts) => box(type, [0, 0, 0, 0], ...parts);
  const trak = box(
    'trak',
    box(
      'mdia',
      fb('mdhd', u32(0), u32(0), u32(90000), u32(9000), u32(0)),
      box(
        'minf',
        box(
          'stbl',
          fb('stsz', u32(0), u32(5), u32(10), u32(20), u32(30), u32(40), u32(50)),
          fb('stsc', u32(2), u32(1), u32(3), u32(1), u32(2), u32(2), u32(1)),
          fb('stco', u32(2), u32(1000), u32(5000)),
          fb('stts', u32(1), u32(5), u32(3000)),
          fb('ctts', u32(1), u32(5), u32(3000)),
          fb('stss', u32(2), u32(1), u32(4)),
        ),
      ),
    ),
  );
  const u8 = new Uint8Array(trak);
  const t = sampleTable(u8, { body: 8, end: u8.length });
  assert.equal(t.timescale, 90000);
  assert.deepEqual(t.samples.map((s) => s.offset), [1000, 1010, 1030, 5000, 5040]);
  assert.deepEqual(t.samples.map((s) => s.dts), [0, 3000, 6000, 9000, 12000]);
  assert.deepEqual(t.samples.map((s) => s.cts), [3000, 6000, 9000, 12000, 15000]);
  assert.deepEqual(t.samples.map((s) => s.key), [true, false, false, true, false]);
  assert.equal(t.duration, 15000);
});
