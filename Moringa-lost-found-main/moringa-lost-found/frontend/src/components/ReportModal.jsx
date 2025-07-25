import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/itemsSlice';
import { setShowReportModal } from '../store/slices/uiSlice';
import './ReportModal.css';

const ReportModal = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    name: '',
    description: '',
    location: '',
    date: '',
    email: '',
    phone: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create item object for Redux
    const newItem = {
      ...formData,
      id: Date.now(), // Temporary ID, will be replaced by backend
      status: formData.type === 'lost' ? 'lost' : 'found',
      image: imagePreview || null
    };
    
    dispatch(addItem(newItem));
    dispatch(setShowReportModal(false));
  };

  return (
    <div className="modal" onClick={() => dispatch(setShowReportModal(false))}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Lost/Found Item</h2>
          <span className="close" onClick={() => dispatch(setShowReportModal(false))}>&times;</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select 
              name="type" 
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              name="category" 
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="documents">Documents</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Item Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4" 
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Image</label>
            <input 
              type="file" 
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  marginTop: '10px',
                  borderRadius: '8px'
                }} 
              />
            )}
          </div>

          <div className="form-group">
            <label>Contact Information</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
