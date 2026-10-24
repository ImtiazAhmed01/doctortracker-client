'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDoctorPatients, deletePatient, getDoctors } from '@/lib/api';
import PatientModal from './PatientModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  IconPatient,
  IconPlus,
  IconClose,
  IconTrash,
  IconUsers
} from '@/components/Icons';

export default function DoctorPatientsModal({ doctor, onClose }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const limit = 8;

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getDoctorPatients(doctor._id, { page, limit });
      setPatients(data.patients || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load doctor patient roster');
    } finally {
      setLoading(false);
    }
  }, [doctor._id, page]);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  useEffect(() => {
    getDoctors({ limit: 100 }).then(r => setDoctors(r.data.doctors || [])).catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deletePatient(deleteConfirm._id);
      toast.success('Patient removed from roster');
      setDeleteConfirm(null);
      loadPatients();
    } catch {
      toast.error('Failed to remove patient');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" style={{ maxWidth: 660, maxHeight: '88vh' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40,
              background: '#f0f9ff', color: '#0369a1',
              border: '1px solid #bae6fd',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 15, fontWeight: 700
            }}>
              {doctor.name?.replace('Dr. ', '').charAt(0) || 'D'}
            </div>
            <div>
              <div className="modal-title">{doctor.name}</div>
              <div className="modal-subtitle">{doctor.specialization} • {total} Registered Patients</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
              <IconPlus size={14} /> Add Patient
            </button>
            <button className="btn btn-secondary btn-icon" onClick={onClose} title="Close">
              <IconClose size={15} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-card" style={{ padding: '36px 0' }}>
              <div className="spinner" />
              <p className="text-muted text-sm">Loading attending patient roster...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><IconUsers size={22} /></div>
              <div className="empty-title">No Patients Assigned</div>
              <p className="empty-text">Assign or add patients directly under this physician's care.</p>
              <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => setShowAdd(true)}>
                <IconPlus size={15} /> Add First Patient
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {patients.map(pat => (
                  <div key={pat._id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>{pat.name}</span>
                        <span className={`badge ${pat.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{pat.status}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Age {pat.age} • {pat.condition} {pat.bloodGroup ? `• Blood Group: ${pat.bloodGroup}` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        {pat.createdAt ? format(new Date(pat.createdAt), 'MMM d, yyyy') : ''}
                      </span>
                      <button
                        className="btn btn-danger btn-icon"
                        style={{ width: 28, height: 28, padding: 4 }}
                        onClick={() => setDeleteConfirm(pat)}
                        title="Remove Patient"
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                  <div className="pagination" style={{ margin: 0 }}>
                    <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                    <span style={{ padding: '0 10px', fontSize: 12.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                      Page {page} of {totalPages}
                    </span>
                    <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>

      {showAdd && (
        <PatientModal
          doctors={doctors}
          defaultDoctorId={doctor._id}
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); loadPatients(); }}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: 'var(--accent-danger)' }}>Remove Patient from Roster</div>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.5 }}>
                Remove <strong>{deleteConfirm.name}</strong> from Dr. {doctor.name}'s active patient roster?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
