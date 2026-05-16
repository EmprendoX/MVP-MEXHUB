import type { Gig } from '@/types/freelance';

const KEY = 'hubmex.localGigs.v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getLocalGigs(): Gig[] {
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

export function saveLocalGig(gig: Gig): void {
  if (!isBrowser()) return;
  const current = getLocalGigs();
  const next = [gig, ...current.filter((g) => g.id !== gig.id)];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  notify();
}

export function deleteLocalGig(id: string): void {
  if (!isBrowser()) return;
  const next = getLocalGigs().filter((g) => g.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  notify();
}

const EVENT = 'hubmex:localGigsChanged';

function notify() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeLocalGigs(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
