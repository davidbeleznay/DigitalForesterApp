import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';
import PDFExport from '../components/PDFExport';
import PhotoCapture from '../components/PhotoCapture';

// Default values for form reset
const defaultBasicInfo = {
  roadName: '',
  startKm: '',
  endKm: '',
  startLat: '',
  startLong: '',
  endLat: '',
  endLong: '',
  date: new Date().toISOString().split('T')[0],
  inspector: ''
};

const defaultHazardFactors = {
  terrainStability: 2,
  slopeGrade: 2,
  geologySoil: 2,
  drainageConditions: 2,
  roadFailureHistory: 2
};

const defaultConsequenceFactors = {
  proximityToWater: 2,
  drainageStructure: 2,
  publicIndustrialUse: 2,
  environmentalValue: 2
};

const defaultGeotechnicalFactors = {
  cutSlopeHeight: 2,
  fillSlopeHeight: 2,
  bedrockCondition: 2,
  groundwaterConditions: 2,
  erosionEvidence: 2
};

const defaultInfrastructureFactors = {
  roadSurfaceType: 2,
  ditchCondition: 2,
  culvertSizing: 2,
  culvertCondition: 2,
  roadAge: 2
};

// Risk level colors
const riskColors = {
  veryLow: { bg: '#e6f7ff', text: '#0066cc' },
  low: { bg: '#d4edda', text: '#155724' },
  moderate: { bg: '#fff3cd', text: '#856404' },
  high: { bg: '#ffe0b2', text: '#e65100' },
  veryHigh: { bg: '#f8d7da', text: '#721c24' }
};

function RoadRiskForm() {
  const navigate = useNavigate();
  const pdfRef = useRef();
  const { toPDF, targetRef } = usePDF({filename: 'road-risk-assessment.pdf'});
  
  // Basic info state
  const [basicInfo, setBasicInfo] = useState({...defaultBasicInfo});
  
  // Hazard factors state
  const [hazardFactors, setHazardFactors] = useState({...defaultHazardFactors});
  
  // Consequence factors state
  const [consequenceFactors, setConsequenceFactors] = useState({...defaultConsequenceFactors});
  
  // Additional factors toggle
  const [showAdditionalFactors, setShowAdditionalFactors] = useState(false);
  
  // Geotechnical considerations
  const [geotechnicalFactors, setGeotechnicalFactors] = useState({...defaultGeotechnicalFactors});
  
  // Infrastructure elements
  const [infrastructureFactors, setInfrastructureFactors] = useState({...defaultInfrastructureFactors});
  
  // Photos
  const [photos, setPhotos] = useState([]);
  
  // General comments
  const [comments, setComments] = useState('');
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState('');
  
  // Show PDF preview
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  
  // Calculate risk scores
  const getTotalHazardScore = () => {
    return Object.values(hazardFactors).reduce((sum, score) => sum + score, 0);
  };
  
  const getTotalConsequenceScore = () => {
    return Object.values(consequenceFactors).reduce((sum, score) => sum + score, 0);
  };
  
  const getRiskScore = () => {
    return getTotalHazardScore() * getTotalConsequenceScore();
  };
  
  // Updated distribution with logarithmic approach
  const getRiskCategory = (score) => {
    if (score > 1000) return { category: 'Very High', color: riskColors.veryHigh };
    if (score >= 500 && score <= 1000) return { category: 'High', color: riskColors.high };
    if (score >= 250 && score < 500) return { category: 'Moderate', color: riskColors.moderate };
    if (score >= 150 && score < 250) return { category: 'Low', color: riskColors.low };
    return { category: 'Very Low', color: riskColors.veryLow };
  };
  
  const getRequirements = (category) => {
    switch(category) {
      case 'Very High':
        return 'Full professional team with CRP and specialist PORs. Geometric design required. Multiple field reviews.';
      case 'High':
        return 'CRP and road activity POR (may be same person for simple roads). Specialist consultation. Field reviews at critical stages.';
      case 'Moderate':
        return 'CRP and road activity POR oversight. Standard designs with field verification.';
      case 'Low':
        return 'Standard oversight by qualified professionals. Routine field reviews.';
      case 'Very Low':
        return 'Routine professional oversight.';
      default:
        return '';
    }
  };
  
  // Handle basic info changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    const updatedBasicInfo = {
      ...basicInfo,
      [name]: value
    };
    setBasicInfo(updatedBasicInfo);
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      basicInfo: updatedBasicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors,
      comments,
      photos
    });
  };
  
  // Handle hazard factor changes
  const handleHazardChange = (e) => {
    const { name, value } = e.target;
    const updatedHazardFactors = {
      ...hazardFactors,
      [name]: parseInt(value)
    };
    setHazardFactors(updatedHazardFactors);
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      basicInfo,
      hazardFactors: updatedHazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors,
      comments,
      photos
    });
  };
  
  // Handle consequence factor changes
  const handleConsequenceChange = (e) => {
    const { name, value } = e.target;
    const updatedConsequenceFactors = {
      ...consequenceFactors,
      [name]: parseInt(value)
    };
    setConsequenceFactors(updatedConsequenceFactors);
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors: updatedConsequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors,
      comments,
      photos
    });
  };
  
  // Handle geotechnical factor changes
  const handleGeotechnicalChange = (e) => {
    const { name, value } = e.target;
    const updatedGeotechnicalFactors = {
      ...geotechnicalFactors,
      [name]: parseInt(value)
    };
    setGeotechnicalFactors(updatedGeotechnicalFactors);
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors: updatedGeotechnicalFactors,
      infrastructureFactors,
      comments,
      photos
    });
  };
  
  // Handle infrastructure factor changes
  const handleInfrastructureChange = (e) => {
    const { name, value } = e.target;
    const updatedInfrastructureFactors = {
      ...infrastructureFactors,
      [name]: parseInt(value)
    };
    setInfrastructureFactors(updatedInfrastructureFactors);
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors: updatedInfrastructureFactors,
      comments,
      photos
    });
  };
  
  // Handle additional factors toggle
  const handleToggleAdditionalFactors = () => {
    const newValue = !showAdditionalFactors;
    setShowAdditionalFactors(newValue);
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors: newValue,
      geotechnicalFactors,
      infrastructureFactors,
      comments,
      photos
    });
  };
  
  // Handle comments change
  const handleCommentsChange = (e) => {
    const newComments = e.target.value;
    setComments(newComments);
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors,
      comments: newComments,
      photos
    });
  };
  
  // Handle photo capture
  const handlePhotoCapture = (capturedPhotos) => {
    setPhotos(capturedPhotos);
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors,
      comments,
      photos: capturedPhotos
    });
  };
  
  // Mock function to simulate getting current location
  const handleGetLocation = (position) => {
    // In a real implementation, this would use the browser's geolocation API
    // For now we'll just simulate with random coordinates
    const lat = (Math.random() * (49.5 - 48.5) + 48.5).toFixed(6);
    const long = (-Math.random() * (123.5 - 122.5) - 122.5).toFixed(6);
    
    let updatedBasicInfo;
    if (position === 'start') {
      updatedBasicInfo = {
        ...basicInfo,
        startLat: lat,
        startLong: long
      };
    } else {
      updatedBasicInfo = {
        ...basicInfo,
        endLat: lat,
        endLong: long
      };
    }
    
    setBasicInfo(updatedBasicInfo);
    
    // Auto-save to localStorage
    saveToLocalStorage({
      basicInfo: updatedBasicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors,
      comments,
      photos
    });
    
    setStatusMessage('Location captured successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };
  
  // Toggle PDF preview
  const handleTogglePDFPreview = () => {
    setShowPDFPreview(!showPDFPreview);
  };
  
  // Handle exporting PDF
  const handleExportPDF = () => {
    // Generate PDF
    toPDF();
    
    // Show success message
    setStatusMessage('PDF exported successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };
  
  // Save form data to localStorage
  const saveToLocalStorage = (formData) => {
    const completeFormData = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('roadRiskForm', JSON.stringify(completeFormData));
  };
  
  // Save assessment to history and clear form
  const handleSaveAssessment = () => {
    // Check if road name is provided (minimal validation)
    if (!basicInfo.roadName) {
      setStatusMessage('Please provide a road name before saving');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    
    // Save the assessment to history
    const assessmentData = {
      type: 'roadRisk',
      data: {
        basicInfo,
        hazardFactors,
        consequenceFactors,
        showAdditionalFactors,
        geotechnicalFactors,
        infrastructureFactors,
        comments,
        photos
      },
      photoCount: photos.length,
      inspector: basicInfo.inspector,
      completedAt: new Date().toISOString()
    };
    
    // Get existing history or initialize new array
    const existingHistory = localStorage.getItem('assessmentHistory');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Add new assessment to history
    history.unshift(assessmentData);
    
    // Save updated history
    localStorage.setItem('assessmentHistory', JSON.stringify(history));
    
    setStatusMessage('Assessment saved to history!');
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };
  
  // Save draft explicitly
  const handleSaveDraft = () => {
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors,
      comments,
      photos
    });
    
    setStatusMessage('Road risk assessment draft saved successfully!');
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };
  
  // Start a new assessment
  const handleNewAssessment = () => {
    // Reset all form fields to defaults
    setBasicInfo({...defaultBasicInfo});
    setHazardFactors({...defaultHazardFactors});
    setConsequenceFactors({...defaultConsequenceFactors});
    setShowAdditionalFactors(false);
    setGeotechnicalFactors({...defaultGeotechnicalFactors});
    setInfrastructureFactors({...defaultInfrastructureFactors});
    setComments('');
    setPhotos([]);
    
    // Clear the saved draft
    localStorage.removeItem('roadRiskForm');
    
    setStatusMessage('Started new assessment');
    setTimeout(() => setStatusMessage(''), 3000);
    
    // Scroll to top of form
    window.scrollTo(0, 0);
  };
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('roadRiskForm');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setBasicInfo(parsedData.basicInfo);
        setHazardFactors(parsedData.hazardFactors);
        setConsequenceFactors(parsedData.consequenceFactors);
        setShowAdditionalFactors(parsedData.showAdditionalFactors);
        setGeotechnicalFactors(parsedData.geotechnicalFactors);
        setInfrastructureFactors(parsedData.infrastructureFactors);
        setComments(parsedData.comments);
        if (parsedData.photos) {
          setPhotos(parsedData.photos);
        }
        
        setStatusMessage('Loaded saved draft');
        setTimeout(() => setStatusMessage(''), 3000);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);
  
  // Calculate risk values for display
  const hazardScore = getTotalHazardScore();
  const consequenceScore = getTotalConsequenceScore();
  const riskScore = getRiskScore();
  const { category: riskCategory, color: riskColor } = getRiskCategory(riskScore);
  const requirements = getRequirements(riskCategory);
  
  // PDF Export data
  const formData = {
    basicInfo,
    hazardFactors,
    consequenceFactors,
    comments,
    riskScore,
    riskCategory
  };
  
  // Helper function for rendering risk selection radios
  const renderRiskRadio = (name, value, onChange, score) => {
    return (
      <input
        type="radio"
        name={name}
        value={score}
        checked={value === score}
        onChange={onChange}
        style={{
          cursor: 'pointer',
          width: '18px',
          height: '18px'
        }}
      />
    );
  };
  
  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      {/* Hidden PDF component for export */}
      <div style={{display: 'none'}}>
        <PDFExport 
          ref={targetRef}
          formData={formData}
          riskScore={riskScore}
          riskCategory={riskCategory}
          riskColor={riskColor}
          requirements={requirements}
        />
      </div>
      
      {showPDFPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={handleTogglePDFPreview}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
            
            <PDFExport 
              formData={formData}
              riskScore={riskScore}
              riskCategory={riskCategory}
              riskColor={riskColor}
              requirements={requirements}
            />
          </div>
          
          <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
            <button 
              onClick={handleExportPDF}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Download PDF
            </button>
            
            <button 
              onClick={handleTogglePDFPreview}
              style={{
                backgroundColor: '#777',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
      
      <h1 style={{color: '#1976D2', marginBottom: '5px'}}>Road Risk Assessment</h1>
      <p style={{marginBottom: '20px', color: '#666'}}>Evaluate forest road conditions and identify potential hazards</p>
      
      {statusMessage && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724',
          marginBottom: '15px'
        }}>
          {statusMessage}
        </div>
      )}
      
      <form>
        {/* Basic Information Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '15px', color: '#1976D2'}}>Road Information</h2>
          
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
              Road Name <span style={{color: '#dc3545'}}>*</span>
            </label>
            <input 
              type="text"
              name="roadName"
              value={basicInfo.roadName}
              onChange={handleBasicInfoChange}
              placeholder="e.g., Forest Service Road #137"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '15px'}}>
            <div style={{flex: 1}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                Start KM
              </label>
              <input 
                type="number"
                name="startKm"
                value={basicInfo.startKm}
                onChange={handleBasicInfoChange}
                placeholder="e.g., 0.0"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div style={{flex: 1}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                End KM
              </label>
              <input 
                type="number"
                name="endKm"
                value={basicInfo.endKm}
                onChange={handleBasicInfoChange}
                placeholder="e.g., 2.5"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '15px'}}>
            <div style={{flex: 1}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                Start Coordinates
              </label>
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                  type="text"
                  name="startLat"
                  value={basicInfo.startLat}
                  onChange={handleBasicInfoChange}
                  placeholder="Latitude"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <input 
                  type="text"
                  name="startLong"
                  value={basicInfo.startLong}
                  onChange={handleBasicInfoChange}
                  placeholder="Longitude"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <button 
                  type="button"
                  onClick={() => handleGetLocation('start')}
                  style={{
                    backgroundColor: '#1976D2',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Get Location
                </button>
              </div>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '15px'}}>
            <div style={{flex: 1}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                End Coordinates
              </label>
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                  type="text"
                  name="endLat"
                  value={basicInfo.endLat}
                  onChange={handleBasicInfoChange}
                  placeholder="Latitude"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <input 
                  type="text"
                  name="endLong"
                  value={basicInfo.endLong}
                  onChange={handleBasicInfoChange}
                  placeholder="Longitude"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <button 
                  type="button"
                  onClick={() => handleGetLocation('end')}
                  style={{
                    backgroundColor: '#1976D2',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Get Location
                </button>
              </div>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', gap: '15px'}}>
            <div style={{flex: 1}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                Assessment Date
              </label>
              <input 
                type="date"
                name="date"
                value={basicInfo.date}
                onChange={handleBasicInfoChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div style={{flex: 1}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                Inspector Name
              </label>
              <input 
                type="text"
                name="inspector"
                value={basicInfo.inspector}
                onChange={handleBasicInfoChange}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Hazard Factors Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '5px', color: '#1976D2'}}>Hazard Factors (Likelihood)</h2>
          <p style={{marginBottom: '15px', color: '#666', fontSize: '0.9rem'}}>Select the appropriate score for each factor</p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '15px'}}>
              <thead>
                <tr style={{backgroundColor: '#e9ecef'}}>
                  <th style={{padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Factor</th>
                  <th style={{padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>2</th>
                  <th style={{padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>4</th>
                  <th style={{padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>6</th>
                  <th style={{padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>10</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Terrain Stability</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.terrainStability === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('terrainStability', hazardFactors.terrainStability, handleHazardChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Stable terrain<br/>(slopes &lt;40%)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.terrainStability === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('terrainStability', hazardFactors.terrainStability, handleHazardChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Moderately stable<br/>(slopes 40-60%)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.terrainStability === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('terrainStability', hazardFactors.terrainStability, handleHazardChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Potentially unstable<br/>(slopes &gt;60%)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.terrainStability === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('terrainStability', hazardFactors.terrainStability, handleHazardChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Unstable terrain<br/>(Class IV/V)</div>
                  </td>
                </tr>
                
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Slope Grade</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.slopeGrade === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('slopeGrade', hazardFactors.slopeGrade, handleHazardChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Low grade<br/>(&lt;8%)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.slopeGrade === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('slopeGrade', hazardFactors.slopeGrade, handleHazardChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Moderate grade<br/>(8-12%)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.slopeGrade === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('slopeGrade', hazardFactors.slopeGrade, handleHazardChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Steep grade<br/>(12-18%)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.slopeGrade === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('slopeGrade', hazardFactors.slopeGrade, handleHazardChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Very steep grade<br/>(&gt;18%)</div>
                  </td>
                </tr>
                
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Geology/Soil</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.geologySoil === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('geologySoil', hazardFactors.geologySoil, handleHazardChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Cohesive, stable soils/bedrock</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.geologySoil === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('geologySoil', hazardFactors.geologySoil, handleHazardChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Moderately stable soils</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.geologySoil === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('geologySoil', hazardFactors.geologySoil, handleHazardChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Loose, erodible soils</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.geologySoil === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('geologySoil', hazardFactors.geologySoil, handleHazardChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Highly erodible soils/talus</div>
                  </td>
                </tr>
                
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Drainage Conditions</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.drainageConditions === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('drainageConditions', hazardFactors.drainageConditions, handleHazardChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Well-drained, minimal surface water</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.drainageConditions === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('drainageConditions', hazardFactors.drainageConditions, handleHazardChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Moderate drainage issues</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.drainageConditions === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('drainageConditions', hazardFactors.drainageConditions, handleHazardChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Poor drainage, standing water</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.drainageConditions === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('drainageConditions', hazardFactors.drainageConditions, handleHazardChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Severe drainage issues, seepage</div>
                  </td>
                </tr>
                
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Road Failure History</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.roadFailureHistory === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('roadFailureHistory', hazardFactors.roadFailureHistory, handleHazardChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>No previous failures</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.roadFailureHistory === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('roadFailureHistory', hazardFactors.roadFailureHistory, handleHazardChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Minor historical issues</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.roadFailureHistory === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('roadFailureHistory', hazardFactors.roadFailureHistory, handleHazardChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Moderate historical failures</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: hazardFactors.roadFailureHistory === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('roadFailureHistory', hazardFactors.roadFailureHistory, handleHazardChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Frequent/significant failures</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style={{
            backgroundColor: '#e9ecef', 
            padding: '10px', 
            borderRadius: '4px',
            marginTop: '15px'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontWeight: 'bold'}}>Total Hazard Score:</span>
              <span style={{fontWeight: 'bold'}}>{hazardScore}</span>
            </div>
          </div>
        </div>
        
        {/* Consequence Factors Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '5px', color: '#1976D2'}}>Consequence Factors (Severity)</h2>
          <p style={{marginBottom: '15px', color: '#666', fontSize: '0.9rem'}}>Select the appropriate score for each factor</p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '15px'}}>
              <thead>
                <tr style={{backgroundColor: '#e9ecef'}}>
                  <th style={{padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Factor</th>
                  <th style={{padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>2</th>
                  <th style={{padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>4</th>
                  <th style={{padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>6</th>
                  <th style={{padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>10</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Proximity to Water</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.proximityToWater === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('proximityToWater', consequenceFactors.proximityToWater, handleConsequenceChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>No water nearby<br/>(&gt;100m)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.proximityToWater === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('proximityToWater', consequenceFactors.proximityToWater, handleConsequenceChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Non-fish stream<br/>(30-100m)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.proximityToWater === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('proximityToWater', consequenceFactors.proximityToWater, handleConsequenceChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Fish stream<br/>(10-30m)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.proximityToWater === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('proximityToWater', consequenceFactors.proximityToWater, handleConsequenceChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Adjacent to fish stream<br/>(&lt;10m)</div>
                  </td>
                </tr>
                
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Drainage Structure</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.drainageStructure === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('drainageStructure', consequenceFactors.drainageStructure, handleConsequenceChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Adequate for 100+ year events</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.drainageStructure === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('drainageStructure', consequenceFactors.drainageStructure, handleConsequenceChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Adequate for 50-year events</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.drainageStructure === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('drainageStructure', consequenceFactors.drainageStructure, handleConsequenceChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Adequate for 25-year events</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.drainageStructure === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('drainageStructure', consequenceFactors.drainageStructure, handleConsequenceChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Undersized or deteriorating</div>
                  </td>
                </tr>
                
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Public/Industrial Use</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.publicIndustrialUse === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('publicIndustrialUse', consequenceFactors.publicIndustrialUse, handleConsequenceChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Minimal use (wilderness road)</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.publicIndustrialUse === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('publicIndustrialUse', consequenceFactors.publicIndustrialUse, handleConsequenceChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Low volume industrial use</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.publicIndustrialUse === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('publicIndustrialUse', consequenceFactors.publicIndustrialUse, handleConsequenceChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Moderate public/industrial</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.publicIndustrialUse === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('publicIndustrialUse', consequenceFactors.publicIndustrialUse, handleConsequenceChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>High volume/mainline road</div>
                  </td>
                </tr>
                
                <tr style={{borderBottom: '1px solid #dee2e6'}}>
                  <td style={{padding: '12px 8px', fontWeight: 'bold'}}>Environmental Value</td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.environmentalValue === 2 ? '#d4edda' : 'transparent'}}>
                    {renderRiskRadio('environmentalValue', consequenceFactors.environmentalValue, handleConsequenceChange, 2)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>No significant values</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.environmentalValue === 4 ? '#fff3cd' : 'transparent'}}>
                    {renderRiskRadio('environmentalValue', consequenceFactors.environmentalValue, handleConsequenceChange, 4)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Standard riparian/wildlife</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.environmentalValue === 6 ? '#ffe0b2' : 'transparent'}}>
                    {renderRiskRadio('environmentalValue', consequenceFactors.environmentalValue, handleConsequenceChange, 6)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Important habitat or cultural</div>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center', backgroundColor: consequenceFactors.environmentalValue === 10 ? '#f8d7da' : 'transparent'}}>
                    {renderRiskRadio('environmentalValue', consequenceFactors.environmentalValue, handleConsequenceChange, 10)}
                    <div style={{fontSize: '0.8rem', marginTop: '4px'}}>Critical habitat/cultural site</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style={{
            backgroundColor: '#e9ecef', 
            padding: '10px', 
            borderRadius: '4px',
            marginTop: '15px'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontWeight: 'bold'}}>Total Consequence Score:</span>
              <span style={{fontWeight: 'bold'}}>{consequenceScore}</span>
            </div>
          </div>
        </div>
        
        {/* Risk Calculation Section */}
        <div style={{
          backgroundColor: riskColor.bg,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: `1px solid ${riskColor.text}`,
          color: riskColor.text
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '15px', textAlign: 'center'}}>
            Risk Assessment Results
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <div style={{fontSize: '0.9rem', marginBottom: '5px'}}>
              Risk Score = Hazard ({hazardScore}) × Consequence ({consequenceScore})
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              {riskScore}
            </div>
            <div style={{
              padding: '5px 15px',
              borderRadius: '20px',
              backgroundColor: riskColor.text,
              color: '#fff',
              fontWeight: 'bold'
            }}>
              {riskCategory} Risk
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '15px',
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <h3 style={{fontSize: '1rem', marginBottom: '8px', color: '#333'}}>
              Professional Requirements:
            </h3>
            <p style={{color: '#333', fontSize: '0.9rem'}}>
              {requirements}
            </p>
          </div>
        </div>
        
        {/* Photo Capture Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '15px', color: '#1976D2'}}>Photo Documentation</h2>
          <PhotoCapture onPhotoCapture={handlePhotoCapture} />
        </div>
        
        {/* General Comments Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '15px', color: '#1976D2'}}>General Comments</h2>
          <textarea 
            value={comments}
            onChange={handleCommentsChange}
            placeholder="Enter any additional observations, maintenance recommendations, or notes about this road segment..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'inherit',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
        
        {/* Action Buttons */}
        <div style={{marginTop: '30px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'}}>
          <Link to="/" style={{
            display: 'inline-block',
            background: '#ccc',
            color: '#333',
            padding: '12px 24px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Back to Dashboard
          </Link>
          
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            <button 
              type="button"
              onClick={handleSaveDraft}
              style={{
                background: '#1976D2',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Save Draft
            </button>
            
            <button 
              type="button"
              onClick={handleSaveAssessment}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Save Assessment
            </button>
            
            <button 
              type="button"
              onClick={handleTogglePDFPreview}
              style={{
                background: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Preview PDF
            </button>
            
            <button 
              type="button"
              onClick={handleNewAssessment}
              style={{
                background: '#9C27B0',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              New Assessment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RoadRiskForm;