import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReward, initiatePayment } from '../store/slices/rewardSlice';
import './RewardPaymentModal.css';

const RewardPaymentModal = ({ isOpen, onClose, item, finderUser }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.rewards);
  
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('create'); // 'create' or 'pay'
  const [rewardId, setRewardId] = useState(null);
  const [error, setError] = useState('');

  const handleCreateReward = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const rewardData = {
        item_id: item.id,
        finder_user_id: finderUser.id,
        amount: parseFloat(amount),
        phone_number: phoneNumber,
      };

      const response = await dispatch(createReward(rewardData)).unwrap();
      setRewardId(response.reward.id);
      setStep('pay');
    } catch (err) {
      setError(err || 'Failed to create reward');
    }
  };

  const handleInitiatePayment = async () => {
    setError('');
    
    try {
      await dispatch(initiatePayment(rewardId)).unwrap();
      alert('M-Pesa payment initiated! Check your phone for payment prompt.');
      onClose();
    } catch (err) {
      setError(err || 'Failed to initiate payment');
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 'create' ? 'Create Reward' : 'Pay Reward'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {step === 'create' ? (
          <form onSubmit={handleCreateReward} className="reward-form">
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
                <p>Phone: {finderUser.phone || 'Not provided'}</p>
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
              <label htmlFor="phoneNumber">Your M-Pesa Phone Number:</label>
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
        ) : (
          <div className="payment-section">
            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <p><strong>Item:</strong> {item.name}</p>
              <p><strong>Finder:</strong> {finderUser.username}</p>
              <p><strong>Amount:</strong> {formatAmount(parseFloat(amount))}</p>
              <p><strong>Phone:</strong> {phoneNumber}</p>
            </div>

            <div className="payment-instructions">
              <p>Click "Pay with M-Pesa" to initiate payment. You will receive a payment prompt on your phone.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button 
                onClick={handleInitiatePayment} 
                disabled={loading} 
                className="submit-button mpesa-button"
              >
                {loading ? 'Processing...' : 'Pay with M-Pesa'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardPaymentModal;
