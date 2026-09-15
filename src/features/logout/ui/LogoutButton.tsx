import { LogOut } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/features/auth';
export function LogoutButton() {
  const signOut = useAuthStore((state) => state.signOut);
  const router = useRouter();
  const logout = async () => {
    await signOut();
    await router.navigate({ to: '/login' });
  };
  return (
    <Button variant="ghost" onClick={() => void logout()}>
      <LogOut size={17} />
      Выйти
    </Button>
  );
}
