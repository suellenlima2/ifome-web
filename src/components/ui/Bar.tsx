import { cn } from '@/utils/cn';

interface BarProps {
  value: number;
  max: number;
  tone?: 'ok' | 'low' | 'crit';
}

export function Bar({ value, max, tone }: BarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('bar', tone && `bar--${tone}`)}>
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}
