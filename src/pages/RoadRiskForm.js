import React from 'react';
import { Link } from 'react-router-dom';

function RoadRiskForm() {
  return (
    <div className="road-risk-form">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Road Risk Assessment</span>
      </div>
      
      <h1>Road Risk Assessment</h1>
      
      <p>This form is currently being rebuilt. Please check back later.</p>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#2e7d32',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default RoadRiskForm;
