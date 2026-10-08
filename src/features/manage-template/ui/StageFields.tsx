import { useFieldArray, useFormContext } from 'react-hook-form';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button, Input, Textarea } from '@/shared/ui';
import { emptyTask, type TemplateValues } from '../model/schema';
import { TemplateTaskFields } from './TemplateTaskFields';
import styles from './TemplateForm.module.css';

export function StageFields({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<TemplateValues>();
  const tasks = useFieldArray({ control, name: `stages.${index}.tasks` });
  const stageErrors = errors.stages?.[index];
  const tasksError = stageErrors?.tasks?.root?.message ?? stageErrors?.tasks?.message;

  return (
    <section className={styles.stage} aria-label={`Этап ${index + 1}`}>
      <div className={styles.stageHead}>
        <span className={styles.order}>{index + 1}</span>
        <h3>Этап {index + 1}</h3>
        <div className={styles.stageActions}>
          <Button
            type="button"
            variant="ghost"
            disabled={index === 0}
            onClick={() => onMove(index - 1)}
            aria-label="Поднять этап"
          >
            <ArrowUp size={15} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={index === total - 1}
            onClick={() => onMove(index + 1)}
            aria-label="Опустить этап"
          >
            <ArrowDown size={15} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={total === 1}
            onClick={onRemove}
            aria-label="Удалить этап"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
      <div className={styles.stageGrid}>
        <Input label="Название этапа" error={stageErrors?.title?.message} {...register(`stages.${index}.title`)} />
        <Input
          label="С дня"
          type="number"
          min={1}
          error={stageErrors?.startDay?.message}
          {...register(`stages.${index}.startDay`, { valueAsNumber: true })}
        />
        <Input
          label="По день"
          type="number"
          min={1}
          error={stageErrors?.endDay?.message}
          {...register(`stages.${index}.endDay`, { valueAsNumber: true })}
        />
      </div>
      <label className={styles.fieldLabel}>
        Описание этапа
        <Textarea className={styles.compactText} {...register(`stages.${index}.description`)} />
      </label>
      <div className={styles.taskList}>
        {tasks.fields.map((field, taskIndex) => (
          <TemplateTaskFields
            key={field.id}
            stageIndex={index}
            taskIndex={taskIndex}
            canRemove={tasks.fields.length > 1}
            onRemove={() => tasks.remove(taskIndex)}
          />
        ))}
      </div>
      {tasksError && <p className={styles.error}>{tasksError}</p>}
      <Button
        type="button"
        variant="secondary"
        onClick={() => tasks.append(emptyTask(getValues(`stages.${index}.startDay`) || 1))}
      >
        <Plus size={15} />
        Задача
      </Button>
    </section>
  );
}
