import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button, Textarea } from '@/shared/ui';
import { useAddTaskComment } from '../model/useAddTaskComment';
import pageStyles from '@/pages/page.module.css';

export function AddCommentForm({ taskId, placeholder }: { taskId: string; placeholder: string }) {
  const [text, setText] = useState('');
  const add = useAddTaskComment(taskId);
  const submit = async () => {
    if (!text.trim()) return;
    await add.mutateAsync(text);
    setText('');
  };

  return (
    <form
      className={pageStyles.formStack}
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <Textarea
        aria-label="Сообщение"
        placeholder={placeholder}
        value={text}
        maxLength={1000}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) void submit();
        }}
      />
      {add.error && <p className={pageStyles.formError}>{add.error.message}</p>}
      <div className={pageStyles.inlineActions}>
        <Button type="submit" disabled={!text.trim()} loading={add.isPending}>
          <Send size={15} />
          Отправить
        </Button>
      </div>
    </form>
  );
}
