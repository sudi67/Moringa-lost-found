import axios from 'axios';
import authService from './authService';

const API_URL = '/api/reports';

class ReportRewardService {
  // Create reward for report
  async createRewardForReport(reportId, rewardData) {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
      const response = await axios.post(`${API_URL}/${reportId}/rewards`, rewardData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Create a new report
  async createReport(reportData) {
    try {
      let user = await authService.getCurrentUser();
      if (!user || !user.id) {
        // Fallback: try to get user info from localStorage or other means
        const userJson = localStorage.getItem('user');
        if (userJson) {
          user = JSON.parse(userJson);
        }
        if (!user || !user.id) {
          throw new Error('User not authenticated');
        }
      }
      const authToken = localStorage.getItem('token');
      const payload = {
        name: reportData.name,
        description: reportData.description,
        location_found: reportData.location,
        category: reportData.category,
        reported_by: user.id,
        // Add any other necessary fields from reportData
      };
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await axios.post('https://moringa-lost-found-api.onrender.com/items', payload, config);
      console.log('Item created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error.response?.data || error.message;
    }
  }

  // Initiate MPESA payment
  async initiateMpesaPayment(reportId) {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
      const response = await axios.post(`${API_URL}/${reportId}/initiate-payment`, null, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get report with reward details
  async getReportWithReward(reportId) {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
      const response = await axios.get(`${API_URL}/${reportId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get user rewards
  async getUserRewards() {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
      const response = await axios.get('/api/reports/my-rewards', config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new ReportRewardService();
