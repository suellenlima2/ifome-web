'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Empty } from '@/components/ui/Empty';
import { Skeleton } from '@/components/ui/Skeleton';
import { NotificationItem } from '@/components/student/NotificationItem';
import { useNotifications, useMarkAllRead, useMarkOneRead } from '@/hooks/useNotifications';

export default function NotificacoesPage() {
  const { data, isLoading } = useNotifications();
  const { mutate: markAll, isPending } = useMarkAllRead();
  const { mutate: markOne } = useMarkOneRead();

  if (isLoading) return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}><Skeleton h={36} w={200} r={8} /></div>
      <div className="card col gap-12" style={{ padding: 16 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="row gap-12">
            <Skeleton w={36} h={36} r={8} />
            <div className="col gap-6 flex-1">
              <Skeleton w="80%" h={12} />
              <Skeleton w="100%" h={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const { today = [], earlier = [], unreadCount = 0 } = data ?? {};

  if (today.length === 0 && earlier.length === 0) return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="col gap-4" style={{ marginBottom: 20 }}>
        <span className="h-page">Notificações</span>
        <span className="muted">Lembretes de cardápio e confirmações.</span>
      </div>
      <div className="card">
        <Empty icon={Bell} title="Sem notificações" body="Você está em dia. Voltaremos quando houver novidades sobre o RU." />
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <div className="between" style={{ marginBottom: 20 }}>
        <div className="col gap-4">
          <span className="h-page">Notificações</span>
          <span className="muted">{unreadCount} não lida{unreadCount !== 1 ? 's' : ''}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => markAll()} disabled={isPending}>
          Marcar tudo como lido
        </Button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {today.length > 0 && (
          <>
            <div className="text-xs weight-600 muted" style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid var(--divider)' }}>
              Hoje
            </div>
            {today.map(n => <NotificationItem key={n.id} notification={n} onMarkRead={() => markOne(n.id)} />)}
          </>
        )}
        {earlier.length > 0 && (
          <>
            <div className="text-xs weight-600 muted" style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid var(--divider)' }}>
              Anteriores
            </div>
            {earlier.map(n => <NotificationItem key={n.id} notification={n} onMarkRead={() => markOne(n.id)} />)}
          </>
        )}
      </div>
    </div>
  );
}
