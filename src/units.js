// Kilometres or miles, remembered per browser.

import { t } from './i18n.js';

let unit = localStorage.getItem('units') === 'mph' ? 'mph' : 'kmh';

export const getUnit = () => unit;

export function setUnit(next) {
  unit = next === 'mph' ? 'mph' : 'kmh';
  localStorage.setItem('units', unit);
  document.dispatchEvent(new Event('unitchange'));
}

const MILE = 1.609344;
export const speedIn = (kmh) => (unit === 'mph' ? kmh / MILE : kmh);
export const distanceIn = (km) => (unit === 'mph' ? km / MILE : km);
export const speedUnit = () => t(unit === 'mph' ? 'v.mph' : 'v.kmh');
export const distanceUnit = () => t(unit === 'mph' ? 'u.mi' : 'u.km');
export const altitudeIn = (m) => (unit === 'mph' ? m * 3.28084 : m);
export const altitudeUnit = () => (unit === 'mph' ? 'ft' : 'm');
