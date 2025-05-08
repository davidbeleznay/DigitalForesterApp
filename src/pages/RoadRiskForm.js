import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';
import PDFExport from '../components/PDFExport';
import PhotoCapture from '../components/PhotoCapture';

// Component for radio button selection of risk factors
const RiskSelector = ({ name, value, onChange, options }) => {
  return (
    <div style={{ display: 'flex', marginBottom: '8px' }}>
      {options.map((option) => (
        <div 
          key={option.value} 
          style={{ 
            flex: 1, 
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => onChange({ target: { name, value: option.value } })}
        >
          <div 
            style={{
              backgroundColor: value === option.value ? option.color : '#f5f5f5',
              border: value === option.value ? `2px solid ${option.borderColor || option.color}` : '1px solid #ddd',
              padding: '8px',
              margin: '0 2px',
              borderRadius: '4px',
              fontWeight: value === option.value ? 'bold' : 'normal',
              color: value === option.value ? (option.textColor || '#fff') : '#333',
              transition: 'all 0.2s ease'
            }}
          >
            {option.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Risk level colors
const riskColors = {
  veryLow: { bg: '#e6f7ff', text: '#0066cc' },
  low: { bg: '#d4edda', text: '#155724' },
  moderate: { bg: '#fff3cd', text: '#856404' },
  high: { bg: '#ffe0b2', text: '#e65100' },
  veryHigh: { bg: '#f8d7da', text: '#721c24' }
};

// Standard risk options for selectors
const standardRiskOptions = [
  { value: 2, label: '2', color: '#4CAF50', textColor: '#fff', borderColor: '#388E3C' },
  { value: 4, label: '4', color: '#FFC107', textColor: '#333', borderColor: '#FFA000' },
  { value: 6, label: '6', color: '#FF9800', textColor: '#fff', borderColor: '#F57C00' },
  { value: 10, label: '10', color: '#F44336', textColor: '#fff', borderColor: '#D32F2F' }
];

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
          
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Terrain Stability</label>
            </div>
            <RiskSelector 
              name="terrainStability"
              value={hazardFactors.terrainStability}
              onChange={handleHazardChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>Stable terrain<br/>(slopes &lt;40%)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Moderately stable<br/>(slopes 40-60%)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Potentially unstable<br/>(slopes &gt;60%)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Unstable terrain<br/>(Class IV/V)</span>
            </div>
          </div>
          
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Slope Grade</label>
            </div>
            <RiskSelector 
              name="slopeGrade"
              value={hazardFactors.slopeGrade}
              onChange={handleHazardChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>Low grade<br/>(&lt;8%)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Moderate grade<br/>(8-12%)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Steep grade<br/>(12-18%)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Very steep grade<br/>(&gt;18%)</span>
            </div>
          </div>
          
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Geology/Soil</label>
            </div>
            <RiskSelector 
              name="geologySoil"
              value={hazardFactors.geologySoil}
              onChange={handleHazardChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>Cohesive, stable soils/bedrock</span>
              <span style={{flex: 1, textAlign: 'center'}}>Moderately stable soils</span>
              <span style={{flex: 1, textAlign: 'center'}}>Loose, erodible soils</span>
              <span style={{flex: 1, textAlign: 'center'}}>Highly erodible soils/talus</span>
            </div>
          </div>
          
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Drainage Conditions</label>
            </div>
            <RiskSelector 
              name="drainageConditions"
              value={hazardFactors.drainageConditions}
              onChange={handleHazardChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>Well-drained, minimal surface water</span>
              <span style={{flex: 1, textAlign: 'center'}}>Moderate drainage issues</span>
              <span style={{flex: 1, textAlign: 'center'}}>Poor drainage, standing water</span>
              <span style={{flex: 1, textAlign: 'center'}}>Severe drainage issues, seepage</span>
            </div>
          </div>
          
          <div style={{marginBottom: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Road Failure History</label>
            </div>
            <RiskSelector 
              name="roadFailureHistory"
              value={hazardFactors.roadFailureHistory}
              onChange={handleHazardChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>No previous failures</span>
              <span style={{flex: 1, textAlign: 'center'}}>Minor historical issues</span>
              <span style={{flex: 1, textAlign: 'center'}}>Moderate historical failures</span>
              <span style={{flex: 1, textAlign: 'center'}}>Frequent/significant failures</span>
            </div>
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
          
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Proximity to Water</label>
            </div>
            <RiskSelector 
              name="proximityToWater"
              value={consequenceFactors.proximityToWater}
              onChange={handleConsequenceChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>No water nearby<br/>(&gt;100m)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Non-fish stream<br/>(30-100m)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Fish stream<br/>(10-30m)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Adjacent to fish stream<br/>(&lt;10m)</span>
            </div>
          </div>
          
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Drainage Structure</label>
            </div>
            <RiskSelector 
              name="drainageStructure"
              value={consequenceFactors.drainageStructure}
              onChange={handleConsequenceChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>Adequate for 100+ year events</span>
              <span style={{flex: 1, textAlign: 'center'}}>Adequate for 50-year events</span>
              <span style={{flex: 1, textAlign: 'center'}}>Adequate for 25-year events</span>
              <span style={{flex: 1, textAlign: 'center'}}>Undersized or deteriorating</span>
            </div>
          </div>
          
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Public/Industrial Use</label>
            </div>
            <RiskSelector 
              name="publicIndustrialUse"
              value={consequenceFactors.publicIndustrialUse}
              onChange={handleConsequenceChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>Minimal use (wilderness road)</span>
              <span style={{flex: 1, textAlign: 'center'}}>Low volume industrial use</span>
              <span style={{flex: 1, textAlign: 'center'}}>Moderate public/industrial</span>
              <span style={{flex: 1, textAlign: 'center'}}>High volume/mainline road</span>
            </div>
          </div>
          
          <div style={{marginBottom: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <label style={{fontWeight: 'bold'}}>Environmental Value</label>
            </div>
            <RiskSelector 
              name="environmentalValue"
              value={consequenceFactors.environmentalValue}
              onChange={handleConsequenceChange}
              options={standardRiskOptions}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
              <span style={{flex: 1, textAlign: 'center'}}>No significant values</span>
              <span style={{flex: 1, textAlign: 'center'}}>Standard riparian/wildlife</span>
              <span style={{flex: 1, textAlign: 'center'}}>Important habitat or cultural</span>
              <span style={{flex: 1, textAlign: 'center'}}>Critical habitat/cultural site</span>
            </div>
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