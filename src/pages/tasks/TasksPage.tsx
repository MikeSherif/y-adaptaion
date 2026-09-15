import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTasksQuery } from '@/entities/task';
import { TaskFilters } from '@/widgets/task-filters';
import { TaskList } from '@/widgets/task-list';
import styles from '@/pages/page.module.css';

export function TasksPage() {
  const search = useSearch({ from: '/tasks' });
  const navigate = useNavigate({ from: '/tasks' });
  const query = useTasksQuery(search);
  const setSearch = (value: Partial<typeof search>) => {
    void navigate({ search: (previous) => ({ ...previous, ...value }) });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Рабочий список</p>
          <h1>Задачи</h1>
          <p>Следите за дедлайнами и отмечайте завершённые пункты.</p>
        </div>
      </div>
      <TaskFilters filters={search} onChange={setSearch} />
      <TaskList
        tasks={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      />
    </div>
  );
}
