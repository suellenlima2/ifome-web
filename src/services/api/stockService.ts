import { apiRequest } from './client';

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minLimit?: number;
  maxLimit?: number;
  status?: string;
}

export async function getStock(): Promise<StockItem[]> {
  return apiRequest<StockItem[]>('/api/stock');
}

export async function createStockItem(item: Omit<StockItem, 'id'>): Promise<StockItem> {
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