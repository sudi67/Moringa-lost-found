import React, { useState, useEffect } from 'react';
import reportRewardService from '../services/reportRewardService';
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
      } catch (err) {
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
    } catch (err) {
      setError('Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async (reportData) => {
    setLoading(true);
    setError(null);
    try {
      await reportRewardService.createReport(reportData);
      // Optionally refresh items after report submission
      const data = await rewardService.getAllItems();
      setItems(data);
    } catch (err) {
      setError('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

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
              src={item.image || 'https://via.placeholder.com/150x100?text=No+Image'} 
              alt={item.name} 
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
