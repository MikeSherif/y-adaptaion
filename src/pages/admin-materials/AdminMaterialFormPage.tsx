import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useMaterialQuery } from '@/entities/material';
import { MaterialForm } from '@/features/manage-material';
import { ErrorState, Skeleton } from '@/shared/ui';
import styles from '@/pages/page.module.css';

export function AdminMaterialFormPage() {
  const { materialId = '' } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: material, isLoading, isError, refetch } = useMaterialQuery(materialId);
  const isEdit = Boolean(materialId);
  const backToList = () => void navigate({ to: '/admin/materials' });

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/admin/materials">
          <ArrowLeft size={15} />
          Материалы
        </Link>
        <span>/</span>
        <span>{isEdit ? (material?.title ?? 'Материал') : 'Новый материал'}</span>
      </div>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Кабинет HR</p>
          <h1>{isEdit ? 'Редактировать материал' : 'Добавить материал'}</h1>
          <p>Материал — это ссылка на документ, видео, презентацию или страницу.</p>
        </div>
      </div>
      {!isEdit ? (
        <MaterialForm onSaved={backToList} />
      ) : isLoading ? (
        <Skeleton height={360} />
      ) : isError || !material ? (
        <ErrorState title="Материал не найден" onRetry={() => void refetch()} />
      ) : (
        <MaterialForm key={material.id} material={material} onSaved={backToList} />
      )}
    </div>
  );
}
