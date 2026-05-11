import type { Meal, WeekDay, Dish, ConfirmationPayload } from '@/types';
import { getMenuToday, getWeekMenu, getDishById, confirmMeal, getConfirmedMeal, cancelMeal } from '@/services/api/menuService';

export interface MealWithUsage extends Meal {
  usagePercent: number;
}

export async function fetchTodayMenu(): Promise<{ date: string; meals: MealWithUsage[] }> {
  const menu = await getMenuToday();
  return {
    date: menu.date,
    meals: menu.meals.map(meal => ({
      ...meal,
      usagePercent: meal.capacidade > 0 ? Math.round((meal.confirmados / meal.capacidade) * 100) : 0,
    })),
  };
}

export async function fetchWeekMenu(filter: string | null): Promise<WeekDay[]> {
  const week = await getWeekMenu();
  if (!filter) return week;
  return week
    .map(day => ({
      ...day,
      meals: day.meals
        .map(m => ({ ...m, dishes: m.dishes.filter(d => (d.tags ?? []).includes(filter as never)) }))
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

export async function fetchTodayConfirmation(): Promise<ConfirmationPayload | null> {
  return getConfirmedMeal();
}

export async function submitCancellation(): Promise<void> {
  return cancelMeal();
}
