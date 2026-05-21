'use client';

import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MealSection } from '@/components/student/MealSection';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTodayMenu, useTodayConfirmation, useCancelConfirmation } from '@/hooks/useMenu';

function HomeSkeleton() {
  return (
    <div className="col gap-24" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      {/* 1. A Data de Hoje */}
      <div className="col gap-4">
        <Skeleton w={280} h={36} r={8} />
      </div>
      
      {/* 2. Aviso da Coordenação */}
      <Skeleton h={80} r={14} />
      
      {/* 3. Bloco de Confirmação */}
      <Skeleton h={100} r={14} />
      
      {/* 4. Cardápio do Dia */}
      <div className="col gap-16">
        <Skeleton w={180} h={24} r={6} />
        <div className="col gap-24">
          <div className="col gap-12">
            <div className="between">
              <Skeleton w={140} h={20} r={6} />
              <Skeleton w={100} h={14} r={4} />
            </div>
            <div className="grid-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={200} r={14} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentHomePage() {
  const { data, isLoading, isError } = useTodayMenu();
  const { data: confirmation } = useTodayConfirmation();
  const { mutate: cancelConfirm } = useCancelConfirmation();
  const confirmed = !!confirmation;

  if (isLoading) return <HomeSkeleton />;

  if (isError) return (
    <div className="center" style={{ height: 400 }}>
      <div className="col gap-12 center">
        <span className="muted">Não foi possível carregar o cardápio.</span>
        <Button variant="secondary" onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    </div>
  );

  const PERIOD_LABELS: Record<string, string> = { cafe: 'Café da Manhã', almoco: 'Almoço', jantar: 'Jantar' };
  const confirmedPeriod = confirmation?.period ?? 'almoco';
  const confirmedMeal = data!.meals.find(m => m.key === confirmedPeriod);
  const almoco = data!.meals.find(m => m.key === 'almoco');
  const displayMeal = confirmed ? confirmedMeal : almoco;
  const displayLabel = confirmed ? (PERIOD_LABELS[confirmedPeriod] ?? 'Almoço') : 'Almoço';

  return (
    <div className="col gap-24" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      {/* 1. A Data de Hoje */}
      <div className="col gap-4">
        <span className="h-page">{data!.date}</span>
      </div>

      {/* 2. Aviso da Coordenação */}
      <div className="banner">
        <span className="banner__icon" style={{ background: 'var(--brand-soft)', color: 'var(--brand-text)', borderRadius: 8 }}>
          <AlertCircle size={16} />
        </span>
        <div className="col" style={{ flex: 1 }}>
          <div className="banner__title">Aviso da Coordenação</div>
          <div className="banner__body">O Restaurante Universitário estará fechado nesta sexta-feira (16/05) devido ao feriado nacional.</div>
        </div>
      </div>

      {/* 3. Bloco de Confirmação */}
      <div className="card" style={{
        padding: 24,
        background: confirmed
          ? 'linear-gradient(135deg, var(--green-700) 0%, var(--green-500) 100%)'
          : 'var(--surface)',
        color: confirmed ? 'white' : 'var(--text)',
        border: confirmed ? '0' : '1px solid var(--border)',
      }}>
        <div className="row gap-20" style={{ flexWrap: 'wrap' }}>
          <div className="col gap-8" style={{ flex: 1, minWidth: 240 }}>
            <span className="text-xs" style={{ opacity: confirmed ? .85 : 1, color: confirmed ? 'rgba(255,255,255,0.85)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>
              {displayLabel} · {displayMeal?.time}
            </span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>
              {confirmed ? 'Refeição confirmada!' : 'Confirme sua presença'}
            </span>
            <span className="text-sm" style={{ opacity: .9 }}>
              {confirmed
                ? 'Você nos ajudou a reduzir 0,5% do desperdício de alimentos hoje.'
                : 'Confirme até as 10h00 para que possamos preparar a refeição certa.'}
            </span>
          </div>
          <div className="row gap-12">
            {confirmed ? (
              <>
                <Link href={`/student/confirmar?period=${confirmation?.period || 'almoco'}&type=${confirmation?.type || 'padrao'}`}><Button variant="secondary">Editar refeição</Button></Link>
                <Button variant="secondary" onClick={() => cancelConfirm()}>Cancelar</Button>
              </>
            ) : (
              <Link href="/student/confirmar">
                <Button variant="primary" size="lg" icon={CheckCircle}>Confirmar refeição</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 4. Cardápio do Dia */}
      <div className="col gap-16">
        <span className="h-section" style={{ fontSize: 20 }}>Cardápio de hoje</span>
        <div className="col gap-24">
          {data!.meals.map(meal => (
            <MealSection key={meal.key} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  );
}
