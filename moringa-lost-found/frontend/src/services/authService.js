import axios from 'axios';

const API_URL = 'https://moringa-lost-found-api.onrender.com/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'signup', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
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
    const response = await axios.get(API_URL + 'me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
