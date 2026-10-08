import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChevronDown, Paperclip, Trash2 } from 'lucide-react';
import { MaterialPicker } from '@/entities/material';
import { taskPriorityOptions } from '@/entities/task';
import type { TaskPriority } from '@/shared/types/domain';
import { assigneeRoleLabels } from '@/shared/lib/user';
import { Button, Input, Select, Textarea } from '@/shared/ui';
import type { TemplateValues } from '../model/schema';
import styles from './TemplateForm.module.css';

const assigneeOptions = [
  { value: '', label: 'Сотрудник' },
  { value: 'manager', label: assigneeRoleLabels.manager },
  { value: 'mentor', label: assigneeRoleLabels.mentor },
];

export function TemplateTaskFields({
  stageIndex,
  taskIndex,
  canRemove,
  onRemove,
}: {
  stageIndex: number;
  taskIndex: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const [showMaterials, setShowMaterials] = useState(false);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TemplateValues>();
  const path = `stages.${stageIndex}.tasks.${taskIndex}` as const;
  const taskErrors = errors.stages?.[stageIndex]?.tasks?.[taskIndex];
  const materialIds = watch(`${path}.materialIds`);

  return (
    <div className={styles.task}>
      <div className={styles.taskHead}>
        <span className={styles.taskNumber}>Задача {taskIndex + 1}</span>
        {canRemove && (
          <Button type="button" variant="ghost" onClick={onRemove} aria-label={`Удалить задачу ${taskIndex + 1}`}>
            <Trash2 size={15} />
          </Button>
        )}
      </div>
      <Input label="Название" error={taskErrors?.title?.message} {...register(`${path}.title`)} />
      <div className={styles.taskGrid}>
        <Input
          label="День"
          type="number"
          min={1}
          error={taskErrors?.day?.message}
          {...register(`${path}.day`, { valueAsNumber: true })}
        />
        <Select
          label="Приоритет"
          value={watch(`${path}.priority`)}
          options={taskPriorityOptions}
          onChange={(priority) =>
            setValue(`${path}.priority`, priority as TaskPriority, { shouldDirty: true })
          }
        />
        <Select
          label="Исполнитель"
          value={watch(`${path}.assignee`)}
          options={assigneeOptions}
          onChange={(assignee) =>
            setValue(`${path}.assignee`, assignee as '' | 'manager' | 'mentor', { shouldDirty: true })
          }
        />
      </div>
      <label className={styles.fieldLabel}>
        Описание
        <Textarea className={styles.compactText} {...register(`${path}.description`)} />
      </label>
      <button
        type="button"
        className={styles.materialsToggle}
        aria-expanded={showMaterials}
        onClick={() => setShowMaterials((value) => !value)}
      >
        <Paperclip size={14} />
        Материалы{materialIds.length > 0 ? ` · ${materialIds.length}` : ''}
        <ChevronDown size={14} className={showMaterials ? styles.chevronOpen : undefined} />
      </button>
      {showMaterials && (
        <MaterialPicker
          legend="Материалы задачи"
          value={materialIds}
          onChange={(ids) => setValue(`${path}.materialIds`, ids, { shouldDirty: true })}
        />
      )}
    </div>
  );
}
