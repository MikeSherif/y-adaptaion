import { useQuery } from '@tanstack/react-query';
import { getTemplate, getTemplates } from '@/shared/api';
import { templateKeys } from '@/shared/api/query-keys';

export function useTemplatesQuery() {
  return useQuery({ queryKey: templateKeys.list(), queryFn: getTemplates });
}

export function useTemplateQuery(templateId?: string) {
  return useQuery({
    queryKey: templateKeys.detail(templateId ?? ''),
    queryFn: () => getTemplate(templateId!),
    enabled: Boolean(templateId),
  });
}
