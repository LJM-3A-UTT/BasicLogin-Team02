// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { firebaseAuth, firebaseRegister, firebaseLogin, firebaseLogout } from '../services/firebase';

type User = { id: string | null; email?: string | null } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, use: 'supabase'|'firebase') => Promise<void>;
  signInWithEmail: (email: string, password: string, use: 'supabase'|'firebase') => Promise<void>;
  signOut: (use: 'supabase'|'firebase') => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try restore user from AsyncStorage
    (async () => {
      const u = await AsyncStorage.getItem('@user');
      if (u) setUser(JSON.parse(u));
      setLoading(false);
    })();
  }, []);

  const saveUser = async (u: User) => {
    setUser(u);
    if (u) await AsyncStorage.setItem('@user', JSON.stringify(u));
    else await AsyncStorage.removeItem('@user');
  };

  const signUpWithEmail = async (email: string, password: string, use: 'supabase'|'firebase') => {
    setLoading(true);
    try {
      if (use === 'supabase') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        await saveUser({ id: data.user?.id ?? null, email: data.user?.email ?? null });
      } else {
        const user = await firebaseRegister(email, password);
        await saveUser({ id: user.uid, email: user.email });
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string, use: 'supabase'|'firebase') => {
    setLoading(true);
    try {
      if (use === 'supabase') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await saveUser({ id: data.user?.id ?? null, email: data.user?.email ?? null });
      } else {
        const user = await firebaseLogin(email, password);
        await saveUser({ id: user.uid, email: user.email });
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (use: 'supabase'|'firebase') => {
    setLoading(true);
    try {
      if (use === 'supabase') {
        await supabase.auth.signOut();
      } else {
        await firebaseLogout();
      }
      await saveUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUpWithEmail, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
