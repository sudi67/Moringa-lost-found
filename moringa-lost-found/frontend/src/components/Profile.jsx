import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { fetchMyItems } from '../store/slices/itemsSlice';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myItems, loading: itemsLoading } = useSelector((state) => state.items);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyItems());
    }
  }, [dispatch, user]);

  // Separate items by status
  const lostItems = myItems.filter(item => item.status === 'lost');
  const foundItems = myItems.filter(item => item.status === 'found');

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

        {/* Add the Make Payment link here: */}
        <div style={{ marginTop: '1rem' }}>
          <Link to="/pay" className="btn-pay">
            Make Payment
          </Link>
        </div>
      </div>



      <div className="profile-section">
        <h3>My Lost Items</h3>
        {itemsLoading ? (
          <p>Loading items...</p>
        ) : lostItems.length > 0 ? (
          <div className="items-grid">
            {lostItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-image">
                  <img
                    src={item.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <div className="item-content">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <div className="item-details">
                    <span className="item-category">{item.category}</span>
                    <span className="item-location">{item.location_found}</span>
                    <span className="item-date">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`item-status ${item.status}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No lost items reported yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3>My Found Items</h3>
        {itemsLoading ? (
          <p>Loading items...</p>
        ) : foundItems.length > 0 ? (
          <div className="items-grid">
            {foundItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-image">
                  <img
                    src={item.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <div className="item-content">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <div className="item-details">
                    <span className="item-category">{item.category}</span>
                    <span className="item-location">{item.location_found}</span>
                    <span className="item-date">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`item-status ${item.status}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No found items reported yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3>My Claims</h3>
        <p className="empty-state">No claims submitted yet.</p>
      </div>
    </div>
  );
};

export default Profile;
