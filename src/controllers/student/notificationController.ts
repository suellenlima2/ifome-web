import type { Notification } from '@/types';
import { getNotifications, markAllRead, markOneRead } from '@/services/api/notificationService';

export async function fetchNotifications(): Promise<{ today: Notification[]; earlier: Notification[]; unreadCount: number }> {
  const all = await getNotifications();
  return {
    today: all.filter(n => n.at.startsWith('Hoje')),
    earlier: all.filter(n => !n.at.startsWith('Hoje')),
    unreadCount: all.filter(n => n.unread).length,
  };
}

export async function markNotificationsRead(): Promise<void> {
  return markAllRead();
}

export async function markNotificationRead(id: string): Promise<void> {
  return markOneRead(id);
}
