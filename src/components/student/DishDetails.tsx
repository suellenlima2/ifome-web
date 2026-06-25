import React from 'react';
import { Utensils } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { Dish } from '@/types';
import { RestrictionChip } from './RestrictionChip';

interface DishDetailsProps {
  dish: Dish;
}

export function DishDetails({ dish }: DishDetailsProps) {
  // Sincronizado com a propriedade .restrictions do Swagger
  const uniqueRestrictions = Array.from(new Set(dish.restrictions ?? []));
  const ingredientText = dish.description || 'Informações de ingredientes não disponíveis.';

  return (
    <div className="space-y-6" style={{ textAlign: 'left' }}>
      <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
        <div style={{ width: 80, height: 80, borderRadius: 22, background: 'linear-gradient(135deg, var(--brand-soft) 0%, color-mix(in oklab, var(--brand) 20%, var(--surface)) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-text)' }}>
          <Utensils size={32} />
        </div>
        <div className="col gap-4">
          <div className="text-xs font-semibold uppercase tracking-wider muted">Categoria</div>
          <div className="weight-700" style={{ textTransform: 'capitalize' }}>{dish.category}</div>
          <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
            {uniqueRestrictions.map(tagKey => (
              <RestrictionChip key={tagKey} k={tagKey} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ gap: 12 }}>
        <div className="card card--padded col gap-4">
          <span className="text-xs muted">Calorias</span>
          <span className="weight-700 mono">~420 kcal</span>
        </div>
        <div className="card card--padded col gap-4">
          <span className="text-xs muted">Porção</span>
          <span className="weight-700 mono">300 g</span>
        </div>
        <div className="card card--padded col gap-4">
          <span className="text-xs muted">Avaliação média</span>
          <span className="weight-700 mono">4,6 / 5</span>
        </div>
      </div>

      <div className="col gap-3">
        <span className="weight-600">Ingredientes principais</span>
        <span className="text-sm muted">{ingredientText}</span>
      </div>

      {uniqueRestrictions.length > 0 && (
        <div className="col gap-3">
          <span className="weight-600">Restrições e avisos</span>
          <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
            {uniqueRestrictions.map((tagKey) => (
              <Tag key={tagKey} tone="yellow">{tagKey}</Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}