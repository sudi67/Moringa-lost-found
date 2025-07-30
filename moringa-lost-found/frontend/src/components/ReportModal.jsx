import React, { useState, useContext } from 'react'; // Import useContext
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext'; // Assuming AuthContext is defined elsewhere
import { addItem } from '../store/slices/itemsSlice';
import { setShowReportModal } from '../store/slices/uiSlice';
import reportRewardService from '../services/reportRewardService';
import './ReportModal.css';

const ReportModal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isAuthenticated } = useContext(AuthContext); // Consume the context
  const [formData, setFormData] = useState({
    title: '',
    status: '',
    category: '',
    description: '',
    location: '',
    image_url: '',
    rewardAmount: '',
    rewardPhone: '',
    addReward: false
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => { // Made function async for potential async calls later
    e.preventDefault();
    setError(null);
    
    // Add an authentication check here
    if (!isAuthenticated) {
      console.error('User not authenticated');
      // Redirect to login or show a message
      return;
    }

    setLoading(true);
    
    // Prepare payload for backend API
    const payload = {
      title: formData.title,
      description: formData.description,
      item_type: formData.status,
      category: formData.category,
      location: formData.location,
      image_url: formData.image_url,
      // Additional fields can be added if backend supports
    };

    try {
      // Call backend API to create report
      const response = await reportRewardService.createReport(payload);

      // Optionally update Redux store with new item
      const newItem = {
        id: response.item.id,
        description: response.item.description,
        status: response.item.status,
        location_found: response.item.location_found,
        image_url: response.item.image_url,
        created_at: response.item.created_at
      };
      dispatch(addItem(newItem));

      // Close modal on success
      dispatch(setShowReportModal(false));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={() => dispatch(setShowReportModal(false))}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Lost/Found Item</h2>
          <span className="close" onClick={() => dispatch(setShowReportModal(false))}>&times;</span>
        </div>

        {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter title"
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select 
              name="status" 
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              name="category" 
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="documents">Documents</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4" 
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input 
              type="text" 
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
            {formData.image_url && (
              <img 
                src={formData.image_url} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  marginTop: '10px',
                  borderRadius: '8px'
                }} 
              />
            )}
          </div>

          {formData.status === 'lost' && (
            <div className="reward-section">
              <h3>Reward (Optional)</h3>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="addReward"
                    checked={formData.addReward}
                    onChange={(e) => setFormData(prev => ({ ...prev, addReward: e.target.checked }))}
                  />
                  Add reward for finding this item
                </label>
              </div>
              
              {formData.addReward && (
                <>
                  <div className="form-group">
                    <label>Reward Amount (KES)</label>
                    <input
                      type="number"
                      name="rewardAmount"
                      value={formData.rewardAmount}
                      onChange={handleChange}
                      min="1"
                      step="0.01"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>MPESA Phone Number</label>
                    <input
                      type="tel"
                      name="rewardPhone"
                      value={formData.rewardPhone}
                      onChange={handleChange}
                      placeholder="+2547XXXXXXXX"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
