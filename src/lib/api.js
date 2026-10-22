import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('dt_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('dt_token');
      localStorage.removeItem('dt_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const loginAPI = (data) => api.post('/api/auth/login', data);
export const registerAPI = (data) => api.post('/api/auth/register', data);
export const firebaseLoginAPI = (data) => api.post('/api/auth/firebase', data);

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/api/dashboard/stats');

// ─── Doctors ─────────────────────────────────────────────────────────────────
export const getDoctors = (params) => api.get('/api/doctors', { params });
export const getDoctor = (id) => api.get(`/api/doctors/${id}`);
export const createDoctor = (data) => api.post('/api/doctors', data);
export const updateDoctor = (id, data) => api.put(`/api/doctors/${id}`, data);
export const deleteDoctor = (id) => api.delete(`/api/doctors/${id}`);
export const getDoctorPatients = (id, params) => api.get(`/api/doctors/${id}/patients`, { params });
export const getSpecializations = () => api.get('/api/doctors/meta/specializations');

// ─── Patients ────────────────────────────────────────────────────────────────
export const getPatients = (params) => api.get('/api/patients', { params });
export const getPatient = (id) => api.get(`/api/patients/${id}`);
export const createPatient = (data) => api.post('/api/patients', data);
export const updatePatient = (id, data) => api.put(`/api/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/api/patients/${id}`);
export const getConditions = () => api.get('/api/patients/meta/conditions');

// ─── Chat ────────────────────────────────────────────────────────────────────
export const sendChatMessage = (data) => api.post('/api/chat', data);

export default api;
