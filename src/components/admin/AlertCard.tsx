import { AlertTriangle } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import type { Alert, AlertLevel } from '@/types'; // Garanta que AlertLevel está importado se existir

// Forçamos o Record a aceitar qualquer AlertLevel como chave válida
const levelConfig: Record<string, { tone: 'red' | 'yellow' | 'purple'; label: string; bg: string; color: string }> = {
  critical: { tone: 'red' as const, label: 'Crítico',     bg: 'var(--error-50)',  color: 'var(--error)'  },
  warning:  { tone: 'yellow' as const, label: 'Atenção',    bg: 'var(--warn-50)',   color: '#854D0E'       },
  info:     { tone: 'purple' as const, label: 'Informativo', bg: 'var(--info-50)',   color: 'var(--info)'   },
  // Fallbacks para mapear compatibilidade caso dados antigos tragam 'crit' ou 'warn' da API
  crit:     { tone: 'red' as const, label: 'Crítico',     bg: 'var(--error-50)',  color: 'var(--error)'  },
  warn:     { tone: 'yellow' as const, label: 'Atenção',    bg: 'var(--warn-50)',   color: '#854D0E'       },
};

export function AlertCard({ alert }: { alert: Alert }) {
  // Fazemos uma asserção de tipo simples (as string) para indexar sem reclamações implícitas de 'any'
  const cfg = levelConfig[alert.level as string] || levelConfig.info;

  const formattedTime = alert.createdAt && alert.createdAt.includes('T')
    ? alert.createdAt.split('T')[1].substring(0, 5)
    : alert.createdAt || '';

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
      <span className="text-xs muted" style={{ whiteSpace: 'nowrap' }}>{formattedTime}</span>
      <Button variant="secondary" size="sm">Ver item</Button>
    </div>
  );
}