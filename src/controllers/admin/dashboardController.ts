import type { DashboardData, MenuToday } from '@/types';
import { getMenuToday } from '@/services/api/menuService';
import { getAlerts, getDemand7d } from '@/services/api/alertService';
import { getStock } from '@/services/api/stockService';
import { getRecentConfirmations } from '@/services/api/userService';

export async function fetchDashboardData(): Promise<DashboardData> {
  const [menuRaw, alerts, stock, demand7d, recentConfirmations] = await Promise.all([
    getMenuToday(),
    getAlerts(),
    getStock(),
    getDemand7d(),
    getRecentConfirmations(),
  ]);

  // A API pode retornar { day: MenuToday } ou MenuToday diretamente
  const menuToday: MenuToday = (menuRaw as any)?.day ?? menuRaw as MenuToday;

  return {
    menuToday: { day: menuToday },
    alerts,
    stock,
    demand7d,
    recentConfirmations,
  };
}
