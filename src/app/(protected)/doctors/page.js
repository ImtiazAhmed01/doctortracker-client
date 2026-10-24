'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDoctors, deleteDoctor, getSpecializations } from '@/lib/api';
import DoctorModal from '@/components/DoctorModal';
import DoctorPatientsModal from '@/components/DoctorPatientsModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Chatbot from '@/components/Chatbot';
import {
  IconDoctor,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconUsers
} from '@/components/Icons';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [patientsModal, setPatientsModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const limit = 10;

  useEffect(() => {
    getSpecializations().then(r => setSpecializations(r.data)).catch(() => {});
  }, []);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, search, specialization, dateFrom, dateTo };
      const { data } = await getDoctors(params);
      setDoctors(data.doctors || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load doctors list');
    } finally {
      setLoading(false);
    }
  }, [page, search, specialization, dateFrom, dateTo]);

  useEffect(() => { loadDoctors(); }, [loadDoctors]);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteDoctor(deleteConfirm._id);
      toast.success('Doctor record deleted');
      setDeleteConfirm(null);
      loadDoctors();
    } catch {
      toast.error('Failed to delete doctor');
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
            <IconDoctor size={20} color="#0284c7" />
            <span>Doctors Directory</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>({total})</span>
          </h1>
          <div className="section-subtitle">Manage medical personnel, clinical specialties, and patient rosters</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditDoctor(null); setShowModal(true); }}>
          <IconPlus size={16} /> Add Doctor
        </button>
      </div>

      {/* Search & Filter */}
      <div className="search-filter-bar">
        <div className="input-group" style={{ flex: 2, minWidth: 240 }}>
          <span className="input-group-icon">
            <IconSearch size={15} />
          </span>
          <input
            className="form-control"
            placeholder="Search by physician name, specialty, or hospital..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <select
          className="form-control"
          style={{ width: 200 }}
          value={specialization}
          onChange={e => { setSpecialization(e.target.value); setPage(1); }}
        >
          <option value="">All Specializations</option>
          {specializations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="date" className="form-control" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} style={{ width: 145 }} title="From date" />
          <span className="text-muted text-sm">to</span>
          <input type="date" className="form-control" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} style={{ width: 145 }} title="To date" />
        </div>
        {(search || specialization || dateFrom || dateTo) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setSpecialization(''); setDateFrom(''); setDateTo(''); setPage(1); }}>
            Reset Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-card">
            <div className="spinner" />
            <p className="text-muted text-sm">Retrieving physician records...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IconDoctor size={24} /></div>
            <div className="empty-title">No Physicians Found</div>
            <p className="empty-text">No records match your filter criteria or directory is currently empty.</p>
            <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => setShowModal(true)}>
              <IconPlus size={15} /> Add First Doctor
            </button>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 44 }}>#</th>
                  <th>Physician</th>
                  <th>Specialization</th>
                  <th>Hospital Affiliation</th>
                  <th>Contact Details</th>
                  <th>Active Patients</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, idx) => (
                  <tr key={doc._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * limit + idx + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34,
                          background: '#f0f9ff', color: '#0369a1',
                          border: '1px solid #bae6fd',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0
                        }}>
                          {doc.name?.replace('Dr. ', '').charAt(0) || 'D'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doc.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.experience ? `${doc.experience} yrs experience` : 'Attending Physician'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{doc.specialization}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{doc.hospital}</td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{doc.email}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{doc.phone}</div>
                    </td>
                    <td>
                      <button
                        className="badge badge-info"
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                        onClick={() => setPatientsModal(doc)}
                        title="View assigned patient roster"
                      >
                        <IconUsers size={12} />
                        <span>{doc.patientCount || 0} Patients</span>
                      </button>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {doc.createdAt ? format(new Date(doc.createdAt), 'MMM d, yyyy') : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', paddingRight: 8 }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => { setEditDoctor(doc); setShowModal(true); }}
                          title="Edit Physician"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => setPatientsModal(doc)}
                          title="View Patients"
                        >
                          <IconUsers size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-icon"
                          onClick={() => setDeleteConfirm(doc)}
                          title="Delete Physician"
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
              <span className="text-muted text-sm">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} doctors</span>
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

      {/* Doctor Modal */}
      {showModal && (
        <DoctorModal
          doctor={editDoctor}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadDoctors(); }}
        />
      )}

      {/* Doctor Patients Modal */}
      {patientsModal && (
        <DoctorPatientsModal
          doctor={patientsModal}
          onClose={() => setPatientsModal(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: 'var(--accent-danger)' }}>Delete Physician Record</div>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: 13.5 }}>
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone. Associated patients will be unassigned.
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
