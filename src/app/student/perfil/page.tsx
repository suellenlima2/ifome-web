'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, LogOut, History, Pencil } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { Toggle } from '@/components/ui/Toggle';
import { Empty } from '@/components/ui/Empty';
import { Skeleton } from '@/components/ui/Skeleton';
import { MealHistoryItem } from '@/components/student/MealHistoryItem';
import { RESTRICTIONS } from '@/components/student/RestrictionChip';
import { profileSchema, type ProfileForm } from '@/schemas/profileSchema';
import { useProfile, useUpdateProfile, useMealHistory } from '@/hooks/useProfile';
import { useLogout } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import type { RestrictionKey } from '@/types';

export default function PerfilPage() {
  const { mutate: doLogout } = useLogout();
  const { data: profile, isLoading } = useProfile();
  const { data: history } = useMealHistory();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  
  const [restrictions, setRestrictions] = useState<RestrictionKey[]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.restrictions) {
      setRestrictions(profile.restrictions);
    }
  }, [profile]);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: profile ? { 
      name: profile.name, 
      email: profile.email, 
      phone: profile.phone, 
      campus: profile.campus 
    } : undefined,
  });

  const displayHistory = useMemo(
    () => (showAllHistory ? history : history?.slice(0, 4)) ?? [],
    [history, showAllHistory],
  );

  const toggleRestriction = (k: RestrictionKey) => {
    setRestrictions(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  };

  const onSubmit = (data: ProfileForm) => {
    updateProfile({ ...data, restrictions });
  };

  if (isLoading) return (
    <div className="col gap-20" style={{ maxWidth: 920, margin: '0 auto', padding: '20px' }}>
      <Skeleton h={200} r={14} />
      <div className="profile-grid">
        <Skeleton h={300} r={14} />
        <Skeleton h={300} r={14} />
      </div>
    </div>
  );

  if (!profile) return null;

  return (
    <>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={() => toast.success('Foto atualizada com sucesso!')}
      />
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <div className="col gap-20" style={{ maxWidth: 920, margin: '0 auto', width: '100%', padding: '0 16px' }}>
          
          <div className="row gap-12">
            <Link href="/student/home">
              <Button type="button" variant="ghost" size="sm" icon={ArrowLeft}>Início</Button>
            </Link>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ height: 100, background: 'linear-gradient(135deg, var(--green-700) 0%, var(--green-500) 100%)' }} />
            
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: -40, marginBottom: 16 }}>
                <div style={{ flexShrink: 0, background: 'var(--surface)', padding: 4, borderRadius: '50%' }}>
                  <Avatar name={profile.name} size="xl" />
                </div>
                <div style={{ paddingBottom: 8 }}>
                   <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    icon={Pencil} 
                    onClick={() => photoInputRef.current?.click()}
                  >
                    Editar foto
                  </Button>
                </div>
              </div>

              <div className="col" style={{ minWidth: 0 }}>
                <span style={{ 
                  fontSize: '1.75rem',
                  fontWeight: 800, 
                  display: 'block',
                  lineHeight: 1.2,
                  color: 'var(--text)'
                }}>
                  {profile.name}
                </span>
                <span className="text-sm muted" style={{ display: 'block', marginTop: 4 }}>
                  {profile.curso} · Matrícula {profile.matricula}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-grid">
            <div className="card card--padded col gap-12">
              <span className="h-section">Dados pessoais</span>
              <Field label="Nome completo" error={errors.name?.message}>
                <TextInput {...register('name')} placeholder="Seu nome" />
              </Field>
              <Field label="E-mail institucional" error={errors.email?.message}>
                <TextInput {...register('email')} type="email" />
              </Field>
              <Field label="Telefone" error={errors.phone?.message}>
                <TextInput {...register('phone')} />
              </Field>
              <Field label="Campus" error={errors.campus?.message}>
                <TextInput {...register('campus')} />
              </Field>
            </div>

            <div className="col gap-16">
              <div className="card card--padded col gap-12">
                <span className="h-section">Restrições alimentares</span>
                <span className="text-sm muted">Usadas para sugerir a refeição adaptada do dia.</span>
                <div className="col gap-8">
                  {(Object.keys(RESTRICTIONS) as RestrictionKey[]).map(k => {
                    const r = RESTRICTIONS[k];
                    const on = restrictions.includes(k);
                    return (
                      <div
                        key={k}
                        className="between"
                        style={{
                          padding: 12, borderRadius: 10, cursor: 'pointer',
                          border: `1px solid ${on ? 'var(--brand)' : 'var(--border)'}`,
                          background: on ? 'var(--brand-soft)' : 'var(--surface)',
                        }}
                        onClick={() => toggleRestriction(k)}
                      >
                        <div className="row gap-10">
                          <span className="center" style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface)', color: 'var(--brand-text)' }}>
                            <r.icon size={16} />
                          </span>
                          <span className="weight-500 text-sm">{r.label}</span>
                        </div>
                        <Toggle on={on} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card card--padded col gap-12">
                <span className="h-section">Histórico recente</span>
                {displayHistory.length === 0 ? (
                  <Empty icon={History} title="Nenhuma refeição ainda" body="Suas confirmações aparecerão aqui." />
                ) : (
                  <div className="col gap-8">
                    {displayHistory.map((h, i) => <MealHistoryItem key={i} item={h} />)}
                  </div>
                )}
                <Button type="button" variant="ghost" size="sm" block icon={History} onClick={() => setShowAllHistory(v => !v)}>
                  {showAllHistory ? 'Ver menos' : 'Ver histórico completo'}
                </Button>
              </div>
            </div>
          </div>

          <div className="row gap-12" style={{ justifyContent: 'space-between', paddingBottom: 40, marginTop: 10 }}>
            <Button type="button" variant="ghost" size="sm" icon={LogOut} style={{ color: 'var(--error)' }} onClick={() => doLogout()}>
              Sair da conta
            </Button>
            <div className="row gap-12">
              <Link href="/student/home">
                <Button type="button" variant="secondary">Cancelar</Button>
              </Link>
              <Button type="submit" variant="primary" icon={Check} disabled={isPending}>
                {isPending ? 'Salvando…' : 'Salvar alterações'}
              </Button>
            </div>
          </div>

        </div>
      </form>
    </>
  );
}