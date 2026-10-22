'use client';

import { useState, useEffect } from 'react';
import { createPatient, updatePatient } from '@/lib/api';
import toast from 'react-hot-toast';
import { IconPatient, IconClose } from '@/components/Icons';

const CONDITIONS = [
  'Hypertension', 'Diabetes', 'Asthma', 'Cancer', 'Heart Disease',
  'Arthritis', 'Depression', 'Anxiety', 'COPD', 'Kidney Disease',
  'Liver Disease', 'Stroke', 'Alzheimer\'s', 'Parkinson\'s', 'Epilepsy',
  'Migraine', 'Anemia', 'Thyroid Disorder', 'Obesity', 'COVID-19', 'Other'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const STATUSES = ['Active', 'Inactive', 'Discharged', 'Critical'];

export default function PatientModal({ patient, doctors, onClose, onSuccess, defaultDoctorId }) {
  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male', condition: '', doctorId: defaultDoctorId || '',
    phone: '', email: '', address: '', bloodGroup: '', notes: '', status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditing = !!patient;

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || '',
        age: patient.age || '',
        gender: patient.gender || 'Male',
        condition: patient.condition || '',
        doctorId: patient.doctorId || defaultDoctorId || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        bloodGroup: patient.bloodGroup || '',
        notes: patient.notes || '',
        status: patient.status || 'Active'
      });
    }
  }, [patient, defaultDoctorId]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Patient name is required';
    if (!form.age || form.age < 0 || form.age > 150) e.age = 'Valid age required';
    if (!form.condition) e.condition = 'Primary diagnostic condition is required';
    if (!form.doctorId) e.doctorId = 'Attending physician assignment is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditing) {
        await updatePatient(patient._id, form);
        toast.success('Patient record updated');
      } else {
        await createPatient(form);
        toast.success('Patient admitted to registry');
      }
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">
              <IconPatient size={19} color="#0f766e" />
              <span>{isEditing ? 'Edit Patient Admission' : 'New Patient Registration'}</span>
            </div>
            <div className="modal-subtitle">Record clinical history, attending provider, and demographic profile</div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} style={{ marginLeft: 'auto' }} title="Close">
            <IconClose size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input name="name" className="form-control" value={form.name} onChange={handleChange} placeholder="Eleanor Vance" />
                {errors.name && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Age *</label>
                <input type="number" name="age" className="form-control" value={form.age} onChange={handleChange} placeholder="42" min="0" max="150" />
                {errors.age && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.age}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select name="bloodGroup" className="form-control" value={form.bloodGroup} onChange={handleChange}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Diagnosis *</label>
                <select name="condition" className="form-control" value={form.condition} onChange={handleChange}>
                  <option value="">Select medical condition</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.condition && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.condition}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Attending Physician *</label>
                <select name="doctorId" className="form-control" value={form.doctorId} onChange={handleChange}>
                  <option value="">Assign attending doctor</option>
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>
                  ))}
                </select>
                {errors.doctorId && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.doctorId}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Contact</label>
                <input name="phone" className="form-control" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} placeholder="patient@example.com" />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input name="address" className="form-control" value={form.address} onChange={handleChange} placeholder="123 Main St, City, State" />
              </div>

              <div className="form-group">
                <label className="form-label">Admission Status</label>
                <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Notes / History</label>
              <textarea name="notes" className="form-control" value={form.notes} onChange={handleChange} placeholder="Relevant medical observations, allergy alerts, prescription notes..." rows={3} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="spinner spinner-sm" /> : null}
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Admit Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
