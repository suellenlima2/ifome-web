import { ChevronRight } from 'lucide-react';
import { Bar } from '@/components/ui/Bar';
import { StatusPill } from '@/components/ui/StatusPill';
import type { StockItem } from '@/types';

interface StockTableProps {
  items: StockItem[];
  onEdit?: (item: StockItem) => void;
}

export function StockTable({ items, onEdit }: StockTableProps) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Estoque atual</th>
            <th>Mínimo</th>
            <th>Nível</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(s => (
            <tr key={s.id} onClick={() => onEdit?.(s)} style={{ cursor: 'pointer' }}>
              <td className="weight-600">{s.name}</td>
              <td className="muted">{s.cat}</td>
              <td className="mono">{s.stock} {s.unit}</td>
              <td className="mono muted">{s.min} {s.unit}</td>
              <td style={{ width: 200 }}><Bar value={s.stock} max={s.max} tone={s.status} /></td>
              <td><StatusPill status={s.status} /></td>
              <td style={{ width: 60, textAlign: 'right' }}>
                <ChevronRight size={16} style={{ color: 'var(--text-3)' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
