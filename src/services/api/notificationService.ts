import { apiRequest } from './client';
import type { Notification, NotificationResponse } from '@/types';

export async function getNotifications(page = 1, pageSize = 50): Promise<Notification[]> {
  const response = await apiRequest<NotificationResponse | Notification[]>(`/api/notifications?page=${page}&pageSize=${pageSize}`);
  if (response && (response as NotificationResponse).data) {
    return (response as NotificationResponse).data;
  }
  return response as Notification[];
}

export async function markAllRead(): Promise<void> {
  return apiRequest<void>('/api/notifications/read-all', {
    method: 'POST',
  });
}

export async function markOneRead(id: string): Promise<void> {
  return apiRequest<void>(`/api/notifications/${id}/read`, {
    method: 'POST',
  });
}
