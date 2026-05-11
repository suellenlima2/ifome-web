'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/services/api/userService';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.clear();
      router.push('/login');
    },
  });
}
