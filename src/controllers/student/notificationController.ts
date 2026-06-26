import type { Notification } from '@/types';
import { getNotifications, markAllRead, markOneRead } from '@/services/api/notificationService';

export async function fetchNotifications(): Promise<{ today: Notification[]; earlier: Notification[]; unreadCount: number }> {
  const all = await getNotifications();

  if (!Array.isArray(all)) {
    return { today: [], earlier: [], unreadCount: 0 };
  }

  const unreadCount = all.filter(n => !n.read).length;
  const todayISO = new Date().toISOString().split('T')[0];

  const today = all.filter(n => n.createdAt?.startsWith(todayISO));
  const earlier = all.filter(n => !n.createdAt?.startsWith(todayISO));

  return { today, earlier, unreadCount };
}

export async function markNotificationsRead(): Promise<void> {
  return markAllRead();
}

export async function markNotificationRead(id: string): Promise<void> {
  return markOneRead(id);
}
