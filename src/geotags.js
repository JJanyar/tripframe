// Markers on the route of a clip, kept in this browser per clip.

const key = (moment) => `geotags:${moment.primary.path}|${moment.primary.size}`;

export function loadTags(moment) {
  try {
    return JSON.parse(localStorage.getItem(key(moment)) || '[]');
  } catch {
    return [];
  }
}

export function saveTags(moment, list) {
  if (list.length) localStorage.setItem(key(moment), JSON.stringify(list));
  else localStorage.removeItem(key(moment));
}

/** The point of the route closest to a position, for markers imported from a file. */
export function nearestIndex(points, lat, lon) {
  let best = 0;
  let bestD = Infinity;
  points.forEach((p, i) => {
    const d = (p.lat - lat) ** 2 + ((p.lon - lon) * Math.cos((lat * Math.PI) / 180)) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}
