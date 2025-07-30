// src/components/MpesaPayment.jsx
import React, { useState } from 'react';
import './MpesaPayment.css'; // Import the new CSS file

function MpesaPayment() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('https://moringa-lost-found-api.onrender.com/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Payment initiation failed.');
      }
      
      setSuccess('M-Pesa request sent successfully! Please check your phone to complete the payment.');
      setPhone('');
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mpesa-payment-page">
      <div className="mpesa-payment-container">
        <div className="mpesa-header">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png" alt="M-Pesa Logo" className="mpesa-logo" />
          <h2>Pay with M-Pesa</h2>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="mpesa-form">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g., 254712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="254[0-9]{9}"
              title="Phone number must be in the format 254XXXXXXXXX"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount (KES)</label>
            <input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>
          
          <button type="submit" className="mpesa-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : `Pay KES ${amount || '0'}`}
          </button>
        </form>

        <div className="mpesa-footer">
          <p>Powered by Safaricom</p>
        </div>
      </div>
    </div>
  );
}

export default MpesaPayment;

