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
    proteina: 'Proteína',
    proteina_v: 'Vegetariana',
    salada: 'Salada',
    acomp: 'Acompanhamento',
    sobremesa: 'Sobremesa',
    bebida: 'Bebida',
  };
  return map[cat] ?? cat;
}
