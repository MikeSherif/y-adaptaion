import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useFieldArray, useForm, useWatch, type Control } from 'react-hook-form';
import { Plus } from 'lucide-react';
import type { OnboardingTemplate } from '@/shared/types/domain';
import { Button, Card, Input, Textarea } from '@/shared/ui';
import {
  emptyStage,
  templateSchema,
  toPreviewTemplate,
  toTemplatePayload,
  toTemplateValues,
  type TemplateValues,
} from '../model/schema';
import { useCreateTemplate, useUpdateTemplate } from '../model/useManageTemplate';
import { StageFields } from './StageFields';
import pageStyles from '@/pages/page.module.css';
import styles from './TemplateForm.module.css';

type RenderPreview = (template: OnboardingTemplate) => ReactNode;

function LivePreview({ control, render }: { control: Control<TemplateValues>; render: RenderPreview }) {
  const values = useWatch({ control }) as TemplateValues;
  return <>{render(toPreviewTemplate(values))}</>;
}

export function TemplateForm({
  template,
  source,
  onSaved,
  renderPreview,
}: {
  template?: OnboardingTemplate;
  source?: OnboardingTemplate;
  onSaved: (template: OnboardingTemplate) => void;
  renderPreview?: RenderPreview;
}) {
  const create = useCreateTemplate();
  const update = useUpdateTemplate(template?.id ?? '');
  const mutation = template ? update : create;
  const form = useForm<TemplateValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: toTemplateValues(template ?? source, { copy: !template && Boolean(source) }),
  });
  const stages = useFieldArray({ control: form.control, name: 'stages' });
  const {
    register,
    getValues,
    formState: { errors, isDirty },
  } = form;

  const addStage = () => {
    const last = getValues('stages').at(-1);
    stages.append(emptyStage(last ? (last.endDay || 0) + 1 : 1));
  };
  const save = (values: TemplateValues) =>
    mutation.mutate(toTemplatePayload(values), { onSuccess: onSaved });

  return (
    <FormProvider {...form}>
      <form
        className={styles.layout}
        onSubmit={form.handleSubmit(save)}
        noValidate
      >
        <div className={pageStyles.formStack}>
          <Card className={pageStyles.panel}>
            <h2>Шаблон</h2>
            <p className={pageStyles.panelLead}>Название и описание видны в каталоге и при добавлении сотрудника.</p>
            <div className={pageStyles.formStack}>
              <Input label="Название" error={errors.title?.message} {...register('title')} />
              <label className={pageStyles.fieldLabel}>
                Описание
                <Textarea className={styles.compactText} {...register('description')} />
              </label>
            </div>
          </Card>
          <Card className={pageStyles.panel}>
            <h2>Этапы и задачи</h2>
            <p className={pageStyles.panelLead}>
              Дни считаются от даты выхода: «День 1» — первый рабочий день.
            </p>
            <div className={styles.stageList}>
              {stages.fields.map((field, index) => (
                <StageFields
                  key={field.id}
                  index={index}
                  total={stages.fields.length}
                  onMove={(to) => stages.move(index, to)}
                  onRemove={() => stages.remove(index)}
                />
              ))}
            </div>
            {errors.stages?.root?.message && <p className={styles.error}>{errors.stages.root.message}</p>}
            <Button type="button" variant="secondary" className={styles.addStage} onClick={addStage}>
              <Plus size={16} />
              Добавить этап
            </Button>
          </Card>
          {mutation.error && <p className={pageStyles.formError}>{mutation.error.message}</p>}
          <div className={pageStyles.formActions}>
            <Button type="submit" loading={mutation.isPending} disabled={Boolean(template) && !isDirty}>
              {template ? 'Сохранить шаблон' : 'Создать шаблон'}
            </Button>
          </div>
        </div>
        {renderPreview && (
          <aside className={styles.preview}>
            <Card className={pageStyles.panel}>
              <h2>Превью</h2>
              <LivePreview control={form.control} render={renderPreview} />
            </Card>
          </aside>
        )}
      </form>
    </FormProvider>
  );
}
