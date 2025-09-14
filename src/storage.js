// src/storage.js
const KEY = 'rpolls_v1';

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { polls: [] };
  } catch (e) {
    return { polls: [] };
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {}
}
