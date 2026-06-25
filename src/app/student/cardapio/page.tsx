'use client';

import { useState, type KeyboardEvent } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { RestrictionChip } from '@/components/student/RestrictionChip';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { DishDetails } from '@/components/student/DishDetails';
import { useDishById, useWeekMenu } from '@/hooks/useMenu';

const FILTERS = [
  { k: null,            label: 'Todos'       },
  { k: 'vegetarian',    label: 'Vegetariano' },
  { k: 'vegan',         label: 'Vegano'      },
  { k: 'gluten_free',   label: 'Sem glúten'  },
  { k: 'lactose_free',  label: 'Sem lactose' },
];

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar'
};

export default function StudentCardapioPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const { data: week, isLoading } = useWeekMenu(filter);
  const { data: selectedDish, isLoading: isDishLoading } = useDishById(selectedDishId ?? '');

  const handleDishKeyDown = (event: KeyboardEvent, dishId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedDishId(dishId);
    }
  };

  if (isLoading) return (
    <div className="col gap-20" style={{ maxWidth: 1100, margin: '0 auto', padding: '20px' }}>
      <Skeleton h={40} w={200} r={8} />
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={120} r={14} />)}
    </div>
  );

  return (
    <div className="col gap-20" style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '20px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, header, footer, .no-print, button, .btn { display: none !important; }
          body { background: white !important; font-family: sans-serif; }
          .card { 
            break-inside: avoid; 
            border: 1px solid #ddd !important; 
            margin-bottom: 15px !important;
            padding: 15px !important;
            background: white !important;
          }
          .cardapio-grid-3, .cardapio-grid-2 {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          span svg { display: inline-block !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: A4; margin: 15mm; }
          .h-page::after {
            content: " - Restaurante Universitário IFAL";
            font-size: 14px;
            color: #444;
          }
        }
      `}} />

      <div className="between no-print">
        <div className="col">
          <span className="h-page">Cardápio da semana</span>
          <span className="text-sm muted">Veja o que será servido nos próximos 7 dias</span>
        </div>
        <Button variant="secondary" size="sm" icon={Download} onClick={() => window.print()} aria-label="Baixar cardápio em formato PDF">
          Baixar PDF
        </Button>
      </div>

      <div className="col only-print" style={{ display: 'none' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Cardápio Semanal</h1>
        <p style={{ marginBottom: '20px' }}>IFAL - Campus Arapiraca</p>
      </div>

      <div className="row gap-8 no-print" style={{ flexWrap: 'wrap' }}>
        <span className="text-xs muted weight-600" style={{ marginRight: 4, alignSelf: 'center', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Filtrar por restrição
        </span>
        {FILTERS.map(f => (
          <button
            key={String(f.k)}
            onClick={() => setFilter(f.k)}
            className={`btn ${filter === f.k ? 'btn--primary' : 'btn--secondary'} btn--sm`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="col gap-16">
        {(week ?? []).map((day: any, i: number) => (
          <div key={i} className="card card--padded col gap-12" role="region" aria-label={`Cardápio de ${day.date}`}>
            <div className="row gap-12" style={{ alignItems: 'baseline' }}>
              <span className="weight-700" style={{ fontSize: 16 }}>{day.date}</span>
              {day.today && <Tag tone="green">Hoje</Tag>}
            </div>
            <div className={i === 0 ? 'cardapio-grid-3' : 'cardapio-grid-2'}>
              {day.meals?.map((m: any, mi: number) => (
                <div 
                  key={mi} 
                  className="col gap-8" 
                  style={{ padding: 14, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid #f0f0f0' }}
                >
                  <div className="between">
                    <span className="weight-600 text-sm">{MEAL_LABELS[m.period] || m.period}</span>
                    <span className="text-xs muted">{`${m.startTime} - ${m.endTime}`}</span>
                  </div>
                  <div className="col gap-6">
                    {m.dishes?.slice(0, 4).map((d: any, di: number) => (
                      <button
                        key={d.id ?? di}
                        type="button"
                        className="text-sm"
                        style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'left' }}
                        onClick={() => setSelectedDishId(d.id)}
                        onKeyDown={(e) => handleDishKeyDown(e, d.id)}
                        aria-label={`Ver detalhes de ${d.name}`}
                      >
                        {d.name}
                      </button>
                    ))}
                    {m.dishes?.length > 4 && <span className="text-xs muted">+ {m.dishes.length - 4} pratos</span>}
                  </div>
                  <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
                    {[...new Set(m.dishes?.flatMap((d: any) => d.restrictions ?? []))].slice(0, 4).map((t: any) => (
                      <RestrictionChip key={t} k={t} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!selectedDishId}
        onClose={() => setSelectedDishId(null)}
        title={selectedDish?.name ?? 'Detalhes do prato'}
        sub={selectedDish ? `Categoria ${selectedDish.category}` : undefined}
      >
        {isDishLoading ? (
          <div className="col gap-4">
            <Skeleton h={28} w="70%" r={8} />
            <Skeleton h={16} w="90%" r={6} />
            <Skeleton h={16} w="80%" r={6} />
          </div>
        ) : selectedDish ? (
          <DishDetails dish={selectedDish} />
        ) : (
          <div className="col gap-4">
            <span className="muted">Não foi possível carregar os detalhes do prato.</span>
          </div>
        )}
      </Modal>
    </div>
  );
}