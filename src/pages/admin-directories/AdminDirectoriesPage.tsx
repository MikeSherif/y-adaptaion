import { useDepartmentsQuery } from '@/entities/department';
import { useStaffQuery } from '@/entities/user';
import {
  ArchiveDepartmentButton,
  ArchiveStaffButton,
  DepartmentForm,
  PersonForm,
} from '@/features/manage-directory';
import type { StaffKind, StaffMember } from '@/shared/types/domain';
import { formatUserName } from '@/shared/lib/user';
import { ErrorState } from '@/shared/ui';
import { DirectoryList } from '@/widgets/directory-list';
import styles from '@/pages/page.module.css';

const describePerson = (person: StaffMember) => ({
  title: formatUserName(person),
  subtitle: person.position,
});

const staffSections: { kind: StaffKind; title: string; lead: string; addLabel: string }[] = [
  {
    kind: 'manager',
    title: 'Руководители',
    lead: 'Выбираются при добавлении сотрудника и в команде адаптации.',
    addLabel: 'Добавить руководителя',
  },
  {
    kind: 'mentor',
    title: 'Наставники',
    lead: 'Помогают новичку в первые недели и получают задачи с ролью «Наставник».',
    addLabel: 'Добавить наставника',
  },
];

export function AdminDirectoriesPage() {
  const staff = useStaffQuery();
  const departments = useDepartmentsQuery();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Кабинет HR</p>
          <h1>Справочники</h1>
          <p>
            Переименование сразу видно в карточках и задачах. Архивные записи остаются у текущих
            сотрудников, но недоступны для новых назначений.
          </p>
        </div>
      </div>
      {staff.isError || departments.isError ? (
        <ErrorState
          onRetry={() => {
            void staff.refetch();
            void departments.refetch();
          }}
        />
      ) : (
        <div className={styles.templateGrid}>
          {staffSections.map(({ kind, title, lead, addLabel }) => (
            <DirectoryList
              key={kind}
              title={title}
              lead={lead}
              addLabel={addLabel}
              items={kind === 'manager' ? staff.data?.managers : staff.data?.mentors}
              isLoading={staff.isLoading}
              describe={describePerson}
              renderEditor={(member, close) => <PersonForm kind={kind} member={member} onDone={close} />}
              renderArchive={(member) => <ArchiveStaffButton kind={kind} member={member} />}
            />
          ))}
          <DirectoryList
            title="Отделы"
            lead="Используются в карточке сотрудника и в фильтрах списка."
            addLabel="Добавить отдел"
            items={departments.data}
            isLoading={departments.isLoading}
            describe={(department) => ({ title: department.name })}
            renderEditor={(department, close) => <DepartmentForm department={department} onDone={close} />}
            renderArchive={(department) => <ArchiveDepartmentButton department={department} />}
          />
        </div>
      )}
    </div>
  );
}
