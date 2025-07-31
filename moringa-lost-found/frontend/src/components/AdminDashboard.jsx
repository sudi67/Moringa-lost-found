import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchCurrentAdmin,
  adminLogout,
  fetchAllReports,
  approveReport,
  fetchInventory,
  fetchFoundItems,
  fetchClaimedItems,
  addItemToInventory,
  removeItemFromInventory,
} from '../store/slices/adminSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    admin,
    isLoading,
    isError,
    message,
    reports,
    inventory,
    foundItems,
    claimedItems,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!admin) {
      dispatch(fetchCurrentAdmin());
    }
  }, [admin, dispatch]);

  useEffect(() => {
    if (isError && message === 'Session expired. Please login again.') {
      navigate('/admin/login');
    }
  }, [isError, message, navigate]);

  useEffect(() => {
    if (admin) {
      dispatch(fetchAllReports());
      dispatch(fetchInventory());
      dispatch(fetchFoundItems());
      dispatch(fetchClaimedItems());
    }
  }, [admin, dispatch]);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  const handleApproveReport = (reportId) => {
    dispatch(approveReport(reportId));
  };

  const handleAddToInventory = (itemId) => {
    dispatch(addItemToInventory(itemId));
  };

  const handleRemoveFromInventory = (itemId) => {
    dispatch(removeItemFromInventory(itemId));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!admin) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-info">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {admin.username || admin.email}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="fas fa-clipboard-list"></i>
            Reports ({reports.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <i className="fas fa-boxes"></i>
            Inventory ({inventory.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'found' ? 'active' : ''}`}
            onClick={() => setActiveTab('found')}
          >
            <i className="fas fa-search"></i>
            Found Items ({foundItems.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'claimed' ? 'active' : ''}`}
            onClick={() => setActiveTab('claimed')}
          >
            <i className="fas fa-check-circle"></i>
            Claimed ({claimedItems.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'reports' && (
            <div className="reports-section">
              <h2>Pending Reports</h2>
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading reports...</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-clipboard-list"></i>
                  <p>No pending reports</p>
                </div>
              ) : (
                <div className="reports-grid">
                  {reports.map((report) => (
                    <div key={report.id} className="report-card">
                      <div className="report-header">
                        <h3>{report.item_name}</h3>
                        <span className={`status-badge ${report.status}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="report-details">
                        <p><strong>Type:</strong> {report.item_type}</p>
                        <p><strong>Location:</strong> {report.location}</p>
                        <p><strong>Description:</strong> {report.description}</p>
                        <p><strong>Reported by:</strong> {report.user_email}</p>
                        <p><strong>Date:</strong> {formatDate(report.created_at)}</p>
                      </div>
                      {report.image_url && (
                        <div className="report-image">
                          <img src={report.image_url} alt={report.item_name} />
                        </div>
                      )}
                      <div className="report-actions">
                        <button
                          onClick={() => handleApproveReport(report.id)}
                          className="approve-btn"
                          disabled={isLoading}
                        >
                          <i className="fas fa-check"></i>
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="inventory-section">
              <h2>Inventory Items</h2>
              {inventory.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-boxes"></i>
                  <p>No items in inventory</p>
                </div>
              ) : (
                <div className="items-grid">
                  {inventory.map((item) => (
                    <div key={item.id} className="item-card">
                      <div className="item-header">
                        <h3>{item.name}</h3>
                        <span className="item-type">{item.type}</span>
                      </div>
                      <div className="item-details">
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Description:</strong> {item.description}</p>
                        <p><strong>Added:</strong> {formatDate(item.created_at)}</p>
                      </div>
                      {item.image_url && (
                        <div className="item-image">
                          <img src={item.image_url} alt={item.name} />
                        </div>
                      )}
                      <div className="item-actions">
                        <button
                          onClick={() => handleRemoveFromInventory(item.id)}
                          className="remove-btn"
                          disabled={isLoading}
                        >
                          <i className="fas fa-trash"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'found' && (
            <div className="found-section">
              <h2>Found Items</h2>
              {foundItems.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-search"></i>
                  <p>No found items</p>
                </div>
              ) : (
                <div className="items-grid">
                  {foundItems.map((item) => (
                    <div key={item.id} className="item-card">
                      <div className="item-header">
                        <h3>{item.name}</h3>
                        <span className="item-type">{item.type}</span>
                      </div>
                      <div className="item-details">
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Description:</strong> {item.description}</p>
                        <p><strong>Found:</strong> {formatDate(item.created_at)}</p>
                      </div>
                      {item.image_url && (
                        <div className="item-image">
                          <img src={item.image_url} alt={item.name} />
                        </div>
                      )}
                      <div className="item-actions">
                        <button
                          onClick={() => handleAddToInventory(item.id)}
                          className="add-btn"
                          disabled={isLoading}
                        >
                          <i className="fas fa-plus"></i>
                          Add to Inventory
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'claimed' && (
            <div className="claimed-section">
              <h2>Claimed Items</h2>
              {claimedItems.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-check-circle"></i>
                  <p>No claimed items</p>
                </div>
              ) : (
                <div className="items-grid">
                  {claimedItems.map((item) => (
                    <div key={item.id} className="item-card claimed">
                      <div className="item-header">
                        <h3>{item.name}</h3>
                        <span className="item-type">{item.type}</span>
                      </div>
                      <div className="item-details">
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Description:</strong> {item.description}</p>
                        <p><strong>Claimed by:</strong> {item.claimed_by}</p>
                        <p><strong>Claimed:</strong> {formatDate(item.claimed_at)}</p>
                      </div>
                      {item.image_url && (
                        <div className="item-image">
                          <img src={item.image_url} alt={item.name} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isError && message && (
        <div className="error-toast">
          <i className="fas fa-exclamation-triangle"></i>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;