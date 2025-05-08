import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/sharedStyles';

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
    <div style={styles.container}>
      <h1 style={styles.header}>Digital Forester App</h1>
      <p style={{marginBottom: '20px', color: '#4b5563'}}>
        Select a tool to begin your field assessment:
      </p>
      
      <div style={{display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'}}>
        <Link to="/road-risk" style={{
          ...styles.toolButton, 
          backgroundColor: '#2563eb',
          hover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }
        }}>
          <div style={{fontSize: '1.125rem', marginBottom: '8px'}}>Road Risk Assessment</div>
          <div style={{fontSize: '0.875rem', opacity: 0.9}}>Evaluate road conditions and climate impact risks</div>
        </Link>
        
        <Link to="/culvert-sizing" style={{
          ...styles.toolButton,
          backgroundColor: '#059669'
        }}>
          <div style={{fontSize: '1.125rem', marginBottom: '8px'}}>Culvert Sizing Tool</div>
          <div style={{fontSize: '0.875rem', opacity: 0.9}}>Calculate appropriate culvert dimensions</div>
        </Link>
      </div>
      
      <div style={styles.section}>
        <h2 style={{
          fontSize: '1.25rem', 
          color: '#1f2937', 
          marginBottom: '16px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '8px'
        }}>
          Recent Drafts
        </h2>
        
        {(!savedForms.roadRisk && !savedForms.culvertSizing) ? (
          <div style={{
            padding: '24px', 
            textAlign: 'center', 
            color: '#6b7280', 
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            border: '1px dashed #d1d5db'
          }}>
            <p style={{fontSize: '0.875rem', fontStyle: 'italic'}}>No saved drafts found. Start a new assessment above.</p>
          </div>
        ) : (
          <div style={{display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'}}>
            {savedForms.roadRisk && (
              <div style={{
                ...styles.card,
                borderLeft: '4px solid #2563eb'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 'bold', color: '#1f2937'}}>
                    {savedForms.roadRisk.title || 'Untitled Road Risk Assessment'}
                  </span>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    Road Risk
                  </span>
                </div>
                <div style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px', 
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <span>{savedForms.roadRisk.location || 'No location'}</span>
                  <span>{formatDate(savedForms.roadRisk.date)}</span>
                </div>
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <Link to="/road-risk" style={{
                    ...styles.link,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>Continue editing</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
            
            {savedForms.culvertSizing && (
              <div style={{
                ...styles.card,
                borderLeft: '4px solid #059669'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 'bold', color: '#1f2937'}}>
                    {savedForms.culvertSizing.title || 'Untitled Culvert Sizing'}
                  </span>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: '#d1fae5',
                    color: '#065f46'
                  }}>
                    Culvert Sizing
                  </span>
                </div>
                <div style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px', 
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <span>{savedForms.culvertSizing.location || 'No location'}</span>
                  <span>{formatDate(savedForms.culvertSizing.date)}</span>
                </div>
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <Link to="/culvert-sizing" style={{
                    ...styles.link,
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>Continue editing</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer style={{
        marginTop: '48px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p>Digital Forester App © 2025 | Field forms for forestry professionals</p>
      </footer>
    </div>
  );
}

export default Dashboard;