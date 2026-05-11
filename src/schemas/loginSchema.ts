import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .email('E-mail inválido')
    .refine(
      (email) => email.endsWith('@ifal.edu.br') || email.endsWith('@aluno.ifal.edu.br'),
      { message: 'Use seu e-mail institucional @ifal.edu.br ou @aluno.ifal.edu.br' }
    ),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
