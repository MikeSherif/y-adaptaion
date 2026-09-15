import { Outlet, useRouterState } from '@tanstack/react-router';
import { AppLayout } from '@/app/AppLayout';
export function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === '/login' ? <Outlet /> : <AppLayout />;
}
