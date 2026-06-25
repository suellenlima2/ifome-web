'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import {
  LayoutDashboard, Utensils, CheckCircle, Box, AlertTriangle, Settings, LogOut,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';
import { useLogout } from '@/hooks/useAuth';
import { useAlerts } from '@/hooks/useAlerts';

const navItems = [
  { href: '/admin/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/cardapio',     label: 'Cardápios',    icon: Utensils        },
  { href: '/admin/confirmacoes', label: 'Confirmações', icon: CheckCircle     },
  { href: '/admin/estoque',      label: 'Estoque',      icon: Box             },
  { href: '/admin/alertas',      label: 'Alertas',      icon: AlertTriangle   }, // Removido o badge: 5 estático
];

const bottomItems = [
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

interface AdminSidebarProps {
  userName?: string;
}

export function AdminSidebar({ userName = 'Mariana Costa' }: AdminSidebarProps) {
  const pathname = usePathname();
  const { mutate: doLogout } = useLogout();
  
  // Consome a rota real de alertas
  const { data: alertsData } = useAlerts();

  // Calcula a quantidade real de alertas ativos desestruturando de forma resiliente
  const activeAlertsCount = useMemo(() => {
    if (!alertsData) return 0;
    if (Array.isArray(alertsData)) return alertsData.length;
    if ((alertsData as any).data && Array.isArray((alertsData as any).data)) return (alertsData as any).data.length;
    if ((alertsData as any).alerts && Array.isArray((alertsData as any).alerts)) return (alertsData as any).alerts.length;
    return 0;
  }, [alertsData]);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Image
          src="/logo-ifome.png" 
          alt="Logo IFome"
          width={80} 
          height={35}
          style={{ objectFit: 'contain' }}
        />
        <small>Admin</small>
      </div>

      <nav className="col gap-4 flex-1">
        <div className="sidebar__group nav-item__label">Operação</div>
        {navItems.map(item => {
          // Injeta o badge dinâmico somente no botão de alertas
          const badgeValue = item.href === '/admin/alertas' ? activeAlertsCount : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('nav-item', pathname === item.href && 'nav-item--active')}
              style={{ textDecoration: 'none' }}
            >
              <span className="nav-item__icon"><item.icon size={18} /></span>
              <span className="nav-item__label">{item.label}</span>
              {badgeValue > 0 && <span className="nav-item__badge">{badgeValue}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="col gap-4">
        {bottomItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('nav-item', pathname === item.href && 'nav-item--active')}
            style={{ textDecoration: 'none' }}
          >
            <span className="nav-item__icon"><item.icon size={18} /></span>
            <span className="nav-item__label">{item.label}</span>
          </Link>
        ))}
        <div className="row gap-12" style={{ marginTop: 12, padding: '10px 8px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
          <Avatar name={userName} />
          <div className="col" style={{ minWidth: 0, flex: 1 }}>
            <span className="text-sm weight-600 nav-item__label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName}
            </span>
            <span className="text-xs muted nav-item__label">Gerente do RU</span>
          </div>
          <button
            onClick={() => doLogout()}
            title="Sair da conta"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', padding: 4, display: 'flex', flexShrink: 0 }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}