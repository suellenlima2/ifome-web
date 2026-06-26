import type { UserProfile, UserRole, MealHistory, MealHistoryResponse, RecentConfirmation, RecentConfirmationsResponse } from '@/types';
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
      body: JSON.stringify({ email, password }),
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
  const response = await apiRequest<UserProfile | { data: UserProfile }>('/api/users/profile');
  // Suporta resposta envelopada { data: {...} } ou direta
  if (response && (response as any).data && typeof (response as any).data === 'object' && (response as any).data.id) {
    return (response as any).data as UserProfile;
  }
  return response as UserProfile;
}

export async function updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  const response = await apiRequest<UserProfile | { data: UserProfile }>('/api/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  if (response && (response as any).data && typeof (response as any).data === 'object') {
    return (response as any).data as UserProfile;
  }
  return response as UserProfile;
}

export async function getMealHistory(): Promise<MealHistory[]> {
  const response = await apiRequest<MealHistoryResponse | MealHistory[]>('/api/users/meal-history');
  // Suporta paginação { data: [...] } ou array direto
  if (response && (response as MealHistoryResponse).data) {
    return (response as MealHistoryResponse).data;
  }
  return response as MealHistory[];
}

export async function getRecentConfirmations(): Promise<RecentConfirmation[]> {
  // Usa o endpoint de confirmações recentes do admin
  try {
    const response = await apiRequest<RecentConfirmationsResponse | RecentConfirmation[]>('/api/confirmations/recent?page=1&pageSize=10');
    if (response && (response as RecentConfirmationsResponse).data) {
      return (response as RecentConfirmationsResponse).data;
    }
    return response as RecentConfirmation[];
  } catch {
    return [];
  }
}
