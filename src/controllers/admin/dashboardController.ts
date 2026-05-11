import type { DashboardData } from '@/types';
import { getMenuToday } from '@/services/api/menuService';
import { getAlerts, getDemand7d } from '@/services/api/alertService';
import { getStock } from '@/services/api/stockService';
import { getRecentConfirmations } from '@/services/api/userService';

export async function fetchDashboardData(): Promise<DashboardData> {
  const [menuToday, alerts, stock, demand7d, recentConfirmations] = await Promise.all([
    getMenuToday(),
    getAlerts(),
    getStock(),
    getDemand7d(),
    getRecentConfirmations(),
  ]);
  return { menuToday, alerts, stock, demand7d, recentConfirmations };
}
