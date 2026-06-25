import { z } from 'zod';

export const confirmationSchema = z.object({
  period: z.enum(['breakfast', 'lunch', 'dinner']),
  type: z.enum(['standard', 'adapted']),
});

export type ConfirmationForm = z.infer<typeof confirmationSchema>;