import React from 'react';
import './RewardCard.css';

const RewardCard = ({ reward, type }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      case 'initiated':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="reward-card">
      <div className="reward-header">
        <h3>{reward.item_name || 'Item Reward'}</h3>
        <span 
          className="reward-status" 
          style={{ backgroundColor: getStatusColor(reward.status) }}
        >
          {reward.status}
        </span>
      </div>
      
      <div className="reward-details">
        <div className="reward-amount">
          <span className="amount-label">Amount:</span>
          <span className="amount-value">{formatAmount(reward.amount)}</span>
        </div>
        
        <div className="reward-parties">
          {type === 'given' ? (
            <div>
              <span className="party-label">Finder:</span>
              <span className="party-value">{reward.other_party?.username || 'Unknown'}</span>
            </div>
          ) : (
            <div>
              <span className="party-label">Owner:</span>
              <span className="party-value">{reward.other_party?.username || 'Unknown'}</span>
            </div>
          )}
        </div>
        
        <div className="reward-phone">
          <span className="phone-label">Phone:</span>
          <span className="phone-value">{reward.mpesa_phone_number}</span>
        </div>
        
        <div className="reward-date">
          <span className="date-label">Created:</span>
          <span className="date-value">{formatDate(reward.created_at)}</span>
        </div>
        
        {reward.mpesa_transaction_id && (
          <div className="reward-transaction">
            <span className="transaction-label">Transaction ID:</span>
            <span className="transaction-value">{reward.mpesa_transaction_id}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardCard;
