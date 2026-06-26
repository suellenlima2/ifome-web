import { apiRequest } from './client';
import type { StockItem, StockResponse, StockMovementsResponse } from '@/types';

export async function getStock(page = 1, pageSize = 100): Promise<StockItem[]> {
  const response = await apiRequest<StockResponse | StockItem[]>(`/api/stock?page=${page}&pageSize=${pageSize}`);
  // Suporta resposta paginada { data: [...] } ou array direto
  if (response && (response as StockResponse).data) {
    return (response as StockResponse).data;
  }
  return response as StockItem[];
}

export async function createStockItem(item: Omit<StockItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<StockItem> {
  return apiRequest<StockItem>('/api/stock', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function updateStockItem(id: string, updates: Partial<StockItem>): Promise<StockItem> {
  return apiRequest<StockItem>(`/api/stock/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteStockItem(id: string): Promise<void> {
  return apiRequest<void>(`/api/stock/${id}`, {
    method: 'DELETE',
  });
}

export async function getStockItemDetails(id: string): Promise<StockItem> {
  return apiRequest<StockItem>(`/api/stock/${id}`);
}

export async function getStockMovements(stockItemId: string, page = 1, pageSize = 20): Promise<StockMovementsResponse> {
  return apiRequest<StockMovementsResponse>(`/api/stock/${stockItemId}/movements?page=${page}&pageSize=${pageSize}`);
}
