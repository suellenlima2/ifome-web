import { DishCard } from './DishCard';
import type { Meal } from '@/types';

interface MealSectionProps {
  meal: Meal;
}

export function MealSection({ meal }: MealSectionProps) {
  return (
    <div className="col gap-12">
      <div className="between">
        <div className="row gap-12" style={{ alignItems: 'baseline' }}>
          <span className="h-section">{meal.label}</span>
          <span className="text-sm muted">{meal.time}</span>
        </div>
        <span className="text-xs muted">{meal.confirmados}/{meal.capacidade} confirmados</span>
      </div>
      <div className="grid-3">
        {meal.dishes.map(dish => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
