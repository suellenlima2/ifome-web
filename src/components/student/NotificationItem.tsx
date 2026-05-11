import { Utensils, AlertTriangle, Bell, CheckCircle, Calendar, Check } from 'lucide-react';
import type { Notification } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  utensils: Utensils,
  alert: AlertTriangle,
  bell: Bell,
  checkCircle: CheckCircle,
  calendar: Calendar,
};

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: () => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const Icon = iconMap[notification.icon] ?? Bell;
  return (
    <div
      className="row gap-12"
      style={{
        padding: 16,
        borderBottom: '1px solid var(--divider)',
        background: notification.unread ? 'var(--brand-soft)' : 'transparent',
      }}
    >
      <span className="center" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface)', color: 'var(--brand-text)', flexShrink: 0 }}>
        <Icon size={16} />
      </span>
      <div className="col" style={{ flex: 1 }}>
        <div className="row gap-8" style={{ alignItems: 'center' }}>
          <span className="weight-600 text-sm">{notification.title}</span>
          {notification.unread && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--brand)' }} />}
        </div>
        <span className="text-sm muted">{notification.body}</span>
        <span className="text-xs muted" style={{ marginTop: 4 }}>{notification.at}</span>
      </div>
      {notification.unread && onMarkRead && (
        <button
          onClick={onMarkRead}
          title="Marcar como lida"
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 6,
            padding: '4px 8px', cursor: 'pointer', color: 'var(--brand-text)',
            display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
            fontSize: 12,
          }}
        >
          <Check size={12} />
          Lida
        </button>
      )}
    </div>
  );
}
