interface Archivable {
  id: string;
  archived?: boolean;
}

export interface Option {
  value: string;
  label: string;
}

export function selectableOptions<T extends Archivable>(
  items: T[] = [],
  currentId: string | undefined,
  toOption: (item: T) => Option,
): Option[] {
  return items
    .filter((item) => !item.archived || item.id === currentId)
    .map((item) => {
      const option = toOption(item);
      return item.archived ? { ...option, label: `${option.label} (в архиве)` } : option;
    });
}

export const isActive = (item: { archived?: boolean }) => !item.archived;

export type ArchiveFilter = 'active' | 'archived';
export const archiveFilterOptions: { value: ArchiveFilter; label: string }[] = [
  { value: 'active', label: 'Активные' },
  { value: 'archived', label: 'Архив' },
];
export const matchesArchiveFilter = (item: { archived?: boolean }, filter: ArchiveFilter) =>
  filter === 'archived' ? Boolean(item.archived) : !item.archived;
