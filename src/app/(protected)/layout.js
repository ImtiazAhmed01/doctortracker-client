'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  IconDashboard,
  IconDoctor,
  IconPatient,
  IconMedicalCross,
  IconLogout,
  IconShield
} from '@/components/Icons';

function ProtectedLayoutInner({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div style={{ width: 48, height: 48, background: 'var(--gradient-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <IconMedicalCross size={24} />
        </div>
        <div className="spinner spinner-lg" />
        <p className="text-muted text-sm">Loading workspace...</p>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', icon: <IconDashboard size={18} />, label: 'Dashboard' },
    { href: '/doctors', icon: <IconDoctor size={18} />, label: 'Doctors' },
    { href: '/patients', icon: <IconPatient size={18} />, label: 'Patients' },
  ];

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD';

  const pageTitles = {
    '/dashboard': { title: 'Dashboard Overview', sub: 'Clinical metrics & performance monitoring' },
    '/doctors': { title: 'Doctors Directory', sub: 'Manage medical providers and specializations' },
    '/patients': { title: 'Patient Registry', sub: 'Comprehensive records and provider rosters' },
  };

  const currentPage = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key));
  const pageInfo = currentPage ? currentPage[1] : { title: 'DoctorTracker', sub: '' };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <IconMedicalCross size={20} />
          </div>
          <div>
            <div className="sidebar-logo-text">DoctorTracker</div>
            <div className="sidebar-logo-sub">Clinical Administration</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="nav-label" style={{ marginTop: 12 }}>Account</div>
          <div style={{ padding: '2px 6px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 2, fontWeight: 500 }}>Active User</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || user.email}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
                <IconShield size={10} /> Admin Role
              </div>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card" onClick={logout} title="Sign out">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.name || 'Admin User'}</div>
              <div className="user-role">Sign Out</div>
            </div>
            <IconLogout size={16} color="var(--text-muted)" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <div>
              <div className="topbar-title">{pageInfo.title}</div>
              {pageInfo.sub && <div className="topbar-subtitle">{pageInfo.sub}</div>}
            </div>
          </div>
          <div className="topbar-right">
            <div style={{
              padding: '4px 10px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 4,
              fontSize: 11.5,
              fontWeight: 600,
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              Operational
            </div>
            <div className="user-avatar" style={{ width: 34, height: 34, cursor: 'pointer' }} onClick={logout} title="Sign out">
              {user.photoURL ? <img src={user.photoURL} alt={user.name} /> : initials}
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }) {
  return (
    <Suspense fallback={<div className="loading-screen"><div className="spinner spinner-lg" /></div>}>
      <ProtectedLayoutInner>{children}</ProtectedLayoutInner>
    </Suspense>
  );
}
