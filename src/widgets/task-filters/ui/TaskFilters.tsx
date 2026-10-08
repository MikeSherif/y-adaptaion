import type {
  TaskFilters as TaskFiltersState,
  TaskPriority,
  TaskStatus,
} from '@/shared/types/domain';
import { Card, Input, Select } from '@/shared/ui';
import styles from '@/pages/page.module.css';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (value: Partial<TaskFiltersState>) => void;
}
const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'todo', label: 'К выполнению' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Готово' },
  { value: 'overdue', label: 'Просрочено' },
] as const;
const priorityOptions = [
  { value: '', label: 'Все приоритеты' },
  { value: 'high', label: 'Высокий' },
  { value: 'medium', label: 'Средний' },
  { value: 'low', label: 'Низкий' },
] as const;
const sortOptions = [
  { value: 'dueDate', label: 'По сроку' },
  { value: 'priority', label: 'По приоритету' },
] as const;

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <Card className={styles.filters}>
      <Input
        aria-label="Поиск задач"
        placeholder="Поиск задач"
        value={filters.search ?? ''}
        onChange={(event) => onChange({ search: event.target.value || undefined })}
      />
      <Select
        aria-label="Статус"
        value={filters.status ?? ''}
        options={[...statusOptions]}
        onChange={(status) => onChange({ status: (status || undefined) as TaskStatus | undefined })}
      />
      <Select
        aria-label="Приоритет"
        value={filters.priority ?? ''}
        options={[...priorityOptions]}
        onChange={(priority) =>
          onChange({ priority: (priority || undefined) as TaskPriority | undefined })
        }
      />
      <Select
        aria-label="Сортировка"
        value={filters.sort ?? 'dueDate'}
        options={[...sortOptions]}
        onChange={(sort) => onChange({ sort })}
      />
    </Card>
  );
}
