'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { handleErrorWithToast } from '@/utils/handle-error-with-toast';
import { useRefreshSessionOnActivity } from '@/app/hooks/use-refresh-session-on-activity';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      onError: (error) => {
        handleErrorWithToast(error, 'Failed to perform action');
      },
    },
  },
});

function SessionActivityRefresher({ idleTimeoutSeconds }: { idleTimeoutSeconds: number }) {
  useRefreshSessionOnActivity(idleTimeoutSeconds);
  return null;
}

export default function Providers({ children, session, sessionIdleTimeout }: { children: ReactNode; session: Session | null; sessionIdleTimeout: number }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <SessionActivityRefresher idleTimeoutSeconds={sessionIdleTimeout} />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
