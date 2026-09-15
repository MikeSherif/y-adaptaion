import { BookOpen, ExternalLink, FileText, Presentation, Video } from 'lucide-react';
import type { Material } from '@/shared/types/domain';
import { Badge, Card } from '@/shared/ui';
import styles from './MaterialCard.module.css';
const typeIcons = {
  document: FileText,
  video: Video,
  link: ExternalLink,
  presentation: Presentation,
};
const typeLabels = {
  document: 'Документ',
  video: 'Видео',
  link: 'Ссылка',
  presentation: 'Презентация',
};
export function MaterialCard({
  material,
  onRead,
}: {
  material: Material;
  onRead?: (id: string) => void;
}) {
  const Icon = typeIcons[material.type];
  return (
    <Card className={styles.card}>
      <a
        className={styles.link}
        href={material.url}
        target="_blank"
        rel="noreferrer"
        onClick={() => !material.isRead && onRead?.(material.id)}
      >
        <div className={styles.icon}>
          <Icon size={21} />
        </div>
        <div className={styles.copy}>
          <div className={styles.top}>
            <Badge tone="info">{typeLabels[material.type]}</Badge>
            {!material.isRead && <span className={styles.unread}>Новое</span>}
          </div>
          <h3>{material.title}</h3>
          <p>{material.description}</p>
          <div className={styles.footer}>
            <BookOpen size={14} />
            {material.category ?? 'Материал'}
            {material.duration && <span>· {material.duration} мин</span>}
          </div>
        </div>
      </a>
    </Card>
  );
}
