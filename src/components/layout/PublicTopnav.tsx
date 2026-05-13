'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const memberLinks = [
  { href: '/student/home',     label: 'Início'   },
  { href: '/student/cardapio', label: 'Cardápio' },
];

const guestLinks = [
  { href: '/guest',            label: 'Início'   },
  { href: '/student/cardapio', label: 'Cardápio' },
];

interface PublicTopnavProps {
  loggedIn?: boolean;
  userName?: string;
}

export function PublicTopnav({ loggedIn = true, userName = 'João Silva' }: PublicTopnavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navLinks = loggedIn ? memberLinks : guestLinks;

  return (
    <header className="topnav">
      <div className="topnav__brand" style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="/logo-ifome.png"
          alt="Logo IFome"
          width={50}  
          height={50} 
          style={{ objectFit: 'contain' }}
        />
     </div>

      <nav className="topnav__links">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn('topnav__link', pathname === link.href && 'topnav__link--active')}
            style={{ textDecoration: 'none' }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <span className="spacer" />

      {loggedIn && (
        <button className="icon-btn" onClick={() => router.push('/student/notificacoes')}>
          <Bell size={18} />
          <span className="icon-btn__dot" />
        </button>
      )}

      {loggedIn ? (
        <Link href="/student/perfil" className="row gap-8" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Avatar name={userName} />
          <span className="text-sm weight-500 topnav__user-name">{userName.split(' ')[0]} {userName.split(' ')[1]?.[0]}.</span>
        </Link>
      ) : (
        <>
          <Link href="/login"><Button variant="ghost" size="sm">Entrar</Button></Link>
        </>
      )}
    </header>
  );
}
