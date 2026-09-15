import type {
  Material,
  MaterialFilters,
  Notification,
  Onboarding,
  OnboardingStage,
  Task,
  TaskFilters,
  UpdateProfilePayload,
  User,
} from '@/shared/types/domain';
import { currentUser } from './mock/users';
import { getMockOnboarding } from './mock/onboarding';
import { materials } from './mock/materials';
import { notifications } from './mock/notifications';
import { tasks } from './mock/tasks';

const delay = (ms = 360) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => structuredClone(value);
const byDate = (a: Task, b: Task) => (a.dueDate ?? '').localeCompare(b.dueDate ?? '');

export async function getCurrentUser(): Promise<User> {
  await delay();
  return clone(currentUser);
}
export async function getOnboarding(): Promise<Onboarding> {
  await delay(420);
  return getMockOnboarding();
}
export async function getOnboardingStage(stageId: string): Promise<OnboardingStage> {
  await delay();
  const stage = getMockOnboarding().stages.find((item) => item.id === stageId);
  if (!stage) throw new Error('Этап адаптации не найден');
  return stage;
}
export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  await delay();
  let result = [...tasks];
  if (filters.status) result = result.filter((task) => task.status === filters.status);
  if (filters.priority) result = result.filter((task) => task.priority === filters.priority);
  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((task) =>
      `${task.title} ${task.description ?? ''}`.toLowerCase().includes(search),
    );
  }
  if (filters.sort === 'priority') {
    const rank = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => rank[a.priority] - rank[b.priority]);
  } else result.sort(byDate);
  return clone(result);
}
export async function getTask(taskId: string): Promise<Task> {
  await delay();
  const task = tasks.find((item) => item.id === taskId);
  if (!task) throw new Error('Задача не найдена');
  return clone(task);
}
export async function completeTask(taskId: string): Promise<Task> {
  await delay(520);
  const task = tasks.find((item) => item.id === taskId);
  if (!task) throw new Error('Задача не найдена');
  task.status = 'completed';
  task.completedAt = new Date().toISOString();
  return clone(task);
}
export async function getMaterials(filters: MaterialFilters = {}): Promise<Material[]> {
  await delay();
  let result = [...materials];
  if (filters.type) result = result.filter((material) => material.type === filters.type);
  if (filters.category)
    result = result.filter((material) => material.category === filters.category);
  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((material) =>
      `${material.title} ${material.description ?? ''}`.toLowerCase().includes(search),
    );
  }
  return clone(result);
}
export async function getMaterial(materialId: string): Promise<Material> {
  await delay();
  const material = materials.find((item) => item.id === materialId);
  if (!material) throw new Error('Материал не найден');
  return clone(material);
}
export async function markMaterialAsRead(materialId: string): Promise<Material> {
  await delay(280);
  const material = materials.find((item) => item.id === materialId);
  if (!material) throw new Error('Материал не найден');
  material.isRead = true;
  return clone(material);
}
export async function getNotifications(): Promise<Notification[]> {
  await delay();
  return clone([...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}
export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  await delay(220);
  const notification = notifications.find((item) => item.id === notificationId);
  if (!notification) throw new Error('Уведомление не найдено');
  notification.isRead = true;
  return clone(notification);
}
export async function updateUserProfile(payload: UpdateProfilePayload): Promise<User> {
  await delay(480);
  Object.assign(currentUser, payload);
  return clone(currentUser);
}
