// The GPS track of a clip as GPX, KML, CSV or GeoJSON, for mapping tools and
// evidence, plus distance along the route. Points come from mp4.js:
// { lat, lon, speed (km/h), bearing, time (UTC ms or null), alt?, sats?, hdop? }.

const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const iso = (ms) => new Date(ms).toISOString();
const fixed = (n, d) => Number(n).toFixed(d);
const has = (v) => v != null && Number.isFinite(v);

/** Route as a track, with markers (geotags) as waypoints. */
export function toGpx(points, name, waypoints = []) {
  const pts = points
    .map((p) => `      <trkpt lat="${fixed(p.lat, 7)}" lon="${fixed(p.lon, 7)}">${has(p.alt) ? `<ele>${fixed(p.alt, 1)}</ele>` : ''}${p.time ? `<time>${iso(p.time)}</time>` : ''}</trkpt>`)
    .join('\n');
  const wpts = waypoints.map(
    (w) => `  <wpt lat="${fixed(w.lat, 7)}" lon="${fixed(w.lon, 7)}">${w.time ? `<time>${iso(w.time)}</time>` : ''}<name>${xml(w.name || '')}</name>${w.address ? `<desc>${xml(w.address)}</desc>` : ''}</wpt>\n`,
  );
  const trk = points.length
    ? `  <trk>
    <name>${xml(name)}</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Tripframe" xmlns="http://www.topografix.com/GPX/1/1">
${wpts.join('')}${trk}</gpx>
`;
}

/** Waypoints from a GPX file: lat, lon, name, time and description. */
export function waypointsFromGpx(text) {
  const out = [];
  for (const m of text.matchAll(/<wpt\b([^>]*)>([\s\S]*?)<\/wpt>|<wpt\b([^>]*)\/>/g)) {
    const attrs = m[1] ?? m[3];
    const inner = m[2] ?? '';
    const lat = Number(attrs.match(/\blat="([^"]+)"/)?.[1]);
    const lon = Number(attrs.match(/\blon="([^"]+)"/)?.[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const tag = (name) => {
      const v = inner.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1];
      return v == null ? '' : v.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    };
    const time = Date.parse(tag('time'));
    out.push({ lat, lon, name: tag('name'), address: tag('desc'), time: Number.isFinite(time) ? time : null });
  }
  return out;
}

export function toKml(points, name) {
  const coords = points.map((p) => `${fixed(p.lon, 7)},${fixed(p.lat, 7)},${has(p.alt) ? fixed(p.alt, 1) : 0}`).join(' ');
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
  const cell = (v, d) => (has(v) ? fixed(v, d) : '');
  const rows = points.map((p) => [p.time ? iso(p.time) : '', fixed(p.lat, 7), fixed(p.lon, 7), fixed(p.speed, 1), fixed(p.bearing, 1), cell(p.alt, 1), cell(p.sats, 0), cell(p.hdop, 1)].join(','));
  return `time_utc,latitude,longitude,speed_kmh,bearing_deg,altitude_m,satellites,hdop\n${rows.join('\n')}\n`;
}

export function toGeoJson(points, name) {
  const feature = {
    type: 'Feature',
    properties: { name, times: points.map((p) => (p.time ? iso(p.time) : null)), speeds_kmh: points.map((p) => Math.round(p.speed * 10) / 10) },
    geometry: { type: 'LineString', coordinates: points.map((p) => (has(p.alt) ? [p.lon, p.lat, p.alt] : [p.lon, p.lat])) },
  };
  return `${JSON.stringify({ type: 'FeatureCollection', features: [feature] }, null, 2)}\n`;
}

export const ROUTE_FORMATS = {
  gpx: { make: (points, name) => toGpx(points, name), type: 'application/gpx+xml' },
  kml: { make: toKml, type: 'application/vnd.google-earth.kml+xml' },
  csv: { make: (points) => toCsv(points), type: 'text/csv' },
  geojson: { make: toGeoJson, type: 'application/geo+json' },
};

const toRad = (d) => (d * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export function km(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Kilometres driven from the first point to each point. */
export function cumulativeKm(points) {
  let total = 0;
  return points.map((p, i) => (i ? (total += km(points[i - 1], p)) : 0));
}

/** Road gradient in percent, from altitude change over at least 30 m of road. */
export function gradients(points, dist) {
  return points.map((p, i) => {
    let a = i;
    let b = i;
    while (a > 0 && (dist[i] - dist[a]) * 1000 < 15) a--;
    while (b < points.length - 1 && (dist[b] - dist[i]) * 1000 < 15) b++;
    const run = (dist[b] - dist[a]) * 1000;
    return has(points[a].alt) && has(points[b].alt) && run >= 30 ? ((points[b].alt - points[a].alt) / run) * 100 : null;
  });
}
