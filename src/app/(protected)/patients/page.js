'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPatients, deletePatient, getDoctors, getConditions } from '@/lib/api';
import PatientModal from '@/components/PatientModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Chatbot from '@/components/Chatbot';
import {
  IconPatient,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash
} from '@/components/Icons';

const STATUS_BADGE = {
  Active: 'badge-success',
  Inactive: 'badge-warning',
  Discharged: 'badge-info',
  Critical: 'badge-danger',
};

const bloodGroupColors = {
  'A+': 'badge-primary',
  'A-': 'badge-primary',
  'B+': 'badge-purple',
  'B-': 'badge-purple',
  'O+': 'badge-success',
  'O-': 'badge-success',
  'AB+': 'badge-warning',
  'AB-': 'badge-warning',
};

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [conditions, setConditions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const limit = 10;

  useEffect(() => {
    getConditions().then(r => setConditions(r.data)).catch(() => {});
    getDoctors({ limit: 100 }).then(r => setDoctors(r.data.doctors || [])).catch(() => {});
  }, []);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPatients({ page, limit, search, condition, dateFrom, dateTo });
      setPatients(data.patients || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  }, [page, search, condition, dateFrom, dateTo]);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deletePatient(deleteConfirm._id);
      toast.success('Patient record removed');
      setDeleteConfirm(null);
      loadPatients();
    } catch {
      toast.error('Failed to delete patient');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <IconPatient size={20} color="#0f766e" />
            <span>Patient Registry</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>({total})</span>
          </h1>
          <div className="section-subtitle">Complete patient medical admissions, diagnostic records, and provider assignments</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditPatient(null); setShowModal(true); }}>
          <IconPlus size={16} /> Add Patient
        </button>
      </div>

      {/* Filters */}
      <div className="search-filter-bar">
        <div className="input-group" style={{ flex: 2, minWidth: 240 }}>
          <span className="input-group-icon">
            <IconSearch size={15} />
          </span>
          <input
            className="form-control"
            placeholder="Search by patient name, email, or diagnosis..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="form-control"
          style={{ width: 180 }}
          value={condition}
          onChange={e => { setCondition(e.target.value); setPage(1); }}
        >
          <option value="">All Diagnoses</option>
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="date" className="form-control" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} style={{ width: 145 }} title="Admission from" />
          <span className="text-muted text-sm">to</span>
          <input type="date" className="form-control" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} style={{ width: 145 }} title="Admission to" />
        </div>
        {(search || condition || dateFrom || dateTo) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setCondition(''); setDateFrom(''); setDateTo(''); setPage(1); }}>
            Reset Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-card">
            <div className="spinner" />
            <p className="text-muted text-sm">Retrieving patient admissions...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IconPatient size={24} /></div>
            <div className="empty-title">No Patient Records</div>
            <p className="empty-text">No patients found matching the selected filters.</p>
            <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => setShowModal(true)}>
              <IconPlus size={15} /> Admit New Patient
            </button>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 44 }}>#</th>
                  <th>Patient Name</th>
                  <th>Demographics</th>
                  <th>Primary Diagnosis</th>
                  <th>Blood Group</th>
                  <th>Attending Physician</th>
                  <th>Status</th>
                  <th>Admission Date</th>
                  <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((pat, idx) => (
                  <tr key={pat._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * limit + idx + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34,
                          background: '#f0fdf4', color: '#166534',
                          border: '1px solid #bbf7d0',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0
                        }}>
                          {pat.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pat.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pat.email || pat.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{pat.age} yrs / {pat.gender}</td>
                    <td><span className="badge badge-info">{pat.condition}</span></td>
                    <td>
                      {pat.bloodGroup ? (
                        <span className={`badge ${bloodGroupColors[pat.bloodGroup] || 'badge-primary'}`}>{pat.bloodGroup}</span>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {pat.doctor?.name || 'Unassigned'}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[pat.status] || 'badge-primary'}`}>{pat.status}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {pat.createdAt ? format(new Date(pat.createdAt), 'MMM d, yyyy') : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', paddingRight: 8 }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => { setEditPatient(pat); setShowModal(true); }}
                          title="Edit Patient"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-icon"
                          onClick={() => setDeleteConfirm(pat)}
                          title="Delete Patient"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-muted text-sm">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} patients</span>
              <div className="pagination" style={{ margin: 0 }}>
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button key={pageNum} className={`page-btn ${page === pageNum ? 'active' : ''}`} onClick={() => setPage(pageNum)}>
                      {pageNum}
                    </button>
                  );
                })}
                <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Patient Modal */}
      {showModal && (
        <PatientModal
          patient={editPatient}
          doctors={doctors}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadPatients(); }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: 'var(--accent-danger)' }}>Delete Patient Record</div>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: 13.5 }}>
                Are you sure you want to remove <strong>{deleteConfirm.name}</strong> from the registry? This medical record will be archived.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}
