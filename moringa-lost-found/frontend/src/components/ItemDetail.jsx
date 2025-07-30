import React from 'react';
import ItemRewards from './ItemRewards';
import './ItemDetail.css';

const ItemDetail = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="item-detail-overlay">
      <div className="item-detail-modal">
        <button className="close-button" onClick={onClose}>X</button>
        <div className="item-detail-content">
          <div className="item-detail-image">
            <img 
              src={item.image || 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=No+Image'} 
              alt={item.name} 
            />
          </div>
          <div className="item-detail-info">
            <h2>{item.name}</h2>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {item.status}</p>
          </div>
        </div>
        <ItemRewards itemId={item.id} />
      </div>
    </div>
  );
};

export default ItemDetail;
