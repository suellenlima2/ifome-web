'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Utensils, CheckCircle, Box, AlertTriangle, Settings, LogOut,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';
import { useLogout } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/cardapio',     label: 'Cardápios',    icon: Utensils        },
  { href: '/admin/confirmacoes', label: 'Confirmações', icon: CheckCircle     },
  { href: '/admin/estoque',      label: 'Estoque',      icon: Box             },
  { href: '/admin/alertas',      label: 'Alertas',      icon: AlertTriangle, badge: 5 },
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
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('nav-item', pathname === item.href && 'nav-item--active')}
            style={{ textDecoration: 'none' }}
          >
            <span className="nav-item__icon"><item.icon size={18} /></span>
            <span className="nav-item__label">{item.label}</span>
            {item.badge ? <span className="nav-item__badge">{item.badge}</span> : null}
          </Link>
        ))}
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
