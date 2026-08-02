import React, { createContext, useContext, useMemo, useState } from 'react';
import { AuthenticatedUser } from './sampleUsers';
import { clearStoredSession, getStoredSession, saveSession } from './session';

interface AuthContextValue {
  user: AuthenticatedUser | null;
  role: AuthenticatedUser['role'] | null;
  login: (user: AuthenticatedUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const initialSession = getStoredSession();
  const [user, setUser] = useState<AuthenticatedUser | null>(initialSession?.user ?? null);

  const login = (authenticatedUser: AuthenticatedUser) => {
    saveSession(authenticatedUser);
    setUser(authenticatedUser);
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    role: user?.role ?? null,
    login,
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
