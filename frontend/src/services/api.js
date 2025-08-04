import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const gtmAPI = {
  // Dashboard and stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/dashboard-stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Case studies
  getCaseStudies: async () => {
    try {
      const response = await api.get('/api/case-studies');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCaseStudy: async (caseId) => {
    try {
      const response = await api.get(`/api/case-studies/${caseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Frameworks
  getFrameworks: async () => {
    try {
      const response = await api.get('/api/frameworks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Metrics
  getCaseMetrics: async (caseId) => {
    try {
      const response = await api.get(`/api/metrics/${caseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;