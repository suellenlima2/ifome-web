export function formatCapacityPercent(confirmed: number, capacity: number): number {
  if (capacity === 0) return 0;
  return Math.round((confirmed / capacity) * 100);
}

export function getStockTone(status: 'ok' | 'low' | 'crit'): string {
  return status;
}

export function getDishCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    base: 'Base',
    protein: 'Proteína',
    protein_v: 'Vegetariana',
    salad: 'Salada',
    side: 'Acompanhamento',
    dessert: 'Sobremesa',
    drink: 'Bebida',
  };

  const normalized = cat?.toLowerCase().trim() || '';
  return map[normalized] ?? cat;
}