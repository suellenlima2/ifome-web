import { apiRequest } from './client';

export interface Alert {
  id: string;
  title: string;
  description: string;
  resolved: boolean;
  createdAt: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface DemandDay {
  date: string;
  quantity: number;
}

export async function getAlerts(): Promise<Alert[]> {
  return apiRequest<Alert[]>('/api/alerts');
}

export async function getDemand7d(): Promise<DemandDay[]> {
  return apiRequest<DemandDay[]>('/api/alerts/demand-7days');
}

export async function getUnresolvedCount(): Promise<{ count: number }> {
  return apiRequest<{ count: number }>('/api/alerts/unresolved-count');
}

export async function toggleAlertStatus(id: string, resolved: boolean): Promise<Alert> {
  return apiRequest<Alert>(`/api/alerts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ resolved }),
  });
}