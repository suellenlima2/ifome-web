import { z } from 'zod';

export const stockSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  currentQuantity: z.number().min(0, 'Estoque não pode ser negativo'),
  minQuantity: z.number().min(0, 'Mínimo não pode ser negativo'),
  maxQuantity: z.number().min(1, 'Máximo deve ser maior que zero'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
});

export type StockForm = z.infer<typeof stockSchema>;