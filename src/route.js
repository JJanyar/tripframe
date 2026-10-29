// The GPS track of a clip as GPX, KML or CSV, for mapping tools and evidence.
// Points come from mp4.js: { lat, lon, speed (km/h), bearing, time (UTC ms or null) }.

const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const iso = (ms) => new Date(ms).toISOString();
const fixed = (n, d) => Number(n).toFixed(d);

export function toGpx(points, name) {
  const pts = points
    .map((p) => `      <trkpt lat="${fixed(p.lat, 7)}" lon="${fixed(p.lon, 7)}">${p.time ? `<time>${iso(p.time)}</time>` : ''}</trkpt>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Tripframe" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${xml(name)}</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
</gpx>
`;
}

export function toKml(points, name) {
  const coords = points.map((p) => `${fixed(p.lon, 7)},${fixed(p.lat, 7)},0`).join(' ');
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${xml(name)}</name>
    <Placemark>
      <name>${xml(name)}</name>
      <Style><LineStyle><color>ff1ac2ff</color><width>4</width></LineStyle></Style>
      <LineString><tessellate>1</tessellate><coordinates>${coords}</coordinates></LineString>
    </Placemark>
  </Document>
</kml>
`;
}

export function toCsv(points) {
  const rows = points.map((p) => [p.time ? iso(p.time) : '', fixed(p.lat, 7), fixed(p.lon, 7), fixed(p.speed, 1), fixed(p.bearing, 1)].join(','));
  return `time_utc,latitude,longitude,speed_kmh,bearing_deg\n${rows.join('\n')}\n`;
}

export const ROUTE_FORMATS = {
  gpx: { make: toGpx, type: 'application/gpx+xml' },
  kml: { make: toKml, type: 'application/vnd.google-earth.kml+xml' },
  csv: { make: (points) => toCsv(points), type: 'text/csv' },
};
