import type { DashboardData, MenuToday } from '@/types';
import { getMenuToday } from '@/services/api/menuService';
import { getAlerts, getDemand7d } from '@/services/api/alertService';
import { getStock } from '@/services/api/stockService';
import { getRecentConfirmations } from '@/services/api/userService';

export async function fetchDashboardData(): Promise<DashboardData> {
  const [menuRaw, alerts, stock, demand7d, recentConfirmations] = await Promise.all([
    getMenuToday().catch(err => {
      console.error('Erro ao buscar menuToday:', err);
      return null;
    }),
    getAlerts().catch(err => {
      console.error('Erro ao buscar alerts:', err);
      return [];
    }),
    getStock().catch(err => {
      console.error('Erro ao buscar stock (Erro 400 - Parâmetros de paginação):', err);
      return []; 
    }),
    getDemand7d().catch(err => {
      console.error('Erro ao buscar demand7d (Erro 404 - Rota inexistente):', err);
      return []; 
    }),
    getRecentConfirmations().catch(err => {
      console.error('Erro ao buscar recentConfirmations:', err);
      return [];
    }),
  ]);

  return {
    menuToday: { day: menuRaw },
    alerts,
    stock,
    demand7d,
    recentConfirmations,
  };
}