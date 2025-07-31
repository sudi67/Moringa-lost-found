import React from 'react';
import ItemRewards from './ItemRewards';
import Comments from './Comments';
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
              src={item.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
              alt={item.name}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
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
        <Comments itemId={item.id} />
      </div>
    </div>
  );
};

export default ItemDetail;
