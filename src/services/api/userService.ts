import type { UserProfile, UserRole, MealHistory, RecentConfirmation } from '@/types';
import { apiRequest } from './client';

interface LoginResponse {
  token: string;
  user: {
    role: UserRole;
  };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (typeof window !== 'undefined' && localStorage.getItem('token_ifome')) {
    try {
      return await getProfile();
    } catch {
      return null;
    }
  }
  return null;
}

export async function login(email: string, password: string): Promise<{ success: boolean; role?: UserRole }> {
  try {
    const dados = await apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }), // Verifique na doc se é 'password' ou 'senha'
    });

    if (dados && dados.token) {
      localStorage.setItem('token_ifome', dados.token);
      return { success: true, role: dados.user?.role };
    }
    return { success: false };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false };
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Erro no logout do servidor:', error);
  } finally {
    localStorage.removeItem('token_ifome');
  }
}

export async function getProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/api/users/profile');
}

export async function updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  return apiRequest<UserProfile>('/api/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function getMealHistory(): Promise<MealHistory[]> {
  return apiRequest<MealHistory[]>('/api/users/meal-history');
}

export async function getRecentConfirmations(): Promise<RecentConfirmation[]> {
  return [];
}