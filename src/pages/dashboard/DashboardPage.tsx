import { CircleHelp, ListChecks } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card } from '@/shared/ui';
import { DashboardOverview } from '@/widgets/dashboard-overview';
import { OnboardingProgress } from '@/widgets/onboarding-progress';
import { UpcomingTasks } from '@/widgets/upcoming-tasks';
import { RecentMaterials } from '@/widgets/recent-materials';
import { NotificationCenter } from '@/widgets/notification-center';
import styles from '@/pages/page.module.css';
export function DashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Понедельник, 15 сентября</p>
          <h1>Доброе утро!</h1>
          <p>Вот что важно для вашей адаптации сегодня.</p>
        </div>
      </div>
      <DashboardOverview />
      <div className={styles.dashboardGrid}>
        <div className={styles.page}>
          <UpcomingTasks />
          <RecentMaterials />
        </div>
        <div className={styles.page}>
          <OnboardingProgress />
          <NotificationCenter />
          <Card className={styles.panel}>
            <CircleHelp size={22} color="#6273df" />
            <h2 style={{ marginTop: 10 }}>Нужна помощь?</h2>
            <p
              style={{
                marginTop: 6,
                color: 'var(--color-text-secondary)',
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              Наставник рядом и готов помочь разобраться с любым вопросом.
            </p>
            <Link
              to="/onboarding"
              style={{
                display: 'inline-flex',
                marginTop: 15,
                color: 'var(--color-primary)',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Открыть план <ListChecks size={16} style={{ marginLeft: 6 }} />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
