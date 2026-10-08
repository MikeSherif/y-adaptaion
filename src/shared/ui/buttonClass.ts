import clsx from 'clsx';
import styles from './ui.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export const buttonClass = (variant: ButtonVariant = 'primary', className?: string) =>
  clsx(styles.button, styles[variant], className);
