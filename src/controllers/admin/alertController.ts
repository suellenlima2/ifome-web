import type { Alert, DemandDay } from '@/types';
import { getAlerts, getDemand7d } from '@/services/api/alertService';

export async function fetchAlerts(): Promise<Alert[]> {
  const response = await getAlerts();
  
  if (response && (response as any).data) {
    return ((response as any).data as unknown) as Alert[];
  }
  
  return (response as unknown) as Alert[];
}

export async function fetchDemand(): Promise<DemandDay[]> {
  const response = await getDemand7d();
  
  if (response && (response as any).data) {
    return ((response as any).data as unknown) as DemandDay[];
  }
  
  return (response as unknown) as DemandDay[];
}