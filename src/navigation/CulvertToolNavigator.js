import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InputScreen from '../screens/culvert/InputScreen';
import ResultScreen from '../screens/culvert/ResultScreen';

const CulvertToolNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<InputScreen />} />
      <Route path="/results" element={<ResultScreen />} />
    </Routes>
  );
};

export default CulvertToolNavigator;
