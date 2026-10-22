'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/lib/api';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import Chatbot from '@/components/Chatbot';
import {
  IconDoctor,
  IconPatient,
  IconClipboard,
  IconStethoscope,
  IconTrendUp,
  IconBarChart,
  IconHospital
} from '@/components/Icons';

// Professional clinical chart palette: Indigo/Sapphire, Teal, Slate Blue, Amber, Emerald, Violet, Rose
const COLORS = ['#0284c7', '#0f766e', '#6366f1', '#d97706', '#15803d', '#475569', '#be185d', '#0891b2'];

function StatCard({ icon, value, label, color, bgColor }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bgColor, color }}>
        {icon}
      </div>
      <div className="stat-value" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12.5,
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || '#0284c7', fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await getDashboardStats();
      setStats(data);
    } catch {
      // Default to empty state if offline
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-card" style={{ minHeight: 400 }}>
        <div className="spinner" />
        <p className="text-muted text-sm">Aggregating analytics data...</p>
      </div>
    );
  }

  const patientsOverTime = (stats?.patientsOverTime || []).map(item => ({
    name: item._id,
    Patients: item.count
  }));

  const patientsPerDoctor = (stats?.patientsPerDoctor || []).slice(0, 6).map(item => ({
    name: item.doctorName ? item.doctorName.replace('Dr. ', '') : 'Unknown',
    Patients: item.count
  }));

  const doctorsBySpec = (stats?.doctorsBySpecialization || []).map(item => ({
    name: item._id || 'General',
    value: item.count
  }));

  const patientsByCondition = (stats?.patientsByCondition || []).slice(0, 5).map(item => ({
    name: item._id,
    value: item.count
  }));

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <StatCard
          icon={<IconDoctor size={20} />}
          value={stats?.totalDoctors ?? 0}
          label="Total Physicians"
          color="#0284c7"
          bgColor="#f0f9ff"
        />
        <StatCard
          icon={<IconPatient size={20} />}
          value={stats?.totalPatients ?? 0}
          label="Registered Patients"
          color="#0f766e"
          bgColor="#f0fdfa"
        />
        <StatCard
          icon={<IconClipboard size={20} />}
          value={stats?.avgPatientsPerDoctor ?? 0}
          label="Patient/Physician Ratio"
          color="#d97706"
          bgColor="#fffbeb"
        />
        <StatCard
          icon={<IconHospital size={20} />}
          value={(stats?.doctorsBySpecialization?.length ?? 0)}
          label="Active Specialties"
          color="#4338ca"
          bgColor="#eef2ff"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        {/* Patients Over Time */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">
                <IconTrendUp size={17} color="#0284c7" />
                <span>Patient Registration Trends</span>
              </div>
              <div className="section-subtitle">Monthly patient intake volume</div>
            </div>
          </div>
          {patientsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={patientsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Patients" stroke="#0284c7" strokeWidth={2} fill="url(#patientGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '36px 0' }}>
              <div className="empty-icon"><IconTrendUp size={22} /></div>
              <p className="empty-title">No Historical Data</p>
              <p className="empty-text">Patient intake trends will populate automatically as records are created.</p>
            </div>
          )}
        </div>

        {/* Patients per Doctor */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">
                <IconBarChart size={17} color="#0f766e" />
                <span>Patient Load Distribution</span>
              </div>
              <div className="section-subtitle">Active caseload per attending physician</div>
            </div>
          </div>
          {patientsPerDoctor.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={patientsPerDoctor} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Patients" fill="#0f766e" radius={[3, 3, 0, 0]} maxBarSize={36} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '36px 0' }}>
              <div className="empty-icon"><IconBarChart size={22} /></div>
              <p className="empty-title">No Caseload Records</p>
              <p className="empty-text">Assign patients to physicians to monitor workload balance.</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        {/* Doctors by Specialization */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">
                <IconStethoscope size={17} color="#4338ca" />
                <span>Physicians by Specialty</span>
              </div>
              <div className="section-subtitle">Clinical department distribution</div>
            </div>
          </div>
          {doctorsBySpec.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ResponsiveContainer width="55%" height={190}>
                <PieChart>
                  <Pie data={doctorsBySpec} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={2} dataKey="value">
                    {doctorsBySpec.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, maxHeight: 180, overflowY: 'auto' }}>
                {doctorsBySpec.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '36px 0' }}>
              <div className="empty-icon"><IconStethoscope size={22} /></div>
              <p className="empty-title">No Specialties Recorded</p>
              <p className="empty-text">Add physician profiles to populate department breakdowns.</p>
            </div>
          )}
        </div>

        {/* Patients by Condition */}
        <div className="card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">
                <IconClipboard size={17} color="#0284c7" />
                <span>Primary Diagnostic Conditions</span>
              </div>
              <div className="section-subtitle">Top diagnoses among registered patients</div>
            </div>
          </div>
          {patientsByCondition.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={patientsByCondition} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0284c7" radius={[0, 4, 4, 0]} maxBarSize={28} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '36px 0' }}>
              <div className="empty-icon"><IconClipboard size={22} /></div>
              <p className="empty-title">No Diagnostic Data</p>
              <p className="empty-text">Record patient conditions to analyze epidemiological distributions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Records Row */}
      <div className="grid grid-2">
        <div className="card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div className="section-title">
              <IconDoctor size={17} color="#0284c7" />
              <span>Recent Physicians</span>
            </div>
          </div>
          {stats?.recentDoctors?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.recentDoctors.map(doc => (
                <div key={doc._id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 12px',
                  background: '#f8fafc',
                  borderRadius: 6,
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: 32, height: 32, background: '#e0f2fe', color: '#0369a1',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0
                  }}>
                    {doc.name?.replace('Dr. ', '').charAt(0) || 'D'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{doc.hospital || doc.specialization}</div>
                  </div>
                  <div className="badge badge-primary">{doc.specialization?.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p className="empty-text">No physicians registered yet.</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div className="section-title">
              <IconPatient size={17} color="#0f766e" />
              <span>Recent Patient Intakes</span>
            </div>
          </div>
          {stats?.recentPatients?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.recentPatients.map(pat => (
                <div key={pat._id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 12px',
                  background: '#f8fafc',
                  borderRadius: 6,
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: 32, height: 32,
                    background: '#f0fdf4', color: '#166534',
                    border: '1px solid #bbf7d0',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0
                  }}>
                    {pat.name?.charAt(0) || 'P'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pat.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Age {pat.age} • {pat.condition}</div>
                  </div>
                  <div className={`badge ${pat.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{pat.status}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p className="empty-text">No patients recorded yet.</p>
            </div>
          )}
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
