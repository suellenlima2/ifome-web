'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, LogOut, History, Pencil } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { Toggle } from '@/components/ui/Toggle';
import { Empty } from '@/components/ui/Empty';
import { Skeleton } from '@/components/ui/Skeleton';
import { MealHistoryItem } from '@/components/student/MealHistoryItem';
import { Modal } from '@/components/ui/Modal';
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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.restrictions) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Extrai com segurança a lista correta de histórico tratando paginação do backend
  const displayHistory = useMemo(() => {
    if (!history) return [];
    
    if (Array.isArray(history)) {
      return history.slice(0, 4);
    }
    
    const list = (history as any).content || (history as any).data || (history as any).history;
    if (Array.isArray(list)) {
      return list.slice(0, 4);
    }
    
    return [];
  }, [history]);

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

      <Modal
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Histórico completo"
        sub="Todas as suas refeições confirmadas"
        footer={
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            block 
            icon={History} 
            onClick={() => setIsHistoryOpen(false)}
          >
            Ver menos
          </Button>
        }
      >
        <div className="col gap-8 scroll-y" style={{ maxHeight: 340, paddingRight: 4 }}>
          {(() => {
            const actualHistory = Array.isArray(history) 
              ? history 
              : ((history as any)?.content || (history as any)?.data || (history as any)?.history || []);
              
            return actualHistory.length > 0 ? (
              actualHistory.map((h: any, i: number) => <MealHistoryItem key={i} item={h} />)
            ) : (
              <Empty icon={History} title="Nenhuma refeição ainda" body="Suas confirmações aparecerão aqui." />
            );
          })()}
        </div>
      </Modal>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <div className="col gap-20" style={{ maxWidth: 920, margin: '0 auto', width: '100%', padding: '0 16px' }}>
          
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
                  {profile.course || 'Estudante'} · Matrícula {profile.enrollment || 'N/A'}
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
                {(() => {
                  const total = Array.isArray(history) 
                    ? history.length 
                    : ((history as any)?.content || (history as any)?.data || (history as any)?.history || []).length;
                    
                  return total > 4 && (
                    <Button type="button" variant="ghost" size="sm" block icon={History} onClick={() => setIsHistoryOpen(true)}>
                      Ver histórico completo
                    </Button>
                  );
                })()}
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