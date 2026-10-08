import { useState } from 'react';
import { History } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ActivityItem, useEmployeeActivityQuery } from '@/entities/activity';
import { Button, Card, ErrorState, Skeleton } from '@/shared/ui';
import pageStyles from '@/pages/page.module.css';
import styles from './EmployeeActivity.module.css';

const PAGE_SIZE = 20;

export function EmployeeActivity({ userId }: { userId: string }) {
  const { data, isLoading, isError, refetch } = useEmployeeActivityQuery(userId);
  const [expanded, setExpanded] = useState(false);
  const items = expanded ? data : data?.slice(0, PAGE_SIZE);

  return (
    <Card className={pageStyles.sideCard}>
      <h3 className={styles.title}>
        <History size={16} />
        История
      </h3>
      {isLoading && <Skeleton height={140} />}
      {isError && <ErrorState onRetry={() => void refetch()} />}
      {items && items.length === 0 && <p className={pageStyles.panelLead}>Изменений пока не было.</p>}
      {items && items.length > 0 && (
        <ol className={styles.list}>
          {items.map((entry) => (
            <ActivityItem
              key={entry.id}
              entry={entry}
              action={
                entry.taskId && (
                  <Link
                    to="/admin/employees/$userId/tasks/$taskId"
                    params={{ userId, taskId: entry.taskId }}
                  >
                    К задаче
                  </Link>
                )
              }
            />
          ))}
        </ol>
      )}
      {data && data.length > PAGE_SIZE && (
        <Button variant="ghost" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Свернуть' : `Показать все · ${data.length}`}
        </Button>
      )}
    </Card>
  );
}
