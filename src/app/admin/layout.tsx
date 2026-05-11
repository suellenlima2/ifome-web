'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminBottomNav } from '@/components/layout/AdminBottomNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
    else if (!isLoading && user?.role === 'student') router.replace('/student/home');
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="shell">
      <AdminSidebar userName={user.name} />
      <div className="main">
        {children}
      </div>
      <AdminBottomNav />
    </div>
  );
}
