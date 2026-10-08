import { useNavigate, useSearch } from '@tanstack/react-router';
import type { MaterialType } from '@/shared/types/domain';
import {
  materialCategoryOptions,
  materialTypeOptions,
  MaterialCard,
  useMaterialsQuery,
} from '@/entities/material';
import { useMarkMaterialAsRead } from '@/features/mark-material-as-read';
import { Card, EmptyState, ErrorState, Input, Select, Skeleton } from '@/shared/ui';
import styles from '@/pages/page.module.css';

const typeFilterOptions = [{ value: '', label: 'Все типы' }, ...materialTypeOptions];
const categoryFilterOptions = [{ value: '', label: 'Все категории' }, ...materialCategoryOptions];

export function MaterialsPage() {
  const search = useSearch({ from: '/materials' });
  const navigate = useNavigate({ from: '/materials' });
  const { data, isLoading, isError, refetch } = useMaterialsQuery(search);
  const markRead = useMarkMaterialAsRead();
  const setSearch = (value: Partial<typeof search>) => {
    void navigate({ search: (prev) => ({ ...prev, ...value }) });
  };
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>База знаний</p>
          <h1>Материалы</h1>
          <p>Всё, что поможет быстрее освоиться в команде и продукте.</p>
        </div>
      </div>
      <Card className={styles.filters}>
        <Input
          aria-label="Поиск материалов"
          placeholder="Поиск материалов"
          value={search.search ?? ''}
          onChange={(event) => setSearch({ search: event.target.value || undefined })}
        />
        <Select
          aria-label="Тип материала"
          value={search.type ?? ''}
          options={typeFilterOptions}
          onChange={(type) => setSearch({ type: (type || undefined) as MaterialType | undefined })}
        />
        <Select
          aria-label="Категория"
          value={search.category ?? ''}
          options={categoryFilterOptions}
          onChange={(category) => setSearch({ category: category || undefined })}
        />
      </Card>
      {isLoading && (
        <div className={styles.materialGrid}>
          <Skeleton height={180} />
          <Skeleton height={180} />
          <Skeleton height={180} />
        </div>
      )}
      {isError && <ErrorState onRetry={() => void refetch()} />}{' '}
      {data &&
        (data.length ? (
          <div className={styles.materialGrid}>
            {data.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onRead={(id) => markRead.mutate(id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState title="Материалы не найдены" />
          </Card>
        ))}
    </div>
  );
}
