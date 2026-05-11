'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/controllers/admin/dashboardController';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 2 * 60_000,
    refetchInterval: 30_000,
  });
}
