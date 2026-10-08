import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import clsx from 'clsx';
import { AlertCircle, Archive, ArchiveRestore, Inbox, LoaderCircle } from 'lucide-react';
import styles from './ui.module.css';
export { Select } from './Select';
export type { SelectOption, SelectProps } from './Select';
export { DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';
import { buttonClass, type ButtonVariant } from './buttonClass';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}
export function Button({
  className,
  variant = 'primary',
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClass(variant, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
export function ArchiveToggleButton({
  archived,
  loading,
  onToggle,
}: {
  archived?: boolean;
  loading?: boolean;
  onToggle: () => void;
}) {
  return (
    <Button type="button" variant={archived ? 'secondary' : 'ghost'} loading={loading} onClick={onToggle}>
      {!loading && (archived ? <ArchiveRestore size={16} /> : <Archive size={16} />)}
      {archived ? 'Вернуть' : 'В архив'}
    </Button>
  );
}
export function IconButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(styles.button, styles.iconButton, className)} {...props}>
      {children}
    </button>
  );
}
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className, id, ...props }: FieldProps) {
  const inputId = id ?? props.name;
  return (
    <div className={styles.inputWrap}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(styles.input, error && styles.inputError, className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(styles.textarea, className)} {...props} />;
}
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={clsx(styles.card, className)}>{children}</section>;
}
export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  children: ReactNode;
}) {
  const toneClass = tone === 'danger' ? styles.dangerBadge : styles[tone];
  return <span className={clsx(styles.badge, toneClass)}>{children}</span>;
}
export function Avatar({
  user,
  large = false,
}: {
  user: { firstName: string; lastName: string };
  large?: boolean;
}) {
  return (
    <span
      className={clsx(styles.avatar, large && styles.avatarLarge)}
      aria-label={`${user.firstName} ${user.lastName}`}
    >
      {user.firstName[0]}
      {user.lastName[0]}
    </span>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className={styles.progress}
      aria-label={`Прогресс ${value}%`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={styles.progressFill}
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  );
}
export function Skeleton({ height = 16 }: { height?: number }) {
  return <div className={styles.skeleton} style={{ height }} aria-hidden="true" />;
}
export function EmptyState({
  title = 'Ничего не найдено',
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className={styles.empty}>
      <Inbox size={28} />
      <h3>{title}</h3>
      <p>{description ?? 'Попробуйте изменить параметры поиска или вернитесь позже.'}</p>
    </div>
  );
}
export function ErrorState({
  title = 'Не удалось загрузить данные',
  onRetry,
}: {
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.error}>
      <AlertCircle size={28} />
      <h3>{title}</h3>
      <p>Проверьте соединение и попробуйте ещё раз.</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  );
}
