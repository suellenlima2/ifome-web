'use client';

import { useState } from 'react';
import { Upload, Plus, Package, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { StockTable } from '@/components/admin/StockTable';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/TextInput';
import { toast } from 'react-toastify';
import { useStock, useUpdateStock, useAddStock } from '@/hooks/useStock';
import { cn } from '@/utils/cn';
import type { StockItem, StockStatus } from '@/types';

const FILTERS: { k: StockStatus | 'all'; l: string }[] = [
  { k: 'all',  l: 'Todos'   },
  { k: 'ok',   l: 'OK'      },
  { k: 'low',  l: 'Baixo'   },
  { k: 'crit', l: 'Crítico' },
];

const EMPTY_PRODUCT: Omit<StockItem, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
  name: '', 
  category: '', 
  currentQuantity: 0, 
  minQuantity: 0, 
  maxQuantity: 0, 
  unit: 'kg',
};

export default function AdminEstoquePage() {
  const [filter, setFilter] = useState<StockStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<StockItem | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<StockItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>>(EMPTY_PRODUCT);
  
  const { data: rawItems, isLoading } = useStock(filter);
  const { mutate: updateStock, isPending: updatingPending } = useUpdateStock();
  const { mutate: addStock, isPending: addingPending } = useAddStock();
  const { data: allItems } = useStock('all');

  const q = search.toLowerCase();
  const items = q 
    ? (rawItems ?? []).filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) 
    : rawItems;

  const totalItems = allItems?.length ?? 0;
  const lowItems = allItems?.filter(s => s.status === 'low').length ?? 0;
  const critItems = allItems?.filter(s => s.status === 'crit').length ?? 0;

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = () => {
      toast.success('Planilha importada com sucesso!');
    };
    input.click();
  }

  function handleAddProduct() {
    const status: StockStatus = newProduct.currentQuantity < newProduct.minQuantity
      ? (newProduct.currentQuantity < newProduct.minQuantity * 0.5 ? 'crit' : 'low')
      : 'ok';
    
    addStock({ ...newProduct, status } as any, {
      onSuccess: () => {
        setAddingProduct(false);
        setNewProduct(EMPTY_PRODUCT);
      },
    });
  }

  return (
    <>
      <AdminTopbar
        title="Estoque"
        sub="Controle de ingredientes e insumos"
        primaryLabel="Adicionar produto"
        onPrimary={() => setAddingProduct(true)}
        onSearch={setSearch}
      />
      <div className="main__scroll">
        <div className="col gap-20">
          <div className="grid-3">
            <Stat label="Itens totais" value={totalItems} icon={Package} sub="cadastrados" />
            <Stat label="Estoque baixo" value={lowItems} icon={AlertTriangle} sub="atenção" />
            <Stat label="Crítico" value={critItems} icon={AlertCircle} deltaTone="down" delta="reposição urgente" />
          </div>

          <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
            {FILTERS.map(({ k, l }) => (
              <button key={k} className={cn('btn', filter === k ? 'btn--primary' : 'btn--secondary', 'btn--sm')} onClick={() => setFilter(k)}>
                {l}
              </button>
            ))}
            <span className="spacer" />
            <Button variant="secondary" size="sm" icon={Upload} onClick={handleImport}>Importar planilha</Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setAddingProduct(true)}>Adicionar produto</Button>
          </div>

          {isLoading ? (
            <div className="card col gap-12" style={{ padding: 16 }}>
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={48} r={8} />)}
            </div>
          ) : (
            <div className="card">
              <StockTable items={items ?? []} onEdit={setEditing} />
            </div>
          )}
        </div>
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Editar produto"
        sub={editing?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button variant="primary" disabled={updatingPending} onClick={() => {
              if (editing) {
                const newStatus: StockStatus = editing.currentQuantity < editing.minQuantity
                  ? (editing.currentQuantity < editing.minQuantity * 0.5 ? 'crit' : 'low') : 'ok';
                updateStock({ id: editing.id, updates: { ...editing, status: newStatus } }, { onSuccess: () => setEditing(null) });
              }
            }}>
              {updatingPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </>
        }
      >
        {editing && (
          <div className="col gap-12">
            <Field label="Estoque atual">
              <TextInput
                type="number"
                value={editing.currentQuantity}
                onChange={e => setEditing({ ...editing, currentQuantity: Number(e.target.value) })}
              />
            </Field>
            <Field label="Estoque mínimo">
              <TextInput
                type="number"
                value={editing.minQuantity}
                onChange={e => setEditing({ ...editing, minQuantity: Number(e.target.value) })}
              />
            </Field>
          </div>
        )}
      </Modal>

      <Modal
        open={addingProduct}
        onClose={() => setAddingProduct(false)}
        title="Adicionar produto"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddingProduct(false)}>Cancelar</Button>
            <Button variant="primary" icon={Check} disabled={addingPending} onClick={handleAddProduct}>
              {addingPending ? 'Adicionando…' : 'Adicionar'}
            </Button>
          </>
        }
      >
        <div className="col gap-12">
          <Field label="Nome">
            <TextInput value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Arroz" />
          </Field>
          <Field label="Categoria">
            <TextInput value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} placeholder="Ex: Grão" />
          </Field>
          <Field label="Unidade">
            <TextInput value={newProduct.unit} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))} placeholder="Ex: kg" />
          </Field>
          <Field label="Estoque atual">
            <TextInput type="number" value={newProduct.currentQuantity} onChange={e => setNewProduct(p => ({ ...p, currentQuantity: Number(e.target.value) }))} />
          </Field>
          <Field label="Estoque mínimo">
            <TextInput type="number" value={newProduct.minQuantity} onChange={e => setNewProduct(p => ({ ...p, minQuantity: Number(e.target.value) }))} />
          </Field>
          <Field label="Estoque máximo">
            <TextInput type="number" value={newProduct.maxQuantity} onChange={e => setNewProduct(p => ({ ...p, maxQuantity: Number(e.target.value) }))} />
          </Field>
        </div>
      </Modal>
    </>
  );
}