import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchItems } from '../store/slices/itemsSlice';
import ItemDetail from './ItemDetail';
import './ItemsGrid.css';

const ItemsGrid = () => {
  const { items, loading, error } = useSelector((state) => state.items);
  const dispatch = useDispatch();
  const [visibleItems, setVisibleItems] = useState(6);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const loadMoreItems = () => {
    setVisibleItems(prev => prev + 6);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
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

  if (error) {
    return (
      <section className="items-section">
        <div className="container">
          <div className="error">
            <p>Error: {error}</p>
            <button className="btn btn-primary" onClick={() => dispatch(fetchItems())}>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="items-section">
      <div className="container">
        <div className="items-grid">
          {items.slice(0, visibleItems).map(item => (
            <div key={item.id} className="item-card" onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
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

        {selectedItem && (
          <ItemDetail item={selectedItem} onClose={handleCloseDetail} />
        )}
      </div>
    </section>
  );
};

export default ItemsGrid;
