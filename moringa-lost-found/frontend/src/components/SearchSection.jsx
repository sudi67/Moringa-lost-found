import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    // Search logic will be implemented with context
    console.log('Searching:', { searchTerm, category, status, date });
  };

  return (
    <section className="search-section" id="search">
      <div className="container">
        <h2 className="section-title">Search Lost & Found Items</h2>
        <div className="search-container">
          <div className="search-filters">
            <select 
              id="category-filter" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="documents">Documents</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
            
            <select 
              id="status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            
            <input 
              type="date" 
              id="date-filter" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Date"
            />
          </div>
          
          <div className="search-bar">
            <input 
              type="text" 
              id="search-input" 
              placeholder="Search by item name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
