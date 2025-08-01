import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../store/slices/notificationSlice.js';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, error } = useSelector(
    (state) => state.notifications
  );

  // Check authentication
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    dispatch(fetchNotifications());
  }, [dispatch, isAuthenticated, navigate]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Your Notifications</h1>
          <div className="notifications-stats">
            <span className="total-count">
              {notifications.length} total
            </span>
            {unreadCount > 0 && (
              <span className="unread-count">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="notifications-actions">
            <button
              className="mark-all-read-btn"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          </div>
        )}

        <div className="notifications-content">
          {loading && (
            <div className="notifications-loading">
              <div className="spinner"></div>
              <p>Loading your notifications...</p>
            </div>
          )}

          {error && (
            <div className="notifications-error">
              <h3>Error loading notifications</h3>
              <p>{error}</p>
              <button onClick={() => dispatch(fetchNotifications())}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="no-notifications">
              <div className="no-notifications-icon">🔔</div>
              <h2>No notifications yet</h2>
              <p>
                You'll receive notifications here when admins review your reported items.
              </p>
              <button onClick={() => navigate('/')} className="go-home-btn">
                Go to Home
              </button>
            </div>
          )}

          {!loading && notifications.length > 0 && (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${
                    !notification.is_read ? 'unread' : 'read'
                  } ${notification.type}`}
                >
                  <div className="notification-header-card">
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-actions">
                      {!notification.is_read && (
                        <button
                          className="mark-read-btn"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(notification.id)}
                        title="Delete notification"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="notification-body">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {formatDate(notification.created_at)}
                      </span>
                      {notification.item_id && (
                        <span className="notification-item">
                          Item ID: {notification.item_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;