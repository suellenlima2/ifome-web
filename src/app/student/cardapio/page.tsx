'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { RestrictionChip } from '@/components/student/RestrictionChip';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWeekMenu } from '@/hooks/useMenu';

const FILTERS = [
  { k: null,          label: 'Todos'       },
  { k: 'vegetarian',  label: 'Vegetariano' },
  { k: 'vegan',       label: 'Vegano'      },
  { k: 'glutenFree',  label: 'Sem glúten'  },
  { k: 'lactoseFree', label: 'Sem lactose' },
];

export default function StudentCardapioPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const { data: week, isLoading } = useWeekMenu(filter);
  const router = useRouter();

  const handleCardKeyDown = (event: React.KeyboardEvent, dishId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push(`/student/cardapio/${dishId}`);
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
              {day.meals.map((m: any, mi: number) => {
                const primeiroPratoId = m.dishes[0]?.id || '';
                return (
                  <div 
                    key={mi} 
                    className="col gap-8" 
                    style={{ padding: 14, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid #f0f0f0', cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver detalhes da refeição: ${m.label} de ${day.date}`}
                    onClick={() => router.push(`/student/cardapio/${primeiroPratoId}`)}
                    onKeyDown={(e) => handleCardKeyDown(e, primeiroPratoId)}
                  >
                    <div className="between">
                      <span className="weight-600 text-sm">{m.label}</span>
                      <span className="text-xs muted">{m.time}</span>
                    </div>
                    <div className="col gap-6">
                      {m.dishes.slice(0, 4).map((d: any, di: number) => (
                        <span key={di} className="text-sm">{d.name}</span>
                      ))}
                      {m.dishes.length > 4 && <span className="text-xs muted">+ {m.dishes.length - 4} pratos</span>}
                    </div>
                    <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
                      {[...new Set(m.dishes.flatMap((d: any) => d.tags ?? []))].slice(0, 4).map((t: any) => (
                        <RestrictionChip key={t} k={t} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
