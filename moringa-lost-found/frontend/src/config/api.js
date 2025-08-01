// API Configuration
// Use the production API on Render
export const API_BASE_URL = 'https://moringa-lost-found-api.onrender.com';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  ITEMS: `${API_BASE_URL}/items`,
  REPORTS: `${API_BASE_URL}/reports`,
  ADMIN: `${API_BASE_URL}/admin`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  REWARDS: `${API_BASE_URL}/rewards`,
  COMMENTS: `${API_BASE_URL}/comments`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};