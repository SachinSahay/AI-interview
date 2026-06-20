'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User, ExperienceLevel } from '@/lib/types';
import { userStore } from '@/lib/store';
import { generateId, getAvatarColor } from '@/lib/utils';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = userStore.get();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback((email: string, _password: string): boolean => {
    const stored = userStore.get();
    if (stored && stored.email === email) {
      setUser(stored);
      return true;
    }
    // For demo: auto-create user on login if exists in storage
    if (stored) {
      setUser(stored);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(
    (name: string, email: string, _password: string, targetRole: string, experience: ExperienceLevel) => {
      const newUser: User = {
        id: generateId('user'),
        name,
        email,
        targetRole,
        experience,
        createdAt: new Date().toISOString(),
        avatarColor: getAvatarColor(),
      };
      userStore.set(newUser);
      setUser(newUser);
    },
    [],
  );

  const logout = useCallback(() => {
    userStore.clear();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    userStore.set(updated);
    setUser(updated);
  }, [user]);

  return { user, loading, login, signup, logout, updateUser, isAuthenticated: !!user };
}
