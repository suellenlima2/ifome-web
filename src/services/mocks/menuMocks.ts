import type { MenuToday, NextDay } from '@/types';

export const mockMenuToday: MenuToday = {
  date: 'Sexta, 9 de Maio de 2026',
  meals: [
    {
      key: 'almoco',
      label: 'Almoço',
      time: '11:00 – 14:00',
      confirmados: 387,
      capacidade: 540,
      dishes: [
        { id: 'd1', name: 'Arroz Branco',       desc: 'Arroz agulhinha cozido no ponto',       cat: 'base',      tags: ['vegetarian', 'vegan', 'glutenFree'] },
        { id: 'd2', name: 'Feijão Carioca',     desc: 'Feijão temperado com louro e alho',     cat: 'base',      tags: ['vegetarian', 'vegan', 'glutenFree'] },
        { id: 'd3', name: 'Bife Acebolado',     desc: 'Patinho grelhado com cebolas',          cat: 'proteina',  tags: [] },
        { id: 'd4', name: 'Frango Assado',      desc: 'Sobrecoxa marinada em ervas',           cat: 'proteina',  tags: ['glutenFree', 'lactoseFree'] },
        { id: 'd5', name: 'Moqueca de Palmito', desc: 'Opção vegana com leite de coco',        cat: 'proteina_v',tags: ['vegan', 'vegetarian', 'glutenFree', 'lactoseFree'] },
        { id: 'd6', name: 'Farofa de Cebola',   desc: 'Farinha de mandioca tostada',           cat: 'acomp',     tags: ['vegetarian', 'vegan', 'lactoseFree'] },
        { id: 'd7', name: 'Salada Mista',       desc: 'Alface, tomate, cenoura ralada',        cat: 'salada',    tags: ['vegan', 'vegetarian', 'glutenFree', 'lactoseFree'] },
        { id: 'd8', name: 'Mousse de Maracujá', desc: 'Sobremesa do dia',                      cat: 'sobremesa', tags: ['vegetarian'] },
      ],
    },
    {
      key: 'cafe',
      label: 'Café da Manhã',
      time: '06:30 – 08:30',
      confirmados: 142,
      capacidade: 220,
      dishes: [
        { id: 'c1', name: 'Pão Francês',         desc: 'Com manteiga ou margarina',  cat: 'base',   tags: ['vegetarian'] },
        { id: 'c2', name: 'Cuscuz Nordestino',   desc: 'Acompanha ovo ou queijo',    cat: 'base',   tags: ['vegetarian', 'glutenFree'] },
        { id: 'c3', name: 'Café com Leite',      desc: 'Tradicional',                cat: 'bebida', tags: ['vegetarian'] },
        { id: 'c4', name: 'Suco de Goiaba',      desc: 'Natural, sem açúcar',        cat: 'bebida', tags: ['vegan', 'vegetarian', 'glutenFree'] },
      ],
    },
    {
      key: 'jantar',
      label: 'Jantar',
      time: '17:30 – 19:30',
      confirmados: 0,
      capacidade: 380,
      dishes: [
        { id: 'j1', name: 'Arroz Integral',   desc: 'Cozido no vapor',              cat: 'base',     tags: ['vegan', 'vegetarian', 'glutenFree'] },
        { id: 'j2', name: 'Lentilha',         desc: 'Refogada com cebola',          cat: 'base',     tags: ['vegan', 'vegetarian', 'glutenFree'] },
        { id: 'j3', name: 'Filé de Tilápia',  desc: 'Grelhado com limão',           cat: 'proteina', tags: ['glutenFree', 'lactoseFree'] },
        { id: 'j4', name: 'Legumes ao Vapor',  desc: 'Brócolis, cenoura, abobrinha', cat: 'acomp',   tags: ['vegan', 'vegetarian', 'glutenFree', 'lactoseFree'] },
        { id: 'j5', name: 'Banana',            desc: 'Fruta da estação',            cat: 'sobremesa',tags: ['vegan', 'vegetarian', 'glutenFree', 'lactoseFree'] },
      ],
    },
  ],
};

export const mockNextDays: NextDay[] = [
  { date: 'Seg, 12/05', almoco: 'Estrogonofe de Frango',    jantar: 'Sopa de Legumes'       },
  { date: 'Ter, 13/05', almoco: 'Macarronada à Bolonhesa',  jantar: 'Risoto de Cogumelos'   },
  { date: 'Qua, 14/05', almoco: 'Feijoada Tropeira',        jantar: 'Filé de Pescada'       },
  { date: 'Qui, 15/05', almoco: 'Galinhada com Pequi',      jantar: 'Omelete de Forno'      },
  { date: 'Sex, 16/05', almoco: 'Carne de Panela',          jantar: 'Lasanha de Berinjela'  },
];
