import { apiRequest } from './client';
import type { Alert, AlertsResponse, Demand7dResponse, DemandDay } from '@/types';

export async function getAlerts(page = 1, pageSize = 50): Promise<Alert[]> {
  const response = await apiRequest<AlertsResponse | Alert[]>(`/api/alerts?page=${page}&pageSize=${pageSize}`);
  if (response && (response as AlertsResponse).data) {
    return (response as AlertsResponse).data;
  }
  return response as Alert[];
}

export async function getDemand7d(): Promise<DemandDay[]> {
  const response = await apiRequest<Demand7dResponse | DemandDay[]>('/api/alerts/demand-7days');
  if (response && (response as Demand7dResponse).data) {
    return (response as Demand7dResponse).data;
  }
  return response as DemandDay[];
}

export async function getUnresolvedCount(): Promise<{ count: number }> {
  return apiRequest<{ count: number }>('/api/alerts/unresolved-count');
}

export async function resolveAlert(id: string): Promise<Alert> {
  return apiRequest<Alert>(`/api/alerts/${id}/resolve`, {
    method: 'POST',
  });
}

export async function patchAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
  return apiRequest<Alert>(`/api/alerts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}
