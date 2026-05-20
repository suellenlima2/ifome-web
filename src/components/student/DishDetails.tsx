import React from 'react';
import { Dish } from '@/types';
import { RestrictionChip } from './RestrictionChip';

interface DishDetailsProps {
  dish: Dish;
}

export function DishDetails({ dish }: DishDetailsProps) {
  const uniqueTags = Array.from(new Set(dish.tags));

  return (
    <div className="space-y-4" style={{ textAlign: 'left' }}>
      <div className="col gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider muted">
          Categoria: {dish.cat}
        </span>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>{dish.desc}</p>
      </div>

      {uniqueTags.length > 0 && (
        <div className="border-t pt-4" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-6" style={{ color: 'var(--brand-text)', marginBottom: 12 }}>
            ⚠️ Avisos e Restrições Alimentares
          </h4>
          
          <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
            {uniqueTags.map((tagKey) => (
              <RestrictionChip key={tagKey} k={tagKey} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}