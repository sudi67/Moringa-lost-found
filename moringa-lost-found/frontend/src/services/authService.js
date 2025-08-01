import apiClient from '../config/axios.js';

const API_URL = '/auth/';

// Register user
const register = async (userData) => {
  const response = await apiClient.post(API_URL + 'signup', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await apiClient.post(API_URL + 'login', userData);
  console.log('Login API response:', response.data);
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

// Get current user info
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  try {
    const response = await apiClient.get(API_URL + 'me');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      // Token invalid or expired, remove it
      localStorage.removeItem('token');
      return null;
    }
    throw error;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
