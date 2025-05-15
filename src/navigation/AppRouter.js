import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import CulvertToolNavigator from './CulvertToolNavigator';
import RoadRiskNavigator from './RoadRiskNavigator';
import RoadRiskForm from '../pages/RoadRiskForm';
import HistoryPage from '../pages/HistoryPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/culvert/*" element={<CulvertToolNavigator />} />
        <Route path="/road-risk/*" element={<RoadRiskForm />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
