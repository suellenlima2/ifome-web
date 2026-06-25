'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlerts, fetchDemand } from '@/controllers/admin/alertController';
import { apiRequest } from '@/services/api/client';
import { toast } from 'react-toastify';

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}

export function useDemand() {
  return useQuery({
    queryKey: ['demand'],
    queryFn: fetchDemand,
    staleTime: 10 * 60_000,
  });
}

export function useResolveAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest<void>(`/api/alerts/${alertId}/resolve`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alerta arquivado com sucesso!');
    },
    onError: () => {
      toast.error('Falha ao atualizar o status do alerta.');
    },
  });
}