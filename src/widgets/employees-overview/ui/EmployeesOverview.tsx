import { AlertTriangle, Flag, MessageCircleQuestion, Percent, Users } from 'lucide-react';
import { Card } from '@/shared/ui';
import styles from './EmployeesOverview.module.css';

export function EmployeesOverview({
  total,
  overdue,
  withQuestions,
  averageProgress,
  currentStages,
}: {
  total: number;
  overdue: number;
  withQuestions: number;
  averageProgress: number;
  currentStages: number;
}) {
  const stats = [
    { icon: Users, value: total, label: 'новичков' },
    { icon: AlertTriangle, value: overdue, label: 'с просрочкой' },
    { icon: MessageCircleQuestion, value: withQuestions, label: 'с вопросами' },
    { icon: Percent, value: `${averageProgress}%`, label: 'средний прогресс' },
    { icon: Flag, value: currentStages, label: 'на текущих этапах' },
  ];
  return (
    <div className={styles.grid}>
      {stats.map(({ icon: Icon, value, label }) => (
        <Card key={label} className={styles.stat}>
          <Icon size={18} />
          <strong>{value}</strong>
          <span>{label}</span>
        </Card>
      ))}
    </div>
  );
}
