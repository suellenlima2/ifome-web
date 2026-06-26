import { DishCard } from './DishCard';
import type { Meal, MealKey } from '@/types';

interface MealSectionProps {
  meal: Meal;
}

const MEAL_LABELS: Record<MealKey, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar'
};

export function MealSection({ meal }: MealSectionProps) {

  const label = MEAL_LABELS[meal.period] || meal.period;

  const timeFormatted = `${meal.startTime} - ${meal.endTime}`;

  return (
    <div className="col gap-12">
      <div className="between">
        <div className="row gap-12" style={{ alignItems: 'baseline' }}>
          <span className="h-section">{label}</span>
          <span className="text-sm muted">{timeFormatted}</span>
        </div>
        <span className="text-xs muted">
          {meal.confirmedCount}/{meal.capacity} confirmados
        </span>
      </div>
      <div className="grid-3">
        {meal.dishes.map(dish => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}