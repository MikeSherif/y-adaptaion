import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTemplate, setTemplateArchived, updateTemplate } from '@/shared/api';
import { templateKeys } from '@/shared/api/query-keys';
import type { TemplatePayload } from '@/shared/types/domain';

function useInvalidateTemplates() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: templateKeys.all });
}

export function useCreateTemplate() {
  const onSuccess = useInvalidateTemplates();
  return useMutation({ mutationFn: createTemplate, onSuccess });
}

export function useUpdateTemplate(templateId: string) {
  const onSuccess = useInvalidateTemplates();
  return useMutation({
    mutationFn: (payload: TemplatePayload) => updateTemplate(templateId, payload),
    onSuccess,
  });
}

export function useArchiveTemplate() {
  const onSuccess = useInvalidateTemplates();
  return useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) => setTemplateArchived(id, archived),
    onSuccess,
  });
}
