import apiClient from '../config/axios.js';

class NotificationService {
  // Get all notifications for the current user
  async getNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.unread_only) {
        queryParams.append('unread_only', 'true');
      }
      if (params.limit) {
        queryParams.append('limit', params.limit);
      }
      
      const url = `/notifications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get unread notification count
  async getUnreadCount() {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await apiClient.put('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new NotificationService();