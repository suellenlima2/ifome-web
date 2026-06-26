'use client';

import { useState, useMemo } from 'react';
import { Calendar, Filter, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Donut } from '@/components/ui/Donut';
import { Bar } from '@/components/ui/Bar';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import { useDashboard } from '@/hooks/useDashboard';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/utils/cn';

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar'
};

function exportCSV(rows: any[]) {
  const header = 'Aluno,Matrícula,Refeição,Tipo,Hora';
  const lines = rows.map(r => `${r.userName ?? r.studentName},${r.userEnrollment ?? r.studentId},${MEAL_LABELS[r.mealPeriod ?? r.period] || r.mealPeriod || r.period},${r.type},${r.confirmedAt}`);
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'confirmacoes_reais.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function ConfirmationsContent() {
  const { data, isLoading } = useDashboard();
  const searchParams = useSearchParams();
  
  const [typeFilter, setTypeFilter] = useState<'all' | 'standard' | 'adapted'>('all');
  const [mealFilter, setMealFilter] = useState<string>(searchParams.get('meal') || 'all');
  const [search, setSearch] = useState('');

  const { meals, total, capacity, confirmations } = useMemo(() => {
    if (!data) return { meals: [], total: 0, capacity: 0, confirmations: [] };
    
    const activeDay = data.menuToday.day;
    const meals = activeDay?.meals ?? [];
    const total = meals.reduce((acc, m) => acc + m.confirmedCount, 0);
    const capacity = meals.reduce((acc, m) => acc + m.capacity, 0);
    const confirmations = data.recentConfirmations ?? [];
    
    return { meals, total, capacity, confirmations };
  }, [data]);

  const q = search.toLowerCase();
  
  const filtered = confirmations
    .filter((r: any) => typeFilter === 'all' || r.type === typeFilter)
    .filter((r: any) => mealFilter === 'all' || (r.mealPeriod ?? r.period) === mealFilter)
    .filter((r: any) => !q || (r.userName ?? r.studentName ?? '').toLowerCase().includes(q) || (r.userEnrollment ?? r.studentId ?? '').toLowerCase().includes(q));

  if (isLoading) return (
    <>
      <AdminTopbar title="Confirmações" />
      <div className="main__scroll col gap-20" style={{ padding: 24 }}>
        <div className="grid-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={160} r={14} />)}
        </div>
        <Skeleton h={300} r={14} />
      </div>
    </>
  );

  return (
    <>
      <AdminTopbar title="Confirmações" sub={`Hoje · ${data?.menuToday?.day?.date ?? ''}`} onSearch={setSearch} />
      <div className="main__scroll">
        <div className="col gap-20">
          <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" icon={Calendar} onClick={() => toast.info('Filtrado pelo dia vigente.')}>
              Hoje · {data?.menuToday?.day?.date}
            </Button>
            <Button variant="secondary" size="sm" icon={Filter}>
              Tipo: {typeFilter === 'all' ? 'Todos' : typeFilter === 'standard' ? 'Padrão' : 'Adaptada'}
            </Button>
            {mealFilter !== 'all' && (
              <Button variant="primary" size="sm" onClick={() => setMealFilter('all')}>
                Refeição: {MEAL_LABELS[mealFilter] || mealFilter} ✕
              </Button>
            )}
            <span className="spacer" />
            <Button variant="secondary" size="sm" icon={Download} onClick={() => exportCSV(filtered)}>Exportar CSV</Button>
          </div>

          <div className="grid-3">
            {meals.map(m => {
              const label = MEAL_LABELS[m.period] || m.period;
              const timeFormatted = `${m.startTime} - ${m.endTime}`;
              const isSelected = mealFilter === m.period;

              return (
                <div 
                  key={m.id} 
                  className={cn("card card--padded col gap-12", isSelected && "card--active")}
                  onClick={() => setMealFilter(f => f === m.period ? 'all' : m.period)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="between">
                    <span className="weight-700">{label}</span>
                    <span className="text-xs muted">{timeFormatted}</span>
                  </div>
                  <div className="row gap-12" style={{ alignItems: 'center' }}>
                    <Donut value={m.confirmedCount} max={m.capacity} size={92} />
                    <div className="col">
                      <span className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{m.confirmedCount}</span>
                      <span className="text-xs muted">de {m.capacity}</span>
                    </div>
                  </div>
                  <Bar value={m.confirmedCount} max={m.capacity} tone={m.confirmedCount / m.capacity > .85 ? 'low' : 'ok'} />
                </div>
              );
            })}
          </div>

          <div className="card">
            <div className="between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--divider)' }}>
              <span className="h-section">Lista de confirmações · {filtered.length} de {capacity}</span>
              <div className="row gap-8">
                <Button
                  variant={typeFilter === 'standard' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTypeFilter(f => f === 'standard' ? 'all' : 'standard')}
                >
                  Padrão ({confirmations.filter((r: any) => r.type === 'standard').length})
                </Button>
                <Button
                  variant={typeFilter === 'adapted' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTypeFilter(f => f === 'adapted' ? 'all' : 'adapted')}
                >
                  Adaptada ({confirmations.filter((r: any) => r.type === 'adapted').length})
                </Button>
              </div>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Matrícula</th>
                    <th>Refeição</th>
                    <th>Tipo</th>
                    <th>Hora da Confirmação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r: any) => (
                    <tr key={r.id}>
                      <td>
                        <div className="row gap-12">
                          <Avatar name={r.userName ?? r.studentName} size="sm" />
                          <span className="weight-600">{r.userName ?? r.studentName}</span>
                        </div>
                      </td>
                      <td className="mono muted">{r.userEnrollment ?? r.studentId}</td>
                      <td>{MEAL_LABELS[r.mealPeriod ?? r.period] || r.mealPeriod || r.period}</td>
                      <td>
                        <Tag tone={r.type === 'adapted' ? 'purple' : 'gray'}>
                          {r.type === 'adapted' ? 'Adaptada' : 'Padrão'}
                        </Tag>
                      </td>
                      <td className="mono muted">
                        {r.confirmedAt?.includes('T')
                          ? r.confirmedAt.split('T')[1].substring(0, 5)
                          : r.confirmedAt ?? '—'}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="muted text-center" style={{ padding: 24 }}>
                        Nenhuma confirmação encontrada para os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { Suspense } from 'react';

export default function AdminConfirmacoesPage() {
  return (
    <Suspense fallback={<div className="center" style={{ height: '100vh' }}>Carregando listagem...</div>}>
      <ConfirmationsContent />
    </Suspense>
  );
}