import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RoadRiskForm.css';

// Default basic information
const defaultBasicInfo = {
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

// Default hazard factors
const defaultHazardFactors = {
  hillslopeGradient: -1,
  connectivityToStream: -1,
  pastSlides: -1,
  roadGradient: -1,
  roadWidth: -1,
  runoutZones: -1,
  drainageStructure: -1
};

// Default consequence factors
const defaultConsequenceFactors = {
  waterQuality: -1,
  publicSafety: -1,
  forestValues: -1,
  infrastructureValues: -1,
  environmentalValue: -1,
  publicIndustrialUse: -1
};

// Risk colors mapping
const riskColors = {
  "very-low": "#f1f8e9",  // Very Light Green
  "low": "#dcedc8",       // Light Green
  "moderate": "#ffe0b2",  // Light Orange
  "high": "#ffccbc",      // Light Red-Orange
  "very-high": "#ffcdd2"  // Light Red
};

// Risk text colors mapping
const riskTextColors = {
  "very-low": "#33691e",  // Dark Green
  "low": "#558b2f",       // Medium-Dark Green
  "moderate": "#ef6c00",  // Dark Orange
  "high": "#d84315",      // Dark Red-Orange
  "very-high": "#b71c1c"  // Dark Red
};

// Common styles for sections
const sectionStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '30px',
  padding: '25px'
};

// Common styles for section headers
const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '22px',
  marginBottom: '25px',
  paddingBottom: '15px',
  borderBottom: '1px solid #eee',
  position: 'relative'
};

// ScoreButton component for factor selection
const ScoreButton = ({ factor, value, currentValue, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(value, factor)}
    className={`score-button ${currentValue === value ? 'selected' : ''} 
      ${value <= 2 ? 'green' : value <= 4 ? 'yellow' : value <= 6 ? 'orange' : 'red'}`}
    style={{
      opacity: currentValue === value ? 1 : 0.7,
      transform: currentValue === value ? 'scale(1.05)' : 'scale(1)',
      border: currentValue === value ? 
        `2px solid ${value <= 2 ? '#2e7d32' : value <= 4 ? '#f57f17' : 
          value <= 6 ? '#e65100' : '#b71c1c'}` : 
        '1px solid #ddd'
    }}
  >
    <span className="score-value">{value}</span>
    <span className="score-label">{label}</span>
  </button>
);

function RoadRiskForm() {
  const navigate = useNavigate();
  
  // Initialize states
  const [basicInfo, setBasicInfo] = useState(() => {
    const savedInfo = localStorage.getItem('roadRiskBasicInfo');
    return savedInfo ? JSON.parse(savedInfo) : defaultBasicInfo;
  });
  
  const [hazardFactors, setHazardFactors] = useState(() => {
    const savedFactors = localStorage.getItem('roadRiskHazardFactors');
    return savedFactors ? JSON.parse(savedFactors) : defaultHazardFactors;
  });
  
  const [consequenceFactors, setConsequenceFactors] = useState(() => {
    const savedFactors = localStorage.getItem('roadRiskConsequenceFactors');
    return savedFactors ? JSON.parse(savedFactors) : defaultConsequenceFactors;
  });
  
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('roadRiskComments');
    return savedComments || '';
  });
  
  const [photos, setPhotos] = useState([]);
  
  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem('roadRiskBasicInfo', JSON.stringify(basicInfo));
  }, [basicInfo]);
  
  useEffect(() => {
    localStorage.setItem('roadRiskHazardFactors', JSON.stringify(hazardFactors));
  }, [hazardFactors]);
  
  useEffect(() => {
    localStorage.setItem('roadRiskConsequenceFactors', JSON.stringify(consequenceFactors));
  }, [consequenceFactors]);
  
  useEffect(() => {
    localStorage.setItem('roadRiskComments', comments);
  }, [comments]);
  
  // Calculate scores
  const hazardScore = Object.values(hazardFactors).reduce((sum, value) => 
    sum + (value > 0 ? value : 0), 0);
    
  const consequenceScore = Object.values(consequenceFactors).reduce((sum, value) => 
    sum + (value > 0 ? value : 0), 0);
    
  const riskScore = hazardScore * consequenceScore;
  
  // Determine risk category
  let riskCategory = "Not Assessed";
  let riskColorKey = "very-low";
  
  if (hazardScore > 0 && consequenceScore > 0) {
    if (riskScore <= 20) {
      riskCategory = "Very Low";
      riskColorKey = "very-low";
    } else if (riskScore <= 40) {
      riskCategory = "Low";
      riskColorKey = "low";
    } else if (riskScore <= 60) {
      riskCategory = "Moderate";
      riskColorKey = "moderate";
    } else if (riskScore <= 80) {
      riskCategory = "High";
      riskColorKey = "high";
    } else {
      riskCategory = "Very High";
      riskColorKey = "very-high";
    }
  }
  
  // Event handlers
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleHazardFactorChange = (value, factor) => {
    setHazardFactors(prev => ({ ...prev, [factor]: value }));
  };
  
  const handleConsequenceChange = (value, factor) => {
    setConsequenceFactors(prev => ({ ...prev, [factor]: value }));
  };
  
  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };
  
  const handleAddPhoto = () => {
    // Mock function for adding photos
    const newPhoto = {
      id: Date.now(),
      name: `Photo ${photos.length + 1}`,
      url: 'https://via.placeholder.com/200',
      timestamp: new Date().toISOString()
    };
    setPhotos([...photos, newPhoto]);
  };
  
  const handleRemovePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };
  
  const handleSaveAssessment = () => {
    // Get existing history or initialize new array
    const historyJSON = localStorage.getItem('assessmentHistory');
    const history = historyJSON ? JSON.parse(historyJSON) : [];
    
    // Create new assessment entry
    const assessment = {
      id: Date.now(),
      date: new Date().toISOString(),
      basicInfo,
      hazardFactors,
      consequenceFactors,
      hazardScore,
      consequenceScore,
      riskScore,
      riskCategory,
      comments,
      photos,
      isDraft: false
    };
    
    // Add to history
    history.push(assessment);
    localStorage.setItem('assessmentHistory', JSON.stringify(history));
    
    // Navigate to history page
    navigate('/history');
  };
  
  const handleSaveDraft = () => {
    // Get existing history or initialize new array
    const historyJSON = localStorage.getItem('assessmentHistory');
    const history = historyJSON ? JSON.parse(historyJSON) : [];
    
    // Create new assessment entry
    const assessment = {
      id: Date.now(),
      date: new Date().toISOString(),
      basicInfo,
      hazardFactors,
      consequenceFactors,
      hazardScore,
      consequenceScore,
      riskScore,
      riskCategory,
      comments,
      photos,
      isDraft: true
    };
    
    // Add to history
    history.push(assessment);
    localStorage.setItem('assessmentHistory', JSON.stringify(history));
    
    // Show success message
    alert('Draft saved successfully!');
  };
  
  const handleExportPDF = () => {
    // Mock function for PDF export
    alert('PDF export functionality coming soon!');
  };
  
  const handleNewAssessment = () => {
    if (window.confirm('Start a new assessment? This will clear all current data.')) {
      setBasicInfo(defaultBasicInfo);
      setHazardFactors(defaultHazardFactors);
      setConsequenceFactors(defaultConsequenceFactors);
      setComments('');
      setPhotos([]);
    }
  };
  
  return (
    <div className="road-risk-form">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Road Risk Assessment</span>
      </div>
      
      <h1 className="form-title">Road Risk Assessment</h1>
      
      {/* Basic Information Section */}
      <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
        <h2 className="section-header" style={{ color: '#2196f3' }}>
          <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
          Basic Information
        </h2>
        
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
      </div>
      
      {/* Hazard Factors Section */}
      <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
        <h2 className="section-header" style={{ color: '#ff9800' }}>
          <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #ff9800, #ffb74d)' }}></span>
          Hazard Factors
        </h2>
        
        <div className="factor-group">
          <h3 className="factor-header">Hillslope Gradient</h3>
          <div className="score-buttons">
            <ScoreButton 
              factor="hillslopeGradient" 
              value={2} 
              currentValue={hazardFactors.hillslopeGradient} 
              onChange={handleHazardFactorChange} 
              label="Low (<30%)" 
            />
            <ScoreButton 
              factor="hillslopeGradient" 
              value={4} 
              currentValue={hazardFactors.hillslopeGradient} 
              onChange={handleHazardFactorChange} 
              label="Moderate (30-50%)" 
            />
            <ScoreButton 
              factor="hillslopeGradient" 
              value={6} 
              currentValue={hazardFactors.hillslopeGradient} 
              onChange={handleHazardFactorChange} 
              label="Steep (50-70%)" 
            />
            <ScoreButton 
              factor="hillslopeGradient" 
              value={10} 
              currentValue={hazardFactors.hillslopeGradient} 
              onChange={handleHazardFactorChange} 
              label="Very Steep (>70%)" 
            />
          </div>
        </div>
        
        <div className="factor-total">
          <span className="factor-total-label">Hazard Score Total:</span>
          <span className="factor-total-value">{hazardScore}</span>
        </div>
      </div>
      
      {/* Consequence Factors Section */}
      <div className="form-section" style={{ borderTop: '4px solid #9c27b0' }}>
        <h2 className="section-header" style={{ color: '#9c27b0' }}>
          <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #9c27b0, #ba68c8)' }}></span>
          Consequence Factors
        </h2>
        
        <div className="factor-group">
          <h3 className="factor-header">Water Quality</h3>
          <div className="score-buttons">
            <ScoreButton 
              factor="waterQuality" 
              value={2} 
              currentValue={consequenceFactors.waterQuality} 
              onChange={handleConsequenceChange} 
              label="Low Impact" 
            />
            <ScoreButton 
              factor="waterQuality" 
              value={4} 
              currentValue={consequenceFactors.waterQuality} 
              onChange={handleConsequenceChange} 
              label="Moderate Impact" 
            />
            <ScoreButton 
              factor="waterQuality" 
              value={6} 
              currentValue={consequenceFactors.waterQuality} 
              onChange={handleConsequenceChange} 
              label="High Impact" 
            />
            <ScoreButton 
              factor="waterQuality" 
              value={10} 
              currentValue={consequenceFactors.waterQuality} 
              onChange={handleConsequenceChange} 
              label="Critical Impact" 
            />
          </div>
        </div>
        
        <div className="factor-total">
          <span className="factor-total-label">Consequence Score Total:</span>
          <span className="factor-total-value">{consequenceScore}</span>
        </div>
      </div>
      
      {/* Risk Result Summary */}
      <div style={{ 
        background: `${riskColors[riskColorKey]}`, 
        padding: '35px', 
        borderRadius: '16px', 
        marginBottom: '28px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${riskTextColors[riskColorKey]}30`,
        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: `linear-gradient(135deg, ${riskTextColors[riskColorKey]}CC, ${riskTextColors[riskColorKey]})`,
          color: 'white',
          padding: '10px 24px',
          borderBottomLeftRadius: '16px',
          fontWeight: '700',
          fontSize: '1.1rem',
          boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>!</span>
          {riskCategory} Risk
        </div>
        
        <h2 style={{ 
          borderBottom: `1px solid ${riskTextColors[riskColorKey]}40`, 
          paddingBottom: '15px', 
          marginBottom: '25px',
          color: riskTextColors[riskColorKey],
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '5px', 
            height: '24px', 
            backgroundColor: riskTextColors[riskColorKey], 
            marginRight: '12px', 
            verticalAlign: 'middle',
            borderRadius: '3px'
          }}></span>
          Risk Assessment Results
        </h2>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '5px', 
          alignItems: 'center',
          marginTop: '30px',
          backgroundColor: 'rgba(255,255,255,0.5)',
          padding: '18px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.4)'
        }}>
          <span style={{ 
            fontWeight: '700', 
            fontSize: '1.4rem', 
            color: '#333'
          }}>Risk Score:</span>
          <span style={{ 
            fontWeight: '700',
            fontSize: '1.8rem',
            padding: '12px 25px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            color: riskTextColors[riskColorKey],
            boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
            border: `1px solid ${riskTextColors[riskColorKey]}30`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {riskScore}
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.7)'
      }}>
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          Save Assessment
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(25, 118, 210, 0.1)'
          }}
        >
          Save Draft
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <button
          type="button"
          onClick={handleExportPDF}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #f5f5f5, #eeeeee)',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        >
          Export PDF
        </button>
        
        <button
          type="button"
          onClick={handleNewAssessment}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #eceff1, #cfd8dc)',
            color: '#455a64',
            border: '1px solid #b0bec5',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        >
          New Assessment
        </button>
      </div>
    </div>
  );
}

export default RoadRiskForm;