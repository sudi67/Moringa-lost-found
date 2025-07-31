import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin, reset } from '../store/slices/adminSlice';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (isError) {
      console.error('Admin login error:', message);
    }

    if (isSuccess || admin) {
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

    const adminData = {
      username,
      password,
    };

    dispatch(adminLogin(adminData));
  };

  if (isLoading) {
    return (
      <div className="admin-login-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Logging in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Access the administrative dashboard</p>
        </div>

        {isError && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="admin-login-form">
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
              placeholder="Enter your admin username"
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

          <button type="submit" className="admin-login-btn" disabled={isLoading}>
            <i className="fas fa-sign-in-alt"></i>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>
            Don't have an admin account?{' '}
            <Link to="/admin/signup" className="signup-link">
              Sign up here
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

export default AdminLogin;