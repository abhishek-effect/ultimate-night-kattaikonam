/**
 * Scoped LocalStorage manager for Ultimate Night @ Kattaikonam (UNAK).
 * 
 * NOTE FOR GITHUB PAGES:
 * GitHub Pages hosts all projects for a user under the same origin (e.g. username.github.io/repo/).
 * In Web browsers, localStorage is strictly origin-scoped, meaning every project hosted on
 * *.github.io shares the exact same window.localStorage!
 * All keys here are explicitly prefixed with 'unak:' so they will never clash with,
 * overwrite, or read the localStorage of its upstream repository (Five Nights at Kattaikonam).
 */

const STORAGE_PREFIX = 'unak:';

export const STORAGE_KEYS = {
  CUSTOM_CONFIG: `${STORAGE_PREFIX}custom_config`,
  SHOW_MINUTES: `${STORAGE_PREFIX}show_minutes`,
  TUTORIAL_ANSWERED: `${STORAGE_PREFIX}tutorial_answered`,
  HIGH_SCORE: `${STORAGE_PREFIX}high_score`,
  SURVIVED_SHIFTS: `${STORAGE_PREFIX}survived_shifts`,
  SETTINGS: `${STORAGE_PREFIX}settings`
};

/**
 * Safely retrieve an item from localStorage.
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
    const item = window.localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (err) {
    console.warn(`[UNAK Storage] Failed to read "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

/**
 * Safely write an item to localStorage.
 */
export function setStorageItem(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
    return true;
  } catch (err) {
    console.warn(`[UNAK Storage] Failed to write "${key}" to localStorage:`, err);
    return false;
  }
}

/**
 * Safely remove an item from localStorage.
 */
export function removeStorageItem(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[UNAK Storage] Failed to remove "${key}" from localStorage:`, err);
    return false;
  }
}

/**
 * Safely retrieve JSON object
 */
export function getStorageJSON(key, defaultValue = null) {
  const raw = getStorageItem(key, null);
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return defaultValue;
  }
}

/**
 * Save player's custom game configuration (selected rooms, selected enemies, upload task)
 */
export function saveCustomConfig(config) {
  return setStorageItem(STORAGE_KEYS.CUSTOM_CONFIG, config);
}

export function getCustomConfig() {
  return getStorageJSON(STORAGE_KEYS.CUSTOM_CONFIG, null);
}

/**
 * Clock preference
 */
export function getShowMinutes() {
  return getStorageItem(STORAGE_KEYS.SHOW_MINUTES) === 'true';
}

export function setShowMinutes(value) {
  return setStorageItem(STORAGE_KEYS.SHOW_MINUTES, Boolean(value));
}

/**
 * Tutorial prompt status
 */
export function getTutorialAnswered() {
  return getStorageItem(STORAGE_KEYS.TUTORIAL_ANSWERED) === 'true';
}

export function setTutorialAnswered(value = true) {
  return setStorageItem(STORAGE_KEYS.TUTORIAL_ANSWERED, Boolean(value));
}
