import type { UserProfile, UserRole, MealHistory, RecentConfirmation } from '@/types';
import { mockCurrentUser, mockAdminUser, mockHistory, mockRecentConfirmations } from '../mocks/userMocks';

function delay<T>(data: T, ms = 600): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

let userProfile = { ...mockCurrentUser };
let sessionUser: UserProfile | null = null;

const MOCK_USERS = [
  { email: 'js@aluno.ifal.edu.br', password: '123456',  profile: mockCurrentUser },
  { email: 'admin@ifal.edu.br',      password: 'admin123', profile: mockAdminUser  },
];

export async function getCurrentUser(): Promise<UserProfile | null> {
  return delay(sessionUser, 0);
}

export async function login(email: string, password: string): Promise<{ success: boolean; role?: UserRole }> {
  const found = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (found) {
    sessionUser = found.profile;
    userProfile = { ...found.profile };
  }
  return delay(found ? { success: true, role: found.profile.role } : { success: false }, 800);
}

export async function logout(): Promise<void> {
  sessionUser = null;
  return delay(undefined as unknown as void, 0);
}

export async function getProfile(): Promise<UserProfile> {
  return delay(sessionUser ? { ...sessionUser } : { ...userProfile });
}

export async function updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  userProfile = { ...userProfile, ...updates };
  if (sessionUser) sessionUser = { ...sessionUser, ...updates };
  return delay({ ...userProfile }, 500);
}

export async function getMealHistory(): Promise<MealHistory[]> {
  return delay([...mockHistory]);
}

export async function getRecentConfirmations(): Promise<RecentConfirmation[]> {
  return delay([...mockRecentConfirmations]);
}
