import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import ItemsGrid from './components/ItemsGrid';
import ReportModal from './components/ReportModal';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import MpesaPayment from './components/MpesaPayment'; // ← new import
import { setShowReportModal } from './store/slices/uiSlice';
import { fetchCurrentUser, logout } from './store/slices/authSlice';

// Create a separate component that uses useNavigate
function AppContent() {
  const showReportModal = useSelector((state) => state.ui.showReportModal);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Only try to fetch current user if there's a token
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser()).unwrap().catch(() => {
        dispatch(logout());
        // Don't automatically redirect to login, let user navigate naturally
      });
    }
  }, [dispatch]);

  const handleReportClick = () => {
    dispatch(setShowReportModal(true));
  };

  const handleCloseModal = () => {
    dispatch(setShowReportModal(false));
  };

  return (
    <div className="App">
      <Navbar onReportClick={handleReportClick} />

      <Routes>
        <Route path="/" element={
          <>
            <Hero onReportClick={handleReportClick} />
            <SearchSection />
            <ItemsGrid />
            <Footer />
          </>
        } />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pay" element={<MpesaPayment />} /> {/* ← added */}
      </Routes>

      {showReportModal && (
        <ReportModal onClose={handleCloseModal} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
