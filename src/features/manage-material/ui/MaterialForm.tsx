import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { materialCategoryOptions, materialTypeOptions } from '@/entities/material';
import type { Material, MaterialType } from '@/shared/types/domain';
import { Button, Card, Input, Select, Textarea } from '@/shared/ui';
import { materialSchema, toMaterialPayload, toMaterialValues, type MaterialValues } from '../model/schema';
import { useCreateMaterial, useUpdateMaterial } from '../model/useManageMaterial';
import pageStyles from '@/pages/page.module.css';

export function MaterialForm({
  material,
  onSaved,
}: {
  material?: Material;
  onSaved: (material: Material) => void;
}) {
  const create = useCreateMaterial();
  const update = useUpdateMaterial(material?.id ?? '');
  const mutation = material ? update : create;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<MaterialValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: toMaterialValues(material),
  });

  const save = (values: MaterialValues) =>
    mutation.mutate(toMaterialPayload(values), { onSuccess: onSaved });

  return (
    <form className={pageStyles.formPage} onSubmit={handleSubmit(save)} noValidate>
      <Card className={pageStyles.panel}>
        <h2>Материал</h2>
        <p className={pageStyles.panelLead}>
          Материал появится в базе знаний и в выборе при настройке задач и шаблонов.
        </p>
        <div className={pageStyles.formStack}>
          <Input label="Название" error={errors.title?.message} {...register('title')} />
          <Input
            label="Ссылка"
            type="url"
            placeholder="https://"
            error={errors.url?.message}
            {...register('url')}
          />
          <div className={pageStyles.formGrid}>
            <Select
              label="Тип"
              value={watch('type')}
              options={materialTypeOptions}
              onChange={(type) => setValue('type', type as MaterialType, { shouldDirty: true })}
            />
            <Select
              label="Категория"
              placeholder="Выберите категорию"
              value={watch('category')}
              options={materialCategoryOptions}
              onChange={(category) =>
                setValue('category', category, { shouldDirty: true, shouldValidate: true })
              }
              error={errors.category?.message}
            />
            <Input
              label="Длительность, мин"
              inputMode="numeric"
              error={errors.duration?.message}
              {...register('duration')}
            />
          </div>
          <label className={pageStyles.fieldLabel}>
            Описание
            <Textarea {...register('description')} />
          </label>
        </div>
      </Card>
      {mutation.error && <p className={pageStyles.formError}>{mutation.error.message}</p>}
      <div className={pageStyles.formActions}>
        <Button type="submit" loading={mutation.isPending} disabled={Boolean(material) && !isDirty}>
          {material ? 'Сохранить изменения' : 'Добавить материал'}
        </Button>
      </div>
    </form>
  );
}
