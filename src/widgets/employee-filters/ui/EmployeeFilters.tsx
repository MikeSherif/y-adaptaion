import type { EmployeeFilters, EmployeeSummary } from '@/shared/types/domain';
import { Card, Input, Select } from '@/shared/ui';
import styles from '@/pages/page.module.css';

const riskOptions = [
  { value: '', label: 'Все' },
  { value: 'overdue', label: 'Просрочено' },
  { value: 'on_track', label: 'В графике' },
  { value: 'completed', label: 'Завершено' },
  { value: 'questions', label: 'С вопросами' },
] as const;

export function EmployeeFilters({
  filters,
  employees,
  onChange,
}: {
  filters: EmployeeFilters;
  employees: EmployeeSummary[];
  onChange: (value: Partial<EmployeeFilters>) => void;
}) {
  const departments = [
    { value: '', label: 'Все отделы' },
    ...unique(
      employees.map((item) => ({
        value: item.user.department.id,
        label: item.user.department.name,
      })),
    ),
  ];
  const stages = [
    { value: '', label: 'Все этапы' },
    ...unique(
      employees
        .map((item) => item.currentStageTitle)
        .filter((title): title is string => Boolean(title))
        .map((title) => ({ value: title, label: title })),
    ),
  ];

  return (
    <Card className={styles.filters}>
      <Input
        aria-label="Поиск сотрудников"
        placeholder="Имя или должность"
        value={filters.search ?? ''}
        onChange={(event) => onChange({ search: event.target.value || undefined })}
      />
      <Select
        aria-label="Отдел"
        value={filters.departmentId ?? ''}
        options={departments}
        onChange={(departmentId) => onChange({ departmentId: departmentId || undefined })}
      />
      <Select
        aria-label="Риск"
        value={filters.risk ?? ''}
        options={[...riskOptions]}
        onChange={(risk) =>
          onChange({ risk: (risk || undefined) as EmployeeFilters['risk'] })
        }
      />
      <Select
        aria-label="Этап"
        value={filters.stage ?? ''}
        options={stages}
        onChange={(stage) => onChange({ stage: stage || undefined })}
      />
    </Card>
  );
}

function unique(options: { value: string; label: string }[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
}
