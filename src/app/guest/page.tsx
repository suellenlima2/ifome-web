'use client';

import Link from 'next/link';
import { LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MealSection } from '@/components/student/MealSection';
import { Skeleton } from '@/components/ui/Skeleton';
import { PublicTopnav } from '@/components/layout/PublicTopnav';
import { useTodayMenu } from '@/hooks/useMenu';

export default function GuestPage() {
  const { data, isLoading } = useTodayMenu();

  return (
    <div className="col" style={{ height: '100vh', overflow: 'hidden' }}>
      <PublicTopnav loggedIn={false} />

      <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: 'var(--bg)' }}>
        <div className="col gap-24" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          {/* Banner de visitante */}
          <div className="banner" style={{ background: 'var(--brand-soft)', border: '1px solid var(--brand-soft)' }}>
            <span className="banner__icon" style={{ background: 'var(--brand)', color: 'white', borderRadius: 8 }}>
              <AlertCircle size={16} />
            </span>
            <div className="col" style={{ flex: 1 }}>
              <div className="banner__title" style={{ color: 'var(--brand-text)' }}>Você está visualizando como visitante</div>
              <div className="banner__body" style={{ color: 'var(--brand-text)', opacity: .85 }}>
                Faça login para confirmar sua presença nas refeições e ajudar o RU a reduzir o desperdício.
              </div>
            </div>
            <Link href="/login">
              <Button variant="primary" size="sm" icon={LogIn}>Fazer login</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="col gap-24">
              <div className="col gap-4">
                <Skeleton w={120} h={12} />
                <Skeleton w={280} h={32} r={8} />
              </div>
              <div className="grid-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={200} r={14} />)}
              </div>
            </div>
          ) : data ? (
            <>
              <div className="col gap-4">
                <span className="text-sm muted">{data.date}</span>
                <span className="h-page">Cardápio de hoje</span>
              </div>
              {data.meals.map(meal => (
                <MealSection key={meal.key} meal={meal} />
              ))}
            </>
          ) : null}

          <div className="card card--padded col gap-16" style={{ textAlign: 'center', alignItems: 'center' }}>
            <span className="h-section">Quer confirmar suas refeições?</span>
            <span className="text-sm muted" style={{ maxWidth: 360 }}>
              Com o IFome você confirma sua presença em até 30 segundos e ajuda o RU a preparar a quantidade certa de alimentos.
            </span>
            <div className="row gap-12">
              <Link href="/login">
                <Button variant="primary" icon={LogIn}>Entrar com e-mail institucional</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
