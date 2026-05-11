import type { StockItem, StockStatus } from '@/types';
import { getStock, updateStockItem, createStockItem } from '@/services/api/stockService';

export async function fetchStock(filter?: StockStatus | 'all'): Promise<StockItem[]> {
  const all = await getStock();
  if (!filter || filter === 'all') return all;
  return all.filter(s => s.status === filter);
}

export async function saveStockItem(id: string, updates: Partial<StockItem>): Promise<StockItem> {
  return updateStockItem(id, updates);
}

export async function addStockItem(item: Omit<StockItem, 'id'>): Promise<StockItem> {
  return createStockItem(item);
}
