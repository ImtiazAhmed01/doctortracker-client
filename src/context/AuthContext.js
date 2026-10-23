'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOutUser } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginAPI, registerAPI, firebaseLoginAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const storedUser = localStorage.getItem('dt_user');
    const storedToken = localStorage.getItem('dt_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !localStorage.getItem('dt_token')) {
        try {
          const { data } = await firebaseLoginAPI({
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            uid: firebaseUser.uid,
            photoURL: firebaseUser.photoURL,
          });
          localStorage.setItem('dt_token', data.token);
          localStorage.setItem('dt_user', JSON.stringify(data.user));
          setUser(data.user);
        } catch (err) {
          console.error('Firebase login failed:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    localStorage.setItem('dt_token', data.token);
    localStorage.setItem('dt_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const registerWithEmail = async (email, password, name) => {
    const { data } = await registerAPI({ email, password, name });
    localStorage.setItem('dt_token', data.token);
    localStorage.setItem('dt_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithGoogle();
    const firebaseUser = result.user;
    const { data } = await firebaseLoginAPI({
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      uid: firebaseUser.uid,
      photoURL: firebaseUser.photoURL,
    });
    localStorage.setItem('dt_token', data.token);
    localStorage.setItem('dt_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch {}
    localStorage.removeItem('dt_token');
    localStorage.removeItem('dt_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, registerWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
