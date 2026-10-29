// npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { toGpx, toKml, toCsv } from './route.js';

const pts = [
  { lat: 52.3702157, lon: 4.8951679, speed: 48.2, bearing: 90, time: Date.UTC(2024, 2, 15, 13, 30, 22) },
  { lat: -33.8688, lon: -151.2093, speed: 0, bearing: 0, time: null },
];

test('gpx has a track point per fix, with time when known', () => {
  const g = toGpx(pts, 'A & B');
  assert.equal(g.match(/<trkpt /g).length, 2);
  assert.match(g, /<trkpt lat="52.3702157" lon="4.8951679"><time>2024-03-15T13:30:22.000Z<\/time><\/trkpt>/);
  assert.match(g, /<trkpt lat="-33.8688000" lon="-151.2093000"><\/trkpt>/);
  assert.match(g, /<name>A &amp; B<\/name>/);
});

test('kml lists coordinates as lon,lat', () => {
  assert.match(toKml(pts, 'x'), /<coordinates>4.8951679,52.3702157,0 -151.2093000,-33.8688000,0<\/coordinates>/);
});

test('csv has a header and one row per fix', () => {
  const lines = toCsv(pts).trim().split('\n');
  assert.equal(lines[0], 'time_utc,latitude,longitude,speed_kmh,bearing_deg');
  assert.equal(lines[1], '2024-03-15T13:30:22.000Z,52.3702157,4.8951679,48.2,90.0');
  assert.equal(lines[2], ',-33.8688000,-151.2093000,0.0,0.0');
});
