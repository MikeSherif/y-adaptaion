import { create } from 'zustand';
import { getCurrentSession, login, logout } from '@/shared/lib/auth';
import type { Session } from '@/shared/lib/auth';
interface AuthState {
  session: Session | null;
  isReady: boolean;
  initialize: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isReady: false,
  initialize: () => set({ session: getCurrentSession(), isReady: true }),
  signIn: async (email, password) => {
    const session = await login(email, password);
    set({ session });
  },
  signOut: async () => {
    await logout();
    set({ session: null });
  },
}));
