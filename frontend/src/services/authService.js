/**
 * Authentication Service
 *
 * Manages authentication state using localStorage (access_token & user).
 * Ready for future FastAPI backend integration:
 *   POST /login -> { access_token, token_type, user }
 *   POST /register -> { access_token, token_type, user }
 *   GET /me -> user
 */

import { mockUsers } from '../data/users';
import { storage } from './storage';
import KEYS from './storage';

const USERS_KEY = KEYS.USERS;
const USER_KEY = KEYS.AUTH_USER;
const TOKEN_KEY = KEYS.ACCESS_TOKEN;

function initUsers() {
  const stored = storage.get(USERS_KEY);
  if (!stored) {
    storage.set(USERS_KEY, mockUsers);
    return mockUsers;
  }
  return stored;
}

export function getAllUsers() {
  return initUsers();
}

function saveUsers(users) {
  storage.set(USERS_KEY, users);
}

/**
 * Get current authenticated user.
 * Returns null if no valid token / user session exists.
 */
export function getCurrentUser() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return null;
  }
  const user = storage.get(USER_KEY);
  return user || null;
}

/**
 * Check if session is authenticated
 */
export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY) && storage.get(USER_KEY));
}

/**
 * Login
 */
export async function login(email, password) {
  // Simulate network latency slightly for realistic UI feel
  await new Promise((r) => setTimeout(r, 180));

  const users = getAllUsers();
  const cleanEmail = (email || '').trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    throw new Error('No student account found with this college email.');
  }

  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters.');
  }

  // Create JWT-compatible mock token
  const token = `cf_jwt_${user.id}_${Date.now()}`;
  localStorage.setItem(TOKEN_KEY, token);
  storage.set(USER_KEY, user);

  return user;
}

/**
 * Register
 */
export async function register({ name, email, password, department, year, phone }) {
  await new Promise((r) => setTimeout(r, 220));

  const users = getAllUsers();
  const cleanEmail = (email || '').trim().toLowerCase();

  const exists = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (exists) {
    throw new Error('An account with this college email already exists.');
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: cleanEmail,
    department: department || 'Computer Science',
    year: year || '1st Year',
    phone: phone ? phone.trim() : '',
    college: 'Delhi Skill and Entrepreneurship University',
    avatar: null,
    bio: `DSEU student, ${department || 'Engineering'}.`,
    member_since: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);

  const token = `cf_jwt_${newUser.id}_${Date.now()}`;
  localStorage.setItem(TOKEN_KEY, token);
  storage.set(USER_KEY, newUser);

  return newUser;
}

/**
 * Logout
 */
export async function logout() {
  localStorage.removeItem(TOKEN_KEY);
  storage.remove(USER_KEY);
  storage.remove('campusfind_auth_user'); // cleanup legacy key if present
  return true;
}

/**
 * Update authenticated user profile
 */
export async function updateCurrentUser(data) {
  const current = getCurrentUser();
  if (!current) throw new Error('Not authenticated');

  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === current.id);
  const updated = { ...current, ...data };

  if (idx !== -1) {
    users[idx] = updated;
    saveUsers(users);
  }
  storage.set(USER_KEY, updated);
  return updated;
}
