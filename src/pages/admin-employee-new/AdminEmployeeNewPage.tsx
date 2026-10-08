import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTemplateQuery } from '@/entities/template';
import { CreateEmployeeForm } from '@/features/create-employee';
import { Skeleton } from '@/shared/ui';
import { TemplatePreview } from '@/widgets/template-preview';
import styles from '@/pages/page.module.css';

function SelectedTemplatePreview({ templateId }: { templateId: string }) {
  const { data } = useTemplateQuery(templateId);
  return data ? <TemplatePreview template={data} compact /> : <Skeleton height={200} />;
}

export function AdminEmployeeNewPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/admin/employees">
          <ArrowLeft size={15} />
          Сотрудники
        </Link>
        <span>/</span>
        <span>Новый сотрудник</span>
      </div>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Кабинет HR</p>
          <h1>Добавить сотрудника</h1>
          <p>План адаптации соберётся из шаблона, сотрудник сразу сможет войти по email.</p>
        </div>
      </div>
      <CreateEmployeeForm
        onCreated={(user) =>
          void navigate({ to: '/admin/employees/$userId', params: { userId: user.id } })
        }
        renderTemplatePreview={(templateId) => <SelectedTemplatePreview templateId={templateId} />}
      />
    </div>
  );
}
