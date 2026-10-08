import { useState } from 'react';
import { Input, Skeleton } from '@/shared/ui';
import { useMaterialsByIds, useMaterialsQuery } from '../model/useMaterialQueries';
import styles from './MaterialPicker.module.css';

export function MaterialPicker({
  value,
  onChange,
  legend = 'Материалы',
}: {
  value: string[];
  onChange: (value: string[]) => void;
  legend?: string;
}) {
  const [search, setSearch] = useState('');
  const { data: active, isLoading } = useMaterialsQuery();
  const { data: selected = [] } = useMaterialsByIds(value);
  const archivedSelected = selected.filter((material) => material.archived);
  const query = search.trim().toLowerCase();
  const visible = [...archivedSelected, ...(active ?? [])].filter((material) =>
    `${material.title} ${material.category ?? ''}`.toLowerCase().includes(query),
  );
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);

  return (
    <fieldset className={styles.picker}>
      <legend className={styles.legend}>
        {legend}
        {value.length > 0 && <span> · выбрано {value.length}</span>}
      </legend>
      <Input
        aria-label="Поиск материалов"
        placeholder="Найти материал"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {isLoading ? (
        <Skeleton height={120} />
      ) : (
        <ul className={styles.list}>
          {visible.map((material) => (
            <li key={material.id}>
              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={value.includes(material.id)}
                  onChange={() => toggle(material.id)}
                />
                <span className={styles.title}>{material.title}</span>
                <span className={material.archived ? styles.archived : styles.category}>
                  {material.archived ? 'В архиве' : material.category}
                </span>
              </label>
            </li>
          ))}
          {visible.length === 0 && <li className={styles.empty}>Ничего не нашли</li>}
        </ul>
      )}
    </fieldset>
  );
}
