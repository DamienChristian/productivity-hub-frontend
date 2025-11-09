import type { Tokens } from '../types/auth.ts';

const STORAGE_KEY = 'auth.tokens';

let memoryTokens: Tokens | null = null;
const listeners = new Set<(tokens: Tokens | null) => void>();

function notify(tokens: Tokens | null) {
  for (const l of listeners) l(tokens);
}

export function loadTokensFromStorage(): Tokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: Tokens = JSON.parse(raw);
    memoryTokens = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTokensToStorage(tokens: Tokens | null) {
  if (!tokens) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function setTokens(tokens: Tokens) {
  memoryTokens = tokens;
  try {
    saveTokensToStorage(tokens);
  } catch {}
  notify(tokens);
}

export function clearTokens() {
  memoryTokens = null;
  try {
    saveTokensToStorage(null);
  } catch {}
  notify(null);
}

export function getTokens(): Tokens | null {
  return memoryTokens;
}

export function subscribe(listener: (tokens: Tokens | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Initialize from storage on module load (best-effort in browser)
if (typeof window !== 'undefined') {
  loadTokensFromStorage();
}
