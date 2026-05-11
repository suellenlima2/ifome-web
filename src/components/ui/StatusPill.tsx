import { Tag } from './Tag';
import type { StockStatus } from '@/types';

const statusMap: Record<StockStatus, { tone: 'green' | 'yellow' | 'red'; label: string }> = {
  ok:   { tone: 'green',  label: 'OK'      },
  low:  { tone: 'yellow', label: 'Baixo'   },
  crit: { tone: 'red',    label: 'Crítico' },
};

export function StatusPill({ status }: { status: StockStatus }) {
  const { tone, label } = statusMap[status];
  return <Tag tone={tone} dot>{label}</Tag>;
}
