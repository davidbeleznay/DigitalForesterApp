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
    <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <h1 style={{color: 'blue'}}>Digital Forester App</h1>
      <p style={{marginBottom: '20px'}}>Select a tool to begin:</p>
      
      <div style={{marginBottom: '10px'}}>
        <Link to="/road-risk" style={{
          display: 'block',
          background: 'blue',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          Road Risk Assessment
        </Link>
      </div>
      
      <div>
        <Link to="/culvert-sizing" style={{
          display: 'block',
          background: 'green',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center'
        }}>
          Culvert Sizing Tool
        </Link>
      </div>
      
      <div style={{marginTop: '30px'}}>
        <h2 style={{fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '15px'}}>
          Recent Drafts
        </h2>
        
        {(!savedForms.roadRisk && !savedForms.culvertSizing) ? (
          <p style={{color: '#666', fontStyle: 'italic'}}>No saved drafts found.</p>
        ) : (
          <div>
            {savedForms.roadRisk && (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '10px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 'bold'}}>
                    {savedForms.roadRisk.title || 'Untitled Road Risk Assessment'}
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    backgroundColor: '#e6f7ff',
                    color: '#0066cc',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
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
                    color: 'blue',
                    textDecoration: 'none'
                  }}>
                    Continue editing →
                  </Link>
                </div>
              </div>
            )}
            
            {savedForms.culvertSizing && (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '12px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 'bold'}}>
                    {savedForms.culvertSizing.title || 'Untitled Culvert Sizing'}
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    backgroundColor: '#e6ffed',
                    color: '#006633',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
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
                    color: 'green',
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