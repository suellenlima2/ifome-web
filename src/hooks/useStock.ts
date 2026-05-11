'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchStock, saveStockItem, addStockItem } from '@/controllers/admin/stockController';
import type { StockItem, StockStatus } from '@/types';
import { toast } from 'react-toastify';

export function useStock(filter: StockStatus | 'all' = 'all') {
  const query = useQuery({
    queryKey: ['stock'],
    queryFn: () => fetchStock('all'),
    staleTime: 2 * 60_000,
  });

  const filtered = useMemo(() => {
    if (!query.data || filter === 'all') return query.data;
    return query.data.filter(s => s.status === filter);
  }, [query.data, filter]);

  return { ...query, data: filtered };
}

export function useUpdateStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StockItem> }) =>
      saveStockItem(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock'] });
      toast.success('Estoque atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar estoque.');
    },
  });
}

export function useAddStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: Omit<StockItem, 'id'>) => addStockItem(item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock'] });
      toast.success('Produto adicionado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao adicionar produto.');
    },
  });
}
