import type { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  { id: 'n1', icon: 'utensils',    title: 'Cardápio de hoje disponível',   body: 'Confira o almoço de sexta — moqueca de palmito vegana incluída.', at: 'Hoje, 06:30',  unread: true  },
  { id: 'n2', icon: 'alert',       title: 'Confirme sua presença',          body: 'O prazo para confirmar o almoço termina às 10h.',                  at: 'Hoje, 08:00',  unread: true  },
  { id: 'n3', icon: 'bell',        title: 'Alteração no cardápio',          body: 'O peixe do jantar foi substituído por filé de pescada.',           at: 'Ontem, 16:42', unread: false },
  { id: 'n4', icon: 'checkCircle', title: 'Refeição registrada',            body: 'Você nos ajudou a reduzir 0,5% do desperdício.',                   at: 'Qua, 12:15',   unread: false },
  { id: 'n5', icon: 'calendar',    title: 'Cardápio da próxima semana',     body: 'Já disponível para consulta.',                                     at: 'Seg, 09:00',   unread: false },
];
