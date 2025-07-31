import axios from 'axios';

const API_BASE_URL = 'https://moringa-lost-found-api.onrender.com';

// Create axios instance with auth header for admin
const adminAxios = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const adminService = {
  // Admin authentication
  adminSignup: async (adminData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/admin/signup`, adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create admin account' };
    }
  },

  adminLogin: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, credentials);
      if (response.data.access_token) {
        localStorage.setItem('adminToken', response.data.access_token);
        
        // Create admin user object since backend doesn't return it
        const adminUser = {
          username: credentials.username,
          access_token: response.data.access_token
        };
        
        return adminUser;
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to login' };
    }
  },

  adminLogout: () => {
    localStorage.removeItem('adminToken');
  },

  // Get current admin info
  getCurrentAdmin: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return null;
      }
      const response = await adminAxios.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Token invalid or expired, remove it
        localStorage.removeItem('adminToken');
        return null;
      }
      throw error;
    }
  },

  // Report management
  approveReport: async (reportId) => {
    try {
      const response = await adminAxios.put(`/reports/${reportId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to approve report' };
    }
  },

  getAllReports: async () => {
    try {
      const response = await adminAxios.get('/reports');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch reports' };
    }
  },

  // Inventory management
  getInventory: async () => {
    try {
      const response = await adminAxios.get('/items/admin/inventory');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch inventory' };
    }
  },

  getFoundItems: async () => {
    try {
      const response = await adminAxios.get('/items/admin/found-items');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch found items' };
    }
  },

  getClaimedItems: async () => {
    try {
      const response = await adminAxios.get('/items/admin/claimed-items');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch claimed items' };
    }
  },

  addItemToInventory: async (itemId) => {
    try {
      const response = await adminAxios.post(`/items/admin/add/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to add item to inventory' };
    }
  },

  updateItem: async (itemId, itemData) => {
    try {
      const response = await adminAxios.put(`/items/admin/${itemId}/update`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update item' };
    }
  },

  removeItem: async (itemId) => {
    try {
      const response = await adminAxios.delete(`/items/admin/${itemId}/remove`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to remove item' };
    }
  },

  // Item approval management
  getPendingItems: async () => {
    try {
      const response = await adminAxios.get('/items/admin/pending-items');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch pending items' };
    }
  },

  approveItem: async (itemId) => {
    try {
      const response = await adminAxios.put(`/items/admin/${itemId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to approve item' };
    }
  },

  rejectItem: async (itemId) => {
    try {
      const response = await adminAxios.put(`/items/admin/${itemId}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to reject item' };
    }
  },

  // Claim approval management
  getPendingClaims: async () => {
    try {
      const response = await adminAxios.get('/items/admin/pending-claims');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch pending claims' };
    }
  },

  approveClaim: async (claimId) => {
    try {
      const response = await adminAxios.put(`/items/admin/claims/${claimId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to approve claim' };
    }
  },

  rejectClaim: async (claimId) => {
    try {
      const response = await adminAxios.put(`/items/admin/claims/${claimId}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to reject claim' };
    }
  }
};

export default adminService;