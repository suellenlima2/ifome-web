'use client';

import { Bell, HelpCircle, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { useAlerts } from '@/hooks/useAlerts';



interface AdminTopbarProps {
  title: string;
  sub?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  onSearch?: (q: string) => void;
}

export function AdminTopbar({ title, sub, primaryLabel, onPrimary, onSearch }: AdminTopbarProps) {
  const router = useRouter();
  const { data: alerts } = useAlerts();
    const hasAlerts = (alerts?.length ?? 0) > 0;

  return (
    <div className="topbar">
      <div className="col gap-4" style={{ flex: 1, minWidth: 0 }}>
        <span className="weight-700" style={{ fontSize: 20, lineHeight: 1, color: 'var(--text)' }}>{title}</span>
        {sub && <span className="text-xs muted">{sub}</span>}
      </div>

      <div className="searchbox">
        <Search size={16} />
        <input placeholder="Buscar pratos, alunos, produtos…" onChange={e => onSearch?.(e.target.value)} />
        <span className="text-xs muted" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px' }}>⌘K</span>
      </div>

      <button className="icon-btn" onClick={() => router.push('/admin/alertas')}>
        <Bell size={18} />
        {hasAlerts && <span className="icon-btn__dot" />}
      </button>
      <button className="icon-btn topbar__help" onClick={() => toast.info('Para suporte, acesse o manual do sistema ou contate o administrador.')}>
        <HelpCircle size={18} />
      </button>

      {primaryLabel && (
        <Button icon={Plus} onClick={onPrimary}>
          {primaryLabel}
        </Button>
      )}
    </div>
  );
}
