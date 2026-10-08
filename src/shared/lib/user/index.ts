import type {
  AssigneeRole,
  EmployeeFilters,
  EmployeeSummary,
  User,
  UserShort,
} from '@/shared/types/domain';

export function formatUserName(user?: { firstName: string; lastName: string }): string {
  if (!user) return 'Не назначен';
  return `${user.firstName} ${user.lastName}`;
}

export function filterEmployees(
  list: EmployeeSummary[],
  filters: EmployeeFilters = {},
): EmployeeSummary[] {
  const search = filters.search?.trim().toLowerCase();
  return list.filter(({ user, progress, overdueCount, openQuestions, currentStageTitle }) => {
    if (search) {
      const haystack = `${formatUserName(user)} ${user.position}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filters.departmentId && user.department.id !== filters.departmentId) return false;
    if (filters.stage && currentStageTitle !== filters.stage) return false;
    if (filters.risk === 'overdue' && overdueCount === 0) return false;
    if (filters.risk === 'completed' && progress < 100) return false;
    if (filters.risk === 'on_track' && (overdueCount > 0 || progress === 100)) return false;
    if (filters.risk === 'questions' && openQuestions === 0) return false;
    return true;
  });
}

export function summarizeEmployees(list: EmployeeSummary[]) {
  const overdue = list.filter((item) => item.overdueCount > 0).length;
  const withQuestions = list.filter((item) => item.openQuestions > 0).length;
  const currentStages = list.filter((item) => Boolean(item.currentStageTitle)).length;
  const averageProgress = list.length
    ? Math.round(list.reduce((sum, item) => sum + item.progress, 0) / list.length)
    : 0;
  return { total: list.length, overdue, withQuestions, averageProgress, currentStages };
}

export const toPersonOption = (person: UserShort) => ({
  value: person.id,
  label: `${formatUserName(person)} · ${person.position}`,
});

export const assigneeRoleLabels: Record<AssigneeRole, string> = {
  manager: 'Руководитель',
  mentor: 'Наставник',
};

export function getSupportContact(user?: Pick<User, 'manager' | 'mentor'>) {
  if (user?.mentor) return { person: user.mentor, role: assigneeRoleLabels.mentor };
  if (user?.manager) return { person: user.manager, role: assigneeRoleLabels.manager };
  return undefined;
}

