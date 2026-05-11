import type { UserProfile, MealHistory, RecentConfirmation } from '@/types';

export const mockCurrentUser: UserProfile = {
  name: 'João Silva',
  initials: 'JS',
  email: 'js@aluno.ifal.edu.br',
  matricula: '20240012345',
  campus: 'IFAL — Campus Arapiraca',
  curso: 'Sistemas de Informação',
  phone: '(82) 98765-4321',
  restrictions: ['lactoseFree', 'spicy'],
  role: 'student',
};

export const mockAdminUser: UserProfile = {
  name: 'Mariana Costa',
  initials: 'MC',
  email: 'admin@ifal.edu.br',
  matricula: 'ADMIN001',
  campus: 'IFAL — Campus Arapiraca',
  curso: 'Gerência do RU',
  phone: '(82) 3000-0001',
  restrictions: [],
  role: 'admin',
};

export const mockHistory: MealHistory[] = [
  { date: '08 Mai', meal: 'Almoço',  dish: 'Frango grelhado, arroz, feijão, salada',    rating: 5 },
  { date: '08 Mai', meal: 'Jantar',  dish: 'Sopa de mandioca com carne',                rating: 4 },
  { date: '07 Mai', meal: 'Almoço',  dish: 'Estrogonofe de frango com arroz',           rating: 5 },
  { date: '06 Mai', meal: 'Almoço',  dish: 'Carne moída com arroz e feijão',            rating: 3 },
  { date: '06 Mai', meal: 'Jantar',  dish: 'Macarronada com molho branco',              rating: 4 },
  { date: '05 Mai', meal: 'Almoço',  dish: 'Feijoada tropeira com couve',               rating: 5 },
];

export const mockRecentConfirmations: RecentConfirmation[] = [
  { id: 'r1', name: 'Ana Oliveira',     mat: '20231042', meal: 'Almoço', type: 'Padrão',   at: '11:48' },
  { id: 'r2', name: 'Bruno Carvalho',   mat: '20221987', meal: 'Almoço', type: 'Adaptada', at: '11:46' },
  { id: 'r3', name: 'Camila Rodrigues', mat: '20240015', meal: 'Almoço', type: 'Padrão',   at: '11:44' },
  { id: 'r4', name: 'Diego Santana',    mat: '20231112', meal: 'Almoço', type: 'Padrão',   at: '11:41' },
  { id: 'r5', name: 'Eduarda Lima',     mat: '20240007', meal: 'Almoço', type: 'Adaptada', at: '11:38' },
  { id: 'r6', name: 'Felipe Nogueira',  mat: '20230498', meal: 'Almoço', type: 'Padrão',   at: '11:35' },
];
