import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

// Risk level colors
const riskColors = {
  veryLow: '#e3f2fd',
  low: '#e8f5e9',
  moderate: '#fff8e1',
  high: '#ffebee',
  veryHigh: '#fce4ec'
};

// Risk level text colors
const riskTextColors = {
  veryLow: '#0d47a1',
  low: '#1b5e20',
  moderate: '#ff8f00',
  high: '#c62828',
  veryHigh: '#880e4f'
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
  
  // Photos (simplified placeholder)
  const [photos, setPhotos] = useState([]);
  
  // Comments
  const [comments, setComments] = useState('');
  
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
  
  // Helper function to show status messages
  const showStatus = (message) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(''), 3000);
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
  const handleHazardChange = (e) => {
    const { name, value } = e.target;
    const updatedHazardFactors = {
      ...hazardFactors,
      [name]: parseInt(value)
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
  const handleConsequenceChange = (e) => {
    const { name, value } = e.target;
    const updatedConsequenceFactors = {
      ...consequenceFactors,
      [name]: parseInt(value)
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
    
    showStatus('Location captured successfully!');
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
    
    showStatus('Photo added successfully!');
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
    showStatus('PDF export functionality will be implemented in the next version.');
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
      showStatus('Please provide a road name before saving');
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
    
    showStatus('Assessment saved to history!');
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
    
    showStatus('Road risk assessment draft saved successfully!');
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
    
    showStatus('Started new assessment');
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
        
        showStatus('Loaded saved draft');
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
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Road Risk Assessment</h1>
      
      {statusMessage && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e8f5e9', 
          borderRadius: '5px', 
          marginBottom: '20px',
          border: '1px solid #81c784',
          color: '#2e7d32'
        }}>
          {statusMessage}
        </div>
      )}
      
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Road Information</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Road Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            name="roadName"
            value={basicInfo.roadName}
            onChange={handleBasicInfoChange}
            placeholder="e.g., Forest Service Road #137"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start KM</label>
            <input
              type="number"
              name="startKm"
              value={basicInfo.startKm}
              onChange={handleBasicInfoChange}
              placeholder="e.g., 0.0"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End KM</label>
            <input
              type="number"
              name="endKm"
              value={basicInfo.endKm}
              onChange={handleBasicInfoChange}
              placeholder="e.g., 2.5"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Coordinates</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="startLat"
              value={basicInfo.startLat}
              onChange={handleBasicInfoChange}
              placeholder="Latitude"
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="text"
              name="startLong"
              value={basicInfo.startLong}
              onChange={handleBasicInfoChange}
              placeholder="Longitude"
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button
              type="button"
              onClick={() => handleGetLocation('start')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Get Location
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End Coordinates</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="endLat"
              value={basicInfo.endLat}
              onChange={handleBasicInfoChange}
              placeholder="Latitude"
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="text"
              name="endLong"
              value={basicInfo.endLong}
              onChange={handleBasicInfoChange}
              placeholder="Longitude"
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button
              type="button"
              onClick={() => handleGetLocation('end')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Get Location
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Assessment Date</label>
            <input
              type="date"
              name="date"
              value={basicInfo.date}
              onChange={handleBasicInfoChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Inspector Name</label>
            <input
              type="text"
              name="inspector"
              value={basicInfo.inspector}
              onChange={handleBasicInfoChange}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Hazard Factors</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Terrain Stability</label>
          <select
            name="terrainStability"
            value={hazardFactors.terrainStability}
            onChange={handleHazardChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>Stable terrain (slopes &lt;40%)</option>
            <option value={4}>Moderately stable (slopes 40-60%)</option>
            <option value={6}>Potentially unstable (slopes &gt;60%)</option>
            <option value={10}>Unstable terrain (Class IV/V)</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Slope Grade</label>
          <select
            name="slopeGrade"
            value={hazardFactors.slopeGrade}
            onChange={handleHazardChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>Low grade (&lt;8%)</option>
            <option value={4}>Moderate grade (8-12%)</option>
            <option value={6}>Steep grade (12-18%)</option>
            <option value={10}>Very steep grade (&gt;18%)</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Geology/Soil</label>
          <select
            name="geologySoil"
            value={hazardFactors.geologySoil}
            onChange={handleHazardChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>Cohesive, stable soils/bedrock</option>
            <option value={4}>Moderately stable soils</option>
            <option value={6}>Loose, erodible soils</option>
            <option value={10}>Highly erodible soils/talus</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Drainage Conditions</label>
          <select
            name="drainageConditions"
            value={hazardFactors.drainageConditions}
            onChange={handleHazardChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>Well-drained, minimal surface water</option>
            <option value={4}>Moderate drainage issues</option>
            <option value={6}>Poor drainage, standing water</option>
            <option value={10}>Severe drainage issues, seepage</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Road Failure History</label>
          <select
            name="roadFailureHistory"
            value={hazardFactors.roadFailureHistory}
            onChange={handleHazardChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>No previous failures</option>
            <option value={4}>Minor historical issues</option>
            <option value={6}>Moderate historical failures</option>
            <option value={10}>Frequent/significant failures</option>
          </select>
        </div>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>Total Hazard Score:</span>
            <span style={{ fontWeight: 'bold' }}>{hazardScore}</span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Consequence Factors</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Proximity to Water</label>
          <select
            name="proximityToWater"
            value={consequenceFactors.proximityToWater}
            onChange={handleConsequenceChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>No water nearby (&gt;100m)</option>
            <option value={4}>Non-fish stream (30-100m)</option>
            <option value={6}>Fish stream (10-30m)</option>
            <option value={10}>Adjacent to fish stream (&lt;10m)</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Drainage Structure</label>
          <select
            name="drainageStructure"
            value={consequenceFactors.drainageStructure}
            onChange={handleConsequenceChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>Adequate for 100+ year events</option>
            <option value={4}>Adequate for 50-year events</option>
            <option value={6}>Adequate for 25-year events</option>
            <option value={10}>Undersized or deteriorating</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Public/Industrial Use</label>
          <select
            name="publicIndustrialUse"
            value={consequenceFactors.publicIndustrialUse}
            onChange={handleConsequenceChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>Minimal use (wilderness road)</option>
            <option value={4}>Low volume industrial use</option>
            <option value={6}>Moderate public/industrial</option>
            <option value={10}>High volume/mainline road</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Environmental Value</label>
          <select
            name="environmentalValue"
            value={consequenceFactors.environmentalValue}
            onChange={handleConsequenceChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value={2}>No significant values</option>
            <option value={4}>Standard riparian/wildlife</option>
            <option value={6}>Important habitat or cultural</option>
            <option value={10}>Critical habitat or cultural site</option>
          </select>
        </div>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>Total Consequence Score:</span>
            <span style={{ fontWeight: 'bold' }}>{consequenceScore}</span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: riskColors[riskColorKey], 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: riskTextColors[riskColorKey],
          color: 'white',
          padding: '5px 10px',
          borderBottomLeftRadius: '8px',
          fontWeight: 'bold'
        }}>
          {riskCategory} Risk
        </div>
        
        <h2 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Risk Assessment Results</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Hazard Score:</span>
            <span style={{ fontWeight: 'bold' }}>{hazardScore}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Consequence Score:</span>
            <span style={{ fontWeight: 'bold' }}>{consequenceScore}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Risk Score:</span>
            <span style={{ fontWeight: 'bold', color: riskTextColors[riskColorKey] }}>{riskScore}</span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Photo Documentation</h2>
        
        <button
          type="button"
          onClick={handleAddPhoto}
          style={{
            padding: '10px 15px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          Add Photo (Placeholder)
        </button>
        
        {photos.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
            {photos.map(photo => (
              <div key={photo.id} style={{ position: 'relative', width: '150px', marginBottom: '10px' }}>
                <img
                  src={photo.url}
                  alt={photo.name}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>{photo.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Comments & Observations</h2>
        
        <textarea
          name="comments"
          value={comments}
          onChange={handleCommentsChange}
          placeholder="Enter any additional observations, notes, or specific concerns about the road section..."
          style={{
            width: '100%',
            height: '100px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            resize: 'vertical'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={handleSaveAssessment}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Save Assessment
        </button>
        
        <button
          type="button"
          onClick={handleSaveDraft}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#ffffff',
            color: '#3498db',
            border: '1px solid #3498db',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Save Draft
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          type="button"
          onClick={handleExportPDF}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export PDF
        </button>
        
        <button
          type="button"
          onClick={handleNewAssessment}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          New Assessment
        </button>
      </div>
      
      <Link
        to="/"
        style={{
          display: 'block',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          color: '#666',
          border: '1px solid #ddd',
          borderRadius: '4px',
          textDecoration: 'none',
          textAlign: 'center',
          marginBottom: '30px'
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default RoadRiskForm;