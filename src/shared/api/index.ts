import type {
  ActivityEntry,
  ActivityKind,
  CreateEmployeePayload,
  CreateTaskPayload,
  Department,
  EmployeeSummary,
  Material,
  MaterialFilters,
  MaterialPayload,
  Notification,
  NotificationType,
  Onboarding,
  OnboardingStage,
  OnboardingTemplate,
  DepartmentPayload,
  Staff,
  StaffKind,
  StaffMember,
  StaffPayload,
  Task,
  TaskComment,
  TaskFilters,
  TemplatePayload,
  TemplateStage,
  UpdateEmployeePayload,
  UpdateProfilePayload,
  UpdateTaskPayload,
  UpdateTeamPayload,
  User,
  UserShort,
} from '@/shared/types/domain';
import { getCurrentSession } from '@/shared/lib/auth';
import { addDays, daysBetween, formatDate } from '@/shared/lib/date';
import { withResolvedStatus } from '@/shared/lib/task';
import { formatUserName } from '@/shared/lib/user';
import { findUser, findUserByEmail, users } from './mock/users';
import { getMockOnboarding } from './mock/onboarding';
import { materials } from './mock/materials';
import { notifications } from './mock/notifications';
import { tasks } from './mock/tasks';
import { findTemplate, templates } from './mock/templates';
import {
  departments,
  managers,
  mentors,
  staffByKind,
  toDepartmentRef,
  toUserShort,
} from './mock/staff';
import { assignPlan, resolveAssignee } from './mock/plan';
import { activity } from './mock/activity';
import { comments } from './mock/comments';

const delay = (ms = 360) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => structuredClone(value);
const byDate = (a: Task, b: Task) => (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
const newestFirst = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);
const REMINDER_WINDOW_MS = 10 * 60 * 1000;
const REMINDER_TITLE = 'HR напомнил о задачах адаптации';

let sequence = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${++sequence}`;

function overdueTasks(userId: string): Task[] {
  return tasks
    .filter((task) => task.userId === userId)
    .map(withResolvedStatus)
    .filter((task) => task.status === 'overdue');
}

function recentReminder(userId: string): Notification | undefined {
  return notifications.find((item) => {
    if (item.userId !== userId || item.title !== REMINDER_TITLE) return false;
    return Date.now() - new Date(item.createdAt).getTime() < REMINDER_WINDOW_MS;
  });
}

function openQuestionTaskIds(userId: string): string[] {
  const lastByTask = new Map<string, TaskComment>();
  comments
    .filter((item) => item.employeeId === userId)
    .forEach((item) => lastByTask.set(item.taskId, item));
  return [...lastByTask.values()]
    .filter((item) => item.authorRole === 'employee')
    .map((item) => item.taskId);
}

function requireSession() {
  const session = getCurrentSession();
  if (!session) throw new Error('Нужна авторизация');
  return session;
}

function requireAdmin() {
  const session = requireSession();
  if (session.role !== 'admin') throw new Error('Недостаточно прав');
  return session;
}

function requireEmployee(userId: string) {
  requireAdmin();
  const user = findUser(userId);
  if (!user || user.role !== 'employee') throw new Error('Сотрудник не найден');
  return user;
}

function requireEditableTask(taskId: string) {
  requireAdmin();
  const task = tasks.find((item) => item.id === taskId);
  if (!task) throw new Error('Задача не найдена');
  requireEmployee(task.userId);
  if (task.status === 'completed') throw new Error('Выполненную задачу менять нельзя');
  return task;
}

function requireTaskAccess(taskId: string) {
  const session = requireSession();
  const task = tasks.find((item) => item.id === taskId);
  if (!task) throw new Error('Задача не найдена');
  if (task.userId !== session.userId && session.role !== 'admin') {
    throw new Error('Недостаточно прав');
  }
  return { session, task };
}

interface ChangeInput {
  employeeId: string;
  kind: ActivityKind;
  title: string;
  description?: string;
  taskId?: string;
  notify?: {
    userIds: string[];
    title: string;
    description?: string;
    link: string;
    type?: NotificationType;
  };
}

function recordChange({ employeeId, kind, title, description, taskId, notify }: ChangeInput) {
  const session = requireSession();
  const createdAt = new Date().toISOString();
  const entry: ActivityEntry = {
    id: nextId('activity'),
    employeeId,
    actorId: session.userId,
    actorName: formatUserName(findUser(session.userId)),
    kind,
    title,
    description,
    taskId,
    createdAt,
  };
  activity.unshift(entry);
  const created = (notify?.userIds ?? []).map((userId): Notification => ({
    id: nextId('notification'),
    userId,
    type: notify?.type ?? 'task',
    title: notify!.title,
    description: notify?.description ?? description,
    isRead: false,
    createdAt,
    link: notify!.link,
  }));
  notifications.unshift(...created);
  return created;
}

const staffLabels: Record<StaffKind, string> = { manager: 'Руководитель', mentor: 'Наставник' };

function findStaffMember(kind: StaffKind, id: string) {
  const member = staffByKind[kind].find((item) => item.id === id);
  if (!member) throw new Error(`${staffLabels[kind]} не найден`);
  return member;
}

function pickMember(kind: 'manager', id: string, currentId?: string): UserShort;
function pickMember(kind: StaffKind, id?: string, currentId?: string): UserShort | undefined;
function pickMember(kind: StaffKind, id?: string, currentId?: string) {
  if (!id) return undefined;
  const member = findStaffMember(kind, id);
  if (member.archived && member.id !== currentId) throw new Error(`${staffLabels[kind]} в архиве`);
  return toUserShort(member);
}

function findDepartmentRecord(id: string) {
  const department = departments.find((item) => item.id === id);
  if (!department) throw new Error('Отдел не найден');
  return department;
}

function pickDepartment(id: string, currentId?: string) {
  const department = findDepartmentRecord(id);
  if (department.archived && department.id !== currentId) throw new Error('Отдел в архиве');
  return toDepartmentRef(department);
}

const adminIds = () => users.filter((user) => user.role === 'admin').map((user) => user.id);

function resolveUserId(requested?: string): string {
  const session = requireSession();
  if (!requested || requested === session.userId) return session.userId;
  if (session.role !== 'admin') throw new Error('Недостаточно прав');
  return requested;
}

export async function getCurrentUser(): Promise<User> {
  await delay();
  const session = requireSession();
  const user = findUser(session.userId);
  if (!user) throw new Error('Пользователь не найден');
  return clone(user);
}

export async function getUser(userId: string): Promise<User> {
  await delay();
  const id = resolveUserId(userId);
  const user = findUser(id);
  if (!user) throw new Error('Пользователь не найден');
  return clone(user);
}

export async function getEmployees(): Promise<EmployeeSummary[]> {
  await delay();
  requireAdmin();
  return users
    .filter((user) => user.role === 'employee')
    .map((user) => {
      const onboarding = getMockOnboarding(user.id);
      const current = onboarding.stages.find((stage) => stage.status === 'current');
      return {
        user: clone(user),
        progress: onboarding.progress,
        currentStageTitle: current?.title,
        overdueCount: overdueTasks(user.id).length,
        openQuestions: openQuestionTaskIds(user.id).length,
        lastRemindedAt: recentReminder(user.id)?.createdAt,
      };
    });
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<User> {
  await delay(520);
  requireAdmin();
  if (findUserByEmail(payload.email)) throw new Error('Сотрудник с таким email уже есть');
  const department = pickDepartment(payload.departmentId);
  const manager = pickMember('manager', payload.managerId);
  const template = findTemplate(payload.templateId);
  if (template.archived) throw new Error('Шаблон в архиве — выберите другой');
  const user: User = {
    id: nextId('user'),
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim().toLowerCase(),
    position: payload.position.trim(),
    role: 'employee',
    department,
    startDate: payload.startDate,
    manager,
    mentor: pickMember('mentor', payload.mentorId),
    templateId: template.id,
  };
  users.push(user);
  tasks.push(...assignPlan(user, template));
  recordChange({
    employeeId: user.id,
    kind: 'employee_created',
    title: 'Сотрудник добавлен',
    description: `План «${template.title}», выход ${formatDate(user.startDate)}`,
    notify: {
      userIds: [user.id],
      type: 'system',
      title: 'Добро пожаловать в команду',
      description: `План адаптации «${template.title}» уже ждёт вас.`,
      link: '/onboarding',
    },
  });
  return clone(user);
}

export async function updateEmployeeTeam(userId: string, payload: UpdateTeamPayload): Promise<User> {
  await delay(420);
  const user = requireEmployee(userId);
  user.manager = pickMember('manager', payload.managerId, user.manager?.id);
  user.mentor = pickMember('mentor', payload.mentorId, user.mentor?.id);
  tasks
    .filter((task) => task.userId === userId && task.status !== 'completed' && task.assigneeRole)
    .forEach((task) => {
      task.assignee = resolveAssignee(user, task.assigneeRole);
    });
  const description = `Руководитель ${formatUserName(user.manager)}, наставник ${formatUserName(user.mentor)}`;
  recordChange({
    employeeId: userId,
    kind: 'team_changed',
    title: 'Обновлена команда',
    description,
    notify: {
      userIds: [userId],
      type: 'system',
      title: 'Обновлена команда адаптации',
      link: '/profile',
    },
  });
  return clone(user);
}

const PROFILE_LABELS = {
  name: 'ФИО',
  email: 'email',
  position: 'должность',
  department: 'отдел',
  startDate: 'дата выхода',
};

export async function updateEmployee(userId: string, payload: UpdateEmployeePayload): Promise<User> {
  await delay(420);
  const user = requireEmployee(userId);
  const email = payload.email.trim().toLowerCase();
  const owner = findUserByEmail(email);
  if (owner && owner.id !== userId) throw new Error('Сотрудник с таким email уже есть');
  const next = {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email,
    position: payload.position.trim(),
    department: pickDepartment(payload.departmentId, user.department.id),
    startDate: payload.startDate,
  };
  const changed = {
    name: next.firstName !== user.firstName || next.lastName !== user.lastName,
    email: next.email !== user.email,
    position: next.position !== user.position,
    department: next.department.id !== user.department.id,
    startDate: next.startDate !== user.startDate,
  };
  const fields = (Object.keys(changed) as (keyof typeof changed)[]).filter((key) => changed[key]);
  if (fields.length === 0) return clone(user);

  const shift = daysBetween(user.startDate, next.startDate);
  if (shift !== 0) {
    tasks
      .filter((task) => task.userId === userId && task.status !== 'completed' && task.dueDate)
      .forEach((task) => {
        task.dueDate = addDays(task.dueDate!, shift);
      });
  }
  Object.assign(user, next);

  const labels = fields.map((key) => PROFILE_LABELS[key]).join(', ');
  const notifyEmployee = changed.startDate || changed.position || changed.department;
  recordChange({
    employeeId: userId,
    kind: 'profile_changed',
    title: 'Профиль изменён',
    description: changed.startDate ? `${labels} · выход ${formatDate(user.startDate)}` : labels,
    notify: notifyEmployee
      ? {
          userIds: [userId],
          type: 'system',
          title: changed.startDate ? 'Сдвинута дата выхода' : 'Обновлены данные профиля',
          description: changed.startDate
            ? `Новая дата выхода — ${formatDate(user.startDate)}, сроки задач пересчитаны.`
            : `Изменено: ${labels}`,
          link: changed.startDate ? '/onboarding' : '/profile',
        }
      : undefined,
  });
  return clone(user);
}

export async function getTemplates(): Promise<OnboardingTemplate[]> {
  await delay();
  requireAdmin();
  return clone(templates);
}

export async function getTemplate(templateId: string): Promise<OnboardingTemplate> {
  await delay();
  requireAdmin();
  const template = templates.find((item) => item.id === templateId);
  if (!template) throw new Error('Шаблон не найден');
  return clone(template);
}

function requireTemplate(templateId: string) {
  requireAdmin();
  const template = templates.find((item) => item.id === templateId);
  if (!template) throw new Error('Шаблон не найден');
  return template;
}

function normalizeTemplate(payload: TemplatePayload): Omit<OnboardingTemplate, 'id'> {
  const title = payload.title.trim();
  if (title.length < 3) throw new Error('Название шаблона — минимум 3 символа');
  if (payload.stages.length === 0) throw new Error('Добавьте хотя бы один этап');
  const stages = payload.stages.map((stage, index): TemplateStage => {
    const label = `Этап ${index + 1}`;
    if (!stage.title.trim()) throw new Error(`${label}: укажите название`);
    if (stage.endOffset < stage.startOffset) throw new Error(`${label}: конец раньше начала`);
    if (stage.tasks.length === 0) throw new Error(`${label}: добавьте хотя бы одну задачу`);
    return {
      id: stage.id ?? nextId('stage'),
      title: stage.title.trim(),
      description: stage.description?.trim() || undefined,
      order: index + 1,
      startOffset: stage.startOffset,
      endOffset: stage.endOffset,
      tasks: stage.tasks.map((task) => {
        if (!task.title.trim()) throw new Error(`${label}: у задачи нет названия`);
        if (task.dayOffset < stage.startOffset || task.dayOffset > stage.endOffset) {
          throw new Error(`${label}: «${task.title}» выходит за сроки этапа`);
        }
        const unknown = task.materialIds?.find((id) => !materials.some((item) => item.id === id));
        if (unknown) throw new Error('Материал не найден');
        return {
          id: task.id ?? nextId('ttask'),
          title: task.title.trim(),
          description: task.description?.trim() || undefined,
          priority: task.priority,
          dayOffset: task.dayOffset,
          assignee: task.assignee,
          materialIds: task.materialIds?.length ? [...task.materialIds] : undefined,
        };
      }),
    };
  });
  return { title, description: payload.description.trim(), stages };
}

export async function createTemplate(payload: TemplatePayload): Promise<OnboardingTemplate> {
  await delay(480);
  requireAdmin();
  const template: OnboardingTemplate = { id: nextId('template'), ...normalizeTemplate(payload) };
  templates.push(template);
  return clone(template);
}

export async function updateTemplate(templateId: string, payload: TemplatePayload): Promise<OnboardingTemplate> {
  await delay(480);
  const template = requireTemplate(templateId);
  Object.assign(template, normalizeTemplate(payload));
  return clone(template);
}

export async function setTemplateArchived(templateId: string, archived: boolean): Promise<OnboardingTemplate> {
  await delay(320);
  const template = requireTemplate(templateId);
  if (archived && templates.filter((item) => !item.archived).length === 1) {
    throw new Error('Нельзя отправить в архив последний активный шаблон');
  }
  template.archived = archived || undefined;
  return clone(template);
}

export async function getStaff(): Promise<Staff> {
  await delay(240);
  requireAdmin();
  return clone({ managers, mentors });
}

export async function getDepartments(): Promise<Department[]> {
  await delay(240);
  requireAdmin();
  return clone(departments);
}

function normalizeStaff(payload: StaffPayload): StaffPayload {
  const value = {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    position: payload.position.trim(),
  };
  if (value.firstName.length < 2 || value.lastName.length < 2) throw new Error('Укажите имя и фамилию');
  if (value.position.length < 2) throw new Error('Укажите должность');
  return value;
}

function syncStaffMember(member: StaffMember) {
  const short = toUserShort(member);
  users.forEach((user) => {
    if (user.manager?.id === member.id) user.manager = short;
    if (user.mentor?.id === member.id) user.mentor = short;
  });
  tasks.forEach((task) => {
    if (task.assignee?.id === member.id) task.assignee = short;
  });
}

export async function createStaffMember(kind: StaffKind, payload: StaffPayload): Promise<StaffMember> {
  await delay(360);
  requireAdmin();
  const member: StaffMember = { id: nextId(kind), ...normalizeStaff(payload) };
  staffByKind[kind].push(member);
  return clone(member);
}

export async function updateStaffMember(
  kind: StaffKind,
  memberId: string,
  payload: StaffPayload,
): Promise<StaffMember> {
  await delay(360);
  requireAdmin();
  const member = findStaffMember(kind, memberId);
  Object.assign(member, normalizeStaff(payload));
  syncStaffMember(member);
  return clone(member);
}

export async function setStaffArchived(kind: StaffKind, memberId: string, archived: boolean): Promise<StaffMember> {
  await delay(300);
  requireAdmin();
  const member = findStaffMember(kind, memberId);
  member.archived = archived || undefined;
  return clone(member);
}

function normalizeDepartment(payload: DepartmentPayload, selfId?: string): DepartmentPayload {
  const name = payload.name.trim();
  if (name.length < 2) throw new Error('Название — минимум 2 символа');
  const duplicate = departments.some(
    (item) => item.id !== selfId && item.name.toLowerCase() === name.toLowerCase(),
  );
  if (duplicate) throw new Error('Такой отдел уже есть');
  return { name };
}

export async function createDepartment(payload: DepartmentPayload): Promise<Department> {
  await delay(360);
  requireAdmin();
  const department: Department = { id: nextId('department'), ...normalizeDepartment(payload) };
  departments.push(department);
  return clone(department);
}

export async function updateDepartment(departmentId: string, payload: DepartmentPayload): Promise<Department> {
  await delay(360);
  requireAdmin();
  const department = findDepartmentRecord(departmentId);
  Object.assign(department, normalizeDepartment(payload, departmentId));
  const ref = toDepartmentRef(department);
  users.forEach((user) => {
    if (user.department.id === departmentId) user.department = ref;
  });
  return clone(department);
}

export async function setDepartmentArchived(departmentId: string, archived: boolean): Promise<Department> {
  await delay(300);
  requireAdmin();
  const department = findDepartmentRecord(departmentId);
  department.archived = archived || undefined;
  return clone(department);
}

export async function getOnboarding(userId?: string): Promise<Onboarding> {
  await delay(420);
  return getMockOnboarding(resolveUserId(userId));
}

export async function getOnboardingStage(stageId: string, userId?: string): Promise<OnboardingStage> {
  await delay();
  const stage = getMockOnboarding(resolveUserId(userId)).stages.find((item) => item.id === stageId);
  if (!stage) throw new Error('Этап адаптации не найден');
  return clone(stage);
}

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  await delay();
  const ownerId = resolveUserId(filters.userId);
  let result = tasks.filter((task) => task.userId === ownerId).map(withResolvedStatus);
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
  const { task } = requireTaskAccess(taskId);
  return clone(withResolvedStatus(task));
}

export async function completeTask(taskId: string): Promise<Task> {
  await delay(520);
  const session = requireSession();
  const task = tasks.find((item) => item.id === taskId);
  if (!task) throw new Error('Задача не найдена');
  if (task.userId !== session.userId) throw new Error('Недостаточно прав');
  task.status = 'completed';
  task.completedAt = new Date().toISOString();
  return clone(withResolvedStatus(task));
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  await delay(480);
  requireEmployee(payload.userId);
  const stage = getMockOnboarding(payload.userId).stages.find((item) => item.id === payload.stageId);
  if (!stage) throw new Error('Этап адаптации не найден');
  const task: Task = {
    id: nextId(`${payload.userId}-custom`),
    userId: payload.userId,
    stageId: payload.stageId,
    title: payload.title.trim(),
    description: payload.description?.trim() || undefined,
    status: 'todo',
    priority: payload.priority,
    dueDate: payload.dueDate,
    materialIds: payload.materialIds?.length ? [...payload.materialIds] : undefined,
  };
  tasks.push(task);
  recordChange({
    employeeId: payload.userId,
    kind: 'task_created',
    title: 'Добавлена задача',
    description: `${task.title} · этап «${stage.title}»`,
    taskId: task.id,
    notify: {
      userIds: [payload.userId],
      title: 'В план добавлена задача',
      description: task.title,
      link: `/tasks/${task.id}`,
    },
  });
  return clone(withResolvedStatus(task));
}

const FIELD_LABELS: Record<keyof UpdateTaskPayload, string> = {
  title: 'название',
  description: 'описание',
  priority: 'приоритет',
  dueDate: 'срок',
  materialIds: 'материалы',
};

function normalizePatch(patch: UpdateTaskPayload): UpdateTaskPayload {
  const next: UpdateTaskPayload = { ...patch };
  if ('title' in patch) next.title = patch.title?.trim();
  if ('description' in patch) next.description = patch.description?.trim() || undefined;
  if ('materialIds' in patch) next.materialIds = patch.materialIds?.length ? [...patch.materialIds] : undefined;
  return next;
}

const sameValue = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export async function updateTask(taskId: string, patch: UpdateTaskPayload): Promise<Task> {
  await delay(420);
  const task = requireEditableTask(taskId);
  const next = normalizePatch(patch);
  const changed = (Object.keys(next) as (keyof UpdateTaskPayload)[]).filter(
    (key) => !sameValue(task[key], next[key]),
  );
  if (changed.length === 0) return clone(withResolvedStatus(task));
  Object.assign(task, next);
  const onlyDate = changed.length === 1 && changed[0] === 'dueDate';
  const fields = changed.map((key) => FIELD_LABELS[key]).join(', ');
  recordChange({
    employeeId: task.userId,
    kind: 'task_updated',
    title: onlyDate ? 'Сдвинут срок' : 'Задача изменена',
    description: onlyDate
      ? `${task.title} · до ${formatDate(task.dueDate)}`
      : `${task.title} · ${fields}`,
    taskId: task.id,
    notify: {
      userIds: [task.userId],
      title: onlyDate ? 'Срок задачи обновлён' : 'Задача обновлена',
      description: onlyDate ? task.title : `${task.title}: изменены ${fields}`,
      link: `/tasks/${task.id}`,
    },
  });
  return clone(withResolvedStatus(task));
}

export async function deleteTask(taskId: string): Promise<void> {
  await delay(420);
  const task = requireEditableTask(taskId);
  tasks.splice(tasks.indexOf(task), 1);
  for (let index = comments.length - 1; index >= 0; index -= 1) {
    if (comments[index].taskId === taskId) comments.splice(index, 1);
  }
  recordChange({
    employeeId: task.userId,
    kind: 'task_removed',
    title: 'Задача снята с плана',
    description: task.title,
    notify: {
      userIds: [task.userId],
      title: 'Задача снята с плана',
      description: task.title,
      link: '/tasks',
    },
  });
}

export async function getTaskComments(taskId: string): Promise<TaskComment[]> {
  await delay(260);
  requireTaskAccess(taskId);
  return clone(comments.filter((item) => item.taskId === taskId));
}

export async function addTaskComment(taskId: string, text: string): Promise<TaskComment> {
  await delay(360);
  const { session, task } = requireTaskAccess(taskId);
  const body = text.trim();
  if (!body) throw new Error('Напишите сообщение');
  const author = findUser(session.userId);
  const comment: TaskComment = {
    id: nextId('comment'),
    taskId,
    employeeId: task.userId,
    authorId: session.userId,
    authorName: formatUserName(author),
    authorRole: session.role,
    text: body,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  const fromEmployee = session.role === 'employee';
  recordChange({
    employeeId: task.userId,
    kind: 'comment',
    title: fromEmployee ? 'Вопрос по задаче' : 'Ответ HR по задаче',
    description: `${task.title}: ${body.slice(0, 120)}`,
    taskId,
    notify: fromEmployee
      ? {
          userIds: adminIds(),
          title: 'Вопрос по задаче',
          description: `${comment.authorName}: ${task.title}`,
          link: `/admin/employees/${task.userId}/tasks/${task.id}`,
        }
      : {
          userIds: [task.userId],
          title: 'Ответ HR по задаче',
          description: task.title,
          link: `/tasks/${task.id}`,
        },
  });
  return clone(comment);
}

export async function getEmployeeActivity(userId: string): Promise<ActivityEntry[]> {
  await delay(280);
  requireEmployee(userId);
  return clone(activity.filter((item) => item.employeeId === userId).sort(newestFirst));
}

export async function getMaterials(filters: MaterialFilters = {}): Promise<Material[]> {
  await delay();
  if (filters.ids) {
    const ids = filters.ids;
    return clone(materials.filter((material) => ids.includes(material.id)));
  }
  let result = filters.includeArchived ? [...materials] : materials.filter((item) => !item.archived);
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

function requireMaterial(materialId: string) {
  requireAdmin();
  const material = materials.find((item) => item.id === materialId);
  if (!material) throw new Error('Материал не найден');
  return material;
}

function normalizeMaterial(payload: MaterialPayload): MaterialPayload {
  const title = payload.title.trim();
  if (title.length < 3) throw new Error('Название — минимум 3 символа');
  if (!URL.canParse(payload.url.trim())) throw new Error('Укажите корректную ссылку');
  return {
    title,
    description: payload.description?.trim() || undefined,
    type: payload.type,
    url: payload.url.trim(),
    category: payload.category || undefined,
    duration: payload.duration || undefined,
  };
}

export async function createMaterial(payload: MaterialPayload): Promise<Material> {
  await delay(420);
  requireAdmin();
  const material: Material = { id: nextId('mat'), ...normalizeMaterial(payload), isRead: false };
  materials.unshift(material);
  return clone(material);
}

export async function updateMaterial(materialId: string, payload: MaterialPayload): Promise<Material> {
  await delay(420);
  const material = requireMaterial(materialId);
  Object.assign(material, normalizeMaterial(payload));
  return clone(material);
}

export async function setMaterialArchived(materialId: string, archived: boolean): Promise<Material> {
  await delay(320);
  const material = requireMaterial(materialId);
  material.archived = archived || undefined;
  return clone(material);
}

export async function getNotifications(): Promise<Notification[]> {
  await delay();
  const session = requireSession();
  return clone(notifications.filter((item) => item.userId === session.userId).sort(newestFirst));
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  await delay(220);
  const session = requireSession();
  const notification = notifications.find((item) => item.id === notificationId);
  if (!notification || notification.userId !== session.userId) {
    throw new Error('Уведомление не найдено');
  }
  notification.isRead = true;
  return clone(notification);
}

export async function sendReminder(userId: string): Promise<Notification> {
  await delay(420);
  requireEmployee(userId);
  const existing = recentReminder(userId);
  if (existing) return clone(existing);
  const first = overdueTasks(userId)[0];
  const [notification] = recordChange({
    employeeId: userId,
    kind: 'reminder',
    title: 'Напоминание о задачах',
    description: first ? `Просрочено: ${first.title}` : 'Проверьте текущий этап',
    taskId: first?.id,
    notify: {
      userIds: [userId],
      type: 'reminder',
      title: REMINDER_TITLE,
      link: first ? `/tasks/${first.id}` : '/onboarding',
    },
  });
  return clone(notification);
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<User> {
  await delay(480);
  const session = requireSession();
  const user = findUser(session.userId);
  if (!user) throw new Error('Пользователь не найден');
  Object.assign(user, payload);
  return clone(user);
}
