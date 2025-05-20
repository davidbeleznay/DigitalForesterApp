import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import CulvertToolNavigator from './CulvertToolNavigator';
import EditScreen from '../screens/roadRisk/EditScreen';
import HistoryPage from '../pages/HistoryPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/culvert/*" element={<CulvertToolNavigator />} />
        <Route path="/road-risk" element={<EditScreen />} />
        <Route path="/road-risk/edit/:id" element={<EditScreen />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;