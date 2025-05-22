import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OptionalAssessments from '../components/OptionalAssessments';
import { saveFormData, loadFormData, saveToHistory } from '../utils/storageUtils';
import '../styles/RoadRiskForm.css';

const RoadRiskForm = () => {
  const navigate = useNavigate();
  const formStorageKey = 'road-risk-form-draft';
  
  // Basic information state
  const [basicInfo, setBasicInfo] = useState({
    roadName: '',
    location: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: '',
    roadClass: '',
    totalLength: '',
    surfaceType: '',
    lastMaintenance: '',
    maintenanceType: ''
  });
  
  // Optional assessments toggle state
  const [optionalAssessments, setOptionalAssessments] = useState({
    soils: false,
    drainage: false,
    vegetation: false
  });
  
  // Assessment data state
  const [assessmentData, setAssessmentData] = useState({
    soils: {
      soilType: '',
      soilDepth: '',
      organicContent: '',
      moistureRegime: '',
      slopeClass: '',
      stabilityHistory: '',
      erosionRisk: '',
      comments: ''
    },
    drainage: {
      culverts: [],
      waterCrossings: [],
      drainagePatterns: '',
      surfaceWater: '',
      ditchConditions: '',
      culvertMaintenance: '',
      comments: ''
    },
    vegetation: {
      forestType: '',
      dominantSpecies: '',
      understoryDensity: '',
      comments: ''
    }
  });
  
  // Form status state
  const [formSaved, setFormSaved] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  // Load saved form data on initial render
  useEffect(() => {
    const savedData = loadFormData(formStorageKey);
    if (savedData) {
      setBasicInfo(savedData.basicInfo || basicInfo);
      setOptionalAssessments(savedData.optionalAssessments || optionalAssessments);
      setAssessmentData(savedData.assessmentData || assessmentData);
    }
  }, []);
  
  // Autosave form data on changes
  useEffect(() => {
    if (basicInfo.roadName) { // Only save if there's at least a road name
      saveFormData(formStorageKey, {
        basicInfo,
        optionalAssessments,
        assessmentData
      });
      setFormSaved(true);
      
      // Hide saved indicator after 3 seconds
      setTimeout(() => {
        setFormSaved(false);
      }, 3000);
    }
  }, [basicInfo, optionalAssessments, assessmentData]);
  
  // Event handlers for basic info
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handler for toggling optional assessment sections
  const handleToggleAssessment = (assessmentKey) => {
    setOptionalAssessments(prev => ({
      ...prev,
      [assessmentKey]: !prev[assessmentKey]
    }));
  };
  
  // Handler for updating assessment data
  const handleUpdateAssessmentData = (assessmentKey, newData) => {
    setAssessmentData(prev => ({
      ...prev,
      [assessmentKey]: newData
    }));
  };
  
  // Save assessment to history
  const handleSaveAssessment = () => {
    const assessmentToSave = {
      basicInfo,
      optionalAssessments,
      assessmentData,
      savedAt: new Date().toISOString()
    };
    
    saveToHistory('road-risk', assessmentToSave);
    setShowSavedMessage(true);
    
    // Clear the autosave data
    localStorage.removeItem(formStorageKey);
    
    // Hide saved message after 3 seconds
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };
  
  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      setBasicInfo({
        roadName: '',
        location: '',
        assessmentDate: new Date().toISOString().split('T')[0],
        assessor: '',
        roadClass: '',
        totalLength: '',
        surfaceType: '',
        lastMaintenance: '',
        maintenanceType: ''
      });
      
      setOptionalAssessments({
        soils: false,
        drainage: false,
        vegetation: false
      });
      
      setAssessmentData({
        soils: {
          soilType: '',
          soilDepth: '',
          organicContent: '',
          moistureRegime: '',
          slopeClass: '',
          stabilityHistory: '',
          erosionRisk: '',
          comments: ''
        },
        drainage: {
          culverts: [],
          waterCrossings: [],
          drainagePatterns: '',
          surfaceWater: '',
          ditchConditions: '',
          culvertMaintenance: '',
          comments: ''
        },
        vegetation: {
          forestType: '',
          dominantSpecies: '',
          understoryDensity: '',
          comments: ''
        }
      });
      
      // Clear autosave data
      localStorage.removeItem(formStorageKey);
    }
  };
  
  // Form validation
  const isFormValid = () => {
    // At minimum, road name is required
    return basicInfo.roadName.trim() !== '';
  };
  
  return (
    <div className="road-risk-form">
      <header className="form-header">
        <div className="header-content">
          <h1>Road Risk Assessment</h1>
          <div className="form-actions">
            <button 
              type="button" 
              className="secondary-button"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
            <button 
              type="button" 
              className="danger-button"
              onClick={handleReset}
            >
              Reset Form
            </button>
          </div>
        </div>
      </header>
      
      <div className="form-container">
        {showSavedMessage && (
          <div className="save-notification">
            Assessment saved successfully!
          </div>
        )}
        
        <form>
          {/* Basic Information */}
          <div className="form-section">
            <h2 className="section-header">Basic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roadName">Road Name/ID *</label>
                <input 
                  type="text" 
                  id="roadName" 
                  name="roadName" 
                  value={basicInfo.roadName}
                  onChange={handleBasicInfoChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={basicInfo.location}
                  onChange={handleBasicInfoChange}
                  className="form-input"
                  placeholder="GPS coordinates or description"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="assessmentDate">Assessment Date</label>
                <input 
                  type="date" 
                  id="assessmentDate" 
                  name="assessmentDate" 
                  value={basicInfo.assessmentDate}
                  onChange={handleBasicInfoChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="assessor">Assessor Name</label>
                <input 
                  type="text" 
                  id="assessor" 
                  name="assessor" 
                  value={basicInfo.assessor}
                  onChange={handleBasicInfoChange}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roadClass">Road Class</label>
                <select 
                  id="roadClass" 
                  name="roadClass" 
                  value={basicInfo.roadClass}
                  onChange={handleBasicInfoChange}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="spur">Spur</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="totalLength">Total Length (km)</label>
                <input 
                  type="text" 
                  id="totalLength" 
                  name="totalLength" 
                  value={basicInfo.totalLength}
                  onChange={handleBasicInfoChange}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="surfaceType">Surface Type</label>
                <select 
                  id="surfaceType" 
                  name="surfaceType" 
                  value={basicInfo.surfaceType}
                  onChange={handleBasicInfoChange}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="native">Native</option>
                  <option value="gravel">Gravel</option>
                  <option value="crushed-rock">Crushed Rock</option>
                  <option value="paved">Paved</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="lastMaintenance">Last Maintenance</label>
                <input 
                  type="date" 
                  id="lastMaintenance" 
                  name="lastMaintenance" 
                  value={basicInfo.lastMaintenance}
                  onChange={handleBasicInfoChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="maintenanceType">Maintenance Type</label>
                <select 
                  id="maintenanceType" 
                  name="maintenanceType" 
                  value={basicInfo.maintenanceType}
                  onChange={handleBasicInfoChange}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="grading">Grading</option>
                  <option value="resurfacing">Resurfacing</option>
                  <option value="culvert-replacement">Culvert Replacement</option>
                  <option value="ditch-clearing">Ditch Clearing</option>
                  <option value="brushing">Brushing</option>
                  <option value="deactivation">Deactivation</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Optional Assessments Component */}
          <OptionalAssessments 
            optionalAssessments={optionalAssessments}
            onToggleAssessment={handleToggleAssessment}
            assessmentData={assessmentData}
            onUpdateAssessmentData={handleUpdateAssessmentData}
          />
          
          {/* Form Actions */}
          <div className="form-actions-container">
            <div className="form-actions">
              <button 
                type="button" 
                className="primary-button"
                onClick={handleSaveAssessment}
                disabled={!isFormValid()}
              >
                Save Assessment
              </button>
            </div>
            
            {formSaved && (
              <div className="autosave-indicator">
                Draft automatically saved
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoadRiskForm;