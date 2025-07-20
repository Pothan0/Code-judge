import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Debug: Log the base URL being used
console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear both token and user data on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Problem API
export const problemAPI = {
  getProblems: (params = {}) => api.get('/problems', { params }),
  getProblem: (id) => api.get(`/problems/${id}`),
  createProblem: (data) => api.post('/problems', data),
  updateProblem: (id, data) => api.put(`/problems/${id}`, data),
  deleteProblem: (id) => api.delete(`/problems/${id}`),
  getProblemStats: () => api.get('/problems/stats'),
};

// Submission API
export const submissionAPI = {
  submitSolution: (data) => api.post('/submissions', data),
  testCode: (data) => api.post('/submissions/test', data),
  getSubmission: (id) => api.get(`/submissions/${id}`),
  getUserSubmissions: (userId, params = {}) => api.get(`/submissions/user/${userId}`, { params }),
  getProblemSubmissions: (problemId, params = {}) => api.get(`/submissions/problem/${problemId}`, { params }),
  getSubmissionStats: () => api.get('/submissions/stats'),
};

// User API
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export default api;
