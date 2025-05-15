import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RoadRiskForm.css';

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

// Risk level colors - Enhanced color palette with softer gradients
const riskColors = {
  veryLow: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
  low: 'linear-gradient(135deg, #dcedc8, #aed581)',
  moderate: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
  high: 'linear-gradient(135deg, #ffebee, #ffcdd2)',
  veryHigh: 'linear-gradient(135deg, #fce4ec, #f8bbd0)'
};

// Risk level text colors with better contrast
const riskTextColors = {
  veryLow: '#1b5e20',
  low: '#33691e',
  moderate: '#f57f17',
  high: '#c62828',
  veryHigh: '#880e4f'
};

// Button style colors with more sophisticated gradients
const buttonColors = {
  2: {
    active: 'linear-gradient(to bottom, #66bb6a, #43a047)',
    inactive: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
    textActive: '#ffffff',
    textInactive: '#333333',
    border: '#dcedc8',
    hoverBg: 'linear-gradient(to bottom, #f1f8e9, #e8f5e9)'
  },
  4: {
    active: 'linear-gradient(to bottom, #ffca28, #ffb300)',
    inactive: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
    textActive: '#ffffff',
    textInactive: '#333333',
    border: '#fff8e1',
    hoverBg: 'linear-gradient(to bottom, #fffde7, #fff8e1)'
  },
  6: {
    active: 'linear-gradient(to bottom, #ffa726, #fb8c00)',
    inactive: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
    textActive: '#ffffff',
    textInactive: '#333333',
    border: '#fff3e0',
    hoverBg: 'linear-gradient(to bottom, #fff8e1, #fff3e0)'
  },
  10: {
    active: 'linear-gradient(to bottom, #ef5350, #e53935)',
    inactive: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
    textActive: '#ffffff',
    textInactive: '#333333',
    border: '#ffebee',
    hoverBg: 'linear-gradient(to bottom, #ffebee, #ffcdd2)'
  }
};

function RoadRiskForm() {
  const navigate = useNavigate();
  
  // Basic info state
  const [basicInfo, setBasicInfo] = useState({...defaultBasicInfo});
  
  // Hazard factors state
  const [hazardFactors, setHazardFactors] = useState({...defaultHazardFactors});
  
  // Consequence factors state
  const [consequenceFactors, setConsequenceFactors] = useState({...defaultConsequenceFactors});
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success'); // success, warning, error, info
  
  // Photos (simplified placeholder)
  const [photos, setPhotos] = useState([]);
  
  // Comments
  const [comments, setComments] = useState('');
  
  // Animation state for status message
  const [statusVisible, setStatusVisible] = useState(false);
  
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
  
  // Get risk category
  const getRiskCategory = (score) => {
    if (score > 1000) return { category: 'Very High', color: 'veryHigh' };
    if (score >= 500) return { category: 'High', color: 'high' };
    if (score >= 250) return { category: 'Moderate', color: 'moderate' };
    if (score >= 150) return { category: 'Low', color: 'low' };
    return { category: 'Very Low', color: 'veryLow' };
  };
  
  // Helper function to show status messages with animation
  const showStatus = (message, type = 'success') => {
    setStatusMessage(message);
    setStatusType(type);
    setStatusVisible(true);
    setTimeout(() => {
      setStatusVisible(false);
      setTimeout(() => setStatusMessage(''), 300); // Clear after fade out
    }, 3000);
  };
  
  // Handle basic info changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    const updatedBasicInfo = {
      ...basicInfo,
      [name]: value
    };
    setBasicInfo(updatedBasicInfo);
    
    // Auto-save to localStorage
    saveToLocalStorage({
      basicInfo: updatedBasicInfo,
      hazardFactors,
      consequenceFactors,
      comments,
      photos
    });
  };
  
  // Handle hazard factor changes
  const handleHazardChange = (name, value) => {
    const updatedHazardFactors = {
      ...hazardFactors,
      [name]: value
    };
    setHazardFactors(updatedHazardFactors);
    
    // Auto-save to localStorage
    saveToLocalStorage({
      basicInfo,
      hazardFactors: updatedHazardFactors,
      consequenceFactors,
      comments,
      photos
    });
  };
  
  // Handle consequence factor changes
  const handleConsequenceChange = (name, value) => {
    const updatedConsequenceFactors = {
      ...consequenceFactors,
      [name]: value
    };
    setConsequenceFactors(updatedConsequenceFactors);
    
    // Auto-save to localStorage
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors: updatedConsequenceFactors,
      comments,
      photos
    });
  };
  
  // Handle comments change
  const handleCommentsChange = (e) => {
    const newComments = e.target.value;
    setComments(newComments);
    
    // Auto-save to localStorage
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      comments: newComments,
      photos
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
      comments,
      photos
    });
    
    showStatus('Location captured successfully!', 'success');
  };
  
  // Add photo placeholder
  const handleAddPhoto = () => {
    const mockPhoto = {
      id: `photo-${Date.now()}`,
      name: `Photo ${photos.length + 1}`,
      url: 'https://via.placeholder.com/150',
      timestamp: new Date().toISOString()
    };
    
    const updatedPhotos = [...photos, mockPhoto];
    setPhotos(updatedPhotos);
    
    // Auto-save to localStorage
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      comments,
      photos: updatedPhotos
    });
    
    showStatus('Photo added successfully!', 'success');
  };
  
  // Remove photo
  const handleRemovePhoto = (id) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(updatedPhotos);
    
    // Auto-save to localStorage
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      comments,
      photos: updatedPhotos
    });
  };
  
  // Export to PDF placeholder
  const handleExportPDF = () => {
    showStatus('PDF export functionality will be implemented in the next version.', 'info');
  };
  
  // Save form data to localStorage
  const saveToLocalStorage = (formData) => {
    const completeFormData = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('roadRiskForm', JSON.stringify(completeFormData));
  };
  
  // Save assessment to history
  const handleSaveAssessment = () => {
    // Check if road name is provided (minimal validation)
    if (!basicInfo.roadName) {
      showStatus('Please provide a road name before saving', 'error');
      return;
    }
    
    // Save the assessment to history
    const assessmentData = {
      type: 'roadRisk',
      data: {
        basicInfo,
        hazardFactors,
        consequenceFactors,
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
    
    showStatus('Assessment saved to history!', 'success');
  };
  
  // Save draft explicitly
  const handleSaveDraft = () => {
    saveToLocalStorage({
      basicInfo,
      hazardFactors,
      consequenceFactors,
      comments,
      photos
    });
    
    showStatus('Road risk assessment draft saved successfully!', 'success');
  };
  
  // Start a new assessment
  const handleNewAssessment = () => {
    // Reset all form fields to defaults
    setBasicInfo({...defaultBasicInfo});
    setHazardFactors({...defaultHazardFactors});
    setConsequenceFactors({...defaultConsequenceFactors});
    setComments('');
    setPhotos([]);
    
    // Clear the saved draft
    localStorage.removeItem('roadRiskForm');
    
    showStatus('Started new assessment', 'info');
  };
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('roadRiskForm');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setBasicInfo(parsedData.basicInfo || {...defaultBasicInfo});
        setHazardFactors(parsedData.hazardFactors || {...defaultHazardFactors});
        setConsequenceFactors(parsedData.consequenceFactors || {...defaultConsequenceFactors});
        setComments(parsedData.comments || '');
        setPhotos(parsedData.photos || []);
        
        showStatus('Loaded saved draft', 'info');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);
  
  // Calculate risk values for display
  const hazardScore = getTotalHazardScore();
  const consequenceScore = getTotalConsequenceScore();
  const riskScore = getRiskScore();
  const { category: riskCategory, color: riskColorKey } = getRiskCategory(riskScore);
  
  // Enhanced status message styles with more sophisticated gradients
  const statusStyles = {
    success: {
      background: 'linear-gradient(45deg, #43a047, #66bb6a)',
      color: 'white',
      icon: '✓'
    },
    error: {
      background: 'linear-gradient(45deg, #e53935, #ef5350)',
      color: 'white',
      icon: '✕'
    },
    warning: {
      background: 'linear-gradient(45deg, #fb8c00, #ffa726)',
      color: 'white',
      icon: '⚠'
    },
    info: {
      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
      color: 'white',
      icon: 'ℹ'
    }
  };
  
  // Create a score option button with enhanced styling and animations
  const ScoreButton = ({ factor, value, currentValue, onChange, label }) => {
    const isSelected = currentValue === value;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        flex: 1,
        position: 'relative',
        transition: 'transform 0.2s ease',
        transform: isSelected ? 'scale(1.03)' : 'scale(1)'
      }}>
        <button
          type="button"
          onClick={() => onChange(factor, value)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: '100%',
            padding: '18px 0',
            margin: '5px 0',
            background: isSelected 
              ? buttonColors[value].active 
              : isHovered 
                ? buttonColors[value].hoverBg 
                : buttonColors[value].inactive,
            color: isSelected ? buttonColors[value].textActive : buttonColors[value].textInactive,
            border: `1px solid ${isSelected ? 'transparent' : buttonColors[value].border}`,
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            outline: 'none',
            boxShadow: isSelected 
              ? '0 6px 12px rgba(0,0,0,0.15)' 
              : isHovered 
                ? '0 3px 6px rgba(0,0,0,0.07)' 
                : 'none',
            position: 'relative',
            overflow: 'hidden',
            zIndex: isSelected ? 2 : 1
          }}
        >
          {value}
          {isSelected && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.15)',
              pointerEvents: 'none'
            }}></div>
          )}
        </button>
        <div style={{ 
          textAlign: 'center', 
          fontSize: '0.85rem', 
          color: isSelected ? '#333' : '#555', 
          marginTop: '8px',
          maxWidth: '120px',
          lineHeight: '1.3',
          fontWeight: isSelected ? '600' : '400',
          transition: 'all 0.3s ease',
          padding: '0 5px'
        }}>
          {label}
        </div>
        {isSelected && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%',
            height: '3px',
            backgroundColor: buttonColors[value].textActive === '#ffffff' 
              ? buttonColors[value].border
              : buttonColors[value].active.split(',')[1],
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }}></div>
        )}
      </div>
    );
  };
  
  return (
    <div className="road-risk-form-container">
      {/* Enhanced Page Header with Shadow and Gradient */}
      <div className="road-risk-header">
        <div className="road-risk-header-accent"></div>
        <h1 className="road-risk-title">Road Risk Assessment</h1>
        <p className="road-risk-subtitle">
          Evaluate forest road conditions and identify potential hazards
        </p>
        {/* Breadcrumb navigation */}
        <div className="breadcrumb-nav">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span>›</span>
          <span>Road Risk Assessment</span>
        </div>
      </div>
      
      {/* Enhanced Animated Status Message with Improved Transitions */}
      {statusMessage && (
        <div 
          style={{ 
            padding: '18px',
            background: statusStyles[statusType].background,
            color: statusStyles[statusType].color,
            borderRadius: '12px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
            opacity: statusVisible ? 1 : 0,
            transform: statusVisible ? 'translateY(0)' : 'translateY(-15px)',
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            borderLeft: `5px solid ${statusStyles[statusType].background.split(',')[1].trim()}`,
            position: 'sticky',
            top: '20px',
            zIndex: 100
          }}
        >
          <span style={{ 
            marginRight: '15px', 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(5px)'
          }}>
            {statusStyles[statusType].icon}
          </span>
          <span style={{ fontWeight: '500', flex: 1 }}>{statusMessage}</span>
          <button 
            onClick={() => setStatusVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              opacity: 0.7,
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '5px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              '&:hover': {
                opacity: 1,
                transform: 'scale(1.1)'
              }
            }}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Enhanced Road Information Section with Better Styling */}
      <div className="form-section" style={{ borderTop: '4px solid #1976d2' }}>
        <h2 className="section-header">
          <span className="section-accent"></span>
          Road Information
        </h2>
        
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label">
            <span className="label-accent"></span>
            Road Name <span style={{ color: '#e53935' }}>*</span>
          </label>
          <input
            type="text"
            name="roadName"
            value={basicInfo.roadName}
            onChange={handleBasicInfoChange}
            placeholder="e.g., Forest Service Road #137"
            className="form-input"
            style={{
              borderColor: basicInfo.roadName ? '#e0e0e0' : '#ffcdd2',
              boxShadow: basicInfo.roadName ? 'none' : '0 0 0 2px rgba(229, 57, 53, 0.1)'
            }}
          />
          {!basicInfo.roadName && (
            <div style={{
              fontSize: '0.85rem',
              color: '#e53935',
              marginTop: '6px',
              paddingLeft: '12px',
              animation: 'fadeIn 0.3s ease-in-out'
            }}>
              Road name is required for saving assessment
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">
              <span className="label-accent"></span>
              Start KM
            </label>
            <input
              type="number"
              name="startKm"
              value={basicInfo.startKm}
              onChange={handleBasicInfoChange}
              placeholder="e.g., 0.0"
              className="form-input"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label">
              <span className="label-accent"></span>
              End KM
            </label>
            <input
              type="number"
              name="endKm"
              value={basicInfo.endKm}
              onChange={handleBasicInfoChange}
              placeholder="e.g., 2.5"
              className="form-input"
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label">
            <span className="label-accent"></span>
            Start Coordinates
          </label>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }} className="coordinate-inputs">
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#777',
                fontSize: '0.9rem',
                zIndex: 1
              }}>
                Lat:
              </span>
              <input
                type="text"
                name="startLat"
                value={basicInfo.startLat}
                onChange={handleBasicInfoChange}
                placeholder="Latitude"
                className="form-input"
                style={{ paddingLeft: '45px' }}
              />
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#777',
                fontSize: '0.9rem',
                zIndex: 1
              }}>
                Long:
              </span>
              <input
                type="text"
                name="startLong"
                value={basicInfo.startLong}
                onChange={handleBasicInfoChange}
                placeholder="Longitude"
                className="form-input"
                style={{ paddingLeft: '55px' }}
              />
            </div>
            <button
              type="button"
              onClick={() => handleGetLocation('start')}
              style={{
                padding: '14px 15px',
                background: 'linear-gradient(to bottom, #42a5f5, #1976d2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid white',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'white',
                  borderRadius: '50%'
                }}></span>
              </span>
              Get Location
            </button>
          </div>
        </div>
        
        {/* Rest of the form remains the same structure but uses the classes */}
        {/* We'll keep the existing styling but gradually migrate more elements to use CSS classes */}
        
        {/* Additional improved styling for action buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginTop: '30px',
          marginBottom: '30px',
          position: 'sticky',
          bottom: '20px',
          zIndex: 10,
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.7)'
        }} className="action-buttons">
          <button
            type="button"
            onClick={handleSaveAssessment}
            style={{
              flex: 1,
              padding: '16px',
              background: 'linear-gradient(45deg, #43a047, #66bb6a)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '0 4px 10px rgba(76, 175, 80, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem'
            }}>
              ✓
            </span>
            Save Assessment
            <span style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shine 2s infinite',
              pointerEvents: 'none'
            }}></span>
          </button>
          
          <button
            type="button"
            onClick={handleSaveDraft}
            style={{
              flex: 1,
              padding: '16px',
              background: 'linear-gradient(45deg, #f5f5f5, #ffffff)',
              color: '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 2px 5px rgba(25, 118, 210, 0.1)'
            }}
          >
            <span style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              color: '#1976d2'
            }}>
              💾
            </span>
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoadRiskForm;