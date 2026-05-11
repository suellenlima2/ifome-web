import type { Alert, DemandDay } from '@/types';
import { mockAlerts, mockDemand7d } from '../mocks/alertMocks';

function delay<T>(data: T, ms = 600): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

export async function getAlerts(): Promise<Alert[]> {
  return delay([...mockAlerts]);
}

export async function getDemand7d(): Promise<DemandDay[]> {
  return delay([...mockDemand7d], 400);
}
