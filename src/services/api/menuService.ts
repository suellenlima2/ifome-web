import type { MenuToday, WeekDay, Dish, ConfirmationPayload } from '@/types';
import { mockMenuToday, mockNextDays } from '../mocks/menuMocks';

function delay<T>(data: T, ms = 800): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

let confirmedMeal: ConfirmationPayload | null = null;

export async function getMenuToday(): Promise<MenuToday> {
  return delay(mockMenuToday);
}

function getTodayDateStr(): string {
  const now = new Date();
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${days[now.getDay()]}, ${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]}`;
}

export async function getWeekMenu(): Promise<WeekDay[]> {
  const todayStr = getTodayDateStr();
  const weekDays: WeekDay[] = [
    { date: todayStr, today: true, meals: mockMenuToday.meals },
    ...mockNextDays.map(d => ({
      date: d.date,
      today: d.date === todayStr,
      meals: [
        { label: 'Almoço', time: '11:00–14:00', dishes: [{ id: `w-a-${d.date}`, name: d.almoco, tags: [], desc: 'Prato principal', cat: 'proteina' as const }] },
        { label: 'Jantar', time: '17:30–19:30', dishes: [{ id: `w-j-${d.date}`, name: d.jantar, tags: [], desc: 'Prato principal', cat: 'proteina' as const }] },
      ],
    })),
  ];
  return delay(weekDays);
}

export async function getDishById(id: string): Promise<Dish | undefined> {
  const all = mockMenuToday.meals.flatMap(m => m.dishes);
  return delay(all.find(d => d.id === id));
}

export async function confirmMeal(payload: ConfirmationPayload): Promise<void> {
  confirmedMeal = payload;
  return delay(undefined as unknown as void, 600);
}

export async function getConfirmedMeal(): Promise<ConfirmationPayload | null> {
  return delay(confirmedMeal, 0);
}

export async function cancelMeal(): Promise<void> {
  confirmedMeal = null;
  return delay(undefined as unknown as void, 0);
}
