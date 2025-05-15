import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RoadRiskForm.css';

function RoadRiskForm() {
  // Basic form state hooks will go here
  const [activeSection, setActiveSection] = useState('basic'); // Track which section is active

  return (
    <div className="road-risk-form">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Road Risk Assessment</span>
      </div>
      
      <h1 className="form-title">Road Risk Assessment</h1>
      
      {/* Form Section Navigation */}
      <div className="form-nav">
        <button 
          className={`form-nav-button ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          Basic Information
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'hazard' ? 'active' : ''}`}
          onClick={() => setActiveSection('hazard')}
        >
          Hazard Factors
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'consequence' ? 'active' : ''}`}
          onClick={() => setActiveSection('consequence')}
        >
          Consequence Factors
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'optional' ? 'active' : ''}`}
          onClick={() => setActiveSection('optional')}
        >
          Optional Assessments
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'results' ? 'active' : ''}`}
          onClick={() => setActiveSection('results')}
        >
          Results
        </button>
      </div>
      
      {/* Basic Information Section */}
      {activeSection === 'basic' && (
        <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
          <h2 className="section-header" style={{ color: '#2196f3' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
            Basic Information
          </h2>
          
          <p className="section-description">
            Enter the general information about the road segment being assessed.
          </p>
          
          <div className="form-placeholder">
            <p>Basic information form will be implemented here.</p>
            <ul>
              <li>Road Name/Number</li>
              <li>Assessment Date</li>
              <li>Assessor Name</li>
              <li>Location Coordinates</li>
              <li>Road Segment Length</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Hazard Factors Section */}
      {activeSection === 'hazard' && (
        <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
          <h2 className="section-header" style={{ color: '#ff9800' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #ff9800, #ffb74d)' }}></span>
            Hazard Factors
          </h2>
          
          <p className="section-description">
            Evaluate the physical conditions that could contribute to road instability or failure.
          </p>
          
          <div className="form-placeholder">
            <p>Hazard factors assessment will be implemented here.</p>
            <ul>
              <li>Hillslope Gradient</li>
              <li>Connectivity to Stream</li>
              <li>History of Past Slides</li>
              <li>Road Gradient</li>
              <li>Road Width</li>
              <li>Runout Zones</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Consequence Factors Section */}
      {activeSection === 'consequence' && (
        <div className="form-section" style={{ borderTop: '4px solid #9c27b0' }}>
          <h2 className="section-header" style={{ color: '#9c27b0' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #9c27b0, #ba68c8)' }}></span>
            Consequence Factors
          </h2>
          
          <p className="section-description">
            Evaluate the potential impacts if a road failure were to occur.
          </p>
          
          <div className="form-placeholder">
            <p>Consequence factors assessment will be implemented here.</p>
            <ul>
              <li>Water Quality</li>
              <li>Public Safety</li>
              <li>Forest Values</li>
              <li>Infrastructure Values</li>
              <li>Environmental Value</li>
              <li>Public/Industrial Use</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Optional Assessments Section */}
      {activeSection === 'optional' && (
        <div className="form-section" style={{ borderTop: '4px solid #00bcd4' }}>
          <h2 className="section-header" style={{ color: '#00bcd4' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #00bcd4, #4dd0e1)' }}></span>
            Optional Assessments
          </h2>
          
          <p className="section-description">
            Additional assessments for more detailed evaluation.
          </p>
          
          <div className="form-placeholder">
            <p>Optional assessments will be implemented here.</p>
            <ul>
              <li>Geotechnical Considerations</li>
              <li>Infrastructure Elements</li>
              <li>Photo Documentation</li>
              <li>Comments & Observations</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Results Section */}
      {activeSection === 'results' && (
        <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
          <h2 className="section-header" style={{ color: '#4caf50' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
            Assessment Results
          </h2>
          
          <p className="section-description">
            View the risk assessment results and recommendations.
          </p>
          
          <div className="form-placeholder">
            <p>Results summary will be displayed here.</p>
            <ul>
              <li>Hazard Score</li>
              <li>Consequence Score</li>
              <li>Overall Risk Rating</li>
              <li>Professional Resource Requirements</li>
              <li>Recommended Actions</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="form-actions">
        <button className="action-button primary">Save Progress</button>
        <button className="action-button secondary">Reset Form</button>
        <Link to="/" className="action-button tertiary">Return to Home</Link>
      </div>
    </div>
  );
}

export default RoadRiskForm;
