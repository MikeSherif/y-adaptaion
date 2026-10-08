import { Button } from '@/shared/ui';
import { useRemoveEmployeeTask } from '../model/useManageEmployeeTask';

export function RemoveEmployeeTaskButton({
  taskId,
  onRemoved,
}: {
  taskId: string;
  onRemoved?: () => void;
}) {
  const mutation = useRemoveEmployeeTask();
  return (
    <Button
      type="button"
      variant="danger"
      loading={mutation.isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void mutation.mutateAsync(taskId).then(onRemoved);
      }}
    >
      Снять с плана
    </Button>
  );
}
