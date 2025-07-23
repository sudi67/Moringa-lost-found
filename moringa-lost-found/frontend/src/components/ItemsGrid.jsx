import React, { useContext, useState } from 'react';
import { ItemContext } from '../context/ItemContext';
import './ItemsGrid.css';

const ItemsGrid = () => {
  const { items, loading } = useContext(ItemContext);
  const [visibleItems, setVisibleItems] = useState(6);

  const loadMoreItems = () => {
    setVisibleItems(prev => prev + 6);
  };

  if (loading) {
    return (
      <section className="items-section">
        <div className="container">
          <div className="loading">Loading items...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="items-section">
      <div className="container">
        <div className="items-grid">
          {items.slice(0, visibleItems).map(item => (
            <div key={item.id} className="item-card">
              <div className="item-image">
                <img 
                  src={item.image || 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=No+Image'} 
                  alt={item.name} 
                />
              </div>
              <div className="item-content">
                <div className="item-header">
                  <h3 className="item-name">{item.name}</h3>
                  <span className={`item-status ${item.status}`}>{item.status}</span>
                </div>
                <p className="item-description">{item.description}</p>
                <div className="item-details">
                  <span className="item-category">{item.category}</span>
                  <span className="item-location">{item.location}</span>
                  <span className="item-date">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <button className="btn btn-outline">Contact Owner</button>
              </div>
            </div>
          ))}
        </div>
        
        {visibleItems < items.length && (
          <div className="load-more">
            <button className="btn btn-outline" onClick={loadMoreItems}>
              Load More Items
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ItemsGrid;
