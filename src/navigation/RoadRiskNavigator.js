import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RoadRiskForm from '../pages/RoadRiskForm';

const RoadRiskNavigator = () => {
  return (
    <div className="road-risk-navigator">
      <Routes>
        <Route path="/" element={<RoadRiskForm />} />
      </Routes>
    </div>
  );
};

export default RoadRiskNavigator;
