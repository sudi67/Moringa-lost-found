import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { adminSignup, reset } from '../store/slices/adminSlice';
import './AdminSignup.css';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (isError) {
      console.error('Admin signup error:', message);
    }

    if (isSuccess) {
      navigate('/admin/login');
    }

    if (admin) {
      navigate('/admin/dashboard');
    }

    dispatch(reset());
  }, [admin, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const adminData = {
      username,
      email,
      password,
    };

    dispatch(adminSignup(adminData));
  };

  if (isLoading) {
    return (
      <div className="admin-signup-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Creating admin account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-signup-container">
      <div className="admin-signup-card">
        <div className="admin-signup-header">
          <h1>Admin Registration</h1>
          <p>Create your administrative account</p>
        </div>

        {isError && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {message}
          </div>
        )}

        {password !== confirmPassword && confirmPassword && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            Passwords do not match
          </div>
        )}

        <form onSubmit={onSubmit} className="admin-signup-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm your password"
              onChange={onChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="admin-signup-btn" 
            disabled={isLoading || password !== confirmPassword}
          >
            <i className="fas fa-user-plus"></i>
            {isLoading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="admin-signup-footer">
          <p>
            Already have an admin account?{' '}
            <Link to="/admin/login" className="login-link">
              Login here
            </Link>
          </p>
          <Link to="/" className="back-to-home">
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;