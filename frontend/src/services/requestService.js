/**
 * Request Service
 *
 * Currently uses localStorage + mock data.
 * Ready to be connected to FastAPI endpoints (e.g. GET /requests, POST /requests, etc.)
 */

import { mockRequests } from '../data/requests';
import { storage } from './storage';
import KEYS from './storage';

const REQUEST_KEY = KEYS.REQUESTS;

function initRequests() {
  const stored = storage.get(REQUEST_KEY);
  if (!stored) {
    storage.set(REQUEST_KEY, mockRequests);
    return mockRequests;
  }
  return stored;
}

function getAllRequests() {
  return initRequests();
}

function saveRequests(requests) {
  storage.set(REQUEST_KEY, requests);
}

/**
 * GET /requests
 */
export async function getRequests(filters = {}) {
  let requests = getAllRequests();

  if (filters.category) {
    requests = requests.filter((r) => r.category === filters.category);
  }
  if (filters.urgency !== undefined && filters.urgency !== null) {
    requests = requests.filter((r) => Boolean(r.urgency) === Boolean(filters.urgency));
  }
  if (filters.status) {
    requests = requests.filter((r) => r.status === filters.status);
  }
  if (filters.user_id) {
    requests = requests.filter((r) => r.user_id === Number(filters.user_id));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    requests = requests.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
    );
  }

  // Default: newest first
  return [...requests].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
}

/**
 * GET /requests/:id
 */
export async function getRequestById(id) {
  const requests = getAllRequests();
  return requests.find((r) => r.id === Number(id)) || null;
}

/**
 * POST /requests
 */
export async function createRequest(data) {
  const requests = getAllRequests();
  const newRequest = {
    ...data,
    id: Date.now(),
    status: 'open',
    helpers: [],
    created_at: new Date().toISOString(),
  };
  const updated = [newRequest, ...requests];
  saveRequests(updated);
  return newRequest;
}

/**
 * POST /requests/:id/help (or PUT /requests/:id)
 * User offers to help on a request
 */
export async function offerHelp(requestId, userId) {
  const requests = getAllRequests();
  const idx = requests.findIndex((r) => r.id === Number(requestId));
  if (idx === -1) throw new Error('Request not found');

  const req = requests[idx];
  const helpers = req.helpers || [];
  if (!helpers.includes(userId)) {
    const updatedReq = {
      ...req,
      helpers: [...helpers, userId],
    };
    requests[idx] = updatedReq;
    saveRequests(requests);
    return updatedReq;
  }
  return req;
}

/**
 * PUT /requests/:id
 */
export async function updateRequest(id, data) {
  const requests = getAllRequests();
  const idx = requests.findIndex((r) => r.id === Number(id));
  if (idx === -1) throw new Error('Request not found');
  const updated = [...requests];
  updated[idx] = { ...updated[idx], ...data };
  saveRequests(updated);
  return updated[idx];
}

/**
 * DELETE /requests/:id
 */
export async function deleteRequest(id) {
  const requests = getAllRequests();
  const filtered = requests.filter((r) => r.id !== Number(id));
  saveRequests(filtered);
  return true;
}

/**
 * GET user's created requests
 */
export async function getUserRequests(userId) {
  return getRequests({ user_id: userId });
}
