const KEY = 'hubmex.favoriteGigs.v1';
const EVENT = 'hubmex:favoritesChanged';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getFavorites(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  if (!isBrowser()) return false;
  const current = getFavorites();
  const exists = current.includes(id);
  const next = exists ? current.filter((g) => g !== id) : [id, ...current];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  notify();
  return !exists;
}

function notify() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeFavorites(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
