import type { Alert, DemandDay } from '@/types';

export const mockAlerts: Alert[] = [
  { id: 'a1', level: 'crit', title: 'Estoque crítico: Tilápia em Filé', body: '4 kg restantes — abaixo do mínimo (25 kg). Programado para o jantar.', at: 'há 5 min'  },
  { id: 'a2', level: 'crit', title: 'Estoque crítico: Leite de Coco',   body: '2 L restantes — abaixo do mínimo (12 L).',                               at: 'há 22 min' },
  { id: 'a3', level: 'warn', title: 'Estoque baixo: Patinho Bovino',    body: '18 kg — abaixo do mínimo (30 kg). Reposição sugerida.',                   at: 'há 1 h'    },
  { id: 'a4', level: 'warn', title: 'Estoque baixo: Alface',            body: '12 un — abaixo do mínimo (30 un).',                                       at: 'há 2 h'    },
  { id: 'a5', level: 'warn', title: 'Estoque baixo: Óleo de Soja',      body: '9 L — abaixo do mínimo (20 L).',                                          at: 'há 3 h'    },
  { id: 'a6', level: 'info', title: 'Pico de confirmações no almoço',   body: '+18% em relação à média da semana. Considere preparar 60 refeições extras.', at: 'há 4 h' },
];

export const mockDemand7d: DemandDay[] = [
  { d: 'Seg', almoco: 412, jantar: 286 },
  { d: 'Ter', almoco: 438, jantar: 304 },
  { d: 'Qua', almoco: 401, jantar: 271 },
  { d: 'Qui', almoco: 452, jantar: 312 },
  { d: 'Sex', almoco: 387, jantar: 0   },
  { d: 'Sáb', almoco: 0,   jantar: 0   },
  { d: 'Dom', almoco: 0,   jantar: 0   },
];
