import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { Pencil, Plus } from 'lucide-react';
import { materialTypeIcons, materialTypeLabels, useMaterialsQuery } from '@/entities/material';
import { ArchiveMaterialButton } from '@/features/manage-material';
import { archiveFilterOptions, matchesArchiveFilter, type ArchiveFilter } from '@/shared/lib/options';
import { Badge, Card, EmptyState, ErrorState, Input, Select, Skeleton } from '@/shared/ui';
import { buttonClass } from '@/shared/ui/buttonClass';
import styles from '@/pages/page.module.css';

export function AdminMaterialsPage() {
  const { search = '', status = 'active' } = useSearch({ from: '/admin/materials' });
  const navigate = useNavigate({ from: '/admin/materials' });
  const setFilters = (value: { search?: string; status?: ArchiveFilter }) =>
    void navigate({ search: (previous) => ({ ...previous, ...value }), replace: true });
  const { data, isLoading, isError, refetch } = useMaterialsQuery({
    includeArchived: true,
    search: search.trim() || undefined,
  });
  const visible = data?.filter((material) => matchesArchiveFilter(material, status)) ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Кабинет HR</p>
          <h1>Материалы</h1>
          <p>База знаний для новичков: из неё выбираются материалы к задачам и шаблонам.</p>
        </div>
        <Link to="/admin/materials/new" className={buttonClass()}>
          <Plus size={16} />
          Добавить материал
        </Link>
      </div>
      <Card className={styles.filters}>
        <Input
          aria-label="Поиск материалов"
          placeholder="Название или описание"
          value={search}
          onChange={(event) => setFilters({ search: event.target.value || undefined })}
        />
        <Select
          aria-label="Статус"
          value={status}
          options={archiveFilterOptions}
          onChange={(value) => setFilters({ status: value === 'active' ? undefined : value })}
        />
      </Card>
      {isLoading ? (
        <Skeleton height={260} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState
          title={status === 'archived' ? 'Архив пуст' : 'Материалов не нашли'}
          description="Измените поиск или добавьте новый материал."
        />
      ) : (
        <ul className={styles.catalogList}>
          {visible.map((material) => {
            const Icon = materialTypeIcons[material.type];
            return (
              <li key={material.id}>
                <Card className={styles.catalogRow}>
                  <span className={styles.catalogIcon}>
                    <Icon size={19} />
                  </span>
                  <div className={styles.catalogCopy}>
                    <h3>{material.title}</h3>
                    <p>
                      {materialTypeLabels[material.type]} · {material.category ?? 'Без категории'}
                      {material.duration ? ` · ${material.duration} мин` : ''}
                    </p>
                  </div>
                  {material.archived && <Badge tone="neutral">В архиве</Badge>}
                  <div className={styles.inlineActions}>
                    <Link
                      to="/admin/materials/$materialId"
                      params={{ materialId: material.id }}
                      className={buttonClass('ghost')}
                    >
                      <Pencil size={15} />
                      Изменить
                    </Link>
                    <ArchiveMaterialButton material={material} />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
