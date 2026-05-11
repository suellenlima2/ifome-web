import { TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { type LucideIcon } from 'lucide-react';

interface StatProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: 'up' | 'down';
  icon?: LucideIcon;
  sub?: string;
}

export function Stat({ label, value, delta, deltaTone = 'up', icon: Icon, sub }: StatProps) {
  return (
    <div className="stat">
      <div className="between" style={{ marginBottom: 2 }}>
        <span className="stat__label">{label}</span>
        {Icon && (
          <span className="center" style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--brand-soft)', color: 'var(--brand-text)' }}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <span className="stat__value">{value}</span>
      <div className="row gap-8">
        {delta && (
          <span className={cn('stat__delta', `stat__delta--${deltaTone}`)}>
            <TrendingUp size={12} />
            {delta}
          </span>
        )}
        {sub && <span className="text-xs muted">{sub}</span>}
      </div>
    </div>
  );
}
