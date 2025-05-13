import React, { useState, useEffect } from 'react';
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
  
  // Get drafts from localStorage
  const getCulvertDrafts = () => {
    try {
      return JSON.parse(localStorage.getItem('culvertDrafts') || '[]');
    } catch (error) {
      console.error('Error retrieving culvert drafts:', error);
      return [];
    }
  };
  
  const getRoadRiskDrafts = () => {
    try {
      return JSON.parse(localStorage.getItem('roadRiskDrafts') || '[]');
    } catch (error) {
      console.error('Error retrieving road risk drafts:', error);
      return [];
    }
  };
  
  // Get and combine all drafts
  const [drafts, setDrafts] = useState([]);
  
  useEffect(() => {
    const culvertDrafts = getCulvertDrafts().map(draft => ({
      ...draft,
      toolType: 'Culvert Sizing'
    }));
    
    const roadRiskDrafts = getRoadRiskDrafts().map(draft => ({
      ...draft,
      toolType: 'Road Risk'
    }));
    
    // Combine and sort drafts by date (newest first)
    const allDrafts = [...culvertDrafts, ...roadRiskDrafts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5); // Only show the 5 most recent drafts
    
    setDrafts(allDrafts);
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  return (
    <div className="home-container">
      <div className="app-header">
        <h1 className="app-title">Digital Forester App</h1>
      </div>
      
      <div className="tool-section">
        <p className="section-label">Select a tool to begin:</p>
        
        <div className="field-card-grid">
          <div className="field-card primary" onClick={navigateToRoadRisk}>
            <div className="field-card-content">
              <div className="field-card-title">Road Risk Assessment</div>
              <div className="field-card-description">
                Evaluate forest road risk factors including terrain, drainage, and maintenance conditions.
              </div>
            </div>
            <div className="field-card-icon">🛣️</div>
          </div>
          
          <div className="field-card success" onClick={navigateToCulvertTool}>
            <div className="field-card-content">
              <div className="field-card-title">Culvert Sizing Tool</div>
              <div className="field-card-description">
                Calculate appropriate culvert dimensions based on stream measurements.
              </div>
            </div>
            <div className="field-card-icon">🌊</div>
          </div>
          
          <div className="field-card secondary" onClick={navigateToHistory}>
            <div className="field-card-content">
              <div className="field-card-title">Assessment History</div>
              <div className="field-card-description">
                View and manage all saved assessments and calculations.
              </div>
            </div>
            <div className="field-card-icon">📋</div>
          </div>
        </div>
      </div>
      
      {drafts.length > 0 && (
        <div className="drafts-section">
          <h2 className="section-title">Recent Drafts</h2>
          
          <div className="draft-list">
            {drafts.map(draft => (
              <div className="draft-item" key={draft.id}>
                <div className="draft-info">
                  <div className="draft-name">
                    {draft.toolType === 'Culvert Sizing' ? draft.culvertId : draft.roadName}
                  </div>
                  <div className="draft-location">
                    {draft.location?.latitude ? `Lat: ${draft.location.latitude.substring(0, 7)}, Lng: ${draft.location.longitude.substring(0, 7)}` : 'No location'}
                  </div>
                </div>
                
                <div className="draft-meta">
                  <div className={`draft-type ${draft.toolType === 'Road Risk' ? 'road-risk' : 'culvert-sizing'}`}>
                    {draft.toolType}
                  </div>
                  <div className="draft-date">{formatDate(draft.date)}</div>
                </div>
                
                <button 
                  className="continue-button"
                  onClick={() => draft.toolType === 'Culvert Sizing' ? 
                    navigate('/culvert') : 
                    navigate('/road-risk')
                  }
                >
                  Continue editing →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="app-footer">
        <div className="app-version">Digital Forester App v0.2.0</div>
        <div className="app-copyright">© 2025 Forest Management Technologies</div>
      </div>
    </div>
  );
};

export default HomeScreen;
