import { z } from 'zod';

export const confirmationSchema = z.object({
  period: z.enum(['cafe', 'almoco', 'jantar']),
  type: z.enum(['padrao', 'adaptada']),
});

export type ConfirmationForm = z.infer<typeof confirmationSchema>;
