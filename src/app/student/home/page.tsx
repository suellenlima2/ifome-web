'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Check } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { MealSection } from '@/components/student/MealSection';
import { RestrictionChip } from '@/components/student/RestrictionChip';

import { useTodayMenu, useTodayConfirmation, useCancelConfirmation, useConfirmMeal } from '@/hooks/useMenu';
import { useProfile } from '@/hooks/useProfile';
import { confirmationSchema, type ConfirmationForm } from '@/schemas/confirmationSchema';
import { cn } from '@/utils/cn';

const PERIODS = [
  { k: 'breakfast' as const, l: 'Café da Manhã' },
  { k: 'lunch' as const, l: 'Almoço' },
  { k: 'dinner' as const, l: 'Jantar' },
];

const TYPES = [
  { k: 'standard' as const, t: 'Refeição Padrão', s: 'Cardápio regular do dia' },
  { k: 'adapted' as const, t: 'Refeição Adaptada', s: 'Baseada nas suas restrições alimentares' },
];

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar'
};

function HomeSkeleton() {
  return (
    <div className="col gap-24" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      <div className="col gap-4">
        <Skeleton w={280} h={36} r={8} />
      </div>
      <Skeleton h={80} r={14} />
      <Skeleton h={100} r={14} />
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { mutate: confirmMeal, isPending } = useConfirmMeal();

  const currentHour = new Date().getHours();
  const defaultPeriod = currentHour >= 14 ? 'dinner' : 'lunch';

  const { control, handleSubmit, watch, reset } = useForm<ConfirmationForm>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: { period: defaultPeriod, type: 'standard' },
  });
  const period = watch('period');

  useEffect(() => {
    if (confirmation) {
      reset({ 
        period: confirmation.period, 
        type: confirmation.type 
      });
    } else {
      reset({ period: defaultPeriod, type: 'standard' });
    }
  }, [confirmation, defaultPeriod, reset]);

  const handleOpenModal = (isEdit: boolean) => {
    if (isEdit && confirmation) {
      reset({
        period: confirmation.period,
        type: confirmation.type || 'standard'
      });
    } else {
      reset({
        period: defaultPeriod,
        type: 'standard'
      });
    }
    setIsConfirmModalOpen(true);
  };

  const onSubmit = (formData: ConfirmationForm) => {
    confirmMeal(formData, {
      onSuccess: () => {
        setIsConfirmModalOpen(false);
      }
    });
  };

  if (isLoading) return <HomeSkeleton />;

  if (isError) return (
    <div className="center" style={{ height: 400 }}>
      <div className="col gap-12 center">
        <span className="muted">Não foi possível carregar o cardápio.</span>
        <Button variant="secondary" onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    </div>
  );

  const findMeal = (periodKey: string) => {
    return data!.meals.find(m => m.period === periodKey);
  };

  const confirmedPeriod = confirmation?.period ?? defaultPeriod;
  const confirmedMeal = findMeal(confirmedPeriod);
  const fallbackMeal = findMeal(defaultPeriod) || data!.meals[0];

  const displayMeal = confirmed ? confirmedMeal : fallbackMeal;
  const displayLabel = displayMeal ? MEAL_LABELS[displayMeal.period] : MEAL_LABELS[confirmedPeriod];

  const formattedDate = (() => {
    try {
      if (data!.date && data!.date.includes('-')) {
        const [year, month, day] = data!.date.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day);

        return parsedDate.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      return data!.date;
    } catch {
      return data!.date;
    }
  })();

  return (
    <div className="col gap-24" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      <div className="col gap-4">
        <span className="h-page" style={{ textTransform: 'capitalize' }}>{formattedDate}</span>
      </div>

      <div className="banner">
        <span className="banner__icon" style={{ background: 'var(--brand-soft)', color: 'var(--brand-text)', borderRadius: 8 }}>
          <AlertCircle size={16} />
        </span>
        <div className="col" style={{ flex: 1 }}>
          <div className="banner__title">Aviso da Coordenação</div>
          <div className="banner__body">O Restaurante Universitário estará fechado nesta sexta-feira (16/05) devido ao feriado nacional.</div>
        </div>
      </div>

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
              {displayLabel} {displayMeal?.startTime ? `· ${displayMeal.startTime} - ${displayMeal.endTime}` : ''}
            </span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>
              {confirmed ? 'Refeição confirmada!' : 'Confirme sua presença'}
            </span>
            <span className="text-sm" style={{ opacity: .9 }}>
              {confirmed
                ? 'Você nos ajudou a reduzir o desperdício de alimentos hoje.'
                : 'Confirme para garantir sua refeição e evitar desperdícios.'}
            </span>
          </div>
          <div className="row gap-12">
            {confirmed ? (
              <>
                <Button variant="secondary" onClick={() => handleOpenModal(true)}>Editar refeição</Button>
                <Button variant="secondary" onClick={() => cancelConfirm()}>Cancelar</Button>
              </>
            ) : (
              <Button variant="primary" size="lg" icon={CheckCircle} onClick={() => handleOpenModal(false)}>
                Confirmar refeição
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="col gap-16">
        <span className="h-section" style={{ fontSize: 20 }}>Cardápio de hoje</span>
        <div className="col gap-24">
          {data!.meals.map((meal) => (
            <MealSection key={meal.id} meal={meal} />
          ))}
        </div>
      </div>

      <Modal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmar refeição"
        sub="IFAL Arapiraca"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="col gap-20" style={{ padding: '10px 0' }}>

          <div className="col gap-12">
            <span className="weight-600">Período</span>
            <Controller name="period" control={control} render={({ field }) => (
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
            <Controller name="type" control={control} render={({ field }) => (
              <div className="col gap-8">
                {TYPES.map(o => (
                  <div key={o.k} onClick={() => field.onChange(o.k)} style={{ padding: 16, borderRadius: 12, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center', border: `2px solid ${field.value === o.k ? 'var(--brand)' : 'var(--border)'}`, background: field.value === o.k ? 'var(--brand-soft)' : 'var(--surface)' }}>
                    <span className="center" style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${field.value === o.k ? 'var(--brand)' : 'var(--border)'}`, background: field.value === o.k ? 'var(--brand)' : 'var(--surface)' }}>
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
              {isProfileLoading ? (
                <Skeleton h={24} w={100} r={12} />
              ) : profile?.restrictions && profile.restrictions.length > 0 ? (
                profile.restrictions.map((res: string) => (
                  <RestrictionChip key={res} k={res as any} />
                ))
              ) : (
                <span className="text-xs muted">Nenhuma restrição cadastrada.</span>
              )}
            </div>
            <Link href="/student/perfil" onClick={() => setIsConfirmModalOpen(false)}>
              <span className="text-xs" style={{ color: 'var(--brand-text)', cursor: 'pointer' }}>Editar restrições no perfil →</span>
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" block disabled={isPending}>
            {isPending
              ? 'Confirmando…'
              : `Confirmar presença · ${MEAL_LABELS[period] || period}`}
          </Button>

        </form>
      </Modal>
    </div>
  );
}