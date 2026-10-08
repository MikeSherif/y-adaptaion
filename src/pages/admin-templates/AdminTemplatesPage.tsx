import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { Copy, Pencil, Plus } from 'lucide-react';
import { useTemplatesQuery } from '@/entities/template';
import { ArchiveTemplateButton } from '@/features/manage-template';
import { archiveFilterOptions, matchesArchiveFilter } from '@/shared/lib/options';
import { Badge, Card, EmptyState, ErrorState, Select, Skeleton } from '@/shared/ui';
import { buttonClass } from '@/shared/ui/buttonClass';
import { TemplatePreview } from '@/widgets/template-preview';
import styles from '@/pages/page.module.css';

export function AdminTemplatesPage() {
  const { status = 'active' } = useSearch({ from: '/admin/templates' });
  const navigate = useNavigate({ from: '/admin/templates' });
  const { data, isLoading, isError, refetch } = useTemplatesQuery();
  const visible = data?.filter((template) => matchesArchiveFilter(template, status)) ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Кабинет HR</p>
          <h1>Шаблоны адаптации</h1>
          <p>План собирается из шаблона при добавлении сотрудника: сроки считаются от даты выхода.</p>
        </div>
        <Link to="/admin/templates/new" className={buttonClass()}>
          <Plus size={16} />
          Создать шаблон
        </Link>
      </div>
      <Card className={styles.filters}>
        <Select
          aria-label="Статус"
          value={status}
          options={archiveFilterOptions}
          onChange={(value) =>
            void navigate({ search: { status: value === 'active' ? undefined : value }, replace: true })
          }
        />
      </Card>
      {isLoading ? (
        <Skeleton height={320} />
      ) : isError || !data ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState
          title={status === 'archived' ? 'Архив пуст' : 'Шаблонов нет'}
          description="Создайте шаблон или верните его из архива."
        />
      ) : (
        <div className={styles.templateGrid}>
          {visible.map((template) => (
            <Card key={template.id} className={styles.panel}>
              <div className={styles.panelHead}>
                <h2>{template.title}</h2>
                {template.archived && <Badge tone="neutral">В архиве</Badge>}
              </div>
              <p className={styles.panelLead}>{template.description}</p>
              <div className={styles.cardActions}>
                <Link
                  to="/admin/templates/$templateId"
                  params={{ templateId: template.id }}
                  className={buttonClass('secondary')}
                >
                  <Pencil size={15} />
                  Изменить
                </Link>
                <Link
                  to="/admin/templates/new"
                  search={{ from: template.id }}
                  className={buttonClass('ghost')}
                >
                  <Copy size={15} />
                  Копировать
                </Link>
                <ArchiveTemplateButton template={template} />
              </div>
              <TemplatePreview template={template} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
