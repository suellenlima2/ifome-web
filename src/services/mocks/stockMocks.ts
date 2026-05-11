import type { StockItem } from '@/types';

export const mockStock: StockItem[] = [
  { id: 's1',  name: 'Arroz Agulhinha (kg)',  cat: 'Grãos',      stock: 184, min: 60,  max: 240, unit: 'kg', status: 'ok'   },
  { id: 's2',  name: 'Feijão Carioca (kg)',   cat: 'Grãos',      stock: 78,  min: 40,  max: 200, unit: 'kg', status: 'ok'   },
  { id: 's3',  name: 'Patinho Bovino (kg)',   cat: 'Proteínas',  stock: 18,  min: 30,  max: 120, unit: 'kg', status: 'low'  },
  { id: 's4',  name: 'Frango (kg)',           cat: 'Proteínas',  stock: 56,  min: 40,  max: 160, unit: 'kg', status: 'ok'   },
  { id: 's5',  name: 'Tilápia em Filé (kg)',  cat: 'Proteínas',  stock: 4,   min: 25,  max: 80,  unit: 'kg', status: 'crit' },
  { id: 's6',  name: 'Tomate (kg)',           cat: 'Hortifruti', stock: 22,  min: 15,  max: 60,  unit: 'kg', status: 'ok'   },
  { id: 's7',  name: 'Alface (un)',           cat: 'Hortifruti', stock: 12,  min: 30,  max: 90,  unit: 'un', status: 'low'  },
  { id: 's8',  name: 'Cenoura (kg)',          cat: 'Hortifruti', stock: 31,  min: 20,  max: 80,  unit: 'kg', status: 'ok'   },
  { id: 's9',  name: 'Óleo de Soja (L)',      cat: 'Mantimentos',stock: 9,   min: 20,  max: 60,  unit: 'L',  status: 'low'  },
  { id: 's10', name: 'Sal Refinado (kg)',     cat: 'Mantimentos',stock: 42,  min: 10,  max: 80,  unit: 'kg', status: 'ok'   },
  { id: 's11', name: 'Leite de Coco (L)',     cat: 'Mantimentos',stock: 2,   min: 12,  max: 40,  unit: 'L',  status: 'crit' },
  { id: 's12', name: 'Açúcar (kg)',           cat: 'Mantimentos',stock: 36,  min: 20,  max: 90,  unit: 'kg', status: 'ok'   },
];
