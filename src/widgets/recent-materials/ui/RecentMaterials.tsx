import { Link } from '@tanstack/react-router';
import { useMaterialsQuery } from '@/entities/material';
import { MaterialCard } from '@/entities/material';
import { useMarkMaterialAsRead } from '@/features/mark-material-as-read';
import { Card, ErrorState, Skeleton } from '@/shared/ui';
import styles from './RecentMaterials.module.css';
export function RecentMaterials() {
  const { data, isLoading, isError, refetch } = useMaterialsQuery();
  const read = useMarkMaterialAsRead();
  return (
    <Card className={styles.section}>
      <div className={styles.heading}>
        <div>
          <h2>Полезные материалы</h2>
          <p>Продолжайте изучать базу знаний</p>
        </div>
        <Link to="/materials">Все материалы</Link>
      </div>
      {isLoading && (
        <div className={styles.grid}>
          <Skeleton height={160} />
          <Skeleton height={160} />
        </div>
      )}
      {isError && <ErrorState onRetry={() => void refetch()} />}{' '}
      {data && (
        <div className={styles.grid}>
          {data.slice(0, 2).map((material) => (
            <MaterialCard key={material.id} material={material} onRead={(id) => read.mutate(id)} />
          ))}
        </div>
      )}
    </Card>
  );
}
