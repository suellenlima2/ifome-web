import type { Notification } from '@/types';
import { mockNotifications } from '../mocks/notificationMocks';

function delay<T>(data: T, ms = 600): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

let notifications = [...mockNotifications];

export async function getNotifications(): Promise<Notification[]> {
  return delay([...notifications]);
}

export async function markAllRead(): Promise<void> {
  notifications = notifications.map(n => ({ ...n, unread: false }));
  return delay(undefined as unknown as void, 300);
}

export async function markOneRead(id: string): Promise<void> {
  notifications = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
  return delay(undefined as unknown as void, 200);
}
