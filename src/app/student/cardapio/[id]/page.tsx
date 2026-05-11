'use client';

import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, AlertCircle, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { RestrictionChip } from '@/components/student/RestrictionChip';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDishById } from '@/hooks/useMenu';

export default function DishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: dish, isLoading } = useDishById(id);

  if (isLoading) return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <Skeleton w={120} h={30} r={8} />
      <div className="card" style={{ marginTop: 16, overflow: 'hidden' }}>
        <Skeleton h={240} r={0} />
        <div className="col gap-16" style={{ padding: 28 }}>
          <Skeleton h={28} w="60%" r={8} />
          <Skeleton h={16} w="80%" r={6} />
        </div>
      </div>
    </div>
  );

  if (!dish) return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <Link href="/student/cardapio"><Button variant="ghost" size="sm" icon={ArrowLeft}>Voltar ao cardápio</Button></Link>
      <div className="card center" style={{ marginTop: 16, padding: 56 }}>
        <span className="muted">Prato não encontrado.</span>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', width: '100%' }}>
      <Link href="/student/cardapio"><Button variant="ghost" size="sm" icon={ArrowLeft}>Voltar ao cardápio</Button></Link>

      <div className="card" style={{ marginTop: 16, overflow: 'hidden' }}>
        <div style={{
          height: 240,
          background: 'linear-gradient(135deg, var(--brand-soft) 0%, color-mix(in oklab, var(--brand) 22%, var(--surface)) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-text)',
        }}>
          <Utensils size={64} />
        </div>

        <div className="col gap-16" style={{ padding: 28 }}>
          <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
            <Tag tone="gray">Almoço · 11:00 – 14:00</Tag>
            {dish.tags.map(t => <RestrictionChip key={t} k={t} />)}
          </div>

          <div className="col gap-4">
            <span className="h-page">{dish.name}</span>
            <span className="muted">{dish.desc}</span>
          </div>

          <div className="grid-3">
            <div className="card card--padded col gap-4">
              <span className="text-xs muted">Calorias</span>
              <span className="weight-700 mono">~640 kcal</span>
            </div>
            <div className="card card--padded col gap-4">
              <span className="text-xs muted">Porção</span>
              <span className="weight-700 mono">350 g</span>
            </div>
            <div className="card card--padded col gap-4">
              <span className="text-xs muted">Avaliação média</span>
              <span className="weight-700 mono">4,6 / 5</span>
            </div>
          </div>

          <div className="col gap-8">
            <span className="weight-600">Ingredientes principais</span>
            <span className="muted text-sm">Patinho bovino, cebola caramelizada, alho, sal refinado, pimenta-do-reino, óleo de soja, salsinha.</span>
          </div>

          <div className="col gap-8">
            <span className="weight-600">Pode conter</span>
            <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
              <Tag tone="yellow" icon={AlertCircle}>Glúten (traço)</Tag>
              <Tag tone="yellow" icon={AlertCircle}>Soja</Tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
