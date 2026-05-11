import type { UserProfile, MealHistory } from '@/types';
import { getProfile, updateProfile, getMealHistory } from '@/services/api/userService';

export async function fetchProfile(): Promise<UserProfile> {
  return getProfile();
}

export async function saveProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  return updateProfile(updates);
}

export async function fetchHistory(): Promise<MealHistory[]> {
  return getMealHistory();
}
