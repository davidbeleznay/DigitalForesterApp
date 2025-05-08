import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

function RoadRiskForm() {
  // Basic info state
  const [basicInfo, setBasicInfo] = useState({
    roadName: '',
    startKm: '',
    endKm: '',
    startLat: '',
    startLong: '',
    endLat: '',
    endLong: '',
    date: new Date().toISOString().split('T')[0],
    inspector: ''
  });
  
  // Hazard factors state
  const [hazardFactors, setHazardFactors] = useState({
    terrainStability: 2,
    slopeGrade: 2,
    geologySoil: 2,
    drainageConditions: 2,
    roadFailureHistory: 2
  });
  
  // Consequence factors state
  const [consequenceFactors, setConsequenceFactors] = useState({
    proximityToWater: 2,
    drainageStructure: 2,
    publicIndustrialUse: 2,
    environmentalValue: 2
  });
  
  // Additional factors toggle
  const [showAdditionalFactors, setShowAdditionalFactors] = useState(false);
  
  // Geotechnical considerations
  const [geotechnicalFactors, setGeotechnicalFactors] = useState({
    cutSlopeHeight: 2,
    fillSlopeHeight: 2,
    bedrockCondition: 2,
    groundwaterConditions: 2,
    erosionEvidence: 2
  });
  
  // Infrastructure elements
  const [infrastructureFactors, setInfrastructureFactors] = useState({
    roadSurfaceType: 2,
    ditchCondition: 2,
    culvertSizing: 2,
    culvertCondition: 2,
    roadAge: 2
  });
  
  // General comments
  const [comments, setComments] = useState('');
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState('');
  
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
  
  const getRiskCategory = (score) => {
    if (score > 500) return { category: 'Very High', color: riskColors.veryHigh };
    if (score >= 200 && score <= 500) return { category: 'High', color: riskColors.high };
    if (score >= 100 && score < 200) return { category: 'Moderate', color: riskColors.moderate };
    if (score >= 50 && score < 100) return { category: 'Low', color: riskColors.low };
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
    setBasicInfo({
      ...basicInfo,
      [name]: value
    });
  };
  
  // Handle hazard factor changes
  const handleHazardChange = (e) => {
    const { name, value } = e.target;
    setHazardFactors({
      ...hazardFactors,
      [name]: parseInt(value)
    });
  };
  
  // Handle consequence factor changes
  const handleConsequenceChange = (e) => {
    const { name, value } = e.target;
    setConsequenceFactors({
      ...consequenceFactors,
      [name]: parseInt(value)
    });
  };
  
  // Handle geotechnical factor changes
  const handleGeotechnicalChange = (e) => {
    const { name, value } = e.target;
    setGeotechnicalFactors({
      ...geotechnicalFactors,
      [name]: parseInt(value)
    });
  };
  
  // Handle infrastructure factor changes
  const handleInfrastructureChange = (e) => {
    const { name, value } = e.target;
    setInfrastructureFactors({
      ...infrastructureFactors,
      [name]: parseInt(value)
    });
  };
  
  // Handle comments change
  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };
  
  // Mock function to simulate getting current location
  const handleGetLocation = (position) => {
    // In a real implementation, this would use the browser's geolocation API
    // For now we'll just simulate with random coordinates
    const lat = (Math.random() * (49.5 - 48.5) + 48.5).toFixed(6);
    const long = (-Math.random() * (123.5 - 122.5) - 122.5).toFixed(6);
    
    if (position === 'start') {
      setBasicInfo({
        ...basicInfo,
        startLat: lat,
        startLong: long
      });
    } else {
      setBasicInfo({
        ...basicInfo,
        endLat: lat,
        endLong: long
      });
    }
    
    setStatusMessage('Location captured successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };
  
  // Save form data to localStorage
  const saveToLocalStorage = () => {
    const formData = {
      basicInfo,
      hazardFactors,
      consequenceFactors,
      showAdditionalFactors,
      geotechnicalFactors,
      infrastructureFactors,
      comments,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('roadRiskForm', JSON.stringify(formData));
  };
  
  // Save draft explicitly
  const handleSaveDraft = () => {
    saveToLocalStorage();
    setStatusMessage('Road risk assessment saved successfully!');
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('roadRiskForm');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setBasicInfo(parsedData.basicInfo);
      setHazardFactors(parsedData.hazardFactors);
      setConsequenceFactors(parsedData.consequenceFactors);
      setShowAdditionalFactors(parsedData.showAdditionalFactors);
      setGeotechnicalFactors(parsedData.geotechnicalFactors);
      setInfrastructureFactors(parsedData.infrastructureFactors);
      setComments(parsedData.comments);
    }
  }, []);
  
  // Calculate risk values for display
  const hazardScore = getTotalHazardScore();
  const consequenceScore = getTotalConsequenceScore();
  const riskScore = getRiskScore();
  const { category: riskCategory, color: riskColor } = getRiskCategory(riskScore);
  
  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
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
              Road Name
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              <div style={{display: 'flex'}}>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>Low</span>
                <span style={{flex: 3}}></span>
                <span style={{flex: 1, textAlign: 'center', fontSize: '0.8rem'}}>High</span>
              </div>
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
              {getRequirements(riskCategory)}
            </p>
          </div>
        </div>
        
        {/* Additional Factors Section (Toggle) */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div 
            style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setShowAdditionalFactors(!showAdditionalFactors)}
          >
            <h2 style={{fontSize: '1.2rem', color: '#1976D2', margin: 0}}>
              Additional Assessment Factors (Optional)
            </h2>
            <span style={{fontSize: '1.5rem', color: '#1976D2'}}>
              {showAdditionalFactors ? '−' : '+'}
            </span>
          </div>
          
          {showAdditionalFactors && (
            <div style={{marginTop: '15px'}}>
              <p style={{marginBottom: '15px', color: '#666', fontSize: '0.9rem'}}>
                These factors provide supplementary information but are not included in the numerical scoring.
              </p>
              
              <h3 style={{fontSize: '1rem', marginTop: '20px', marginBottom: '10px', color: '#1976D2'}}>
                Geotechnical Considerations
              </h3>
              
              <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px'}}>
                <thead>
                  <tr style={{backgroundColor: '#e9ecef'}}>
                    <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Factor</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>Low Risk</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>Moderate Risk</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>High Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Cut Slope Height</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="cutSlopeHeight" 
                        value="2"
                        checked={geotechnicalFactors.cutSlopeHeight === 2}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />&lt;3m
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="cutSlopeHeight" 
                        value="4"
                        checked={geotechnicalFactors.cutSlopeHeight === 4}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />3-6m
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="cutSlopeHeight" 
                        value="10"
                        checked={geotechnicalFactors.cutSlopeHeight === 10}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />&gt;6m
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Fill Slope Height</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="fillSlopeHeight" 
                        value="2"
                        checked={geotechnicalFactors.fillSlopeHeight === 2}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />&lt;3m
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="fillSlopeHeight" 
                        value="4"
                        checked={geotechnicalFactors.fillSlopeHeight === 4}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />3-6m
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="fillSlopeHeight" 
                        value="10"
                        checked={geotechnicalFactors.fillSlopeHeight === 10}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />&gt;6m
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Bedrock Condition</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="bedrockCondition" 
                        value="2"
                        checked={geotechnicalFactors.bedrockCondition === 2}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />Minimal jointing
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="bedrockCondition" 
                        value="4"
                        checked={geotechnicalFactors.bedrockCondition === 4}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />Moderate jointing
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="bedrockCondition" 
                        value="10"
                        checked={geotechnicalFactors.bedrockCondition === 10}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />Highly fractured
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Groundwater Conditions</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="groundwaterConditions" 
                        value="2"
                        checked={geotechnicalFactors.groundwaterConditions === 2}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />Dry, no seepage
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="groundwaterConditions" 
                        value="4"
                        checked={geotechnicalFactors.groundwaterConditions === 4}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />Seasonal seepage
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="groundwaterConditions" 
                        value="10"
                        checked={geotechnicalFactors.groundwaterConditions === 10}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />Persistent seepage
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Erosion Evidence</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="erosionEvidence" 
                        value="2"
                        checked={geotechnicalFactors.erosionEvidence === 2}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />None
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="erosionEvidence" 
                        value="4"
                        checked={geotechnicalFactors.erosionEvidence === 4}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />Minor rilling/gullying
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="erosionEvidence" 
                        value="10"
                        checked={geotechnicalFactors.erosionEvidence === 10}
                        onChange={handleGeotechnicalChange}
                      />
                      <br />Active erosion
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <h3 style={{fontSize: '1rem', marginTop: '20px', marginBottom: '10px', color: '#1976D2'}}>
                Infrastructure Elements
              </h3>
              
              <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '10px'}}>
                <thead>
                  <tr style={{backgroundColor: '#e9ecef'}}>
                    <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Factor</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>Low Risk</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>Moderate Risk</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>High Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Road Surface Type</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="roadSurfaceType" 
                        value="2"
                        checked={infrastructureFactors.roadSurfaceType === 2}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Well-maintained gravel
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="roadSurfaceType" 
                        value="4"
                        checked={infrastructureFactors.roadSurfaceType === 4}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Basic gravel, some rutting
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="roadSurfaceType" 
                        value="10"
                        checked={infrastructureFactors.roadSurfaceType === 10}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Native material, significant rutting
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Ditch Condition</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="ditchCondition" 
                        value="2"
                        checked={infrastructureFactors.ditchCondition === 2}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Clean, well-defined
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="ditchCondition" 
                        value="4"
                        checked={infrastructureFactors.ditchCondition === 4}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Partially vegetated
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="ditchCondition" 
                        value="10"
                        checked={infrastructureFactors.ditchCondition === 10}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Filled with sediment/debris
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Culvert Sizing</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="culvertSizing" 
                        value="2"
                        checked={infrastructureFactors.culvertSizing === 2}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Adequately sized
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="culvertSizing" 
                        value="4"
                        checked={infrastructureFactors.culvertSizing === 4}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Slightly undersized
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="culvertSizing" 
                        value="10"
                        checked={infrastructureFactors.culvertSizing === 10}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Significantly undersized
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Culvert Condition</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="culvertCondition" 
                        value="2"
                        checked={infrastructureFactors.culvertCondition === 2}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Good condition
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="culvertCondition" 
                        value="4"
                        checked={infrastructureFactors.culvertCondition === 4}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Minor deformation
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="culvertCondition" 
                        value="10"
                        checked={infrastructureFactors.culvertCondition === 10}
                        onChange={handleInfrastructureChange}
                      />
                      <br />Significant deformation
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #dee2e6'}}>Road Age</td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="roadAge" 
                        value="2"
                        checked={infrastructureFactors.roadAge === 2}
                        onChange={handleInfrastructureChange}
                      />
                      <br />&lt;5 years
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="roadAge" 
                        value="4"
                        checked={infrastructureFactors.roadAge === 4}
                        onChange={handleInfrastructureChange}
                      />
                      <br />5-15 years
                    </td>
                    <td style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #dee2e6'}}>
                      <input 
                        type="radio" 
                        name="roadAge" 
                        value="10"
                        checked={infrastructureFactors.roadAge === 10}
                        onChange={handleInfrastructureChange}
                      />
                      <br />&gt;15 years without maintenance
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
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
        
        <div style={{marginTop: '30px', display: 'flex', justifyContent: 'space-between'}}>
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
              fontSize: '1rem'
            }}
          >
            Save Assessment
          </button>
        </div>
      </form>
    </div>
  );
}

export default RoadRiskForm;