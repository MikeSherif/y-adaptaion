import { useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { BookOpen, ListTodo, Search } from 'lucide-react';
import { useTasksQuery } from '@/entities/task';
import { useMaterialsQuery } from '@/entities/material';
import { useAuthStore } from '@/features/auth';
import styles from './AppHeader.module.css';

export function HeaderSearch() {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.session?.role === 'admin');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { data: tasks } = useTasksQuery({}, !isAdmin);
  const { data: materials } = useMaterialsQuery();
  const needle = query.trim().toLowerCase();
  const taskHits = useMemo(
    () =>
      !isAdmin && needle
        ? (tasks ?? [])
            .filter((task) =>
              `${task.title} ${task.description ?? ''}`.toLowerCase().includes(needle),
            )
            .slice(0, 4)
        : [],
    [isAdmin, needle, tasks],
  );
  const materialHits = useMemo(
    () =>
      needle
        ? (materials ?? [])
            .filter((material) =>
              `${material.title} ${material.description ?? ''}`.toLowerCase().includes(needle),
            )
            .slice(0, 3)
        : [],
    [needle, materials],
  );
  const hasHits = taskHits.length > 0 || materialHits.length > 0;

  return (
    <form
      className={styles.search}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        if (!needle) return;
        setOpen(false);
        void navigate(
          isAdmin
            ? { to: '/admin/materials', search: { search: query.trim() } }
            : { to: '/tasks', search: { search: query.trim() } },
        );
      }}
    >
      <Search size={18} />
      <input
        type="search"
        value={query}
        placeholder="Поиск по материалам и задачам"
        aria-label="Поиск по материалам и задачам"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      />
      {open && needle && (
        <div className={styles.searchResults}>
          {hasHits ? (
            <>
              {taskHits.map((task) => (
                <Link
                  key={task.id}
                  to="/tasks/$taskId"
                  params={{ taskId: task.id }}
                  className={styles.searchItem}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <ListTodo size={15} />
                  <span>{task.title}</span>
                </Link>
              ))}
              {materialHits.map((material) => (
                <Link
                  key={material.id}
                  {...(isAdmin
                    ? { to: '/admin/materials/$materialId', params: { materialId: material.id } }
                    : { to: '/materials', search: { search: material.title } })}
                  className={styles.searchItem}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <BookOpen size={15} />
                  <span>{material.title}</span>
                </Link>
              ))}
            </>
          ) : (
            <p className={styles.searchEmpty}>Ничего не найдено</p>
          )}
        </div>
      )}
    </form>
  );
}
