import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnreadCount } from '../store/slices/notificationSlice.js';
import NotificationCenter from './NotificationCenter.jsx';
import './NotificationBell.css';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notifications);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Check for authentication
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch unread count on component mount
      dispatch(fetchUnreadCount());

      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated]);

  const handleBellClick = () => {
    setIsNotificationCenterOpen(true);
  };

  const handleCloseNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
    // Refresh unread count after closing
    dispatch(fetchUnreadCount());
  };

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="notification-bell" onClick={handleBellClick}>
        <div className="bell-icon">
          🔔
        </div>
        {unreadCount > 0 && (
          <div className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={handleCloseNotificationCenter}
      />
    </>
  );
};

export default NotificationBell;