'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) router.replace('/dashboard');
      else router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="loading-screen">
      <div className="sidebar-logo-icon" style={{ width: 64, height: 64, fontSize: 28, borderRadius: 16 }}>🏥</div>
      <div className="spinner spinner-lg" />
      <p className="text-muted">Loading DoctorTracker...</p>
    </div>
  );
}
