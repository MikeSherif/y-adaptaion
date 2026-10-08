import { Check } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useCompleteTask } from '../model/useCompleteTask';
export function CompleteTaskButton({
  taskId,
  completed,
  onDone,
  compact = false,
}: {
  taskId: string;
  completed: boolean;
  onDone?: () => void;
  compact?: boolean;
}) {
  const mutation = useCompleteTask();
  const complete = async () => {
    await mutation.mutateAsync(taskId);
    onDone?.();
  };
  return (
    <Button
      type="button"
      variant={compact ? 'secondary' : 'primary'}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void complete();
      }}
      loading={mutation.isPending}
      disabled={completed}
    >
      {completed ? (
        'Задача выполнена'
      ) : (
        <>
          <Check size={17} />
          {compact ? 'Завершить' : 'Завершить задачу'}
        </>
      )}
    </Button>
  );
}
