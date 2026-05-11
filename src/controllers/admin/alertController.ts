import type { Alert, DemandDay } from '@/types';
import { getAlerts, getDemand7d } from '@/services/api/alertService';

export async function fetchAlerts(): Promise<Alert[]> {
  return getAlerts();
}

export async function fetchDemand(): Promise<DemandDay[]> {
  return getDemand7d();
}
