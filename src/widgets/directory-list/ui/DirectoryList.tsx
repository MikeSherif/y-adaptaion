import { useState, type ReactNode } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { Badge, Button, Card, Skeleton } from '@/shared/ui';
import styles from './DirectoryList.module.css';

interface DirectoryItem {
  id: string;
  archived?: boolean;
}

export function DirectoryList<T extends DirectoryItem>({
  title,
  lead,
  items,
  isLoading,
  addLabel,
  describe,
  renderEditor,
  renderArchive,
}: {
  title: string;
  lead: string;
  items?: T[];
  isLoading?: boolean;
  addLabel: string;
  describe: (item: T) => { title: string; subtitle?: string };
  renderEditor: (item: T | undefined, close: () => void) => ReactNode;
  renderArchive: (item: T) => ReactNode;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const close = () => setEditing(null);
  const archivedCount = items?.filter((item) => item.archived).length ?? 0;
  const visible = items?.filter((item) => showArchived || !item.archived) ?? [];

  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <div>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
        {archivedCount > 0 && (
          <button type="button" className={styles.toggle} onClick={() => setShowArchived((value) => !value)}>
            {showArchived ? 'Скрыть архив' : `Архив · ${archivedCount}`}
          </button>
        )}
      </div>
      {isLoading ? (
        <Skeleton height={140} />
      ) : (
        <ul className={styles.list}>
          {visible.map((item) => {
            const { title: itemTitle, subtitle } = describe(item);
            return (
              <li key={item.id} className={item.archived ? styles.archivedRow : styles.row}>
                {editing === item.id ? (
                  renderEditor(item, close)
                ) : (
                  <>
                    <div className={styles.copy}>
                      <strong>{itemTitle}</strong>
                      {subtitle && <span>{subtitle}</span>}
                    </div>
                    {item.archived && <Badge tone="neutral">В архиве</Badge>}
                    <div className={styles.actions}>
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label={`Изменить: ${itemTitle}`}
                        onClick={() => setEditing(item.id)}
                      >
                        <Pencil size={15} />
                      </Button>
                      {renderArchive(item)}
                    </div>
                  </>
                )}
              </li>
            );
          })}
          {visible.length === 0 && <li className={styles.empty}>Пока пусто</li>}
        </ul>
      )}
      {editing === 'new' ? (
        renderEditor(undefined, close)
      ) : (
        <Button type="button" variant="secondary" onClick={() => setEditing('new')}>
          <Plus size={15} />
          {addLabel}
        </Button>
      )}
    </Card>
  );
}
