'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';
import { PublicTopnav } from '@/components/layout/PublicTopnav';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = pathname.startsWith('/student/cardapio');

  useEffect(() => {
    if (!isLoading && !user && !isPublic) router.replace('/login');
    else if (!isLoading && user?.role === 'admin') router.replace('/admin/dashboard');
  }, [user, isLoading, router, isPublic]);

  if ((isLoading || !user) && !isPublic) return null;

  return (
    <div className="col" style={{ height: '100vh', overflow: 'hidden' }}>
      <PublicTopnav loggedIn={!!user} userName={user?.name} />
      <main className="student-main">
        {children}
      </main>
    </div>
  );
}
