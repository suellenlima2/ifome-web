import type { MenuToday, WeekDay, Dish, ConfirmationPayload } from '@/types';
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

export async function getConfirmedMeal(): Promise<ConfirmationPayload | null> {
  try {
    return await apiRequest<ConfirmationPayload | null>('/api/confirmations/today');
  } catch (error) {
    console.error("Erro ao buscar confirmação de hoje:", error);
    return null;
  }
}

export async function cancelMeal(): Promise<void> {
  return apiRequest<void>('/api/confirmations/today', { method: 'DELETE' });
}

/* ==========================================================================
   DICA PARA A ÁREA DO ADMIN:
   Se você precisar listar as confirmações recentes para a tela de dashboard do admin,
   você pode criar uma função usando a última rota da imagem:
   
   export async function getRecentConfirmationsAdmin(): Promise<any> {
     return apiRequest('/api/confirmations/recent');
   }
   ========================================================================== */