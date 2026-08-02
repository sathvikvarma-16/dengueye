import { AuthenticatedUser, SAMPLE_USERS } from './sampleUsers';

export interface AuthSession {
  token: string;
  user: AuthenticatedUser;
}

const SESSION_KEY = 'dengueye-auth-session';
const USERS_KEY = 'dengueye-demo-users';

const encodeSegment = (value: unknown) => {
  return btoa(unescape(encodeURIComponent(JSON.stringify(value))));
};

const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const createDemoJwt = (user: AuthenticatedUser) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    name: user.fullName,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  return `${encodeSegment(header)}.${encodeSegment(payload)}.demo-signature`;
};

export const decodeDemoJwt = (token: string) => {
  try {
    const [, payloadSegment] = token.split('.');
    const decoded = JSON.parse(
      decodeURIComponent(
        escape(atob(payloadSegment))
      )
    ) as {
      email?: string;
      phone?: string;
      role?: string;
      name?: string;
      sub?: string;
    };
    return decoded;
  } catch {
    return null;
  }
};

export const getStoredUsers = (): AuthenticatedUser[] => {
  const stored = readStorage<AuthenticatedUser[]>(USERS_KEY, SAMPLE_USERS);
  return Array.isArray(stored) && stored.length > 0 ? stored : SAMPLE_USERS;
};

export const saveStoredUsers = (users: AuthenticatedUser[]) => {
  writeStorage(USERS_KEY, users);
};

export const resetDemoUsers = () => {
  saveStoredUsers(SAMPLE_USERS);
  clearStoredSession();
};

export const loginWithCredentials = (identifier: string, password: string): AuthenticatedUser | null => {
  const users = getStoredUsers();
  const user = users.find((candidate) => {
    const matchesEmail = candidate.email.toLowerCase() === identifier.toLowerCase();
    const matchesPhone = candidate.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '');
    const matchesPassword = candidate.password === password;
    return (matchesEmail || matchesPhone) && matchesPassword && candidate.isActive;
  });

  return user ?? null;
};

export const saveSession = (user: AuthenticatedUser) => {
  const token = createDemoJwt(user);
  const session: AuthSession = { token, user };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getStoredSession = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user) return null;
    const payload = decodeDemoJwt(parsed.token);
    if (!payload?.role) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearStoredSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
