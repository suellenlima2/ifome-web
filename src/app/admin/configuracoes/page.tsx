'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { Toggle } from '@/components/ui/Toggle';
import { AdminTopbar } from '@/components/layout/AdminTopbar';

export default function AdminConfiguracoesPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [autoLow, setAutoLow] = useState(true);
  const [orig, setOrig] = useState({ emailNotif: true, pushNotif: true, autoLow: true });

  return (
    <>
      <AdminTopbar title="Configurações" sub="Preferências e informações do RU" />
      <div className="main__scroll col gap-20" style={{ maxWidth: 800 }}>
        <div className="card card--padded col gap-16">
          <span className="h-section">Perfil do gerente</span>
          <div className="row gap-16">
            <Avatar name="Mariana Costa" size="xl" />
            <div className="col gap-8" style={{ flex: 1 }}>
              <Field label="Nome completo"><TextInput defaultValue="Mariana Costa Almeida" /></Field>
              <Field label="E-mail institucional"><TextInput defaultValue="mariana.costa@ifal.edu.br" /></Field>
            </div>
          </div>
        </div>

        <div className="card card--padded col gap-16">
          <span className="h-section">Notificações</span>
          <div className="between">
            <div className="col">
              <span className="weight-500 text-sm">E-mail diário (resumo)</span>
              <span className="text-xs muted">Resumo diário às 07:00</span>
            </div>
            <Toggle on={emailNotif} onChange={setEmailNotif} />
          </div>
          <div className="divider" />
          <div className="between">
            <div className="col">
              <span className="weight-500 text-sm">Push em tempo real</span>
              <span className="text-xs muted">Alertas críticos imediatos</span>
            </div>
            <Toggle on={pushNotif} onChange={setPushNotif} />
          </div>
          <div className="divider" />
          <div className="between">
            <div className="col">
              <span className="weight-500 text-sm">Reposição automática</span>
              <span className="text-xs muted">Sugerir pedido quando crítico</span>
            </div>
            <Toggle on={autoLow} onChange={setAutoLow} />
          </div>
        </div>

        <div className="card card--padded col gap-12">
          <span className="h-section">RU — Informações</span>
          <Field label="Nome"><TextInput defaultValue="Restaurante Universitário — IFAL Arapiraca" /></Field>
          <div className="grid-1-1">
            <Field label="Capacidade total"><TextInput defaultValue="540" /></Field>
            <Field label="Tempo de tolerância (min)"><TextInput defaultValue="15" /></Field>
          </div>
        </div>

        <div className="row gap-12" style={{ justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => { setEmailNotif(orig.emailNotif); setPushNotif(orig.pushNotif); setAutoLow(orig.autoLow); }}>Cancelar</Button>
          <Button variant="primary" icon={Check} onClick={() => { setOrig({ emailNotif, pushNotif, autoLow }); toast.success('Configurações salvas com sucesso!'); }}>Salvar alterações</Button>
        </div>
      </div>
    </>
  );
}
