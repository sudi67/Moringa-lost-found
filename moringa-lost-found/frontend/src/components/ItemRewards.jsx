import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRewardsByItemId } from '../store/slices/rewardSlice';
import RewardCard from './RewardCard';
import './ItemRewards.css';

const ItemRewards = ({ itemId }) => {
  const dispatch = useDispatch();
  const { itemRewards, loading, error } = useSelector((state) => state.rewards);

  useEffect(() => {
    if (itemId) {
      dispatch(fetchRewardsByItemId(itemId));
    }
  }, [dispatch, itemId]);

  if (loading) {
    return <div className="item-rewards-loading">Loading rewards...</div>;
  }

  if (error) {
    return <div className="item-rewards-error">Error: {error}</div>;
  }

  if (!itemRewards || itemRewards.length === 0) {
    return <div className="item-rewards-empty">No rewards for this item yet.</div>;
  }

  return (
    <div className="item-rewards">
      <h3>Rewards for this Item</h3>
      <div className="item-rewards-list">
        {itemRewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} type="received" />
        ))}
      </div>
    </div>
  );
};

export default ItemRewards;
