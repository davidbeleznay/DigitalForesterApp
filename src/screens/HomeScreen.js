import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();
  
  // Navigate to specific tools
  const navigateToCulvertTool = () => {
    navigate('/culvert');
  };
  
  const navigateToRoadRisk = () => {
    navigate('/road-risk');
  };
  
  const navigateToHistory = () => {
    navigate('/history');
  };
  
  // Get count of drafts
  const getCulvertDraftsCount = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('culvertDrafts') || '[]');
      return drafts.length;
    } catch (error) {
      console.error('Error retrieving drafts:', error);
      return 0;
    }
  };
  
  const getRoadRiskDraftsCount = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('roadRiskDrafts') || '[]');
      return drafts.length;
    } catch (error) {
      console.error('Error retrieving drafts:', error);
      return 0;
    }
  };
  
  const culvertDraftsCount = getCulvertDraftsCount();
  const roadRiskDraftsCount = getRoadRiskDraftsCount();
  const totalDraftsCount = culvertDraftsCount + roadRiskDraftsCount;
  
  return (
    <div className="home-container">
      <h1>AI-Forester App</h1>
      <p className="subtitle">Forestry field tools for professionals</p>
      
      <h2>Field Tools</h2>
      <div className="field-card-grid">
        <div className="field-card primary" onClick={navigateToCulvertTool}>
          <div className="field-card-content">
            <div className="field-card-title">Culvert Sizing Tool</div>
            <div className="field-card-description">
              Calculate appropriate culvert dimensions based on watershed characteristics and fish passage requirements.
            </div>
          </div>
          <div className="field-card-icon">🌊</div>
        </div>
        
        <div className="field-card success" onClick={navigateToRoadRisk}>
          <div className="field-card-content">
            <div className="field-card-title">Road Risk Assessment</div>
            <div className="field-card-description">
              Evaluate forest road risk factors including terrain, drainage, and maintenance conditions.
            </div>
          </div>
          <div className="field-card-icon">🛣️</div>
        </div>
      </div>
      
      {totalDraftsCount > 0 && (
        <>
          <h2>Recent Drafts</h2>
          <div className="field-card secondary" onClick={navigateToHistory}>
            <div className="field-card-content">
              <div className="field-card-title">Saved Field Cards</div>
              <div className="field-card-description">
                You have {totalDraftsCount} draft{totalDraftsCount !== 1 ? 's' : ''} saved. 
                Click to view or edit.
              </div>
            </div>
            <div className="field-card-icon">📋</div>
          </div>
        </>
      )}
      
      <div className="app-version">
        <p>AI-Forester-App v0.5.0</p>
        <p className="build-date">Current as of May 13, 2025</p>
      </div>
    </div>
  );
};

export default HomeScreen;
