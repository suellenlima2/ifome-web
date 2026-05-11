import { Star } from 'lucide-react';
import type { MealHistory } from '@/types';

export function MealHistoryItem({ item }: { item: MealHistory }) {
  return (
    <div className="between" style={{ padding: '10px 0', borderBottom: '1px solid var(--divider)' }}>
      <div className="col">
        <span className="weight-500 text-sm">{item.dish}</span>
        <span className="text-xs muted">{item.date} · {item.meal}</span>
      </div>
      <span className="row gap-2 mono text-xs muted">
        <Star size={12} style={{ color: 'var(--warn)' }} />
        {item.rating}/5
      </span>
    </div>
  );
}
