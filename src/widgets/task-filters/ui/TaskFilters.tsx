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
        onChange={(event) =>
          onChange({ status: (event.target.value || undefined) as TaskStatus | undefined })
        }
      >
        <option value="">Все статусы</option>
        <option value="todo">К выполнению</option>
        <option value="in_progress">В работе</option>
        <option value="completed">Готово</option>
        <option value="overdue">Просрочено</option>
      </Select>
      <Select
        aria-label="Приоритет"
        value={filters.priority ?? ''}
        onChange={(event) =>
          onChange({ priority: (event.target.value || undefined) as TaskPriority | undefined })
        }
      >
        <option value="">Все приоритеты</option>
        <option value="high">Высокий</option>
        <option value="medium">Средний</option>
        <option value="low">Низкий</option>
      </Select>
      <Select
        aria-label="Сортировка"
        value={filters.sort ?? 'dueDate'}
        onChange={(event) => onChange({ sort: event.target.value as 'dueDate' | 'priority' })}
      >
        <option value="dueDate">По сроку</option>
        <option value="priority">По приоритету</option>
      </Select>
    </Card>
  );
}
