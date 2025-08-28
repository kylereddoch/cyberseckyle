/**
 * Returns back some attributes based on whether the
 * link is active or a parent of an active item.
 *
 * @param {String} itemUrl - The link in question.
 * @param {String} pageUrl - The page context.
 * @returns {String} - The attributes or empty.
 */
export function getLinkActiveState(itemUrl, pageUrl) {
  let response = '';

  // Ensure pageUrl is a string before proceeding
  if (typeof pageUrl === 'string') {
    if (itemUrl === pageUrl) {
      response = ' aria-current="page"';
    }

    if (itemUrl.length > 1 && pageUrl.startsWith(itemUrl.replace('/page-0/', ''))) {
      response += ' aria-current="page" data-state="active"';
    }
  }

  return response;
}

/**
 * Take an array of keys and return back items that match.
 * Note: items in the collection must have a key attribute in
 * Front Matter.
 *
 * @param {Array} collection - 11ty collection.
 * @param {Array} keys - Collection of keys.
 * @returns {Array} - Result collection or empty.
 */
export function filterCollectionByKeys(collection, keys) {
  return collection.filter(x => keys.includes(x.data.key));
}

/**
 * Generates a random UUID (Universally Unique Identifier).
 *
 * @returns {string} A random UUID.
 */
export function random() {
  const segment = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${segment()}-${segment()}-${segment()}`;
}

/* ---------- NEW: build time helpers (timezone-safe) ---------- */

function nowInTZ(timeZone = 'America/Chicago') {
  // Use Date + Intl so output is stable on CI and local
  const d = new Date();
  return { d, timeZone };
}

/** Human readable (MM/DD/YY, HH:MM:SS AM/PM) — keeps your original behavior but stable */
export function buildTimeHuman(timeZone = 'America/Chicago') {
  const { d } = nowInTZ(timeZone);
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    dateStyle: 'short',      // MM/DD/YY
    timeStyle: 'medium'      // HH:MM:SS AM/PM
  }).format(d);
}

/** Filename style (MM-DD-YY) */
export function buildTimeFile(timeZone = 'America/Chicago') {
  const { d } = nowInTZ(timeZone);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(d).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  return `${parts.month}-${parts.day}-${parts.year}`;
}

/** Backwards-compatible: previous `buildTime()` now maps to human format */
export function buildTime(timeZone = 'America/Chicago') {
  return buildTimeHuman(timeZone);
}

export default {
  buildTimeHuman,
  buildTimeFile,
  buildTime,
}