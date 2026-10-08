import { ExternalLink, FileText, Presentation, Video, type LucideIcon } from 'lucide-react';
import type { MaterialType } from '@/shared/types/domain';

export const materialTypeIcons: Record<MaterialType, LucideIcon> = {
  document: FileText,
  video: Video,
  link: ExternalLink,
  presentation: Presentation,
};

export const materialTypeLabels: Record<MaterialType, string> = {
  document: 'Документ',
  video: 'Видео',
  link: 'Ссылка',
  presentation: 'Презентация',
};

export const materialTypeOptions = (Object.keys(materialTypeLabels) as MaterialType[]).map((value) => ({
  value,
  label: materialTypeLabels[value],
}));

export const materialCategories = ['О компании', 'Обязательное', 'Команда', 'Инструменты', 'Процессы'];

export const materialCategoryOptions = materialCategories.map((value) => ({ value, label: value }));
