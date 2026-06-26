import type { Meal, WeekDay, Dish, ConfirmationPayload, MealConfirmation, MenuToday } from '@/types';
import { getMenuToday, getWeekMenu, getDishById, confirmMeal, getConfirmedMeal, cancelMeal } from '@/services/api/menuService';

export interface MealWithUsage extends Meal {
  usagePercent: number;
}

export async function fetchTodayMenu(): Promise<{ date: string; meals: MealWithUsage[] }> {
  const raw = await getMenuToday();

  // A API pode retornar { day: MenuToday } ou MenuToday diretamente
  const menu: MenuToday = (raw as any)?.day ?? raw as MenuToday;

  if (!menu || !menu.meals) {
    return { date: new Date().toISOString().split('T')[0], meals: [] };
  }

  return {
    date: menu.date,
    meals: menu.meals.map(meal => ({
      ...meal,
      usagePercent: meal.capacity > 0 ? Math.round((meal.confirmedCount / meal.capacity) * 100) : 0,
    })),
  };
}

export async function fetchWeekMenu(filter: string | null): Promise<WeekDay[]> {
  const raw = await getWeekMenu();

  // Suporta resposta paginada { data: [...] } ou array direto
  const week: WeekDay[] = (raw as any)?.data ?? raw as WeekDay[];

  if (!Array.isArray(week)) return [];
  if (!filter) return week;

  return week
    .map(day => ({
      ...day,
      meals: day.meals
        .map(m => ({ ...m, dishes: m.dishes.filter(d => (d.restrictions ?? []).includes(filter as never)) }))
        .filter(m => m.dishes.length > 0),
    }))
    .filter(day => day.meals.length > 0);
}

export async function fetchDishById(id: string): Promise<Dish | undefined> {
  return getDishById(id);
}

export async function submitConfirmation(payload: ConfirmationPayload): Promise<void> {
  return confirmMeal(payload);
}

export async function fetchTodayConfirmation(): Promise<MealConfirmation | null> {
  return getConfirmedMeal();
}

export async function submitCancellation(): Promise<void> {
  return cancelMeal();
}
