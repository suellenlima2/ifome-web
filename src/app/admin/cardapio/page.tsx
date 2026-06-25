'use client';

import { useState, useRef } from 'react';
import { Calendar, Filter, ChevronRight, ArrowLeft, Plus, Check, Utensils, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { RestrictionChip } from '@/components/student/RestrictionChip';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useWeekMenu, useSaveMenuAdmin } from '@/hooks/useMenu';
import { cn } from '@/utils/cn';
import type { MealKey, Dish, WeekDay } from '@/types';

export default function AdminCardapioPage() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [tab, setTab] = useState<MealKey>('lunch');
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [monthLabel, setMonthLabel] = useState('Junho 2026');
  const [addingDish, setAddingDish] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [editDishName, setEditDishName] = useState('');
  const [editDishDesc, setEditDishDesc] = useState('');
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  
  const [localMeals, setLocalMeals] = useState<any[]>([]);

  const monthInputRef = useRef<HTMLInputElement>(null);

  const { data: weekData, isLoading, isError, refetch } = useWeekMenu(null);
  const { mutate: saveMenu, isPending: isSaving } = useSaveMenuAdmin();

  if (isLoading) return (
    <>
      <AdminTopbar title="Cardápios" sub="Carregando cronograma..." />
      <div className="main__scroll col gap-12" style={{ padding: 24 }}>
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h={64} r={10} />)}
      </div>
    </>
  );

  if (isError || !weekData) return (
    <>
      <AdminTopbar title="Cardápios" />
      <div className="main__scroll center" style={{ height: 400 }}>
        <div className="col gap-12 center">
          <span className="muted">Não foi possível carregar os cardápios.</span>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      </div>
    </>
  );

  const days: WeekDay[] = weekData;

  const displayDays = statusFilter === 'Todos'
    ? days
    : days.filter(d => (statusFilter === 'Hoje' ? d.today : !d.today));

  const currentDay = days[selectedDayIndex];
  const activeMeal = localMeals.find(m => m.period === tab);
  const dishes: Dish[] = activeMeal?.dishes ?? [];

  function openEdit(index: number) {
    setSelectedDayIndex(index);
    setLocalMeals(JSON.parse(JSON.stringify(days[index].meals || [])));
    setTab('lunch');
    setView('edit');
  }

  function handleCreateMenu() {
    if (!newDate) { toast.error('Selecione uma data.'); return; }
    
    const payload = {
      date: newDate,
      meals: [
        { period: 'lunch', startTime: '11:00', endTime: '14:00', capacity: 200, dishes: [] },
        { period: 'dinner', startTime: '17:00', endTime: '19:30', capacity: 150, dishes: [] }
      ]
    };

    saveMenu(payload, {
      onSuccess: () => {
        setShowNewMenu(false);
        setNewDate('');
        refetch();
      }
    });
  }

  function handleAddDish() {
    if (!newDishName.trim()) { toast.error('Informe o nome do prato.'); return; }
    
    const newDish: Dish = {
      id: String(Date.now()),
      name: newDishName.trim(),
      description: newDishDesc.trim(),
      category: 'protein',
      restrictions: [],
    };

    setLocalMeals(prev => prev.map(m => 
      m.period === tab ? { ...m, dishes: [...(m.dishes || []), newDish] } : m
    ));
    
    setAddingDish(false);
    setNewDishName('');
    setNewDishDesc('');
    toast.success('Prato adicionado localmente!');
  }

  function handleRemoveDish(id: string) {
    setLocalMeals(prev => prev.map(m => 
      m.period === tab ? { ...m, dishes: (m.dishes || []).filter((d: Dish) => d.id !== id) } : m
    ));
    toast.success('Prato removido.');
  }

  function handleEditDishSave() {
    if (!editingDish) return;
    setLocalMeals(prev => prev.map(m => 
      m.period === tab ? {
        ...m,
        dishes: (m.dishes || []).map((d: Dish) => 
          d.id === editingDish.id ? { ...d, name: editDishName, description: editDishDesc } : d
        )
      } : m
    ));
    setEditingDish(null);
    toast.success('Prato atualizado!');
  }

  function handleSaveToServer() {
    const payload = {
      date: currentDay.date,
      meals: localMeals
    };

    saveMenu(payload, {
      onSuccess: () => {
        setView('list');
        refetch();
      }
    });
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
      <AdminTopbar title="Cardápios" sub="Gerencie o cronograma de refeições" primaryLabel="Novo cardápio" onPrimary={() => setShowNewMenu(true)} />
      <div className="main__scroll col gap-20">
        <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
          <Tag tone="green" dot>Hoje</Tag>
          <Tag dot>Próximos dias</Tag>
          <span className="spacer" />
          <Button variant="secondary" size="sm" icon={Calendar} onClick={() => monthInputRef.current?.click()}>{monthLabel}</Button>
          <div style={{ position: 'relative' }}>
            <Button variant="secondary" size="sm" icon={Filter} onClick={() => setFilterOpen(f => !f)}>
              {statusFilter !== 'Todos' ? `Visualizar: ${statusFilter}` : 'Filtros'}
            </Button>
            {filterOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, zIndex: 10, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['Todos', 'Hoje'].map(opt => (
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
                <tr>
                  <th>Data do cardápio</th>
                  <th>Status</th>
                  <th>Almoço principal</th>
                  <th>Jantar principal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayDays.map((d, i) => {
                  const realIndex = days.indexOf(d);
                  const lunchDish = d.meals?.find(m => m.period === 'lunch')?.dishes?.[0]?.name ?? '—';
                  const dinnerDish = d.meals?.find(m => m.period === 'dinner')?.dishes?.[0]?.name ?? '—';

                  return (
                    <tr key={i} onClick={() => openEdit(realIndex)} style={{ cursor: 'pointer' }}>
                      <td className="weight-600">{d.date}</td>
                      <td>
                        {d.today ? <Tag tone="green">Hoje</Tag> : <Tag tone="gray">Agendado</Tag>}
                      </td>
                      <td className={lunchDish === '—' ? 'muted' : ''}>{lunchDish}</td>
                      <td className={dinnerDish === '—' ? 'muted' : ''}>{dinnerDish}</td>
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
        title="Agendar novo cardápio"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowNewMenu(false)}>Cancelar</Button>
            <Button variant="primary" icon={Check} disabled={isSaving} onClick={handleCreateMenu}>
              {isSaving ? 'Criando...' : 'Criar'}
            </Button>
          </>
        }
      >
        <div className="col gap-12">
          <Field label="Selecione a data">
            <TextInput type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
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
            <span className="text-xs muted">Modo de edição em tempo real</span>
          </div>
          <span className="spacer" />
          <Button variant="primary" size="sm" icon={Check} disabled={isSaving} onClick={handleSaveToServer}>
            {isSaving ? 'Salvando na API...' : 'Salvar alterações'}
          </Button>
        </div>

        <div className="row gap-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {localMeals.map(m => (
            <div key={m.period} onClick={() => setTab(m.period)} style={{
              padding: '10px 16px', cursor: 'pointer', fontWeight: 500, fontSize: 14,
              color: tab === m.period ? 'var(--brand-text)' : 'var(--text-3)',
              borderBottom: `2px solid ${tab === m.period ? 'var(--brand)' : 'transparent'}`,
              marginBottom: -1,
            }}>
              {m.period === 'breakfast' ? 'Café da Manhã' : m.period === 'lunch' ? 'Almoço' : 'Jantar'} 
              <span className="text-xs muted" style={{ marginLeft: 6 }}>{(m.dishes ?? []).length} pratos</span>
            </div>
          ))}
        </div>

        {activeMeal && (
          <div className="grid-2-1">
            <div className="card card--padded col gap-12">
              <div className="between">
                <span className="h-section">Pratos do {activeMeal.period === 'lunch' ? 'Almoço' : 'Jantar'}</span>
                <Button variant="secondary" size="sm" icon={Plus} onClick={() => { setAddingDish(true); }}>Adicionar prato</Button>
              </div>
              <div className="col gap-8">
                {dishes.map((d: Dish) => (
                  <div key={d.id} className="row gap-12" style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10 }}>
                    <span className="center" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--brand-soft)', color: 'var(--brand-text)' }}>
                      <Utensils size={16} />
                    </span>
                    <div className="col" style={{ flex: 1, minWidth: 0 }}>
                      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
                        <span className="weight-600 text-sm">{d.name}</span>
                        {d.restrictions?.slice(0, 3).map(t => <RestrictionChip key={t} k={t} />)}
                      </div>
                      <span className="text-xs muted">{d.description}</span>
                    </div>
                    <button className="icon-btn" onClick={() => { setEditingDish(d); setEditDishName(d.name); setEditDishDesc(d.description || ''); }}><Pencil size={16} /></button>
                    <button className="icon-btn" style={{ color: 'var(--error)' }} onClick={() => handleRemoveDish(d.id)}><Trash2 size={16} /></button>
                  </div>
                ))}
                {dishes.length === 0 && <span className="text-xs muted text-center p-8">Nenhum prato inserido nesta refeição.</span>}
              </div>
            </div>

            <div className="col gap-16">
              <div className="card card--padded col gap-12">
                <span className="h-section">Janela de confirmação</span>
                <Field label="Início"><TextInput value={activeMeal.startTime} onChange={e => setLocalMeals(prev => prev.map(m => m.period === tab ? { ...m, startTime: e.target.value } : m))} /></Field>
                <Field label="Encerramento"><TextInput value={activeMeal.endTime} onChange={e => setLocalMeals(prev => prev.map(m => m.period === tab ? { ...m, endTime: e.target.value } : m))} /></Field>
                <Field label="Capacidade máxima"><TextInput type="number" value={String(activeMeal.capacity)} onChange={e => setLocalMeals(prev => prev.map(m => m.period === tab ? { ...m, capacity: Number(e.target.value) } : m))} /></Field>
              </div>
              <div className="card card--padded col gap-10">
                <span className="h-section">Filtros automáticos aplicados</span>
                <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
                  {['vegetarian', 'vegan', 'gluten_free', 'lactose_free', 'spicy'].map(k => <RestrictionChip key={k} k={k as any} />)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={addingDish} onClose={() => setAddingDish(false)} title="Adicionar prato" footer={
        <>
          <Button variant="secondary" onClick={() => setAddingDish(false)}>Cancelar</Button>
          <Button variant="primary" icon={Check} onClick={handleAddDish}>Adicionar</Button>
        </>
      }>
        <div className="col gap-12">
          <Field label="Nome do prato"><TextInput value={newDishName} onChange={e => setNewDishName(e.target.value)} placeholder="Ex: Frango Grelhado" /></Field>
          <Field label="Descrição"><TextInput value={newDishDesc} onChange={e => setNewDishDesc(e.target.value)} placeholder="Ex: Filé de peito temperado com ervas" /></Field>
        </div>
      </Modal>

      <Modal open={!!editingDish} onClose={() => setEditingDish(null)} title="Editar prato" sub={editingDish?.name} footer={
        <>
          <Button variant="secondary" onClick={() => setEditingDish(null)}>Cancelar</Button>
          <Button variant="primary" icon={Check} onClick={handleEditDishSave}>Salvar</Button>
        </>
      }>
        {editingDish && (
          <div className="col gap-12">
            <Field label="Nome do prato"><TextInput value={editDishName} onChange={e => setEditDishName(e.target.value)} /></Field>
            <Field label="Descrição"><TextInput value={editDishDesc} onChange={e => setEditDishDesc(e.target.value)} /></Field>
          </div>
        )}
      </Modal>
    </>
  );
}