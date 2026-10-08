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
import { AdminEmployeePage } from '@/pages/admin-employee';
import { AdminEmployeeNewPage } from '@/pages/admin-employee-new';
import { AdminEmployeeTaskPage } from '@/pages/admin-employee-task';
import { AdminEmployeesPage } from '@/pages/admin-employees';
import { AdminTemplateFormPage, AdminTemplatesPage } from '@/pages/admin-templates';
import { AdminMaterialFormPage, AdminMaterialsPage } from '@/pages/admin-materials';
import { AdminDirectoriesPage } from '@/pages/admin-directories';
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
import type { EmployeeFilters, MaterialType, TaskPriority, TaskStatus } from '@/shared/types/domain';

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const requireSession = () => {
  const session = getCurrentSession();
  if (!session) throw redirect({ to: '/login' });
  return session;
};

const protectedRoute = (component: RouteComponent) => ({
  getParentRoute: () => rootRoute,
  component,
  beforeLoad: () => {
    requireSession();
  },
});

const employeeRoute = (component: RouteComponent) => ({
  getParentRoute: () => rootRoute,
  component,
  beforeLoad: () => {
    const session = requireSession();
    if (session.role === 'admin') throw redirect({ to: '/admin/employees' });
  },
});

const adminRoute = (component: RouteComponent) => ({
  getParentRoute: () => rootRoute,
  component,
  beforeLoad: () => {
    const session = requireSession();
    if (session.role !== 'admin') throw redirect({ to: '/' });
  },
});

const dashboardRoute = createRoute({ ...employeeRoute(DashboardPage), path: '/' });
const onboardingRoute = createRoute({ ...employeeRoute(OnboardingPage), path: '/onboarding' });
const onboardingStageRoute = createRoute({
  ...employeeRoute(OnboardingStagePage),
  path: '/onboarding/$stageId',
});
const taskSearchSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'completed', 'overdue']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  search: z.string().optional(),
  sort: z.enum(['dueDate', 'priority']).optional(),
});
const tasksRoute = createRoute({
  ...employeeRoute(TasksPage),
  path: '/tasks',
  validateSearch: taskSearchSchema,
});
const taskDetailRoute = createRoute({ ...employeeRoute(TaskDetailPage), path: '/tasks/$taskId' });
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
const employeeSearchSchema = z.object({
  search: z.string().optional(),
  departmentId: z.string().optional(),
  risk: z.enum(['overdue', 'on_track', 'completed', 'questions']).optional(),
  stage: z.string().optional(),
});
const adminEmployeesRoute = createRoute({
  ...adminRoute(AdminEmployeesPage),
  path: '/admin/employees',
  validateSearch: employeeSearchSchema,
});
const adminEmployeeRoute = createRoute({
  ...adminRoute(AdminEmployeePage),
  path: '/admin/employees/$userId',
});
const adminEmployeeNewRoute = createRoute({
  ...adminRoute(AdminEmployeeNewPage),
  path: '/admin/employees/new',
});
const adminEmployeeTaskRoute = createRoute({
  ...adminRoute(AdminEmployeeTaskPage),
  path: '/admin/employees/$userId/tasks/$taskId',
});
const archiveStatusSchema = z.enum(['active', 'archived']).optional();
const adminTemplatesRoute = createRoute({
  ...adminRoute(AdminTemplatesPage),
  path: '/admin/templates',
  validateSearch: z.object({ status: archiveStatusSchema }),
});
const adminTemplateNewRoute = createRoute({
  ...adminRoute(AdminTemplateFormPage),
  path: '/admin/templates/new',
  validateSearch: z.object({ from: z.string().optional() }),
});
const adminTemplateEditRoute = createRoute({
  ...adminRoute(AdminTemplateFormPage),
  path: '/admin/templates/$templateId',
});
const adminMaterialsRoute = createRoute({
  ...adminRoute(AdminMaterialsPage),
  path: '/admin/materials',
  validateSearch: z.object({
    search: z.string().optional(),
    status: archiveStatusSchema,
  }),
});
const adminMaterialNewRoute = createRoute({
  ...adminRoute(AdminMaterialFormPage),
  path: '/admin/materials/new',
});
const adminMaterialEditRoute = createRoute({
  ...adminRoute(AdminMaterialFormPage),
  path: '/admin/materials/$materialId',
});
const adminDirectoriesRoute = createRoute({
  ...adminRoute(AdminDirectoriesPage),
  path: '/admin/directories',
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    const session = getCurrentSession();
    if (!session) return;
    throw redirect({ to: session.role === 'admin' ? '/admin/employees' : '/' });
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
  adminEmployeesRoute,
  adminEmployeeNewRoute,
  adminEmployeeRoute,
  adminEmployeeTaskRoute,
  adminTemplatesRoute,
  adminTemplateNewRoute,
  adminTemplateEditRoute,
  adminMaterialsRoute,
  adminMaterialNewRoute,
  adminMaterialEditRoute,
  adminDirectoriesRoute,
]);
export const router = createRouter({
  routeTree,
  context: { queryClient: undefined! },
  defaultPreload: 'intent',
  basepath: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
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
export type EmployeeSearch = EmployeeFilters;
