import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ratings API functions - UPDATED FOR YOUR TABLE STRUCTURE
export const ratingsAPI = {
  // Submit a new rating - PERFECT FOR YOUR the_rate TABLE
  submitRating: async (ratingData) => {
    const response = await api.post('/ratings', ratingData);
    return response.data;
  },

  // Get all ratings (for principal lecturers)
  getAllRatings: async () => {
    const response = await api.get('/ratings');
    return response.data;
  },

  // Get ratings by student - UPDATED
  getMyRatings: async (userId) => {
    const response = await api.get(`/ratings/my-ratings/${userId}`);
    return response.data;
  },

  // Get available reports to rate - UPDATED
  getAvailableReports: async (userId) => {
    const response = await api.get(`/ratings/available-reports/${userId}`);
    return response.data;
  },

  // Get rating statistics
  getStatistics: async () => {
    const response = await api.get('/ratings/statistics');
    return response.data;
  },

  // Check if user can rate a report
  canRateReport: async (reportId, userId) => {
    const response = await api.get(`/ratings/can-rate/${reportId}/${userId}`);
    return response.data;
  }
};

export default api;