'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Utensils, CheckCircle, Box, AlertTriangle, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

const items = [
  { href: '/admin/dashboard',     label: 'Início',   icon: LayoutDashboard },
  { href: '/admin/cardapio',      label: 'Cardápio', icon: Utensils        },
  { href: '/admin/confirmacoes',  label: 'Confirm.', icon: CheckCircle     },
  { href: '/admin/estoque',       label: 'Estoque',  icon: Box             },
  { href: '/admin/alertas',       label: 'Alertas',  icon: AlertTriangle, badge: 5 },
  { href: '/admin/configuracoes', label: 'Config',   icon: Settings        },
];

export function AdminBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-bottom-nav">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn('admin-bottom-nav__item', pathname === item.href && 'admin-bottom-nav__item--active')}
          style={{ textDecoration: 'none' }}
        >
          {item.badge ? <span className="admin-bottom-nav__badge">{item.badge}</span> : null}
          <item.icon size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
