import type { OnboardingTemplate } from '@/shared/types/domain';
import { ArchiveToggleButton } from '@/shared/ui';
import { useArchiveTemplate } from '../model/useManageTemplate';
import pageStyles from '@/pages/page.module.css';

export function ArchiveTemplateButton({ template }: { template: OnboardingTemplate }) {
  const archive = useArchiveTemplate();
  return (
    <>
      <ArchiveToggleButton
        archived={template.archived}
        loading={archive.isPending}
        onToggle={() => archive.mutate({ id: template.id, archived: !template.archived })}
      />
      {archive.error && <span className={pageStyles.formError}>{archive.error.message}</span>}
    </>
  );
}
