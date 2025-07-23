import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import ItemsGrid from './components/ItemsGrid';
import ReportModal from './components/ReportModal';
import Footer from './components/Footer';
import { ItemProvider } from './context/ItemContext';

function App() {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <ItemProvider>
      <div className="App">
        <Navbar onReportClick={() => setShowReportModal(true)} />
        <Hero onReportClick={() => setShowReportModal(true)} />
        <SearchSection />
        <ItemsGrid />
        <Footer />
        
        {showReportModal && (
          <ReportModal onClose={() => setShowReportModal(false)} />
        )}
      </div>
    </ItemProvider>
  );
}

export default App;
