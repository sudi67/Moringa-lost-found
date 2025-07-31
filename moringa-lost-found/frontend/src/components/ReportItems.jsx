import React, { useState, useEffect } from 'react';
import rewardService from '../services/rewardService';
import ItemDetail from './ItemDetail';
import './ReportItems.css';

const ReportItems = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use reportRewardService to get reports (POST endpoint is for creating reports)
        const data = await rewardService.getAllItems();
        setItems(data);
      } catch {
        setError('Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleItemClick = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const item = await rewardService.getItemById(itemId);
      setSelectedItem(item);
    } catch {
      setError('Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  // Removed unused handleReportSubmit function

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="report-items-container">
      <h2>Reported Items</h2>
      <div className="items-list">
        {items.length === 0 && <p>No items found.</p>}
        {items.map(item => (
          <div key={item.id} className="item-card" onClick={() => handleItemClick(item.id)}>
            <img
              src={item.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
              alt={item.name}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
              className="item-image"
            />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <p>{item.status}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedItem && (
        <ItemDetail item={selectedItem} onClose={handleCloseDetail} />
      )}
      {/* You can add a form or modal here to submit a new report and call handleReportSubmit */}
    </div>
  );
};

export default ReportItems;
