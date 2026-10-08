export function formatDate(value?: string): string {
  if (!value) return 'Без срока';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}
export function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function daysBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(`${fromIso.slice(0, 10)}T00:00:00Z`);
  const to = Date.parse(`${toIso.slice(0, 10)}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}
export function monthOf(isoDate: string): string {
  return `${isoDate.slice(0, 7)}-01`;
}
export function shiftMonth(monthIso: string, months: number): string {
  const date = new Date(`${monthOf(monthIso)}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}
export function monthGrid(monthIso: string): string[] {
  const first = new Date(`${monthOf(monthIso)}T00:00:00Z`);
  const mondayOffset = (first.getUTCDay() + 6) % 7;
  const start = addDays(monthOf(monthIso), -mondayOffset);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}
export function formatMonthYear(monthIso: string): string {
  return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${monthOf(monthIso)}T00:00:00Z`))
    .replace(' г.', '');
}
export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
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
export function formatWeekdayDate(value: Date = new Date()): string {
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(value);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
export function dayGreeting(value: Date = new Date()): string {
  const hour = value.getHours();
  if (hour < 5) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}
