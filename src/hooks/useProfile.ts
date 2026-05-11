'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, saveProfile, fetchHistory } from '@/controllers/student/profileController';
import type { UserProfile } from '@/types';
import { toast } from 'react-toastify';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 10 * 60_000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<UserProfile>) => saveProfile(updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao salvar perfil. Tente novamente.');
    },
  });
}

export function useMealHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: fetchHistory,
    staleTime: 5 * 60_000,
  });
}
