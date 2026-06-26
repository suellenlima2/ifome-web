'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchTodayMenu, fetchWeekMenu, fetchDishById, submitConfirmation, fetchTodayConfirmation, submitCancellation } from '@/controllers/student/menuController';
import type { ConfirmationPayload, MenuToday } from '@/types';
import { toast } from 'react-toastify';
import { apiRequest } from '@/services/api/client';

export function useTodayMenu() {
  return useQuery({
    queryKey: ['menu', 'today'],
    queryFn: fetchTodayMenu,
    staleTime: 5 * 60_000,
  });
}

export function useWeekMenu(filter: string | null) {
  const query = useQuery({
    queryKey: ['menu', 'week'],
    queryFn: () => fetchWeekMenu(null),
    staleTime: 5 * 60_000,
  });

  const filtered = useMemo(() => {
    if (!query.data || !filter) return query.data;
    
    return (query.data as any[])
      .map(day => ({
        ...day,
        meals: day.meals
          ?.map((m: any) => ({ 
            ...m, 
            dishes: m.dishes?.filter((d: any) => (d.restrictions ?? []).includes(filter as string)) ?? [] 
          }))
          .filter((m: any) => m.dishes.length > 0) ?? [],
      }))
      .filter(day => day.meals.length > 0);
  }, [query.data, filter]);

  return { ...query, data: filtered };
}

export function useDishById(id: string) {
  return useQuery({
    queryKey: ['dish', id],
    queryFn: () => fetchDishById(id),
    enabled: !!id,
    staleTime: 10 * 60_000,
  });
}

export function useConfirmMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConfirmationPayload) => submitConfirmation(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menu', 'today'] });
      qc.invalidateQueries({ queryKey: ['meal-confirmation'] });
      toast.success('Refeição confirmada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao confirmar refeição. Tente novamente.');
    },
  });
}

export function useTodayConfirmation() {
  return useQuery({
    queryKey: ['meal-confirmation'],
    queryFn: fetchTodayConfirmation,
    staleTime: Infinity,
  });
}

export function useCancelConfirmation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitCancellation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meal-confirmation'] });
      toast.success('Confirmação cancelada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao cancelar confirmação.');
    }
  });
}

export function useSaveMenuAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { date: string; meals: any[] }) => {
      return apiRequest<MenuToday>('/api/menu', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Cardápio salvo na API com sucesso!');
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Falha ao salvar cardápio no servidor.');
    }
  });
}