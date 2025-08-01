import apiClient from '../config/axios.js';
import authService from './authService';

class ReportRewardService {
  // Create reward for report
  async createRewardForReport(reportId, rewardData) {
    try {
      const response = await apiClient.post(`/reports/${reportId}/rewards`, rewardData);
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
      const payload = {
        name: reportData.title,
        description: reportData.description,
        status: reportData.item_type,
        location_found: reportData.location,
        category: reportData.category,
        // reported_by will be set by the backend from the JWT token
      };
      const response = await apiClient.post('/items', payload);
      console.log('Item created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      if (error.response) {
        // Server responded with error status
        throw new Error(`Server error: ${error.response.data?.error || error.response.statusText || 'Unknown server error'}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error: Unable to connect to server. Please check your connection.');
      } else {
        // Something else happened
        throw new Error(`Error: ${error.message || 'Failed to create report'}`);
      }
    }
  }

  // Initiate MPESA payment
  async initiateMpesaPayment(reportId) {
    try {
      const response = await apiClient.post(`/reports/${reportId}/initiate-payment`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get report with reward details
  async getReportWithReward(reportId) {
    try {
      const response = await apiClient.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get user rewards
  async getUserRewards() {
    try {
      const response = await apiClient.get('/reports/my-rewards');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new ReportRewardService();
