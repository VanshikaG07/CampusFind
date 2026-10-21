/**
 * User Service
 *
 * Fetches user profile data and their listings/requests.
 * Ready for future backend endpoints:
 *   GET /users/:id
 *   GET /users/:id/resources
 *   GET /users/:id/requests
 */

import { mockUsers } from '../data/users';
import { storage } from './storage';
import KEYS from './storage';
import { getResources } from './resourceService';
import { getRequests } from './requestService';

function getAllUsers() {
  return storage.get(KEYS.USERS) || mockUsers;
}

export async function getUser(id) {
  const users = getAllUsers();
  return users.find((u) => u.id === Number(id)) || null;
}

export async function getAllCommunityUsers() {
  return getAllUsers();
}

export async function getUserResources(userId) {
  return getResources({ user_id: Number(userId) });
}

export async function getUserRequests(userId) {
  return getRequests({ user_id: Number(userId) });
}
