import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RoadRiskForm from './pages/RoadRiskForm';
import CulvertSizingForm from './pages/CulvertSizingForm';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/road-risk" element={<RoadRiskForm />} />
        <Route path="/culvert-sizing" element={<CulvertSizingForm />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;