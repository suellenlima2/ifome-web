import { TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: 'up' | 'down';
  icon?: LucideIcon;
  sub?: string;
  href?: string;
}

export function Stat({ label, value, delta, deltaTone = 'up', icon: Icon, sub, href }: StatProps) {
  const content = (
    <div className={cn("stat", href && "stat--clickable")}>
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

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {content}
      </Link>
    );
  }

  return content;
}
