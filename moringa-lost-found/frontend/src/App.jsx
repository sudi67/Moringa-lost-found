import React from 'react';
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

  const handleReportClick = () => {
    dispatch(setShowReportModal(true));
  };

  const handleCloseModal = () => {
    dispatch(setShowReportModal(false));
  };

  return (
    <div className="App">
      <Navbar onReportClick={handleReportClick} />
      <Hero onReportClick={handleReportClick} />
      <SearchSection />
      <ItemsGrid />
      <Footer />
      
      {showReportModal && (
        <ReportModal onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
