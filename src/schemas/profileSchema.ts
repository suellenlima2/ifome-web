import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(8, 'Telefone inválido'),
  campus: z.string().min(1, 'Campus é obrigatório'),
  restrictions: z.array(z.string()).optional(),
});

export type ProfileForm = z.infer<typeof profileSchema>;
