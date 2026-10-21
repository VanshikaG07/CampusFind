/**
 * Resource Service
 *
 * Currently uses localStorage + mock data.
 * To connect to FastAPI backend, replace each method body with:
 *   return fetch('http://127.0.0.1:8000/resources').then(r => r.json())
 * without changing any component that calls this service.
 */

import { mockResources } from '../data/resources';
import { storage } from './storage';
import KEYS from './storage';

const RESOURCE_KEY = KEYS.RESOURCES;

// Initialize localStorage with mock data if empty and sync images
function initResources() {
  const stored = storage.get(RESOURCE_KEY);
  if (!stored) {
    storage.set(RESOURCE_KEY, mockResources);
    return mockResources;
  }
  // Sync image paths from mockResources for standard mock items
  let updated = false;
  const migrated = stored.map((r) => {
    const mock = mockResources.find((m) => m.id === r.id);
    if (mock && mock.image && r.image !== mock.image) {
      updated = true;
      return { ...r, image: mock.image };
    }
    return r;
  });
  if (updated) {
    storage.set(RESOURCE_KEY, migrated);
    return migrated;
  }
  return stored;
}

function getAllResources() {
  return initResources();
}

function saveResources(resources) {
  storage.set(RESOURCE_KEY, resources);
}

// ------------------------------------------------------------------
// Public API - mirrors what the FastAPI backend will expose later
// ------------------------------------------------------------------

/**
 * GET /resources
 * Returns all resources, optionally filtered by query params in future.
 */
export async function getResources(filters = {}) {
  let resources = getAllResources();

  // Client-side filtering (will be backend query params later)
  if (filters.type) {
    resources = resources.filter((r) => r.type === filters.type);
  }
  if (filters.category) {
    resources = resources.filter((r) => r.category === filters.category);
  }
  if (filters.condition) {
    resources = resources.filter((r) => r.condition === filters.condition);
  }
  if (filters.status) {
    resources = resources.filter((r) => r.status === filters.status);
  }
  if (filters.user_id) {
    resources = resources.filter((r) => r.user_id === filters.user_id);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    resources = resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
    );
  }
  if (filters.minPrice !== undefined) {
    resources = resources.filter((r) => r.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    resources = resources.filter((r) => r.price <= filters.maxPrice);
  }

  // Sorting
  if (filters.sort === 'price_asc') {
    resources = [...resources].sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    resources = [...resources].sort((a, b) => b.price - a.price);
  } else {
    // Default: newest first
    resources = [...resources].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  return resources;
}

/**
 * GET /resources/:id
 */
export async function getResourceById(id) {
  const resources = getAllResources();
  const resource = resources.find((r) => r.id === Number(id));
  if (!resource) return null;
  return resource;
}

/**
 * POST /resources
 */
export async function createResource(data) {
  const resources = getAllResources();
  const newResource = {
    ...data,
    id: Date.now(),
    status: 'available',
    created_at: new Date().toISOString(),
  };
  const updated = [newResource, ...resources];
  saveResources(updated);
  return newResource;
}

/**
 * PUT /resources/:id
 */
export async function updateResource(id, data) {
  const resources = getAllResources();
  const idx = resources.findIndex((r) => r.id === Number(id));
  if (idx === -1) throw new Error('Resource not found');
  const updated = [...resources];
  updated[idx] = { ...updated[idx], ...data };
  saveResources(updated);
  return updated[idx];
}

/**
 * DELETE /resources/:id
 */
export async function deleteResource(id) {
  const resources = getAllResources();
  const filtered = resources.filter((r) => r.id !== Number(id));
  saveResources(filtered);
  return true;
}

/**
 * GET /resources?user_id=:id  (user's own listings)
 */
export async function getUserResources(userId) {
  return getResources({ user_id: userId });
}
