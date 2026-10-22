'use client';

import { useState, useEffect } from 'react';
import { createDoctor, updateDoctor } from '@/lib/api';
import toast from 'react-hot-toast';
import { IconDoctor, IconClose } from '@/components/Icons';

const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
  'Dermatology', 'Psychiatry', 'Radiology', 'Surgery', 'Gynecology',
  'Ophthalmology', 'ENT', 'Gastroenterology', 'Nephrology', 'Pulmonology',
  'Endocrinology', 'Rheumatology', 'Anesthesiology', 'Emergency Medicine', 'General Medicine'
];

export default function DoctorModal({ doctor, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', specialization: '', hospital: '', phone: '', email: '', bio: '', experience: '', rating: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditing = !!doctor;

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name || '',
        specialization: doctor.specialization || '',
        hospital: doctor.hospital || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
        bio: doctor.bio || '',
        experience: doctor.experience || '',
        rating: doctor.rating || ''
      });
    }
  }, [doctor]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.specialization) e.specialization = 'Specialization is required';
    if (!form.hospital.trim()) e.hospital = 'Hospital affiliation is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address format';
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
        await updateDoctor(doctor._id, form);
        toast.success('Doctor record updated');
      } else {
        await createDoctor(form);
        toast.success('Doctor record created');
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
              <IconDoctor size={19} color="#0284c7" />
              <span>{isEditing ? 'Edit Physician Profile' : 'Register New Physician'}</span>
            </div>
            <div className="modal-subtitle">Enter clinical qualifications and departmental credentials</div>
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
                <input name="name" className="form-control" value={form.name} onChange={handleChange} placeholder="Dr. Jane Smith" />
                {errors.name && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <select name="specialization" className="form-control" value={form.specialization} onChange={handleChange}>
                  <option value="">Select specialty</option>
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialization && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.specialization}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Hospital Affiliation *</label>
                <input name="hospital" className="form-control" value={form.hospital} onChange={handleChange} placeholder="City General Hospital" />
                {errors.hospital && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.hospital}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Contact *</label>
                <input name="phone" className="form-control" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                {errors.phone && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Professional Email *</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} placeholder="doctor@hospital.com" />
                {errors.email && <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input type="number" name="experience" className="form-control" value={form.experience} onChange={handleChange} placeholder="10" min="0" max="60" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Professional Notes & Bio</label>
              <textarea name="bio" className="form-control" value={form.bio} onChange={handleChange} placeholder="Board certifications, clinical focus, office hours..." rows={3} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="spinner spinner-sm" /> : null}
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
