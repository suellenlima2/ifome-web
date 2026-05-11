import { AlertTriangle } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import type { Alert } from '@/types';

const levelConfig = {
  crit: { tone: 'red'    as const, label: 'Crítico',     bg: 'var(--error-50)',  color: 'var(--error)'  },
  warn: { tone: 'yellow' as const, label: 'Atenção',     bg: 'var(--warn-50)',   color: '#854D0E'       },
  info: { tone: 'purple' as const, label: 'Informativo', bg: 'var(--info-50)',   color: 'var(--info)'   },
};

export function AlertCard({ alert }: { alert: Alert }) {
  const cfg = levelConfig[alert.level];
  return (
    <div className="row gap-12" style={{ padding: '16px 20px', borderBottom: '1px solid var(--divider)' }}>
      <span className="center" style={{ width: 36, height: 36, borderRadius: 8, background: cfg.bg, color: cfg.color, flexShrink: 0 }}>
        <AlertTriangle size={16} />
      </span>
      <div className="col" style={{ flex: 1 }}>
        <div className="row gap-8" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="weight-600 text-sm">{alert.title}</span>
          <Tag tone={cfg.tone}>{cfg.label}</Tag>
        </div>
        <span className="text-xs muted">{alert.body}</span>
      </div>
      <span className="text-xs muted" style={{ whiteSpace: 'nowrap' }}>{alert.at}</span>
      <Button variant="secondary" size="sm">Ver item</Button>
    </div>
  );
}
