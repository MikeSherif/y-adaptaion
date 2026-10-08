import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useTemplateQuery } from '@/entities/template';
import { TemplateForm } from '@/features/manage-template';
import { ErrorState, Skeleton } from '@/shared/ui';
import { TemplatePreview } from '@/widgets/template-preview';
import styles from '@/pages/page.module.css';

export function AdminTemplateFormPage() {
  const { templateId } = useParams({ strict: false });
  const { from } = useSearch({ strict: false });
  const navigate = useNavigate();
  const loadId = templateId ?? from;
  const { data: loaded, isLoading, isError, refetch } = useTemplateQuery(loadId);
  const isEdit = Boolean(templateId);
  const title = isEdit ? 'Редактировать шаблон' : from ? 'Копия шаблона' : 'Новый шаблон';
  const backToList = () => void navigate({ to: '/admin/templates' });

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/admin/templates">
          <ArrowLeft size={15} />
          Шаблоны
        </Link>
        <span>/</span>
        <span>{isEdit ? (loaded?.title ?? 'Шаблон') : title}</span>
      </div>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Кабинет HR</p>
          <h1>{title}</h1>
          <p>Этапы, задачи по дням, исполнители и материалы.</p>
        </div>
      </div>
      {isEdit && (
        <p className={styles.notice}>
          Изменения применятся к новым сотрудникам; выданные планы не меняются.
        </p>
      )}
      {loadId && isLoading ? (
        <Skeleton height={420} />
      ) : loadId && (isError || !loaded) ? (
        <ErrorState title="Шаблон не найден" onRetry={() => void refetch()} />
      ) : (
        <TemplateForm
          key={loadId ?? 'new'}
          template={isEdit ? loaded : undefined}
          source={isEdit ? undefined : loaded}
          onSaved={backToList}
          renderPreview={(template) => <TemplatePreview template={template} compact />}
        />
      )}
    </div>
  );
}
