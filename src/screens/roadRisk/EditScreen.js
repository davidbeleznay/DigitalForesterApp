import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles/RoadRiskForm.css';

function EditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewAssessment = !id; // If no id passed, it's a new assessment
  
  // State for active section
  const [activeSection, setActiveSection] = useState('basic');
  
  // State for basic information
  const [basicInfo, setBasicInfo] = useState({
    roadName: '',
    startKm: '',
    endKm: '',
    startLat: '',
    startLong: '',
    endLat: '',
    endLong: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: ''
  });

  // Rest of the component state and functions remain the same...
  // (Keeping this comment brief to focus on the UI changes)

  // Modified render for action buttons
  return (
    <div className="road-risk-form">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Road Risk Assessment</span>
      </div>
      
      <h1 className="form-title">
        {isNewAssessment ? 'New Road Risk Assessment' : `Edit: ${basicInfo.roadName || 'Untitled Assessment'}`}
      </h1>
      
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
      
      {/* Form Content Sections */}
      <div className="form-content-container">
        {/* Basic Information Section */}
        {activeSection === 'basic' && (
          <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
            {/* Content remains the same */}
            <h2 className="section-header" style={{ color: '#2196f3' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
              Basic Information
            </h2>
            
            <p className="section-description">
              Enter the general information about the road segment being assessed.
            </p>
            
            {/* Form fields remain the same */}
          </div>
        )}
        
        {/* Hazard Factors Section */}
        {activeSection === 'hazard' && (
          <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
            {/* Content remains the same */}
          </div>
        )}
        
        {/* Consequence Factors Section */}
        {activeSection === 'consequence' && (
          <div className="form-section" style={{ borderTop: '4px solid #9c27b0' }}>
            {/* Content remains the same */}
          </div>
        )}
        
        {/* Optional Assessments Section */}
        {activeSection === 'optional' && (
          <div className="form-section" style={{ borderTop: '4px solid #00bcd4' }}>
            {/* Content remains the same */}
          </div>
        )}
        
        {/* Results Section */}
        {activeSection === 'results' && (
          <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
            {/* Content remains the same */}
          </div>
        )}
      </div>
      
      {/* Fixed Action Bar at Bottom */}
      <div className="fixed-action-bar">
        <div className="fixed-action-bar-content">
          <button 
            className="form-action-button primary"
            onClick={handleSaveAssessment}
          >
            Save Assessment
          </button>
          <button 
            className="form-action-button secondary"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
          <button 
            className="form-action-button danger"
            onClick={handleResetForm}
          >
            Reset Form
          </button>
          <Link to="/" className="form-action-button tertiary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default EditScreen;