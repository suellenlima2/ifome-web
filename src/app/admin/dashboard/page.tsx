'use client';

import { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, PieChart, Box, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { Donut } from '@/components/ui/Donut';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { ConfirmationTable } from '@/components/admin/ConfirmationTable';
import { DemandChart } from '@/components/charts/DemandChart';
import { useDashboard } from '@/hooks/useDashboard';

const INITIAL_NOTICE = 'Sexta-feira, 16/05 — RU fechado por feriado nacional. Cardápio congelado e confirmações pausadas.';

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const [noticeText, setNoticeText] = useState(INITIAL_NOTICE);
  const [editingNotice, setEditingNotice] = useState(false);
  const [draftNotice, setDraftNotice] = useState(INITIAL_NOTICE);

  if (isLoading) return (
    <>
      <AdminTopbar title="Dashboard" sub="Visão geral de hoje" />
      <div className="main__scroll">
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </>
  );

  if (isError || !data) return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className="main__scroll center" style={{ height: 400 }}>
        <div className="col gap-12 center">
          <span className="muted">Erro ao carregar o dashboard.</span>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      </div>
    </>
  );

  const { menuToday, alerts, stock, demand7d, recentConfirmations } = data;
  const almoco = menuToday.meals.find(m => m.key === 'almoco')!;

  return (
    <>
      <AdminTopbar title="Dashboard" sub={menuToday.date} />
      <div className="main__scroll">
        <div className="col gap-24">
          <div className="banner" style={{ borderColor: 'var(--green-200)' }}>
            <span className="banner__icon" style={{ background: 'var(--brand-soft)', color: 'var(--brand-text)', borderRadius: 8 }}>
              <AlertCircle size={16} />
            </span>
            <div className="col" style={{ flex: 1 }}>
              <div className="banner__title">Aviso operacional</div>
              <div className="banner__body">{noticeText}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setDraftNotice(noticeText); setEditingNotice(true); }}>Editar aviso</Button>
          </div>

          <div className="grid-4">
            <Stat label="Confirmados hoje" value={almoco.confirmados} delta="+12% vs média" icon={CheckCircle} sub="almoço" href="/admin/confirmacoes?meal=Almoço" />
            <Stat label="Capacidade usada" value={`${Math.round(almoco.confirmados / almoco.capacidade * 100)}%`} sub={`${almoco.confirmados}/${almoco.capacidade} pratos`} icon={PieChart} delta="Saudável" href="/admin/confirmacoes" />
            <Stat label="Itens em falta" value={stock.filter(s => s.status !== 'ok').length} delta="3 críticos" deltaTone="down" icon={Box} sub="estoque" href="/admin/estoque" />
            <Stat label="Alertas ativos" value={alerts.length} delta="2 não vistos" deltaTone="down" icon={AlertTriangle} sub="abertos" href="/admin/alertas" />
          </div>

          <div className="grid-2-1">
            <div className="card card--padded col gap-16">
              <div className="between">
                <div className="col">
                  <span className="h-section">Demanda nos últimos 7 dias</span>
                  <span className="text-xs muted">Confirmações por refeição</span>
                </div>
                <div className="row gap-12 text-xs muted">
                  <span className="row gap-6"><span style={{ width: 10, height: 10, background: 'var(--brand)', borderRadius: 2 }} /> Almoço</span>
                  <span className="row gap-6"><span style={{ width: 10, height: 10, background: 'var(--green-200)', borderRadius: 2 }} /> Jantar</span>
                </div>
              </div>
              <DemandChart data={demand7d} />
            </div>

            <div className="card card--padded col gap-16">
              <div className="col">
                <span className="h-section">Refeição atual</span>
                <span className="text-xs muted">Almoço — {almoco.time}</span>
              </div>
              <div className="row gap-16" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Donut value={almoco.confirmados} max={almoco.capacidade} sublabel={`${almoco.confirmados}/${almoco.capacidade}`} />
              </div>
              <div className="col gap-8">
                <div className="between text-sm"><span className="muted">Padrão</span><span className="weight-600">312</span></div>
                <div className="between text-sm"><span className="muted">Adaptada</span><span className="weight-600">75</span></div>
                <div className="between text-sm"><span className="muted">Sem-mostras</span><span className="weight-600">4,2%</span></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--divider)' }}>
              <div className="col">
                <span className="h-section">Confirmações recentes</span>
                <span className="text-xs muted">Atualizado há 12 segundos</span>
              </div>
              <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()}>Atualizar</Button>
            </div>
            <ConfirmationTable confirmations={recentConfirmations} />
          </div>
        </div>
      </div>
      <Modal
        open={editingNotice}
        onClose={() => setEditingNotice(false)}
        title="Editar aviso operacional"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingNotice(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => { setNoticeText(draftNotice); setEditingNotice(false); toast.success('Aviso atualizado com sucesso!'); }}>Salvar</Button>
          </>
        }
      >
        <Field label="Texto do aviso">
          <TextInput value={draftNotice} onChange={e => setDraftNotice(e.target.value)} />
        </Field>
      </Modal>
    </>
  );
}
