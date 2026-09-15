import { Check } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useCompleteTask } from '../model/useCompleteTask';
export function CompleteTaskButton({
  taskId,
  completed,
  onDone,
}: {
  taskId: string;
  completed: boolean;
  onDone?: () => void;
}) {
  const mutation = useCompleteTask();
  const complete = async () => {
    await mutation.mutateAsync(taskId);
    onDone?.();
  };
  return (
    <Button onClick={() => void complete()} loading={mutation.isPending} disabled={completed}>
      {completed ? (
        'Задача выполнена'
      ) : (
        <>
          <Check size={17} />
          Завершить задачу
        </>
      )}
    </Button>
  );
}
