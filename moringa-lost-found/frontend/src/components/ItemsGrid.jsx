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

  const handleCloseModal = () => {
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
            <div key={item.id} className="item-card">
              <div className="item-image">
                <img
                  src={item.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
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
                <button
                  className="btn btn-primary"
                  onClick={() => handleItemClick(item)}
                >
                  <i className="fas fa-eye"></i>
                  View Details & Comments
                </button>
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

        {/* ItemDetail Modal */}
        {selectedItem && (
          <ItemDetail
            item={selectedItem}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </section>
  );
};

export default ItemsGrid;
