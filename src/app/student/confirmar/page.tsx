'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RestrictionChip } from '@/components/student/RestrictionChip';
import { confirmationSchema, type ConfirmationForm } from '@/schemas/confirmationSchema';
import { useConfirmMeal } from '@/hooks/useMenu';
import { cn } from '@/utils/cn';

const PERIODS = [
  { k: 'cafe'   as const, l: 'Café'   },
  { k: 'almoco' as const, l: 'Almoço' },
  { k: 'jantar' as const, l: 'Jantar' },
];

const TYPES = [
  { k: 'padrao'   as const, t: 'Refeição Padrão',   s: 'Cardápio regular do dia' },
  { k: 'adaptada' as const, t: 'Refeição Adaptada', s: 'Baseada nas suas restrições alimentares' },
];

export default function ConfirmarPage() {
  const router = useRouter();
  const { mutate: confirm, isPending } = useConfirmMeal();

  const { control, handleSubmit, watch } = useForm<ConfirmationForm>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { period: 'almoco', type: 'padrao' },
  });

  const period = watch('period');
  const type = watch('type');

  const onSubmit = (data: ConfirmationForm) => {
    confirm(data, { onSuccess: () => router.push('/student/home') });
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <Link href="/student/home"><Button variant="ghost" size="sm" icon={ArrowLeft}>Voltar</Button></Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card card--padded col gap-20" style={{ marginTop: 16 }}>
          <div className="col gap-4">
            <span className="h-page">Confirmar refeição</span>
            <span className="muted">Sex, 09 Mai · IFAL Arapiraca</span>
          </div>

          <div className="col gap-12">
            <span className="weight-600">Período</span>
            <Controller
              name="period"
              control={control}
              render={({ field }) => (
                <div className="row gap-8">
                  {PERIODS.map(p => (
                    <button
                      key={p.k}
                      type="button"
                      onClick={() => field.onChange(p.k)}
                      className={cn('btn', field.value === p.k ? 'btn--primary' : 'btn--secondary')}
                    >
                      {p.l}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="col gap-12">
            <span className="weight-600">Tipo de refeição</span>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="col gap-8">
                  {TYPES.map(o => (
                    <div
                      key={o.k}
                      onClick={() => field.onChange(o.k)}
                      style={{
                        padding: 16, borderRadius: 12, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
                        border: `2px solid ${field.value === o.k ? 'var(--brand)' : 'var(--border)'}`,
                        background: field.value === o.k ? 'var(--brand-soft)' : 'var(--surface)',
                      }}
                    >
                      <span className="center" style={{
                        width: 22, height: 22, borderRadius: 999,
                        border: `2px solid ${field.value === o.k ? 'var(--brand)' : 'var(--border)'}`,
                        background: field.value === o.k ? 'var(--brand)' : 'var(--surface)',
                      }}>
                        {field.value === o.k && <Check size={12} strokeWidth={3} style={{ color: 'white' }} />}
                      </span>
                      <div className="col">
                        <span className="weight-600">{o.t}</span>
                        <span className="text-xs muted">{o.s}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="card card--padded col gap-8" style={{ background: 'var(--surface-2)', border: '1px dashed var(--border)' }}>
            <span className="weight-600 text-sm">Suas restrições aplicadas</span>
            <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
              <RestrictionChip k="lactoseFree" />
              <RestrictionChip k="spicy" />
            </div>
            <Link href="/student/perfil">
              <span className="text-xs" style={{ color: 'var(--brand-text)', cursor: 'pointer' }}>Editar restrições no perfil →</span>
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" block icon={CheckCircle} disabled={isPending}>
            {isPending ? 'Confirmando…' : `Confirmar presença · ${PERIODS.find(p => p.k === period)?.l}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
