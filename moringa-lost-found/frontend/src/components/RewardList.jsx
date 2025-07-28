import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyRewards } from '../store/slices/rewardSlice';
import RewardCard from './RewardCard';
import './RewardList.css';

const RewardList = () => {
  const dispatch = useDispatch();
  const { rewardsGiven, rewardsReceived, loading, error } = useSelector((state) => state.rewards);

  useEffect(() => {
    dispatch(fetchMyRewards());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="reward-list">
        <div className="loading">Loading rewards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reward-list">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="reward-list">
      <h2>My Rewards</h2>
      
      <div className="rewards-section">
        <h3>Rewards Given</h3>
        {rewardsGiven && rewardsGiven.length > 0 ? (
          <div className="rewards-grid">
            {rewardsGiven.map((reward) => (
              <RewardCard key={reward.id} reward={reward} type="given" />
            ))}
          </div>
        ) : (
          <p className="no-rewards">No rewards given yet.</p>
        )}
      </div>

      <div className="rewards-section">
        <h3>Rewards Received</h3>
        {rewardsReceived && rewardsReceived.length > 0 ? (
          <div className="rewards-grid">
            {rewardsReceived.map((reward) => (
              <RewardCard key={reward.id} reward={reward} type="received" />
            ))}
          </div>
        ) : (
          <p className="no-rewards">No rewards received yet.</p>
        )}
      </div>
    </div>
  );
};

export default RewardList;
