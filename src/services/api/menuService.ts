import type { MenuToday, WeekDay, Dish, ConfirmationPayload, MealConfirmation, RecentConfirmationsResponse } from '@/types';
import { apiRequest } from './client';

export async function getMenuToday(): Promise<MenuToday> {
  return apiRequest<MenuToday>('/api/menu/today');
}

export async function getWeekMenu(): Promise<WeekDay[]> {
  return apiRequest<WeekDay[]>('/api/menu/week');
}

export async function getDishById(id: string): Promise<Dish | undefined> {
  try {
    return await apiRequest<Dish>(`/api/menu/dishes/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar o prato ${id}:`, error);
    return undefined;
  }
}

export async function confirmMeal(payload: ConfirmationPayload): Promise<void> {
  return apiRequest<void>('/api/confirmations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getConfirmedMeal(): Promise<MealConfirmation | null> {
  try {
    return await apiRequest<MealConfirmation>('/api/confirmations/today');
  } catch (error: any) {
    if (error.message?.includes('403') || error.message?.includes('404')) {
      return null;
    }
    throw error;
  }
}

export async function cancelMeal(): Promise<void> {
  return apiRequest<void>('/api/confirmations/today', { 
    method: 'DELETE' 
  });
}

export async function getRecentConfirmationsAdmin(page = 1, pageSize = 10): Promise<RecentConfirmationsResponse> {
  return apiRequest<RecentConfirmationsResponse>(`/api/confirmations/recent?page=${page}&pageSize=${pageSize}`);
}