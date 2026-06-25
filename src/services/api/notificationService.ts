import { apiRequest } from './client';

export interface Notification {
  id: string;
  title: string;
  body: string;
  unread: boolean;
  createdAt: string;
  type?: string;
}

export async function getNotifications(): Promise<Notification[]> {
  return apiRequest<Notification[]>('/api/notifications');
}

export async function markAllRead(): Promise<void> {
  return apiRequest<void>('/api/notifications', { 
    method: 'PATCH' 
  });
}

export async function markOneRead(id: string): Promise<void> {
  return apiRequest<void>(`/api/notifications/${id}`, { 
    method: 'PATCH' 
  });
}