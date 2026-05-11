import Link from 'next/link';
import { Utensils } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { RestrictionChip } from './RestrictionChip';
import { getDishCategoryLabel } from '@/utils/formatDate';
import type { Dish } from '@/types';

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <Link href={`/student/cardapio/${dish.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ overflow: 'hidden', cursor: 'pointer', height: '100%' }}>
        <div style={{
          height: 110,
          background: 'linear-gradient(135deg, var(--brand-soft) 0%, color-mix(in oklab, var(--brand) 16%, var(--surface)) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--brand-text)', position: 'relative',
        }}>
          <Utensils size={32} />
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <Tag tone="gray">{getDishCategoryLabel(dish.cat)}</Tag>
          </div>
        </div>
        <div className="col gap-8" style={{ padding: 14 }}>
          <span className="weight-700">{dish.name}</span>
          <span className="text-xs muted" style={{ minHeight: 32 }}>{dish.desc}</span>
          <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
            {dish.tags.slice(0, 3).map(t => <RestrictionChip key={t} k={t} />)}
          </div>
        </div>
      </div>
    </Link>
  );
}
