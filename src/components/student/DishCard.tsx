import { useState } from 'react';
import { Utensils } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { RestrictionChip } from './RestrictionChip';
import { getDishCategoryLabel } from '@/utils/formatDate';
import { Modal } from '@/components/ui/Modal';
import { DishDetails } from './DishDetails';
import type { Dish } from '@/types';

export function DishCard({ dish }: { dish: Dish }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="card"
        style={{
          overflow: 'hidden',
          cursor: 'pointer',
          height: '100%',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(true); }}
      >
        <div style={{
          height: 110,
          background: 'linear-gradient(135deg, var(--brand-soft) 0%, color-mix(in oklab, var(--brand) 16%, var(--surface)) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--brand-text)', position: 'relative',
        }}>
          <Utensils size={32} />
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <Tag tone="gray">{getDishCategoryLabel(dish.category)}</Tag>
          </div>
        </div>
        <div className="col gap-8" style={{ padding: 14 }}>
          <span className="weight-700">{dish.name}</span>
          <span className="text-xs muted" style={{ minHeight: 32 }}>{dish.description}</span>
          <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
            {dish.restrictions?.slice(0, 5).map(t => (
              <RestrictionChip key={t} k={t} />
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={dish.name}
        sub={`Categoria ${getDishCategoryLabel(dish.category)}`}
      >
        <DishDetails dish={dish} />
      </Modal>
    </>
  );
}