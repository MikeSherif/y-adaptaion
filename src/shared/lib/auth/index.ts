import { findUserByEmail } from '@/shared/api/mock/users';
import type { UserRole } from '@/shared/types/domain';

const SESSION_KEY = 'onboarding-session';
export const DEMO_PASSWORD = 'password';
export const DEMO_ACCOUNTS = [
  { email: 'employee@example.com', role: 'employee' as const, label: 'Сотрудник' },
  { email: 'admin@example.com', role: 'admin' as const, label: 'HR' },
];

export interface Session {
  userId: string;
  email: string;
  role: UserRole;
}

const pause = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;
  const session = value as Session;
  return Boolean(session.userId && session.email && session.role);
}

export function getCurrentSession(): Session | null {
  const item = localStorage.getItem(SESSION_KEY);
  if (!item) return null;
  try {
    const session = JSON.parse(item) as unknown;
    if (!isSession(session)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function login(email: string, password: string): Promise<Session> {
  await pause();
  const user = findUserByEmail(email);
  if (!user || password !== DEMO_PASSWORD) throw new Error('Проверьте email и пароль');
  const session: Session = { userId: user.id, email: user.email, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function logout(): Promise<void> {
  await pause(180);
  localStorage.removeItem(SESSION_KEY);
}
