import React, { useState } from 'react';
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

  // Handle input changes for basic info
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to get current location
  const getCurrentLocation = (positionType) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          
          if (positionType === 'start') {
            setBasicInfo(prev => ({
              ...prev,
              startLat: lat.toFixed(6),
              startLong: long.toFixed(6)
            }));
          } else if (positionType === 'end') {
            setBasicInfo(prev => ({
              ...prev,
              endLat: lat.toFixed(6),
              endLong: long.toFixed(6)
            }));
          }
        },
        (error) => {
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handler for saving assessment
  const handleSaveAssessment = () => {
    // Validate required fields
    if (!basicInfo.roadName || !basicInfo.assessor) {
      alert("Please fill in required fields (Road Name and Assessor) before saving.");
      return;
    }
    
    // Create unique ID for assessment
    const assessmentId = id || `road-risk-${Date.now()}`;
    
    // Build assessment object
    const assessment = {
      id: assessmentId,
      type: 'roadRisk',
      dateCreated: new Date().toISOString(),
      data: {
        basicInfo: { ...basicInfo },
        // Include other data properties from other sections
      },
      status: 'completed'
    };
    
    // Get existing history or initialize empty array
    const historyData = localStorage.getItem('assessmentHistory');
    const assessmentHistory = historyData ? JSON.parse(historyData) : [];
    
    // Add new assessment or update existing one
    const updatedHistory = isNewAssessment
      ? [assessment, ...assessmentHistory]
      : assessmentHistory.map(item => item.id === id ? assessment : item);
    
    // Save to localStorage
    localStorage.setItem('assessmentHistory', JSON.stringify(updatedHistory));
    
    // Navigate to history page
    navigate('/history');
    
    // Show confirmation message
    alert('Assessment saved successfully!');
  };
  
  // Handler for saving as draft
  const handleSaveDraft = () => {
    // Create unique ID for the draft
    const draftId = id || `road-risk-draft-${Date.now()}`;
    
    // Build draft assessment object
    const draft = {
      id: draftId,
      type: 'roadRisk',
      dateCreated: new Date().toISOString(),
      data: {
        basicInfo: { ...basicInfo }
        // Include other data properties from other sections
      },
      status: 'draft'
    };
    
    // Get existing drafts or initialize empty array
    const draftsData = localStorage.getItem('assessmentDrafts');
    const assessmentDrafts = draftsData ? JSON.parse(draftsData) : [];
    
    // Add new draft or update existing one
    const updatedDrafts = isNewAssessment
      ? [draft, ...assessmentDrafts]
      : assessmentDrafts.map(item => item.id === id ? draft : item);
    
    // Save to localStorage
    localStorage.setItem('assessmentDrafts', JSON.stringify(updatedDrafts));
    
    // Show confirmation message
    alert('Draft saved successfully!');
  };
  
  // Handler for resetting form
  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
      // Reset basic info
      setBasicInfo({
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
      
      // Reset active section to 'basic'
      setActiveSection('basic');
    }
  };

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
            <h2 className="section-header" style={{ color: '#2196f3' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
              Basic Information
            </h2>
            
            <p className="section-description">
              Enter the general information about the road segment being assessed.
            </p>
            
            {/* Road Name Field */}
            <div className="form-group">
              <label htmlFor="roadName" className="form-label">Road Name/ID <span className="required">*</span></label>
              <input 
                type="text" 
                id="roadName" 
                name="roadName" 
                className="form-input" 
                value={basicInfo.roadName} 
                onChange={handleBasicInfoChange}
                placeholder="Enter road name or identifier" 
                required
              />
            </div>
            
            {/* Road Segment Information */}
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="startKm" className="form-label">Start KM</label>
                <input 
                  type="number" 
                  id="startKm" 
                  name="startKm" 
                  className="form-input" 
                  value={basicInfo.startKm} 
                  onChange={handleBasicInfoChange} 
                  placeholder="Starting kilometer"
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endKm" className="form-label">End KM</label>
                <input 
                  type="number" 
                  id="endKm" 
                  name="endKm" 
                  className="form-input" 
                  value={basicInfo.endKm} 
                  onChange={handleBasicInfoChange} 
                  placeholder="Ending kilometer"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>
            
            {/* GPS Coordinates - Start */}
            <div className="form-subheader">
              <h3>Start Location Coordinates</h3>
              <button 
                type="button" 
                className="gps-button"
                onClick={() => getCurrentLocation('start')}
              >
                Get Current GPS
              </button>
            </div>
            
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="startLat" className="form-label">Latitude</label>
                <input 
                  type="text" 
                  id="startLat" 
                  name="startLat" 
                  className="form-input" 
                  value={basicInfo.startLat} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. 49.123456"
                />
              </div>
              <div className="form-group">
                <label htmlFor="startLong" className="form-label">Longitude</label>
                <input 
                  type="text" 
                  id="startLong" 
                  name="startLong" 
                  className="form-input" 
                  value={basicInfo.startLong} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. -123.123456"
                />
              </div>
            </div>
            
            {/* GPS Coordinates - End */}
            <div className="form-subheader">
              <h3>End Location Coordinates</h3>
              <button 
                type="button" 
                className="gps-button"
                onClick={() => getCurrentLocation('end')}
              >
                Get Current GPS
              </button>
            </div>
            
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="endLat" className="form-label">Latitude</label>
                <input 
                  type="text" 
                  id="endLat" 
                  name="endLat" 
                  className="form-input" 
                  value={basicInfo.endLat} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. 49.123456"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endLong" className="form-label">Longitude</label>
                <input 
                  type="text" 
                  id="endLong" 
                  name="endLong" 
                  className="form-input" 
                  value={basicInfo.endLong} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. -123.123456"
                />
              </div>
            </div>
            
            {/* Assessment Details */}
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="assessmentDate" className="form-label">Assessment Date</label>
                <input 
                  type="date" 
                  id="assessmentDate" 
                  name="assessmentDate" 
                  className="form-input" 
                  value={basicInfo.assessmentDate} 
                  onChange={handleBasicInfoChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="assessor" className="form-label">Assessor Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="assessor" 
                  name="assessor" 
                  className="form-input" 
                  value={basicInfo.assessor} 
                  onChange={handleBasicInfoChange} 
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            
            <div className="section-divider"></div>
            
            {/* Navigation guidance */}
            <div className="navigation-hint">
              <p>Fill out the basic information and continue to the Hazard Factors section.</p>
              <button 
                className="form-nav-forward"
                onClick={() => setActiveSection('hazard')}
              >
                Continue to Hazard Factors
              </button>
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
              Assess the hazard factors for this road segment. Each factor contributes to the overall risk assessment.
            </p>
            
            {/* Placeholder for hazard factors - will implement in next phase */}
            <div className="form-placeholder">
              <p>Hazard factors assessment will be implemented in the next phase.</p>
              <p>This will include factors such as:</p>
              <ul>
                <li>Slope stability</li>
                <li>Drainage patterns</li>
                <li>Road surface condition</li>
                <li>Traffic volume</li>
              </ul>
            </div>
            
            <div className="navigation-hint">
              <div className="nav-buttons-container">
                <button 
                  className="form-nav-back"
                  onClick={() => setActiveSection('basic')}
                >
                  Back to Basic Information
                </button>
                <button 
                  className="form-nav-forward"
                  onClick={() => setActiveSection('consequence')}
                >
                  Continue to Consequence Factors
                </button>
              </div>
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
              Assess the potential consequences if a failure were to occur on this road segment.
            </p>
            
            {/* Placeholder for consequence factors - will implement in next phase */}
            <div className="form-placeholder">
              <p>Consequence factors assessment will be implemented in the next phase.</p>
              <p>This will include factors such as:</p>
              <ul>
                <li>Downstream resources at risk</li>
                <li>Public safety risk</li>
                <li>Environmental impact</li>
                <li>Economic consequences</li>
              </ul>
            </div>
            
            <div className="navigation-hint">
              <div className="nav-buttons-container">
                <button 
                  className="form-nav-back"
                  onClick={() => setActiveSection('hazard')}
                >
                  Back to Hazard Factors
                </button>
                <button 
                  className="form-nav-forward"
                  onClick={() => setActiveSection('optional')}
                >
                  Continue to Optional Assessments
                </button>
              </div>
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
              Additional assessments that may be relevant for this road segment.
            </p>
            
            {/* Placeholder for optional assessments - will implement in next phase */}
            <div className="form-placeholder">
              <p>Optional assessments will be implemented in the next phase.</p>
              <p>This may include:</p>
              <ul>
                <li>Geotechnical considerations</li>
                <li>Culvert and drainage structures</li>
                <li>Wildlife considerations</li>
                <li>Recreational use impacts</li>
              </ul>
            </div>
            
            <div className="navigation-hint">
              <div className="nav-buttons-container">
                <button 
                  className="form-nav-back"
                  onClick={() => setActiveSection('consequence')}
                >
                  Back to Consequence Factors
                </button>
                <button 
                  className="form-nav-forward"
                  onClick={() => setActiveSection('results')}
                >
                  Continue to Results
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Section */}
        {activeSection === 'results' && (
          <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
            <h2 className="section-header" style={{ color: '#4caf50' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
              Results
            </h2>
            
            <p className="section-description">
              Review your assessment results and recommended actions.
            </p>
            
            {/* Placeholder for results - will implement in next phase */}
            <div className="form-placeholder">
              <p>Results calculation and display will be implemented in the next phase.</p>
              <p>This will include:</p>
              <ul>
                <li>Overall risk score</li>
                <li>Risk classification</li>
                <li>Recommended actions</li>
                <li>PDF report generation</li>
              </ul>
            </div>
            
            <div className="navigation-hint">
              <button 
                className="form-nav-back"
                onClick={() => setActiveSection('optional')}
              >
                Back to Optional Assessments
              </button>
            </div>
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