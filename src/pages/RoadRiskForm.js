import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RoadRiskForm.css';

function RoadRiskForm() {
  // State for active section
  const [activeSection, setActiveSection] = useState('basic');
  
  // State for basic information
  const [basicInfo, setBasicInfo] = useState(() => {
    // Load from localStorage if available, otherwise use default values
    const savedInfo = localStorage.getItem('roadRiskBasicInfo');
    return savedInfo ? JSON.parse(savedInfo) : {
      roadName: '',
      startKm: '',
      endKm: '',
      startLat: '',
      startLong: '',
      endLat: '',
      endLong: '',
      assessmentDate: new Date().toISOString().split('T')[0],
      assessor: ''
    };
  });
  
  // Save basic info to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('roadRiskBasicInfo', JSON.stringify(basicInfo));
  }, [basicInfo]);
  
  // Handle basic info input changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Use GPS location for coordinates
  const handleUseGpsLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBasicInfo(prev => ({
            ...prev,
            startLat: position.coords.latitude.toFixed(6),
            startLong: position.coords.longitude.toFixed(6)
          }));
          alert('GPS coordinates captured successfully!');
        },
        (error) => {
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser/device');
    }
  };
  
  // Save form progress
  const handleSaveProgress = () => {
    // For now, we're just saving to localStorage which happens automatically via useEffect
    alert('Progress saved successfully!');
  };
  
  // Reset form fields
  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset all form fields? This cannot be undone.')) {
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
      // In future steps, we'll add reset logic for other form sections too
      alert('Form has been reset.');
    }
  };

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
          
          <div className="input-group">
            <div className="form-field">
              <label htmlFor="roadName" className="form-label">Road Name/Number:</label>
              <input
                type="text"
                id="roadName"
                name="roadName"
                value={basicInfo.roadName}
                onChange={handleBasicInfoChange}
                className="form-input"
                placeholder="Enter road name or number"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="assessmentDate" className="form-label">Assessment Date:</label>
              <input
                type="date"
                id="assessmentDate"
                name="assessmentDate"
                value={basicInfo.assessmentDate}
                onChange={handleBasicInfoChange}
                className="form-input"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="assessor" className="form-label">Assessor Name:</label>
              <input
                type="text"
                id="assessor"
                name="assessor"
                value={basicInfo.assessor}
                onChange={handleBasicInfoChange}
                className="form-input"
                placeholder="Your name"
              />
            </div>
          </div>
          
          <div className="input-group">
            <div className="form-field">
              <label htmlFor="startKm" className="form-label">Starting Kilometer:</label>
              <input
                type="number"
                id="startKm"
                name="startKm"
                value={basicInfo.startKm}
                onChange={handleBasicInfoChange}
                className="form-input"
                placeholder="0.0"
                step="0.1"
                min="0"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="endKm" className="form-label">Ending Kilometer:</label>
              <input
                type="number"
                id="endKm"
                name="endKm"
                value={basicInfo.endKm}
                onChange={handleBasicInfoChange}
                className="form-input"
                placeholder="0.0"
                step="0.1"
                min="0"
              />
            </div>
          </div>
          
          <div className="coordinate-container">
            <h3 className="coordinate-header">Coordinates</h3>
            
            <div className="coordinate-group">
              <h4 className="coordinate-subheader">Start Point</h4>
              <div className="input-group">
                <div className="form-field">
                  <label htmlFor="startLat" className="form-label">Latitude:</label>
                  <input
                    type="text"
                    id="startLat"
                    name="startLat"
                    value={basicInfo.startLat}
                    onChange={handleBasicInfoChange}
                    className="form-input"
                    placeholder="00.000000"
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="startLong" className="form-label">Longitude:</label>
                  <input
                    type="text"
                    id="startLong"
                    name="startLong"
                    value={basicInfo.startLong}
                    onChange={handleBasicInfoChange}
                    className="form-input"
                    placeholder="00.000000"
                  />
                </div>
              </div>
              
              <button 
                type="button" 
                className="gps-button" 
                onClick={handleUseGpsLocation}
              >
                Use Current GPS Location
              </button>
            </div>
            
            <div className="coordinate-group">
              <h4 className="coordinate-subheader">End Point</h4>
              <div className="input-group">
                <div className="form-field">
                  <label htmlFor="endLat" className="form-label">Latitude:</label>
                  <input
                    type="text"
                    id="endLat"
                    name="endLat"
                    value={basicInfo.endLat}
                    onChange={handleBasicInfoChange}
                    className="form-input"
                    placeholder="00.000000"
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="endLong" className="form-label">Longitude:</label>
                  <input
                    type="text"
                    id="endLong"
                    name="endLong"
                    value={basicInfo.endLong}
                    onChange={handleBasicInfoChange}
                    className="form-input"
                    placeholder="00.000000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="section-nav-buttons">
            <div></div> {/* Empty div for spacing */}
            <button 
              type="button" 
              className="section-nav-button next"
              onClick={() => setActiveSection('hazard')}
            >
              Next: Hazard Factors
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
            Evaluate the physical conditions that could contribute to road instability or failure.
          </p>
          
          <div className="form-placeholder">
            <p>Hazard factors assessment will be implemented here in the next step.</p>
            <ul>
              <li>Hillslope Gradient</li>
              <li>Connectivity to Stream</li>
              <li>History of Past Slides</li>
              <li>Road Gradient</li>
              <li>Road Width</li>
              <li>Runout Zones</li>
            </ul>
          </div>
          
          <div className="section-nav-buttons">
            <button 
              type="button" 
              className="section-nav-button prev"
              onClick={() => setActiveSection('basic')}
            >
              Previous: Basic Information
            </button>
            <button 
              type="button" 
              className="section-nav-button next"
              onClick={() => setActiveSection('consequence')}
            >
              Next: Consequence Factors
            </button>
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
          
          <div className="section-nav-buttons">
            <button 
              type="button" 
              className="section-nav-button prev"
              onClick={() => setActiveSection('hazard')}
            >
              Previous: Hazard Factors
            </button>
            <button 
              type="button" 
              className="section-nav-button next"
              onClick={() => setActiveSection('optional')}
            >
              Next: Optional Assessments
            </button>
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
          
          <div className="section-nav-buttons">
            <button 
              type="button" 
              className="section-nav-button prev"
              onClick={() => setActiveSection('consequence')}
            >
              Previous: Consequence Factors
            </button>
            <button 
              type="button" 
              className="section-nav-button next"
              onClick={() => setActiveSection('results')}
            >
              Next: Results
            </button>
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
          
          <div className="section-nav-buttons">
            <button 
              type="button" 
              className="section-nav-button prev"
              onClick={() => setActiveSection('optional')}
            >
              Previous: Optional Assessments
            </button>
            <div></div> {/* Empty div for spacing */}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="form-actions">
        <button 
          className="action-button primary"
          onClick={handleSaveProgress}
        >
          Save Progress
        </button>
        <button 
          className="action-button secondary"
          onClick={handleResetForm}
        >
          Reset Form
        </button>
        <Link to="/" className="action-button tertiary">Return to Home</Link>
      </div>
    </div>
  );
}

export default RoadRiskForm;
