import type { ProfileData } from '../types/profile';

export async function fetchMyProfile(): Promise<ProfileData | null> {
  const res = await fetch('/api/profile/me');
  if (!res.ok) throw new Error(`Profile request failed: ${res.status}`);
  const { profile } = await res.json();
  return profile ?? null;
}