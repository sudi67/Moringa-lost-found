import axios from 'axios';

const API_URL = 'https://moringa-lost-found-api.onrender.com/items/<item_id>/rewards';

// Create axios instance with auth header
const authAxios = axios.create({
  baseURL: API_URL,
});

// Add token to requests
authAxios.interceptors.request.use(
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

const rewardService = {
  // Create a new reward
  createReward: async (rewardData) => {
    try {
      const response = await authAxios.post('/', rewardData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create reward' };
    }
  },

  // Get all items
  getAllItems: async () => {
    try {
      const response = await axios.get('https://moringa-lost-found-api.onrender.com/items');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch items' };
    }
  },

  // Get item by ID
  getItemById: async (itemId) => {
    try {
      const response = await axios.get(`https://moringa-lost-found-api.onrender.com/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch item details' };
    }
  },

  // Initiate M-Pesa payment
  initiatePayment: async (rewardId) => {
    try {
      const response = await authAxios.post(`/${rewardId}/pay`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to initiate payment' };
    }
  },

  // Get user's rewards
  getMyRewards: async () => {
    try {
      const response = await authAxios.get('/my-rewards');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch rewards' };
    }
  },

  // Get specific reward details
  getReward: async (rewardId) => {
    try {
      const response = await authAxios.get(`/${rewardId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch reward details' };
    }
  },

  // Get rewards for a specific item by item ID
  getRewardsByItemId: async (itemId) => {
    try {
      // Note: baseURL is API_URL which is /api/rewards, so we use full URL here
      const response = await axios.get(`https://moringa-lost-found-api.onrender.com/items/<item_id>/rewards`);
     
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch rewards for item' };
    }
  },

  // Handle M-Pesa callback (for backend use)
  handleMpesaCallback: async (rewardId, callbackData) => {
    try {
      const response = await axios.post(`/${rewardId}/callback`, callbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to process callback' };
    }
  }
};

export default rewardService;
