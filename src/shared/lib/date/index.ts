export function formatDate(value?: string): string {
  if (!value) return 'Без срока';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}
export function formatShortDate(value?: string): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(
    new Date(value),
  );
}
export function relativeDate(value: string): string {
  const diff = Math.ceil((new Date(value).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return `Просрочено на ${Math.abs(diff)} дн.`;
  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Завтра';
  if (diff < 5) return `Через ${diff} дня`;
  return formatShortDate(value);
}
export function isOverdue(value?: string): boolean {
  return Boolean(value && new Date(value).setHours(23, 59, 59, 999) < Date.now());
}
