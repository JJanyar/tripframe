// Optional online lookups: the weather at the time and place of a drive
// (Open-Meteo) and the street address of a marker (OpenStreetMap Nominatim).
// Off unless the reader turns them on, because they send a location out.

export const onlineOn = () => localStorage.getItem('online') === '1';
export const setOnline = (on) => localStorage.setItem('online', on ? '1' : '0');

/** WMO weather code to the label key used in the interface. */
export function weatherKind(code) {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return code >= 80 ? 'showers' : 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95 && code <= 99) return 'storm';
  return 'unknown';
}

// The archive covers everything up to about five days ago; the forecast service the days after that.
export function weatherUrl(lat, lon, ms, now = Date.now()) {
  const day = new Date(ms).toISOString().slice(0, 10);
  const base = now - ms > 6 * 86400000 ? 'https://archive-api.open-meteo.com/v1/archive' : 'https://api.open-meteo.com/v1/forecast';
  return `${base}?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&start_date=${day}&end_date=${day}&hourly=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=GMT`;
}

export async function fetchWeather(lat, lon, ms) {
  const r = await fetch(weatherUrl(lat, lon, ms));
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const { hourly } = await r.json();
  const hour = `T${String(new Date(ms).getUTCHours()).padStart(2, '0')}:00`;
  const i = hourly?.time?.findIndex((s) => s.endsWith(hour)) ?? -1;
  if (i < 0 || hourly.temperature_2m[i] == null) throw new Error('no data');
  return { temp: hourly.temperature_2m[i], precip: hourly.precipitation[i], code: hourly.weather_code[i], wind: hourly.wind_speed_10m[i] };
}

export async function fetchAddress(lat, lon, lang) {
  const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat.toFixed(5)}&lon=${lon.toFixed(5)}&zoom=18&addressdetails=1&accept-language=${lang}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  const a = j.address || {};
  const street = [a.road, a.house_number].filter(Boolean).join(' ');
  return [street, a.city || a.town || a.village || a.municipality].filter(Boolean).join(', ') || j.display_name || '';
}
