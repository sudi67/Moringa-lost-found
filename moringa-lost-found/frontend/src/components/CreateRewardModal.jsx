import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReward } from '../store/slices/rewardSlice';
import './CreateRewardModal.css';

const CreateRewardModal = ({ isOpen, onClose, item, finderUser }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const rewardData = {
        item_id: item.id,
        finder_user_id: finderUser.id,
        amount: parseFloat(amount),
        phone_number: phoneNumber,
      };

      await dispatch(createReward(rewardData)).unwrap();
      onClose();
      // Reset form
      setAmount('');
      setPhoneNumber('');
    } catch (err) {
      setError(err || 'Failed to create reward');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Reward</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="reward-form">
          <div className="form-group">
            <label>Item:</label>
            <div className="item-info">
              <strong>{item.name}</strong>
              <p>{item.description}</p>
            </div>
          </div>

          <div className="form-group">
            <label>Finder:</label>
            <div className="finder-info">
              <strong>{finderUser.username}</strong>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Reward Amount (KES):</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
              placeholder="Enter amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">M-Pesa Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="2547XXXXXXXX"
              pattern="254[0-9]{9}"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Creating...' : 'Create Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRewardModal;
