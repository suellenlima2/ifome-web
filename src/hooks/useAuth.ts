'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, login } from '@/services/api/userService';
import { toast } from 'react-toastify';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const response = await getCurrentUser();
      
      const rawUser = response && (response as any).data 
        ? (response as any).data 
        : response;
        
      if (!rawUser) return null;

      const user = {
        ...rawUser,
        role: rawUser.role ? rawUser.role.toLowerCase().trim() : 'student'
      };
        
      return user as any;
    },
    staleTime: Infinity,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: any) => login(credentials.email, credentials.password),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['auth', 'user'] });
      toast.success('Login realizado com sucesso!');

      const role = data?.role || data?.data?.role;
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/notificacoes');
      }
    },
    onError: () => {
      toast.error('Credenciais inválidas. Verifique seus dados.');
    }
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
      toast.info('Sessão encerrada.');
    },
    onError: () => {
      qc.clear();
      router.push('/login');
    }
  });
}