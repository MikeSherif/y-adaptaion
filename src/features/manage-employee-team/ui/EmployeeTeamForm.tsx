import { useState } from 'react';
import { useStaffQuery } from '@/entities/user';
import type { User } from '@/shared/types/domain';
import { selectableOptions } from '@/shared/lib/options';
import { toPersonOption } from '@/shared/lib/user';
import { Button, Select } from '@/shared/ui';
import { useUpdateEmployeeTeam } from '../model/useUpdateEmployeeTeam';
import pageStyles from '@/pages/page.module.css';

export function EmployeeTeamForm({ user }: { user: User }) {
  const { data: staff } = useStaffQuery();
  const update = useUpdateEmployeeTeam(user.id);
  const [managerId, setManagerId] = useState(user.manager?.id ?? '');
  const [mentorId, setMentorId] = useState(user.mentor?.id ?? '');
  const changed = managerId !== (user.manager?.id ?? '') || mentorId !== (user.mentor?.id ?? '');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        update.mutate({ managerId, mentorId: mentorId || undefined });
      }}
    >
      <h2>Команда адаптации</h2>
      <p className={pageStyles.panelLead}>
        Открытые задачи с ролью «Руководитель» или «Наставник» переназначатся автоматически.
      </p>
      <div className={pageStyles.formGrid}>
        <Select
          label="Руководитель"
          placeholder="Выберите руководителя"
          value={managerId}
          options={selectableOptions(staff?.managers, user.manager?.id, toPersonOption)}
          onChange={setManagerId}
        />
        <Select
          label="Наставник"
          value={mentorId}
          options={[
            { value: '', label: 'Без наставника' },
            ...selectableOptions(staff?.mentors, user.mentor?.id, toPersonOption),
          ]}
          onChange={setMentorId}
        />
      </div>
      {update.error && <p className={pageStyles.formError}>{update.error.message}</p>}
      <div className={pageStyles.formActions}>
        <Button type="submit" variant="secondary" disabled={!changed || !managerId} loading={update.isPending}>
          Сохранить команду
        </Button>
      </div>
    </form>
  );
}
