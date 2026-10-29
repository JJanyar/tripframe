// npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { toGpx, toKml, toCsv, toGeoJson, waypointsFromGpx, cumulativeKm, gradients, km } from './route.js';
import { encodeBmp } from './stills.js';
import { weatherKind, weatherUrl } from './online.js';
import { loudMoments } from './audio.js';
import { nearestIndex } from './geotags.js';

const pts = [
  { lat: 52.3702157, lon: 4.8951679, speed: 48.2, bearing: 90, time: Date.UTC(2024, 2, 15, 13, 30, 22), alt: 12.4, sats: 9, hdop: 0.9 },
  { lat: -33.8688, lon: -151.2093, speed: 0, bearing: 0, time: null },
];

test('gpx has a track point per fix, with height and time when known', () => {
  const g = toGpx(pts, 'A & B');
  assert.equal(g.match(/<trkpt /g).length, 2);
  assert.match(g, /<trkpt lat="52.3702157" lon="4.8951679"><ele>12.4<\/ele><time>2024-03-15T13:30:22.000Z<\/time><\/trkpt>/);
  assert.match(g, /<trkpt lat="-33.8688000" lon="-151.2093000"><\/trkpt>/);
  assert.match(g, /<name>A &amp; B<\/name>/);
});

test('gpx markers survive a round trip', () => {
  const tags = [{ lat: 52.1, lon: 4.2, name: 'Bump <here> & there', address: 'Damrak 1, Amsterdam', time: Date.UTC(2024, 2, 15, 13, 31) }];
  const back = waypointsFromGpx(toGpx([], 'x', tags));
  assert.deepEqual(back, [{ lat: 52.1, lon: 4.2, name: 'Bump <here> & there', address: 'Damrak 1, Amsterdam', time: tags[0].time }]);
  assert.deepEqual(waypointsFromGpx('<gpx><wpt lat="1.5" lon="2.5"/></gpx>'), [{ lat: 1.5, lon: 2.5, name: '', address: '', time: null }]);
});

test('kml lists coordinates as lon,lat,height', () => {
  assert.match(toKml(pts, 'x'), /<coordinates>4.8951679,52.3702157,12.4 -151.2093000,-33.8688000,0<\/coordinates>/);
});

test('csv has a header and one row per fix', () => {
  const lines = toCsv(pts).trim().split('\n');
  assert.equal(lines[0], 'time_utc,latitude,longitude,speed_kmh,bearing_deg,altitude_m,satellites,hdop');
  assert.equal(lines[1], '2024-03-15T13:30:22.000Z,52.3702157,4.8951679,48.2,90.0,12.4,9,0.9');
  assert.equal(lines[2], ',-33.8688000,-151.2093000,0.0,0.0,,,');
});

test('geojson is one line string in lon,lat order', () => {
  const g = JSON.parse(toGeoJson(pts, 'trip'));
  assert.equal(g.type, 'FeatureCollection');
  assert.deepEqual(g.features[0].geometry.coordinates, [[4.8951679, 52.3702157, 12.4], [-151.2093, -33.8688]]);
  assert.deepEqual(g.features[0].properties.times, ['2024-03-15T13:30:22.000Z', null]);
});

test('distance and gradient', () => {
  // One degree of latitude is about 111.2 km.
  assert.ok(Math.abs(km({ lat: 0, lon: 0 }, { lat: 1, lon: 0 }) - 111.19) < 0.05);
  const road = Array.from({ length: 11 }, (_, i) => ({ lat: i * 0.0001, lon: 0, alt: i * 0.5 }));
  const dist = cumulativeKm(road);
  assert.ok(Math.abs(dist[10] - 0.1112) < 0.001);
  const g = gradients(road, dist);
  // 0.5 m up per 11.1 m of road is 4.5 %.
  assert.ok(Math.abs(g[5] - 4.5) < 0.1);
});

test('bmp: 24-bit bottom-up rows padded to 4 bytes', () => {
  // 2 x 2: red, green / blue, white
  const rgba = Uint8Array.of(255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255);
  const b = encodeBmp(2, 2, rgba);
  const dv = new DataView(b.buffer);
  assert.equal(String.fromCharCode(b[0], b[1]), 'BM');
  assert.equal(dv.getUint32(2, true), 54 + 8 * 2);
  assert.equal(dv.getInt32(18, true), 2);
  assert.equal(dv.getUint16(28, true), 24);
  // First stored row is the bottom one: blue then white, as BGR.
  assert.deepEqual([...b.subarray(54, 60)], [255, 0, 0, 255, 255, 255]);
  assert.deepEqual([...b.subarray(62, 68)], [0, 0, 255, 0, 255, 0]);
});

test('weather codes and service choice', () => {
  assert.equal(weatherKind(0), 'clear');
  assert.equal(weatherKind(63), 'rain');
  assert.equal(weatherKind(81), 'showers');
  assert.equal(weatherKind(75), 'snow');
  assert.equal(weatherKind(96), 'storm');
  const now = Date.UTC(2026, 9, 29);
  assert.match(weatherUrl(52.37021, 4.89517, Date.UTC(2026, 0, 2, 9), now), /^https:\/\/archive-api\.open-meteo\.com\/v1\/archive\?latitude=52\.370&longitude=4\.895&start_date=2026-01-02&end_date=2026-01-02/);
  assert.match(weatherUrl(52.37, 4.89, Date.UTC(2026, 9, 27, 9), now), /^https:\/\/api\.open-meteo\.com\/v1\/forecast\?/);
});

test('loud moments: a bang after quiet driving noise', () => {
  const rate = 8000;
  const s = new Float32Array(rate * 10);
  for (let i = 0; i < s.length; i++) s[i] = Math.sin(i * 0.3) * 0.02;
  for (let i = rate * 6; i < rate * 6.2; i++) s[i] = Math.sin(i * 0.9) * 0.8;
  const found = loudMoments(s, rate);
  assert.equal(found.length, 1);
  assert.ok(Math.abs(found[0].t - 6) < 0.1);
  assert.equal(loudMoments(new Float32Array(rate * 5).fill(0), rate).length, 0);
});

test('nearest route point to a marker', () => {
  const road = [{ lat: 0, lon: 0 }, { lat: 0, lon: 0.001 }, { lat: 0, lon: 0.002 }];
  assert.equal(nearestIndex(road, 0.0001, 0.0019), 2);
});
