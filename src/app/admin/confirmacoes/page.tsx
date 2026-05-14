'use client';

import { useState } from 'react';
import { Calendar, Filter, Download } from 'lucide-react';
import { useMemo } from 'react';
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
import type { RecentConfirmation } from '@/types';

function exportCSV(rows: RecentConfirmation[]) {
  const header = 'Aluno,Matrícula,Refeição,Tipo,Hora';
  const lines = rows.map(r => `${r.name},${r.mat},${r.meal},${r.type},${r.at}`);
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'confirmacoes.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function ConfirmationsContent() {
  const { data, isLoading } = useDashboard();
  const searchParams = useSearchParams();
  const [typeFilter, setTypeFilter] = useState<'all' | 'Padrão' | 'Adaptada'>('all');
  const [mealFilter, setMealFilter] = useState<string>(searchParams.get('meal') || 'all');
  const [search, setSearch] = useState('');

  const { meals, total, capacity, confirmations } = useMemo(() => {
    if (!data) return { meals: [], total: 0, capacity: 0, confirmations: [] };
    const meals = data.menuToday.meals;
    const total = meals.reduce((s, m) => s + m.confirmados, 0);
    const capacity = meals.reduce((s, m) => s + m.capacidade, 0);
    const confirmations = [...data.recentConfirmations, ...data.recentConfirmations.slice(0, 3).map(r => ({ ...r, id: r.id + 'x' }))];
    return { meals, total, capacity, confirmations };
  }, [data]);

  const q = search.toLowerCase();
  const filtered = confirmations
    .filter(r => typeFilter === 'all' || r.type === typeFilter)
    .filter(r => mealFilter === 'all' || r.meal === mealFilter)
    .filter(r => !q || r.name.toLowerCase().includes(q) || r.mat.toLowerCase().includes(q));

  if (isLoading) return (
    <>
      <AdminTopbar title="Confirmações" />
      <div className="main__scroll col gap-20">
        <div className="grid-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={160} r={14} />)}
        </div>
        <Skeleton h={300} r={14} />
      </div>
    </>
  );

  return (
    <>
      <AdminTopbar title="Confirmações" sub="Hoje · 09/05" onSearch={setSearch} />
      <div className="main__scroll">
        <div className="col gap-20">
          <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" icon={Calendar} onClick={() => toast.info('Filtro por data aplicado.')}>Hoje · 09/05</Button>
            <Button variant="secondary" size="sm" icon={Filter} onClick={() => toast.info('Filtro aplicado.')}>Tipo: {typeFilter === 'all' ? 'Todos' : typeFilter}</Button>
            {mealFilter !== 'all' && (
              <Button variant="primary" size="sm" onClick={() => setMealFilter('all')}>Refeição: {mealFilter} ✕</Button>
            )}
            <span className="spacer" />
            <Button variant="secondary" size="sm" icon={Download} onClick={() => exportCSV(filtered)}>Exportar CSV</Button>
          </div>

          <div className="grid-3">
            {meals.map(m => (
              <div 
                key={m.key} 
                className={cn("card card--padded col gap-12", mealFilter === m.label && "card--active")}
                onClick={() => setMealFilter(f => f === m.label ? 'all' : m.label)}
                style={{ cursor: 'pointer' }}
              >
                <div className="between">
                  <span className="weight-700">{m.label}</span>
                  <span className="text-xs muted">{m.time}</span>
                </div>
                <div className="row gap-12" style={{ alignItems: 'center' }}>
                  <Donut value={m.confirmados} max={m.capacidade} size={92} />
                  <div className="col">
                    <span className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{m.confirmados}</span>
                    <span className="text-xs muted">de {m.capacidade}</span>
                  </div>
                </div>
                <Bar value={m.confirmados} max={m.capacidade} tone={m.confirmados / m.capacidade > .85 ? 'low' : 'ok'} />
              </div>
            ))}
          </div>

          <div className="card">
            <div className="between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--divider)' }}>
              <span className="h-section">Lista de confirmações · {filtered.length} de {capacity}</span>
              <div className="row gap-8">
                <Button
                  variant={typeFilter === 'Padrão' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTypeFilter(f => f === 'Padrão' ? 'all' : 'Padrão')}
                >
                  Padrão ({confirmations.filter(r => r.type === 'Padrão').length})
                </Button>
                <Button
                  variant={typeFilter === 'Adaptada' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTypeFilter(f => f === 'Adaptada' ? 'all' : 'Adaptada')}
                >
                  Adaptada ({confirmations.filter(r => r.type === 'Adaptada').length})
                </Button>
              </div>
            </div>
            <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr><th>Aluno</th><th>Matrícula</th><th>Curso</th><th>Refeição</th><th>Tipo</th><th>Hora</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td><div className="row gap-12"><Avatar name={r.name} size="sm" /><span className="weight-600">{r.name}</span></div></td>
                    <td className="mono muted">{r.mat}</td>
                    <td className="muted">Eng. de Computação</td>
                    <td>{r.meal}</td>
                    <td><Tag tone={r.type === 'Adaptada' ? 'purple' : 'gray'}>{r.type}</Tag></td>
                    <td className="mono muted">{r.at}</td>
                  </tr>
                ))}
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
    <Suspense fallback={<div className="center" style={{ height: '100%' }}>Carregando...</div>}>
      <ConfirmationsContent />
    </Suspense>
  );
}
