import React, { useState } from 'react';
import AuthModal from './components/AuthModal';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import ItemsGrid from './components/ItemsGrid';
import ReportModal from './components/ReportModal';
import Footer from './components/Footer';
import { setShowReportModal } from './store/slices/uiSlice';

function App() {
  const showReportModal = useSelector((state) => state.ui.showReportModal);
  const dispatch = useDispatch();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleReportClick = () => {
    dispatch(setShowReportModal(true));
  };

  const handleCloseModal = () => {
    dispatch(setShowReportModal(false));
  };

  const handleAuthOpen = () => {
    setAuthModalOpen(true);
  };

  const handleAuthClose = () => {
    setAuthModalOpen(false);
  };

  const handleAuthModeChange = (mode) => {
    setAuthMode(mode);
  };

  return (
    <div className="App">
      <Navbar onReportClick={handleReportClick} onAuthOpen={handleAuthOpen} />
      <Hero onReportClick={handleReportClick} />
      <SearchSection />
      <ItemsGrid />
      <Footer />

      {showReportModal && (
        <ReportModal onClose={handleCloseModal} />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthClose}
        mode={authMode}
        onModeChange={handleAuthModeChange}
      />
    </div>
  );
}

export default App;
