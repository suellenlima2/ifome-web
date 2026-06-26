import type { StockItem } from '@/types';
import { getStock, updateStockItem, createStockItem } from '@/services/api/stockService';

export async function fetchStock(): Promise<StockItem[]> {
  return getStock();
}

export async function saveStockItem(id: string, updates: Partial<StockItem>): Promise<StockItem> {
  return updateStockItem(id, updates);
}

export async function addStockItem(item: Omit<StockItem, 'id'>): Promise<StockItem> {
  return createStockItem(item);
}
