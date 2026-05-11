'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { queryClient } from './queryClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={2400}
        hideProgressBar
        newestOnTop
        closeButton={false}
        toastStyle={{
          background: 'var(--gray-900)',
          color: 'white',
          fontSize: 13,
          fontWeight: 500,
          fontFamily: 'var(--font-ui)',
          borderRadius: 10,
          boxShadow: 'var(--sh-3)',
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
