import { fallbackProperties } from '../data/fallbackProperties';
import { defaultPages } from '../data/defaultPages';
import { defaultCityContent } from '../data/cityContent';
import { defaultStats } from '../data/defaultStats';
import { defaultHeaderSettings } from '../data/defaultHeader';

const PROPERTIES_KEY = 'star_estates_properties';
const ENQUIRIES_KEY = 'star_estates_enquiries';
const PAGES_KEY = 'star_estates_pages';
const CITY_CONTENT_KEY = 'star_estates_city_content';
const HOME_STATS_KEY = 'star_estates_home_stats';
const HEADER_SETTINGS_KEY = 'star_estates_header_settings';

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function read(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(stored);
    if (key === PROPERTIES_KEY && Array.isArray(parsed)) {
      const existingSlugs = new Set(parsed.map((property) => property.slug));
      const missingFallbacks = fallbackProperties.filter((property) => !existingSlugs.has(property.slug));
      if (missingFallbacks.length) {
        const merged = [...parsed, ...missingFallbacks];
        localStorage.setItem(key, JSON.stringify(merged));
        return merged;
      }
    }
    if (key === PROPERTIES_KEY && !Array.isArray(parsed)) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    if ((key === ENQUIRIES_KEY || key === HOME_STATS_KEY) && !Array.isArray(parsed)) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('star-estates-data-change'));
}

export function getLocalProperties(filters = {}) {
  const properties = read(PROPERTIES_KEY, fallbackProperties);
  const propertyList = Array.isArray(properties) ? properties : fallbackProperties;
  const search = filters.search?.toLowerCase().trim();

  return propertyList.filter((property) => {
    const matchesSearch = !search || [
      property.title,
      property.location,
      property.city,
      property.type,
      property.shortDescription,
    ].filter(Boolean).some((field) => field.toLowerCase().includes(search));

    return matchesSearch
      && (!filters.city || property.city === filters.city)
      && (!filters.type || property.type === filters.type)
      && (!filters.status || property.status === filters.status)
      && (!filters.minPrice || Number(property.price || 0) >= Number(filters.minPrice))
      && (!filters.maxPrice || Number(property.price || 0) <= Number(filters.maxPrice))
      && (!filters.featured || property.featured === true);
  });
}

export function saveLocalProperty(property, media = {}) {
  const properties = read(PROPERTIES_KEY, fallbackProperties);
  const id = property._id || `local-${Date.now()}`;
  const heroUrl = media.heroImage || null;
  const galleryUrls = media.galleryImages || [];
  const amenities = typeof property.amenities === 'string'
    ? property.amenities.split(',').map((item) => item.trim()).filter(Boolean)
    : property.amenities || [];

  const normalized = {
    ...property,
    _id: id,
    slug: slugify(property.title),
    price: Number(property.price),
    bedrooms: Number(property.bedrooms),
    bathrooms: Number(property.bathrooms),
    area: Number(property.area),
    featured: property.featured === true || property.featured === 'true',
    amenities,
  };

  if (heroUrl) {
    normalized.heroImage = heroUrl;
  }

  if (galleryUrls.length) {
    normalized.images = galleryUrls;
    if (!normalized.heroImage) normalized.heroImage = galleryUrls[0];
  }

  const exists = properties.some((item) => item._id === id);
  const next = exists
    ? properties.map((item) => (item._id === id ? { ...item, ...normalized } : item))
    : [{ ...normalized, createdAt: new Date().toISOString() }, ...properties];

  write(PROPERTIES_KEY, next);
  return normalized;
}

export function deleteLocalProperty(id) {
  const properties = read(PROPERTIES_KEY, fallbackProperties);
  write(PROPERTIES_KEY, properties.filter((property) => property._id !== id));
}

export function getLocalStats() {
  const properties = read(PROPERTIES_KEY, fallbackProperties);
  const enquiries = read(ENQUIRIES_KEY, []);
  return {
    properties: properties.length,
    enquiries: enquiries.length,
    activeListings: properties.length,
    pipelineValue: properties.reduce((sum, property) => sum + Number(property.price || 0), 0),
  };
}

export function getLocalEnquiries() {
  return read(ENQUIRIES_KEY, []);
}

export function saveLocalEnquiry(enquiry) {
  const enquiries = read(ENQUIRIES_KEY, []);
  const normalized = {
    ...enquiry,
    _id: enquiry._id || `enquiry-${Date.now()}`,
    status: enquiry.status || 'New',
    createdAt: enquiry.createdAt || new Date().toISOString(),
  };
  write(ENQUIRIES_KEY, [normalized, ...enquiries]);
  return normalized;
}

export function getLocalPage(slug) {
  const pages = read(PAGES_KEY, defaultPages);
  return pages[slug] || defaultPages[slug];
}

export function getLocalPages() {
  const pages = read(PAGES_KEY, defaultPages);
  return ['about', 'contact'].map((slug) => pages[slug] || defaultPages[slug]);
}

export function saveLocalPage(slug, page) {
  const pages = read(PAGES_KEY, defaultPages);
  const normalized = { ...defaultPages[slug], ...page, slug };
  write(PAGES_KEY, { ...pages, [slug]: normalized });
  return normalized;
}

export function getLocalCityContent() {
  return read(CITY_CONTENT_KEY, defaultCityContent);
}

export function saveLocalCityContent(city, content) {
  const current = read(CITY_CONTENT_KEY, defaultCityContent);
  const next = {
    ...current,
    [city]: { ...defaultCityContent[city], ...content },
  };
  write(CITY_CONTENT_KEY, next);
  return next;
}

export function getLocalHomeStats() {
  return read(HOME_STATS_KEY, defaultStats);
}

export function saveLocalHomeStats(stats) {
  write(HOME_STATS_KEY, stats);
  return stats;
}

export function getLocalHeaderSettings() {
  return read(HEADER_SETTINGS_KEY, defaultHeaderSettings);
}

export function saveLocalHeaderSettings(settings) {
  const normalized = { ...defaultHeaderSettings, ...settings };
  write(HEADER_SETTINGS_KEY, normalized);
  return normalized;
}

export function updateLocalEnquiry(id, values) {
  const enquiries = read(ENQUIRIES_KEY, []);
  const next = enquiries.map((enquiry) => (enquiry._id === id ? { ...enquiry, ...values } : enquiry));
  write(ENQUIRIES_KEY, next);
}

export function fileListToDataUrls(files) {
  return Promise.all(Array.from(files || []).map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
}
