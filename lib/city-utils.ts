/**
 * Utility functions for normalizing, aliasing, and formatting city, province, and restaurant locations.
 */

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'KPK',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Kashmir',
] as const;

export type ProvinceName = (typeof PROVINCES)[number];

export const MAJOR_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
];

export interface CityAliasInfo {
  canonicalCity: string;
  normalizedCity: string;
  province: ProvinceName;
}

// Centralized editable list of Pakistani city aliases & mapping
export const CITY_ALIASES: Record<string, CityAliasInfo> = {
  // Punjab
  lahore: { canonicalCity: 'Lahore', normalizedCity: 'lahore', province: 'Punjab' },
  lhr: { canonicalCity: 'Lahore', normalizedCity: 'lahore', province: 'Punjab' },
  rawalpindi: { canonicalCity: 'Rawalpindi', normalizedCity: 'rawalpindi', province: 'Punjab' },
  pindi: { canonicalCity: 'Rawalpindi', normalizedCity: 'rawalpindi', province: 'Punjab' },
  rwp: { canonicalCity: 'Rawalpindi', normalizedCity: 'rawalpindi', province: 'Punjab' },
  faisalabad: { canonicalCity: 'Faisalabad', normalizedCity: 'faisalabad', province: 'Punjab' },
  fsd: { canonicalCity: 'Faisalabad', normalizedCity: 'faisalabad', province: 'Punjab' },
  multan: { canonicalCity: 'Multan', normalizedCity: 'multan', province: 'Punjab' },
  sheikhupura: { canonicalCity: 'Sheikhupura', normalizedCity: 'sheikhupura', province: 'Punjab' },
  shekhupura: { canonicalCity: 'Sheikhupura', normalizedCity: 'sheikhupura', province: 'Punjab' },
  sheikupura: { canonicalCity: 'Sheikhupura', normalizedCity: 'sheikhupura', province: 'Punjab' },
  gujranwala: { canonicalCity: 'Gujranwala', normalizedCity: 'gujranwala', province: 'Punjab' },
  sialkot: { canonicalCity: 'Sialkot', normalizedCity: 'sialkot', province: 'Punjab' },
  sargodha: { canonicalCity: 'Sargodha', normalizedCity: 'sargodha', province: 'Punjab' },
  bahawalpur: { canonicalCity: 'Bahawalpur', normalizedCity: 'bahawalpur', province: 'Punjab' },
  okara: { canonicalCity: 'Okara', normalizedCity: 'okara', province: 'Punjab' },
  sahiwal: { canonicalCity: 'Sahiwal', normalizedCity: 'sahiwal', province: 'Punjab' },
  'rahim yar khan': { canonicalCity: 'Rahim Yar Khan', normalizedCity: 'rahim yar khan', province: 'Punjab' },
  kasur: { canonicalCity: 'Kasur', normalizedCity: 'kasur', province: 'Punjab' },
  jhelum: { canonicalCity: 'Jhelum', normalizedCity: 'jhelum', province: 'Punjab' },
  gujrat: { canonicalCity: 'Gujrat', normalizedCity: 'gujrat', province: 'Punjab' },

  // Sindh
  karachi: { canonicalCity: 'Karachi', normalizedCity: 'karachi', province: 'Sindh' },
  khi: { canonicalCity: 'Karachi', normalizedCity: 'karachi', province: 'Sindh' },
  hyderabad: { canonicalCity: 'Hyderabad', normalizedCity: 'hyderabad', province: 'Sindh' },
  sukkur: { canonicalCity: 'Sukkur', normalizedCity: 'sukkur', province: 'Sindh' },
  larkana: { canonicalCity: 'Larkana', normalizedCity: 'larkana', province: 'Sindh' },

  // Islamabad Capital Territory
  islamabad: { canonicalCity: 'Islamabad', normalizedCity: 'islamabad', province: 'Islamabad Capital Territory' },
  isb: { canonicalCity: 'Islamabad', normalizedCity: 'islamabad', province: 'Islamabad Capital Territory' },

  // KPK
  peshawar: { canonicalCity: 'Peshawar', normalizedCity: 'peshawar', province: 'KPK' },
  pew: { canonicalCity: 'Peshawar', normalizedCity: 'peshawar', province: 'KPK' },
  abbottabad: { canonicalCity: 'Abbottabad', normalizedCity: 'abbottabad', province: 'KPK' },
  mardan: { canonicalCity: 'Mardan', normalizedCity: 'mardan', province: 'KPK' },
  swat: { canonicalCity: 'Swat', normalizedCity: 'swat', province: 'KPK' },

  // Balochistan
  quetta: { canonicalCity: 'Quetta', normalizedCity: 'quetta', province: 'Balochistan' },
  gwadar: { canonicalCity: 'Gwadar', normalizedCity: 'gwadar', province: 'Balochistan' },

  // Gilgit-Baltistan
  gilgit: { canonicalCity: 'Gilgit', normalizedCity: 'gilgit', province: 'Gilgit-Baltistan' },
  skardu: { canonicalCity: 'Skardu', normalizedCity: 'skardu', province: 'Gilgit-Baltistan' },

  // Azad Kashmir
  muzaffarabad: { canonicalCity: 'Muzaffarabad', normalizedCity: 'muzaffarabad', province: 'Azad Kashmir' },
  mirpur: { canonicalCity: 'Mirpur', normalizedCity: 'mirpur', province: 'Azad Kashmir' },
};

export function normalizeString(str: string): string {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function formatCityName(cityName: string): string {
  if (!cityName) return '';
  const decoded = decodeURIComponent(cityName);
  return decoded
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function cityToSlug(cityName: string): string {
  if (!cityName) return '';
  const norm = normalizeString(cityName);
  const alias = CITY_ALIASES[norm];
  const target = alias ? alias.normalizedCity : norm;
  return target.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function provinceToSlug(provinceName: string): string {
  if (!provinceName) return '';
  const norm = normalizeString(provinceName);
  return norm.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function slugToProvince(slug: string): string {
  if (!slug) return 'Punjab';
  const norm = normalizeString(slug.replace(/-/g, ' '));
  const found = PROVINCES.find((p) => normalizeString(p) === norm || provinceToSlug(p) === slug);
  return found || formatCityName(slug.replace(/-/g, ' '));
}

export function resolveLocationDetails(rawCity: string, rawProvince?: string | null) {
  const normInput = normalizeString(rawCity);
  const aliasMatch = CITY_ALIASES[normInput];

  const displayCity = aliasMatch ? aliasMatch.canonicalCity : formatCityName(rawCity);
  const normalizedCity = aliasMatch ? aliasMatch.normalizedCity : normInput;
  const citySlug = cityToSlug(normalizedCity);

  let province: string = aliasMatch ? aliasMatch.province : (rawProvince?.trim() || 'Punjab');
  const matchedProv = PROVINCES.find((p) => normalizeString(p) === normalizeString(province));
  if (matchedProv) {
    province = matchedProv;
  }

  const normalizedProvince = normalizeString(province);
  const provinceSlug = provinceToSlug(province);

  return {
    displayCity,
    normalizedCity,
    citySlug,
    province,
    normalizedProvince,
    provinceSlug,
  };
}

export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
}
