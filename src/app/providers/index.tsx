import { Component, useEffect, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '@/shared/api/query-client';
import { router } from '@/app/router';
import { useAuthStore } from '@/features/auth';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? (
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div>
          <h1>Что-то пошло не так</h1>
          <p>Обновите страницу или вернитесь немного позже.</p>
        </div>
      </main>
    ) : (
      this.props.children
    );
  }
}
function AuthInitializer({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return <>{children}</>;
}
export function AppProviders() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <RouterProvider router={router} context={{ queryClient }} />
        </AuthInitializer>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
