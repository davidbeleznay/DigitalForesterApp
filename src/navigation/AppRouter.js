// src/navigation/AppRouter.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/culvert/InputScreen';
import ResultScreen from '../screens/culvert/ResultScreen';
import RoadRiskForm from '../pages/RoadRiskForm';
import HistoryPage from '../pages/HistoryPage';
import ThemeToggle from '../components/ThemeToggle';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/culvert" element={<InputScreen />} />
        <Route path="/culvert/result" element={<ResultScreen />} />
        <Route path="/road-risk" element={<RoadRiskForm />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;