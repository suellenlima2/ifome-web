import type { StockItem, StockStatus } from '@/types';
import { getStock, updateStockItem, createStockItem } from '@/services/api/stockService';

export async function fetchStock(filter?: StockStatus | 'all'): Promise<StockItem[]> {
  const response = await getStock();
  
  const all = (response && (response as any).data 
    ? (response as any).data 
    : response) as unknown as StockItem[];

  if (!Array.isArray(all)) return [];
  if (!filter || filter === 'all') return all;
  
  return all.filter(s => s.status === filter);
}

export async function saveStockItem(id: string, updates: Partial<StockItem>): Promise<StockItem> {
  const response = await updateStockItem(id, updates);
  return (response as unknown) as StockItem;
}

export async function addStockItem(item: Omit<StockItem, 'id'>): Promise<StockItem> {
  const payload = {
    ...item,
    quantity: (item as any).currentQuantity ?? 0
  };

  const response = await createStockItem(payload as any);
  return (response as unknown) as StockItem;
}