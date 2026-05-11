'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAlerts, fetchDemand } from '@/controllers/admin/alertController';

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
