import { Inbox } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface EmptyProps {
  icon?: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export function Empty({ icon: Icon = Inbox, title, body, action }: EmptyProps) {
  return (
    <div className="empty">
      <span className="empty__art">
        <Icon size={36} />
      </span>
      <div className="empty__title">{title}</div>
      {body && <div className="empty__body">{body}</div>}
      {action}
    </div>
  );
}
