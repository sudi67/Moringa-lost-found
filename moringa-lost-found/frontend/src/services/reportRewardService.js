import axios from 'axios';

const API_URL = '/api/reports';

class ReportRewardService {
  // Create reward for report
  async createRewardForReport(reportId, rewardData) {
    try {
      const response = await axios.post(`${API_URL}/${reportId}/rewards`, rewardData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Initiate MPESA payment
  async initiateMpesaPayment(reportId) {
    try {
      const response = await axios.post(`${API_URL}/${reportId}/initiate-payment`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get report with reward details
  async getReportWithReward(reportId) {
    try {
      const response = await axios.get(`${API_URL}/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get user rewards
  async getUserRewards() {
    try {
      const response = await axios.get('/api/reports/my-rewards');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new ReportRewardService();
