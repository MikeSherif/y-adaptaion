import { useNavigate, useSearch } from '@tanstack/react-router';
import type { MaterialType } from '@/shared/types/domain';
import { useMaterialsQuery, MaterialCard } from '@/entities/material';
import { useMarkMaterialAsRead } from '@/features/mark-material-as-read';
import { Card, EmptyState, ErrorState, Input, Select, Skeleton } from '@/shared/ui';
import styles from '@/pages/page.module.css';
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
          onChange={(event) =>
            setSearch({ type: (event.target.value || undefined) as MaterialType | undefined })
          }
        >
          <option value="">Все типы</option>
          <option value="document">Документы</option>
          <option value="video">Видео</option>
          <option value="link">Ссылки</option>
          <option value="presentation">Презентации</option>
        </Select>
        <Select
          aria-label="Категория"
          value={search.category ?? ''}
          onChange={(event) => setSearch({ category: event.target.value || undefined })}
        >
          <option value="">Все категории</option>
          <option value="О компании">О компании</option>
          <option value="Обязательное">Обязательное</option>
          <option value="Команда">Команда</option>
          <option value="Инструменты">Инструменты</option>
          <option value="Процессы">Процессы</option>
        </Select>
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
