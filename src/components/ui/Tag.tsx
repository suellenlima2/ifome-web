import { cn } from '@/utils/cn';
import { type LucideIcon } from 'lucide-react';

interface TagProps {
  children: React.ReactNode;
  tone?: 'gray' | 'green' | 'red' | 'yellow' | 'purple';
  icon?: LucideIcon;
  dot?: boolean;
}

export function Tag({ children, tone = 'gray', icon: Icon, dot }: TagProps) {
  return (
    <span className={cn('tag', `tag--${tone}`)}>
      {dot && <span className="tag-dot" />}
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}
