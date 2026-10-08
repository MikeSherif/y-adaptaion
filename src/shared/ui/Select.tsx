import { useCallback, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Check, ChevronDown } from 'lucide-react';
import { useDismiss } from './useDismiss';
import styles from './Select.module.css';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md';
  'aria-label'?: string;
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  label,
  placeholder = 'Выберите значение',
  disabled,
  error,
  id,
  name,
  className,
  size = 'md',
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  const generatedId = useId();
  const selectId = id ?? name ?? generatedId;
  const listId = `${selectId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  );

  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  const moveActive = (direction: 1 | -1) => {
    if (!options.length) return;
    let next = activeIndex;
    for (let step = 0; step < options.length; step += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) {
        setActiveIndex(next);
        return;
      }
    }
  };

  const choose = (option: SelectOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div className={clsx(styles.wrap, className)} ref={rootRef}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        id={selectId}
        className={clsx(
          styles.trigger,
          styles[size],
          open && styles.open,
          error && styles.triggerError,
        )}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={ariaLabel ?? label}
        aria-invalid={Boolean(error)}
        onClick={() => {
          if (disabled) return;
          setActiveIndex(
            Math.max(
              0,
              options.findIndex((option) => option.value === value),
            ),
          );
          setOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) setOpen(true);
            moveActive(event.key === 'ArrowDown' ? 1 : -1);
          }
          if (event.key === 'Enter' && open) {
            event.preventDefault();
            const option = options[activeIndex];
            if (option) choose(option);
          }
          if (event.key === 'Home') {
            event.preventDefault();
            setActiveIndex(0);
          }
          if (event.key === 'End') {
            event.preventDefault();
            setActiveIndex(options.length - 1);
          }
        }}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
      </button>
      {open && (
        <ul className={styles.list} id={listId} role="listbox" aria-labelledby={selectId}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${selectId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                className={clsx(
                  styles.option,
                  isSelected && styles.selected,
                  index === activeIndex && styles.active,
                  option.disabled && styles.disabled,
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={15} aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
