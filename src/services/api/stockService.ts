import type { StockItem } from '@/types';
import { mockStock } from '../mocks/stockMocks';

function delay<T>(data: T, ms = 700): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

let stockData = [...mockStock];

export async function getStock(): Promise<StockItem[]> {
  return delay([...stockData]);
}

export async function updateStockItem(id: string, updates: Partial<StockItem>): Promise<StockItem> {
  stockData = stockData.map(s => s.id === id ? { ...s, ...updates } : s);
  const updated = stockData.find(s => s.id === id)!;
  return delay(updated, 500);
}

export async function createStockItem(item: Omit<StockItem, 'id'>): Promise<StockItem> {
  const newItem: StockItem = { ...item, id: `s${Date.now()}` };
  stockData.push(newItem);
  return delay(newItem, 500);
}
