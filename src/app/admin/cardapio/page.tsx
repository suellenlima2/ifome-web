'use client';

import { useState, useRef } from 'react';
import { Calendar, Filter, ChevronRight, ArrowLeft, Plus, Check, Utensils, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { Modal } from '@/components/ui/Modal';
import { RestrictionChip } from '@/components/student/RestrictionChip';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useTodayMenu } from '@/hooks/useMenu';
import { mockNextDays } from '@/services/mocks/menuMocks';
import { cn } from '@/utils/cn';
import type { MealKey, Dish } from '@/types';

type DayEntry = { date: string; status: string; almoco: string | null; jantar: string | null };

const INITIAL_DAYS: DayEntry[] = [
  { date: 'Sex, 09/05', status: 'ativo',    almoco: 'Bife Acebolado',   jantar: 'Filé de Tilápia' },
  { date: 'Sáb, 10/05', status: 'fechado',  almoco: null,               jantar: null               },
  { date: 'Dom, 11/05', status: 'fechado',  almoco: null,               jantar: null               },
  ...mockNextDays.map(d => ({ date: d.date, status: 'rascunho', almoco: d.almoco, jantar: d.jantar })),
];

export default function AdminCardapioPage() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [days, setDays] = useState<DayEntry[]>(INITIAL_DAYS);
  const [editingDayIndex, setEditingDayIndex] = useState(0);
  const [tab, setTab] = useState<MealKey>('almoco');
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newStatus, setNewStatus] = useState('rascunho');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [monthLabel, setMonthLabel] = useState('Maio 2026');
  const [published, setPublished] = useState(true);
  const [addingDish, setAddingDish] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [editDishName, setEditDishName] = useState('');
  const [editDishDesc, setEditDishDesc] = useState('');
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [localDishes, setLocalDishes] = useState<Partial<Record<MealKey, Dish[]>>>({});
  const monthInputRef = useRef<HTMLInputElement>(null);
  const { data: menu } = useTodayMenu();
  const meal = menu?.meals.find(m => m.key === tab);

  const dishes: Dish[] = localDishes[tab] ?? meal?.dishes ?? [];

  const displayDays = statusFilter === 'Todos'
    ? days
    : days.filter(d => d.status === statusFilter.toLowerCase());

  const currentDay = days[editingDayIndex];

  function openEdit(index: number) {
    setEditingDayIndex(index);
    setLocalDishes({});
    setTab('almoco');
    setView('edit');
  }

  function handleCreateMenu() {
    if (!newDate) { toast.error('Selecione uma data.'); return; }
    const newDay: DayEntry = { date: newDate, status: newStatus, almoco: null, jantar: null };
    const newIndex = days.length;
    setDays(prev => [...prev, newDay]);
    setShowNewMenu(false);
    setNewDate('');
    setNewStatus('rascunho');
    openEdit(newIndex);
  }

  function handleAddDish() {
    if (!newDishName.trim()) { toast.error('Informe o nome do prato.'); return; }
    const newDish: Dish = {
      id: String(Date.now()),
      name: newDishName.trim(),
      desc: newDishDesc.trim(),
      cat: 'proteina',
      tags: [],
    };
    setLocalDishes(prev => ({ ...prev, [tab]: [...(prev[tab] ?? meal?.dishes ?? []), newDish] }));
    setAddingDish(false);
    toast.success('Prato adicionado com sucesso!');
  }

  function handleRemoveDish(id: string) {
    setLocalDishes(prev => ({
      ...prev,
      [tab]: (prev[tab] ?? meal?.dishes ?? []).filter(d => d.id !== id),
    }));
    toast.success('Prato removido.');
  }

  function handleEditDishSave() {
    setLocalDishes(prev => ({
      ...prev,
      [tab]: (prev[tab] ?? meal?.dishes ?? []).map(d =>
        d.id === editingDish!.id ? { ...d, name: editDishName, desc: editDishDesc } : d
      ),
    }));
    setEditingDish(null);
    toast.success('Prato atualizado com sucesso!');
  }

  function handleSave() {
    const proteinaDish = dishes.find(d => d.cat === 'proteina');
    setDays(prev => prev.map((d, i) =>
      i === editingDayIndex
        ? {
            ...d,
            almoco: tab === 'almoco' && proteinaDish ? proteinaDish.name : d.almoco,
            jantar: tab === 'jantar' && proteinaDish ? proteinaDish.name : d.jantar,
          }
        : d
    ));
    toast.success('Alterações salvas com sucesso!');
  }

  if (view === 'list') return (
    <>
      <input
        ref={monthInputRef}
        type="month"
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.value) {
            const [y, m] = e.target.value.split('-');
            const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
            setMonthLabel(`${months[Number(m) - 1]} ${y}`);
          }
        }}
      />
      <AdminTopbar title="Cardápios" sub="Gerencie os cardápios da semana" primaryLabel="Novo cardápio" onPrimary={() => setShowNewMenu(true)} />
      <div className="main__scroll col gap-20">
        <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
          <Tag tone="green" dot>Ativo</Tag>
          <Tag tone="yellow" dot>Rascunho</Tag>
          <Tag dot>Fechado</Tag>
          <span className="spacer" />
          <Button variant="secondary" size="sm" icon={Calendar} onClick={() => monthInputRef.current?.click()}>{monthLabel}</Button>
          <div style={{ position: 'relative' }}>
            <Button variant="secondary" size="sm" icon={Filter} onClick={() => setFilterOpen(f => !f)}>
              {statusFilter !== 'Todos' ? `Status: ${statusFilter}` : 'Filtros'}
            </Button>
            {filterOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, zIndex: 10, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['Todos', 'Ativo', 'Rascunho', 'Fechado'].map(opt => (
                  <button
                    key={opt}
                    className={cn('btn btn--ghost btn--sm', statusFilter === opt && 'btn--primary')}
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => { setStatusFilter(opt); setFilterOpen(false); }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Data</th><th>Status</th><th>Almoço — prato principal</th><th>Jantar — prato principal</th><th></th></tr>
            </thead>
            <tbody>
              {displayDays.map((d, i) => {
                const realIndex = days.indexOf(d);
                return (
                  <tr key={i} onClick={() => openEdit(realIndex)} style={{ cursor: 'pointer' }}>
                    <td className="weight-600">{d.date}</td>
                    <td>
                      {d.status === 'ativo' ? <Tag tone="green">Ativo</Tag> :
                       d.status === 'rascunho' ? <Tag tone="yellow">Rascunho</Tag> :
                       <Tag>Fechado</Tag>}
                    </td>
                    <td className={!d.almoco ? 'muted' : ''}>{d.almoco ?? '—'}</td>
                    <td className={!d.jantar ? 'muted' : ''}>{d.jantar ?? '—'}</td>
                    <td style={{ width: 60, textAlign: 'right' }}>
                      <ChevronRight size={16} style={{ color: 'var(--text-3)' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <Modal
        open={showNewMenu}
        onClose={() => setShowNewMenu(false)}
        title="Novo cardápio"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowNewMenu(false)}>Cancelar</Button>
            <Button variant="primary" icon={Check} onClick={handleCreateMenu}>Criar</Button>
          </>
        }
      >
        <div className="col gap-12">
          <Field label="Data"><TextInput type="date" value={newDate} onChange={e => setNewDate(e.target.value)} /></Field>
          <Field label="Status">
            <select className="text-input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="rascunho">Rascunho</option>
              <option value="ativo">Ativo</option>
              <option value="fechado">Fechado</option>
            </select>
          </Field>
        </div>
      </Modal>
    </>
  );

  return (
    <>
      <AdminTopbar title="Editar cardápio" sub={currentDay?.date ?? ''} />
      <div className="main__scroll col gap-20">
        <div className="row gap-12">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => setView('list')}>Voltar</Button>
          <div className="col">
            <span className="h-section">{currentDay?.date ?? ''}</span>
            <span className="text-xs muted">{published ? 'Cardápio ativo · publicado às 06:12' : 'Cardápio despublicado'}</span>
          </div>
          <span className="spacer" />
          <Button variant="secondary" size="sm" onClick={() => { setPublished(p => !p); toast.success(published ? 'Cardápio despublicado!' : 'Cardápio publicado!'); }}>
            {published ? 'Despublicar' : 'Publicar'}
          </Button>
          <Button variant="primary" size="sm" icon={Check} onClick={handleSave}>Salvar alterações</Button>
        </div>

        <div className="row gap-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {menu?.meals.map(m => (
            <div key={m.key} onClick={() => setTab(m.key)} style={{
              padding: '10px 16px', cursor: 'pointer', fontWeight: 500, fontSize: 14,
              color: tab === m.key ? 'var(--brand-text)' : 'var(--text-3)',
              borderBottom: `2px solid ${tab === m.key ? 'var(--brand)' : 'transparent'}`,
              marginBottom: -1,
            }}>
              {m.label} <span className="text-xs muted" style={{ marginLeft: 6 }}>{dishes.length} pratos</span>
            </div>
          ))}
        </div>

        {meal && (
          <div className="grid-2-1">
            <div className="card card--padded col gap-12">
              <div className="between">
                <span className="h-section">Pratos · {meal.label}</span>
                <Button variant="secondary" size="sm" icon={Plus} onClick={() => { setNewDishName(''); setNewDishDesc(''); setAddingDish(true); }}>Adicionar prato</Button>
              </div>
              <div className="col gap-8">
                {dishes.map(d => (
                  <div key={d.id} className="row gap-12" style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10 }}>
                    <span className="center" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--brand-soft)', color: 'var(--brand-text)' }}>
                      <Utensils size={16} />
                    </span>
                    <div className="col" style={{ flex: 1, minWidth: 0 }}>
                      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
                        <span className="weight-600 text-sm">{d.name}</span>
                        {d.tags.slice(0, 3).map(t => <RestrictionChip key={t} k={t} />)}
                      </div>
                      <span className="text-xs muted">{d.desc}</span>
                    </div>
                    <button className="icon-btn" onClick={() => { setEditingDish(d); setEditDishName(d.name); setEditDishDesc(d.desc); }}><Pencil size={16} /></button>
                    <button className="icon-btn" style={{ color: 'var(--error)' }} onClick={e => { e.stopPropagation(); handleRemoveDish(d.id); }}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col gap-16">
              <div className="card card--padded col gap-12">
                <span className="h-section">Janela de confirmação</span>
                <Field label="Início"><TextInput defaultValue="06:00" /></Field>
                <Field label="Encerramento"><TextInput defaultValue="10:00" /></Field>
                <Field label="Capacidade máxima"><TextInput defaultValue={String(meal.capacidade)} /></Field>
              </div>
              <div className="card card--padded col gap-10">
                <span className="h-section">Tags da refeição</span>
                <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
                  {['vegetarian', 'vegan', 'glutenFree', 'lactoseFree', 'spicy'].map(k => <RestrictionChip key={k} k={k} />)}
                </div>
                <span className="text-xs muted">Aplicadas automaticamente com base nos pratos.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={addingDish}
        onClose={() => setAddingDish(false)}
        title="Adicionar prato"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddingDish(false)}>Cancelar</Button>
            <Button variant="primary" icon={Check} onClick={handleAddDish}>Adicionar</Button>
          </>
        }
      >
        <div className="col gap-12">
          <Field label="Nome do prato">
            <TextInput value={newDishName} onChange={e => setNewDishName(e.target.value)} placeholder="Ex: Bife Acebolado" />
          </Field>
          <Field label="Descrição">
            <TextInput value={newDishDesc} onChange={e => setNewDishDesc(e.target.value)} placeholder="Ex: Acompanha arroz e feijão" />
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!editingDish}
        onClose={() => setEditingDish(null)}
        title="Editar prato"
        sub={editingDish?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingDish(null)}>Cancelar</Button>
            <Button variant="primary" icon={Check} onClick={handleEditDishSave}>Salvar</Button>
          </>
        }
      >
        {editingDish && (
          <div className="col gap-12">
            <Field label="Nome do prato">
              <TextInput value={editDishName} onChange={e => setEditDishName(e.target.value)} />
            </Field>
            <Field label="Descrição">
              <TextInput value={editDishDesc} onChange={e => setEditDishDesc(e.target.value)} />
            </Field>
          </div>
        )}
      </Modal>
    </>
  );
}
