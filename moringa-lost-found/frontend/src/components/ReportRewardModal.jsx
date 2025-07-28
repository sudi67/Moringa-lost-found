import React, { useState } from 'react';
import reportRewardService from '../services/reportRewardService';
import './ReportRewardModal.css';

const ReportRewardModal = ({ reportId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    mpesa_phone_number: '',
    finder_user_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await reportRewardService.createRewardForReport(reportId, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create reward');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-reward-modal">
      <div className="modal-content">
        <h2>Create Reward for Report</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reward Amount (KES)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label>MPESA Phone Number</label>
            <input
              type="tel"
              name="mpesa_phone_number"
              value={formData.mpesa_phone_number}
              onChange={handleChange}
              required
              placeholder="+2547XXXXXXXX"
            />
          </div>
          
          <div className="form-group">
            <label>Finder User ID</label>
            <input
              type="number"
              name="finder_user_id"
              value={formData.finder_user_id}
              onChange={handleChange}
              required
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Reward'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportRewardModal;
