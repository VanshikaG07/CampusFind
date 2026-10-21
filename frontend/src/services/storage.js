/**
 * Storage utility for localStorage persistence.
 * Centralizes localStorage keys for authentication and mock data.
 * Compatible with standard FastAPI JWT responses (access_token, user).
 */

const KEYS = {
  RESOURCES: 'campusfind_resources',
  REQUESTS: 'campusfind_requests',
  USERS: 'campusfind_users',
  AUTH_USER: 'user',
  ACCESS_TOKEN: 'access_token',
};

export const storage = {
  get(key) {
    try {
      const val = localStorage.getItem(key);
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        return val; // in case plain string like token was stored
      }
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch {
      // quota exceeded or private browsing - fail silently
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export default KEYS;
