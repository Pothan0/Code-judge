import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Debug: Log the base URL being used
console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

// Debug: Add a test function to window for manual testing
if (typeof window !== 'undefined') {
  window.testAPI = async () => {
    console.log('🧪 Testing API Connection...');
    try {
      const response = await api.get('/problems');
      console.log('✅ API Test Successful!', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API Test Failed!', error);
      throw error;
    }
  };
  
  window.testHealth = async () => {
    console.log('🏥 Testing Health Endpoint...');
    try {
      const response = await api.get('/health');
      console.log('✅ Health Check Successful!', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Health Check Failed!', error);
      throw error;
    }
  };
  
  console.log('🔧 Debug functions available:');
  console.log('  - window.testAPI() - Test problems endpoint');
  console.log('  - window.testHealth() - Test health endpoint');
}

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug: Log outgoing requests
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  if (config.data) {
    console.log(`📤 Request Data:`, config.data);
  }
  
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => {
    // Debug: Log successful responses
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    if (response.data) {
      console.log(`📥 Response Data:`, response.data);
    }
    return response;
  },
  (error) => {
    // Debug: Log error responses
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error(`Status: ${error.response?.status} - ${error.response?.statusText}`);
    if (error.response?.data) {
      console.error(`Error Data:`, error.response.data);
    }
    if (error.message) {
      console.error(`Error Message:`, error.message);
    }
    
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
