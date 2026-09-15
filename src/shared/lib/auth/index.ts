const SESSION_KEY = 'onboarding-session';
const DEMO_EMAIL = 'employee@example.com';
const DEMO_PASSWORD = 'password';

export interface Session {
  userId: string;
  email: string;
}
const pause = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
export function getCurrentSession(): Session | null {
  const item = localStorage.getItem(SESSION_KEY);
  if (!item) return null;
  try {
    return JSON.parse(item) as Session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}
export async function login(email: string, password: string): Promise<Session> {
  await pause();
  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD)
    throw new Error('Проверьте email и пароль');
  const session = { userId: 'user-1', email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
export async function logout(): Promise<void> {
  await pause(180);
  localStorage.removeItem(SESSION_KEY);
}
