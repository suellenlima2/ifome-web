import type { DashboardData, MenuToday } from '@/types';
import { getMenuToday } from '@/services/api/menuService';
import { getAlerts, getDemand7d } from '@/services/api/alertService';
import { getStock } from '@/services/api/stockService';
import { getRecentConfirmations } from '@/services/api/userService';

export async function fetchDashboardData(): Promise<DashboardData> {
  // Executa as chamadas em paralelo, tratando os erros isoladamente caso uma rota mude no backend
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
      return []; // Fallback seguro para manter a tela viva
    }),
    getDemand7d().catch(err => {
      console.error('Erro ao buscar demand7d (Erro 404 - Rota inexistente):', err);
      return []; // Fallback seguro para o gráfico
    }),
    getRecentConfirmations().catch(err => {
      console.error('Erro ao buscar recentConfirmations:', err);
      return [];
    }),
  ]);

  // Normaliza o retorno do menu do dia
  const menuToday: MenuToday | null = menuRaw 
    ? ((menuRaw as any)?.day ?? (menuRaw as MenuToday))
    : null;

  return {
    // Se menuRaw for null, passa { day: null } como fallback seguro
    menuToday: { day: menuToday },
    alerts,
    stock,
    demand7d,
    recentConfirmations,
  };
}