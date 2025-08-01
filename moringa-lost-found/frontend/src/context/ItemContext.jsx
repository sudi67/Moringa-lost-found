import React, { createContext, useState, useContext } from 'react';
import { API_ENDPOINTS } from '../config/api.js';

// Create context
export const ItemContext = createContext();

// Provider component
export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.ITEMS);
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (item) => {
    try {
      const response = await fetch(API_ENDPOINTS.ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      const newItem = await response.json();
      setItems(prev => [...prev, newItem]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update item
  const updateItem = async (id, updatedItem) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ITEMS}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      const updated = await response.json();
      setItems(prev => prev.map(item => item.id === id ? updated : item));
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      await fetch(`${API_ENDPOINTS.ITEMS}/${id}`, {
        method: 'DELETE',
      });
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
};

// Custom hook for using the context
export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};
