import axios from 'axios';

const API_BASE_URL = 'https://moringa-lost-found-api.onrender.com';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const commentService = {
  // Get comments for an item
  getComments: async (itemId) => {
    try {
      const response = await api.get(`/items/${itemId}/comments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch comments' };
    }
  },

  // Add a comment to an item
  addComment: async (itemId, commentData) => {
    try {
      const response = await api.post(`/items/${itemId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to add comment' };
    }
  },

  // Claim an item
  claimItem: async (itemId, claimData) => {
    try {
      const response = await api.post(`/items/${itemId}/claim`, claimData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to claim item' };
    }
  },

  // Get claims for an item
  getClaims: async (itemId) => {
    try {
      const response = await api.get(`/items/${itemId}/claims`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch claims' };
    }
  }
};

export default commentService;