import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  addDays,
  formatDate,
  formatMonthYear,
  monthGrid,
  monthOf,
  shiftMonth,
  todayIso,
} from '@/shared/lib/date';
import { useDismiss } from './useDismiss';
import selectStyles from './Select.module.css';
import styles from './DatePicker.module.css';

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const dayKeys: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md';
  'aria-label'?: string;
}

const gap = 6;
const margin = 8;

function placePopover(trigger: HTMLElement, popover: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  const spaceBelow = window.innerHeight - rect.bottom - margin;
  const spaceAbove = rect.top - margin;
  const above = height + gap > spaceBelow && spaceAbove > spaceBelow;
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const left = Math.min(Math.max(rect.left, margin), maxLeft);
  const preferred = above ? rect.top - height - gap : rect.bottom + gap;
  const top = Math.max(margin, Math.min(preferred, window.innerHeight - height - margin));
  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
  popover.style.visibility = 'visible';
}

function shiftDateByMonth(isoDate: string, months: number): string {
  const target = shiftMonth(isoDate, months);
  const day = Number(isoDate.slice(8, 10));
  const lastDay = new Date(Date.UTC(Number(target.slice(0, 4)), Number(target.slice(5, 7)), 0)).getUTCDate();
  return `${target.slice(0, 8)}${String(Math.min(day, lastDay)).padStart(2, '0')}`;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Выберите дату',
  error,
  min,
  max,
  disabled,
  id,
  name,
  className,
  size = 'md',
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const generatedId = useId();
  const pickerId = id ?? name ?? generatedId;
  const dialogId = `${pickerId}-calendar`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(() => value || todayIso());
  const [viewMonth, setViewMonth] = useState(() => monthOf(value || todayIso()));
  const today = todayIso();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close, popoverRef);

  useLayoutEffect(() => {
    if (!open) return;
    let frame = 0;
    const update = () => {
      const trigger = triggerRef.current;
      const popover = popoverRef.current;
      if (trigger && popover) placePopover(trigger, popover);
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const isDisabled = (date: string) => Boolean((min && date < min) || (max && date > max));

  useEffect(() => {
    if (!open) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
  }, [open, focused]);

  const toggle = () => {
    if (disabled) return;
    const start = value || today;
    setFocused(start);
    setViewMonth(monthOf(start));
    setOpen((current) => !current);
  };

  const moveFocus = (next: string) => {
    setFocused(next);
    setViewMonth(monthOf(next));
  };

  const choose = (date: string) => {
    if (isDisabled(date)) return;
    onChange(date);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key in dayKeys) {
      event.preventDefault();
      moveFocus(addDays(focused, dayKeys[event.key]));
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      moveFocus(shiftDateByMonth(focused, event.key === 'PageUp' ? -1 : 1));
    } else if (event.key === 'Escape') {
      triggerRef.current?.focus();
    }
  };

  return (
    <div className={clsx(selectStyles.wrap, className)} ref={rootRef}>
      {label && (
        <label className={selectStyles.label} htmlFor={pickerId}>
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        type="button"
        id={pickerId}
        className={clsx(
          selectStyles.trigger,
          selectStyles[size],
          open && selectStyles.open,
          error && selectStyles.triggerError,
        )}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-label={ariaLabel ?? label}
        aria-invalid={Boolean(error)}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault();
            toggle();
          }
        }}
      >
        <span className={value ? selectStyles.value : selectStyles.placeholder}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarDays size={16} className={styles.icon} aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <div ref={popoverRef} className={styles.popover} id={dialogId} role="dialog" aria-label="Выбор даты">
          <div className={styles.head}>
            <button
              type="button"
              className={styles.nav}
              aria-label="Предыдущий месяц"
              onClick={() => setViewMonth((month) => shiftMonth(month, -1))}
            >
              <ChevronLeft size={16} />
            </button>
            <span className={styles.month} aria-live="polite">
              {formatMonthYear(viewMonth)}
            </span>
            <button
              type="button"
              className={styles.nav}
              aria-label="Следующий месяц"
              onClick={() => setViewMonth((month) => shiftMonth(month, 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className={styles.weekdays} aria-hidden="true">
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className={styles.grid} role="grid" ref={gridRef} onKeyDown={onGridKeyDown}>
            {monthGrid(viewMonth).map((date) => (
              <button
                key={date}
                type="button"
                role="gridcell"
                data-date={date}
                tabIndex={date === focused ? 0 : -1}
                disabled={isDisabled(date)}
                aria-selected={date === value}
                aria-label={formatDate(date)}
                className={clsx(
                  styles.day,
                  monthOf(date) !== viewMonth && styles.outside,
                  date === today && styles.today,
                  date === value && styles.selected,
                )}
                onClick={() => choose(date)}
                onFocus={() => setFocused(date)}
              >
                {Number(date.slice(8, 10))}
              </button>
            ))}
          </div>
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.todayButton}
              disabled={isDisabled(today)}
              onClick={() => choose(today)}
            >
              Сегодня
            </button>
          </div>
          </div>,
          document.body,
        )}
      {error && <span className={selectStyles.error}>{error}</span>}
    </div>
  );
}
