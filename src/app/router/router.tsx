import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import type { RouteComponent } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { getCurrentSession } from '@/shared/lib/auth';
import { RootLayout } from './RootLayout';
import { DashboardPage } from '@/pages/dashboard';
import { LoginPage } from '@/pages/login';
import { MaterialsPage } from '@/pages/materials';
import { NotificationsPage } from '@/pages/notifications';
import { OnboardingPage } from '@/pages/onboarding';
import { OnboardingStagePage } from '@/pages/onboarding-stage';
import { NotFoundPage } from '@/pages/not-found';
import { ProfilePage } from '@/pages/profile';
import { TaskDetailPage } from '@/pages/task-detail';
import { TasksPage } from '@/pages/tasks';
import type { MaterialType, TaskPriority, TaskStatus } from '@/shared/types/domain';

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});
const protectedRoute = (component: RouteComponent) => ({
  getParentRoute: () => rootRoute,
  component,
  beforeLoad: () => {
    if (!getCurrentSession()) throw redirect({ to: '/login' });
  },
});
const dashboardRoute = createRoute({ ...protectedRoute(DashboardPage), path: '/' });
const onboardingRoute = createRoute({ ...protectedRoute(OnboardingPage), path: '/onboarding' });
const onboardingStageRoute = createRoute({
  ...protectedRoute(OnboardingStagePage),
  path: '/onboarding/$stageId',
});
const taskSearchSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'completed', 'overdue']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  search: z.string().optional(),
  sort: z.enum(['dueDate', 'priority']).optional(),
});
const tasksRoute = createRoute({
  ...protectedRoute(TasksPage),
  path: '/tasks',
  validateSearch: taskSearchSchema,
});
const taskDetailRoute = createRoute({ ...protectedRoute(TaskDetailPage), path: '/tasks/$taskId' });
const materialSearchSchema = z.object({
  type: z.enum(['document', 'video', 'link', 'presentation']).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});
const materialsRoute = createRoute({
  ...protectedRoute(MaterialsPage),
  path: '/materials',
  validateSearch: materialSearchSchema,
});
const profileRoute = createRoute({ ...protectedRoute(ProfilePage), path: '/profile' });
const notificationsRoute = createRoute({
  ...protectedRoute(NotificationsPage),
  path: '/notifications',
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    if (getCurrentSession()) throw redirect({ to: '/' });
  },
});
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  loginRoute,
  onboardingRoute,
  onboardingStageRoute,
  tasksRoute,
  taskDetailRoute,
  materialsRoute,
  profileRoute,
  notificationsRoute,
]);
export const router = createRouter({
  routeTree,
  context: { queryClient: undefined! },
  defaultPreload: 'intent',
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
export type TaskSearch = {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sort?: 'dueDate' | 'priority';
};
export type MaterialSearch = { type?: MaterialType; category?: string; search?: string };
