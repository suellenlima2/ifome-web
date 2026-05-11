'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Empty } from '@/components/ui/Empty';
import { Bar } from '@/components/ui/Bar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { AlertCard } from '@/components/admin/AlertCard';
import { useAlerts } from '@/hooks/useAlerts';
import { useStock, useUpdateStock } from '@/hooks/useStock';
import type { StockStatus } from '@/types';

export default function AdminAlertasPage() {
  const { data: alerts, isLoading, isError, refetch } = useAlerts();
  const { data: stock } = useStock('all');
  const { mutate: updateStock } = useUpdateStock();
  const [editingLimits, setEditingLimits] = useState(false);
  const [limits, setLimits] = useState<Record<string, number>>({});

  if (isLoading) return (
    <>
      <AdminTopbar title="Alertas" sub="Central de alertas operacionais" />
      <div className="main__scroll">
        <div className="grid-2-1">
          <div className="card col gap-12" style={{ padding: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h={72} r={8} />)}
          </div>
          <Skeleton h={300} r={14} />
        </div>
      </div>
    </>
  );

  if (isError) return (
    <>
      <AdminTopbar title="Alertas" />
      <div className="main__scroll center" style={{ height: 400 }}>
        <div className="col gap-12 center">
          <span className="center" style={{ width: 56, height: 56, background: 'var(--error-50)', color: 'var(--error)', borderRadius: 999 }}>
            <AlertCircle size={26} />
          </span>
          <span className="weight-700">Não foi possível carregar os alertas</span>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      </div>
    </>
  );

  if (!alerts?.length) return (
    <>
      <AdminTopbar title="Alertas" />
      <div className="main__scroll">
        <div className="card" style={{ padding: 0 }}>
          <Empty
            icon={CheckCircle}
            title="Nenhum alerta ativo"
            body="Tudo dentro dos limites configurados."
            action={<Button variant="secondary" size="sm" icon={Settings}>Configurar limites</Button>}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <AdminTopbar title="Alertas" sub={`${alerts.length} alertas ativos`} />
      <div className="main__scroll">
        <div className="grid-2-1">
          <div className="card">
            <div className="between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--divider)' }}>
              <span className="h-section">Central de Alertas · {alerts.length} ativos</span>
              <Button variant="ghost" size="sm" onClick={() => toast.success('Todos os alertas marcados como lidos!')}>Marcar tudo como lido</Button>
            </div>
            <div className="col">
              {alerts.map(a => <AlertCard key={a.id} alert={a} />)}
            </div>
          </div>

          <div className="card card--padded col gap-12">
            <span className="h-section">Limites mínimos</span>
            <span className="text-xs muted">Quando um item fica abaixo do mínimo, um alerta é gerado.</span>
            <div className="col gap-12">
              {(stock ?? []).slice(0, 5).map(s => (
                <div key={s.id} className="col gap-4">
                  <div className="between text-sm">
                    <span className="weight-500">{s.name}</span>
                    <span className="mono muted">{s.min} {s.unit}</span>
                  </div>
                  <Bar value={s.stock} max={s.max} tone={s.status} />
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" icon={Settings} block onClick={() => {
              const initial: Record<string, number> = {};
              (stock ?? []).slice(0, 5).forEach(s => { initial[s.id] = s.min; });
              setLimits(initial);
              setEditingLimits(true);
            }}>Editar todos os limites</Button>
          </div>
        </div>
      </div>

      <Modal
        open={editingLimits}
        onClose={() => setEditingLimits(false)}
        title="Editar limites mínimos"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingLimits(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => {
              (stock ?? []).slice(0, 5).forEach(s => {
                const newMin = limits[s.id];
                if (newMin !== undefined && newMin !== s.min) {
                  const newStatus: StockStatus = s.stock < newMin ? (s.stock < newMin * 0.5 ? 'crit' : 'low') : 'ok';
                  updateStock({ id: s.id, updates: { min: newMin, status: newStatus } });
                }
              });
              setEditingLimits(false);
              toast.success('Limites atualizados com sucesso!');
            }}>Salvar</Button>
          </>
        }
      >
        <div className="col gap-12">
          {(stock ?? []).slice(0, 5).map(s => (
            <Field key={s.id} label={`${s.name} (atual: ${s.stock} ${s.unit})`}>
              <TextInput
                type="number"
                value={limits[s.id] ?? s.min}
                onChange={e => setLimits(prev => ({ ...prev, [s.id]: Number(e.target.value) }))}
              />
            </Field>
          ))}
        </div>
      </Modal>
    </>
  );
}
