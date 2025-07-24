import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Please sign in to view your profile</h2>
        <button onClick={() => navigate('/login')} className="btn-logout">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <div className="profile-info">
          <div>
            <p><strong>Username:</strong> {user.username || 'Not provided'}</p>
            <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
          </div>
          <div>
            <p><strong>Account ID:</strong> {user.id || 'N/A'}</p>
            <p><strong>Member Since:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Sign Out
        </button>
      </div>

      <div className="profile-section">
        <h3>My Lost Items</h3>
        <p className="empty-state">No lost items reported yet.</p>
      </div>

      <div className="profile-section">
        <h3>My Found Items</h3>
        <p className="empty-state">No found items reported yet.</p>
      </div>

      <div className="profile-section">
        <h3>My Claims</h3>
        <p className="empty-state">No claims submitted yet.</p>
      </div>
    </div>
  );
};

export default Profile;
