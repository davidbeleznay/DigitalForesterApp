import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [savedForms, setSavedForms] = useState({
    roadRisk: null,
    culvertSizing: null
  });
  
  useEffect(() => {
    // Load saved forms from localStorage
    const roadRiskData = localStorage.getItem('roadRiskForm');
    const culvertData = localStorage.getItem('culvertSizingForm');
    
    setSavedForms({
      roadRisk: roadRiskData ? JSON.parse(roadRiskData) : null,
      culvertSizing: culvertData ? JSON.parse(culvertData) : null
    });
  }, []);
  
  // Format date for display
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="app-container">
      <h1>Digital Forester App</h1>
      <p style={{marginBottom: '20px'}}>Select a tool to begin:</p>
      
      <div style={{marginBottom: '15px'}}>
        <Link to="/road-risk" className="btn btn-primary" style={{display: 'block', textAlign: 'center'}}>
          Road Risk Assessment
        </Link>
      </div>
      
      <div style={{marginBottom: '30px'}}>
        <Link to="/culvert-sizing" className="btn btn-success" style={{display: 'block', textAlign: 'center'}}>
          Culvert Sizing Tool
        </Link>
      </div>
      
      <div>
        <h2>Recent Drafts</h2>
        
        {(!savedForms.roadRisk && !savedForms.culvertSizing) ? (
          <p style={{color: '#666', fontStyle: 'italic'}}>No saved drafts found.</p>
        ) : (
          <div>
            {savedForms.roadRisk && (
              <div className="card">
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 'bold'}}>
                    {savedForms.roadRisk.title || 'Untitled Road Risk Assessment'}
                  </span>
                  <span className="tag tag-blue">
                    Road Risk
                  </span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.9rem'}}>
                  <span style={{color: '#666'}}>
                    {savedForms.roadRisk.location || 'No location'}
                  </span>
                  <span style={{color: '#666'}}>
                    {formatDate(savedForms.roadRisk.date)}
                  </span>
                </div>
                <div style={{marginTop: '8px'}}>
                  <Link to="/road-risk" style={{
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    color: '#3498db',
                    textDecoration: 'none'
                  }}>
                    Continue editing →
                  </Link>
                </div>
              </div>
            )}
            
            {savedForms.culvertSizing && (
              <div className="card">
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 'bold'}}>
                    {savedForms.culvertSizing.title || 'Untitled Culvert Sizing'}
                  </span>
                  <span className="tag tag-green">
                    Culvert Sizing
                  </span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.9rem'}}>
                  <span style={{color: '#666'}}>
                    {savedForms.culvertSizing.location || 'No location'}
                  </span>
                  <span style={{color: '#666'}}>
                    {formatDate(savedForms.culvertSizing.date)}
                  </span>
                </div>
                <div style={{marginTop: '8px'}}>
                  <Link to="/culvert-sizing" style={{
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    color: '#2ecc71',
                    textDecoration: 'none'
                  }}>
                    Continue editing →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;