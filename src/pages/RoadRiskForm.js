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

  // State for hazard factors
  const [hazardFactors, setHazardFactors] = useState(() => {
    // Load from localStorage if available, otherwise use default values
    const savedFactors = localStorage.getItem('roadRiskHazardFactors');
    return savedFactors ? JSON.parse(savedFactors) : {
      terrainStability: null,
      slopeGrade: null,
      geologySoil: null,
      drainageConditions: null,
      roadFailureHistory: null
    };
  });

  // State for consequence factors
  const [consequenceFactors, setConsequenceFactors] = useState(() => {
    // Load from localStorage if available, otherwise use default values
    const savedFactors = localStorage.getItem('roadRiskConsequenceFactors');
    return savedFactors ? JSON.parse(savedFactors) : {
      proximityToWater: null,
      drainageStructure: null,
      publicIndustrialUse: null,
      environmentalValue: null
    };
  });

  // State for hazard scores explanation
  const hazardScoreExplanations = {
    terrainStability: {
      2: 'Stable terrain (slopes <40%)',
      4: 'Moderately stable (slopes 40-60%)',
      6: 'Potentially unstable (slopes >60%)',
      10: 'Unstable terrain (Class IV/V or high frequency/vuln.)'
    },
    slopeGrade: {
      2: 'Low grade (<8%)',
      4: 'Moderate grade (8-12%)',
      6: 'Steep grade (12-18%)',
      10: 'Very steep grade (>18%)'
    },
    geologySoil: {
      2: 'Cohesive, stable soils/bedrock',
      4: 'Moderately stable soils',
      6: 'Loose, erodible soils',
      10: 'Highly erodible soils/talus deposits'
    },
    drainageConditions: {
      2: 'Well-drained, minimal surface water',
      4: 'Moderate drainage issues',
      6: 'Poor drainage, standing water',
      10: 'Severe drainage issues, seepage/springs'
    },
    roadFailureHistory: {
      2: 'No previous failures',
      4: 'Minor historical issues',
      6: 'Moderate historical failures',
      10: 'Frequent/significant failures'
    }
  };

  // State for consequence scores explanation
  const consequenceScoreExplanations = {
    proximityToWater: {
      2: 'No water resources nearby (>100m)',
      4: 'Non-fish bearing stream (30-100m)',
      6: 'Fish bearing stream (10-30m)',
      10: 'Adjacent to fish stream (<10m) or drinking water intake'
    },
    drainageStructure: {
      2: 'Adequate for 100+ year events',
      4: 'Adequate for 50-year events',
      6: 'Adequate for 25-year events',
      10: 'Undersized or deteriorating'
    },
    publicIndustrialUse: {
      2: 'Minimal use (wilderness road)',
      4: 'Low volume industrial use',
      6: 'Moderate public/industrial use',
      10: 'High volume/mainline road'
    },
    environmentalValue: {
      2: 'No significant values',
      4: 'Standard riparian/wildlife values',
      6: 'Important habitat or cultural areas',
      10: 'Critical habitat or culturally significant site'
    }
  };
  
  // Save basic info to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('roadRiskBasicInfo', JSON.stringify(basicInfo));
  }, [basicInfo]);
  
  // Save hazard factors to localStorage when they change
  useEffect(() => {
    localStorage.setItem('roadRiskHazardFactors', JSON.stringify(hazardFactors));
  }, [hazardFactors]);

  // Save consequence factors to localStorage when they change
  useEffect(() => {
    localStorage.setItem('roadRiskConsequenceFactors', JSON.stringify(consequenceFactors));
  }, [consequenceFactors]);
  
  // Handle basic info input changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle hazard factor selection
  const handleHazardFactorChange = (factor, value) => {
    setHazardFactors(prev => ({ ...prev, [factor]: value }));
  };

  // Handle consequence factor selection
  const handleConsequenceFactorChange = (factor, value) => {
    setConsequenceFactors(prev => ({ ...prev, [factor]: value }));
  };

  // Calculate hazard score
  const calculateHazardScore = () => {
    let total = 0;
    let factorCount = 0;
    
    Object.values(hazardFactors).forEach(value => {
      if (value !== null) {
        total += value;
        factorCount++;
      }
    });
    
    return factorCount > 0 ? total : 0;
  };

  // Calculate consequence score
  const calculateConsequenceScore = () => {
    let total = 0;
    let factorCount = 0;
    
    Object.values(consequenceFactors).forEach(value => {
      if (value !== null) {
        total += value;
        factorCount++;
      }
    });
    
    return factorCount > 0 ? total : 0;
  };

  // Calculate total risk score (hazard x consequence)
  const calculateRiskScore = () => {
    const hazardScore = calculateHazardScore();
    const consequenceScore = calculateConsequenceScore();
    
    return hazardScore * consequenceScore;
  };

  // Determine risk category
  const getRiskCategory = () => {
    const riskScore = calculateRiskScore();
    
    if (riskScore >= 300) return { category: 'Very High', color: '#d32f2f' };
    if (riskScore >= 200) return { category: 'High', color: '#f57c00' };
    if (riskScore >= 100) return { category: 'Moderate', color: '#fbc02d' };
    if (riskScore >= 50) return { category: 'Low', color: '#689f38' };
    return { category: 'Very Low', color: '#388e3c' };
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
      
      setHazardFactors({
        terrainStability: null,
        slopeGrade: null,
        geologySoil: null,
        drainageConditions: null,
        roadFailureHistory: null
      });

      setConsequenceFactors({
        proximityToWater: null,
        drainageStructure: null,
        publicIndustrialUse: null,
        environmentalValue: null
      });
      
      alert('Form has been reset.');
    }
  };

  // Get color class for score button
  const getScoreButtonColorClass = (score) => {
    switch (score) {
      case 2: return 'green';
      case 4: return 'yellow';
      case 6: return 'orange';
      case 10: return 'red';
      default: return '';
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
            Select the appropriate rating for each factor based on field observations.
          </p>
          
          {/* Terrain Stability */}
          <div className="factor-group">
            <h3 className="factor-header">Terrain Stability</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`terrain-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.terrainStability === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('terrainStability', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{hazardScoreExplanations.terrainStability[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Slope Grade */}
          <div className="factor-group">
            <h3 className="factor-header">Slope Grade</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`slope-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.slopeGrade === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('slopeGrade', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{hazardScoreExplanations.slopeGrade[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Geology/Soil */}
          <div className="factor-group">
            <h3 className="factor-header">Geology/Soil</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`geology-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.geologySoil === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('geologySoil', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{hazardScoreExplanations.geologySoil[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Drainage Conditions */}
          <div className="factor-group">
            <h3 className="factor-header">Drainage Conditions</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`drainage-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.drainageConditions === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('drainageConditions', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{hazardScoreExplanations.drainageConditions[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Road Failure History */}
          <div className="factor-group">
            <h3 className="factor-header">Road Failure History</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`failure-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.roadFailureHistory === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('roadFailureHistory', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{hazardScoreExplanations.roadFailureHistory[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Hazard Total Score */}
          <div className="factor-total">
            <span className="factor-total-label">Hazard Total Score:</span>
            <span className="factor-total-value">{calculateHazardScore()}</span>
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
            Select the appropriate rating for each consequence factor.
          </p>
          
          {/* Proximity to Water */}
          <div className="factor-group">
            <h3 className="factor-header">Proximity to Water</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`water-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${consequenceFactors.proximityToWater === score ? 'selected' : ''}`}
                  onClick={() => handleConsequenceFactorChange('proximityToWater', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{consequenceScoreExplanations.proximityToWater[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Drainage Structure */}
          <div className="factor-group">
            <h3 className="factor-header">Drainage Structure</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`drainage-structure-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${consequenceFactors.drainageStructure === score ? 'selected' : ''}`}
                  onClick={() => handleConsequenceFactorChange('drainageStructure', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{consequenceScoreExplanations.drainageStructure[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Public/Industrial Use */}
          <div className="factor-group">
            <h3 className="factor-header">Public/Industrial Use</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`public-use-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${consequenceFactors.publicIndustrialUse === score ? 'selected' : ''}`}
                  onClick={() => handleConsequenceFactorChange('publicIndustrialUse', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{consequenceScoreExplanations.publicIndustrialUse[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Environmental Value */}
          <div className="factor-group">
            <h3 className="factor-header">Environmental Value</h3>
            <div className="score-buttons">
              {[2, 4, 6, 10].map((score) => (
                <button
                  key={`env-value-${score}`}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${consequenceFactors.environmentalValue === score ? 'selected' : ''}`}
                  onClick={() => handleConsequenceFactorChange('environmentalValue', score)}
                >
                  <span className="score-value">{score}</span>
                  <span className="score-label">{consequenceScoreExplanations.environmentalValue[score]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Consequence Total Score */}
          <div className="factor-total">
            <span className="factor-total-label">Consequence Total Score:</span>
            <span className="factor-total-value">{calculateConsequenceScore()}</span>
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
          
          {/* Geotechnical Considerations */}
          <div className="factor-group">
            <h3 className="factor-header">Geotechnical Considerations</h3>
            <table className="assessment-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Low Risk</th>
                  <th>Moderate Risk</th>
                  <th>High Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cut Slope Height</td>
                  <td>&lt;3m</td>
                  <td>3-6m</td>
                  <td>&gt;6m</td>
                </tr>
                <tr>
                  <td>Fill Slope Height</td>
                  <td>&lt;3m</td>
                  <td>3-6m</td>
                  <td>&gt;6m</td>
                </tr>
                <tr>
                  <td>Bedrock Condition</td>
                  <td>Minimal jointing, favorable orientation</td>
                  <td>Moderate jointing</td>
                  <td>Highly fractured, adverse orientation</td>
                </tr>
                <tr>
                  <td>Groundwater Conditions</td>
                  <td>Dry, no seepage</td>
                  <td>Seasonal seepage</td>
                  <td>Persistent seepage, springs</td>
                </tr>
                <tr>
                  <td>Erosion Evidence</td>
                  <td>None</td>
                  <td>Minor rilling/gullying</td>
                  <td>Active erosion, undercutting</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Infrastructure Elements */}
          <div className="factor-group">
            <h3 className="factor-header">Infrastructure Elements</h3>
            <table className="assessment-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Low Risk</th>
                  <th>Moderate Risk</th>
                  <th>High Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Road Surface Type</td>
                  <td>Well-maintained gravel</td>
                  <td>Basic gravel, some rutting</td>
                  <td>Native material, significant rutting</td>
                </tr>
                <tr>
                  <td>Ditch Condition</td>
                  <td>Clean, well-defined</td>
                  <td>Partially vegetated, minor deposits</td>
                  <td>Filled with sediment/debris</td>
                </tr>
                <tr>
                  <td>Culvert Sizing</td>
                  <td>Adequately sized, aligned with natural drainage</td>
                  <td>Slightly undersized</td>
                  <td>Significantly undersized, misaligned</td>
                </tr>
                <tr>
                  <td>Culvert Condition</td>
                  <td>Good condition, no deformation</td>
                  <td>Minor deformation/rusting</td>
                  <td>Significant deformation, crushed ends</td>
                </tr>
                <tr>
                  <td>Road Age</td>
                  <td>&lt;5 years</td>
                  <td>5-15 years</td>
                  <td>&gt;15 years without major maintenance</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Photo Documentation */}
          <div className="factor-group">
            <h3 className="factor-header">Photo Documentation</h3>
            <p>Capture photos of key features to document current conditions.</p>
            <div className="photo-upload-section">
              <div className="photo-upload-box">
                <div className="upload-placeholder">+ Add Photo</div>
                <p className="upload-label">Road Surface</p>
              </div>
              <div className="photo-upload-box">
                <div className="upload-placeholder">+ Add Photo</div>
                <p className="upload-label">Drainage Features</p>
              </div>
              <div className="photo-upload-box">
                <div className="upload-placeholder">+ Add Photo</div>
                <p className="upload-label">Slope Conditions</p>
              </div>
              <div className="photo-upload-box">
                <div className="upload-placeholder">+ Add Photo</div>
                <p className="upload-label">Problem Areas</p>
              </div>
            </div>
          </div>
          
          {/* Comments & Observations */}
          <div className="factor-group">
            <h3 className="factor-header">Comments & Observations</h3>
            <textarea 
              className="comments-area" 
              placeholder="Enter additional observations, notes or special considerations..."
              rows={5}
            ></textarea>
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
          
          <div className="results-summary">
            <div className="results-card">
              <h3 className="results-subtitle">Risk Calculation</h3>
              <div className="results-calculation">
                <div className="calc-group">
                  <span className="calc-label">Hazard Score:</span>
                  <span className="calc-value">{calculateHazardScore()}</span>
                </div>
                <div className="calc-operator">×</div>
                <div className="calc-group">
                  <span className="calc-label">Consequence Score:</span>
                  <span className="calc-value">{calculateConsequenceScore()}</span>
                </div>
                <div className="calc-operator">=</div>
                <div className="calc-group">
                  <span className="calc-label">Risk Score:</span>
                  <span className="calc-value risk-total">{calculateRiskScore()}</span>
                </div>
              </div>
              
              <div className="risk-category" style={{ backgroundColor: getRiskCategory().color }}>
                <h3 className="risk-category-label">Risk Category</h3>
                <div className="risk-category-value">{getRiskCategory().category}</div>
              </div>
              
              <div className="category-requirements">
                <h3 className="requirements-header">Professional Requirements</h3>
                {getRiskCategory().category === 'Very High' && (
                  <div className="requirements-content">
                    <p><strong>Professional Team:</strong> Full professional team with CRP and specialist PORs. Geometric design required. Multiple field reviews.</p>
                    <p><strong>Inspection Frequency:</strong> Frequent during wet season, annual otherwise.</p>
                    <p><strong>Documentation:</strong> Formal assurance statements, detailed documentation package, LRM database entry, inspections and risk mitigation.</p>
                  </div>
                )}
                {getRiskCategory().category === 'High' && (
                  <div className="requirements-content">
                    <p><strong>Professional Team:</strong> CRP and road activity POR (may be same person for simple roads). Specialist consultation. Field reviews at critical stages.</p>
                    <p><strong>Inspection Frequency:</strong> Annual.</p>
                    <p><strong>Documentation:</strong> Assurance statements, documentation of field reviews, maintenance/inspection or deactivation plans.</p>
                  </div>
                )}
                {getRiskCategory().category === 'Moderate' && (
                  <div className="requirements-content">
                    <p><strong>Professional Team:</strong> CRP and road activity POR oversight. Standard designs with field verification.</p>
                    <p><strong>Inspection Frequency:</strong> Bi-annual.</p>
                    <p><strong>Documentation:</strong> Basic assurance documentation, regular monitoring schedule.</p>
                  </div>
                )}
                {getRiskCategory().category === 'Low' && (
                  <div className="requirements-content">
                    <p><strong>Professional Team:</strong> Standard oversight by qualified professionals. Routine field reviews.</p>
                    <p><strong>Inspection Frequency:</strong> Not official.</p>
                    <p><strong>Documentation:</strong> Standard recordkeeping for events.</p>
                  </div>
                )}
                {getRiskCategory().category === 'Very Low' && (
                  <div className="requirements-content">
                    <p><strong>Professional Team:</strong> Routine professional oversight.</p>
                    <p><strong>Inspection Frequency:</strong> During routine maintenance.</p>
                    <p><strong>Documentation:</strong> Basic documentation in Quick Capture app.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="action-recommendations">
            <h3 className="recommendations-header">Recommended Actions</h3>
            <ul className="recommendations-list">
              {getRiskCategory().category === 'Very High' && (
                <>
                  <li>Immediate professional assessment required</li>
                  <li>Implement access controls until remediation complete</li>
                  <li>Develop comprehensive risk mitigation plan</li>
                  <li>Schedule frequent monitoring during wet season</li>
                  <li>Allocate budget for major engineering works</li>
                </>
              )}
              {getRiskCategory().category === 'High' && (
                <>
                  <li>Professional assessment required within 30 days</li>
                  <li>Develop maintenance/inspection plan</li>
                  <li>Consider temporary drainage improvements</li>
                  <li>Schedule annual professional inspection</li>
                  <li>Plan for potential major repairs in next budget cycle</li>
                </>
              )}
              {getRiskCategory().category === 'Moderate' && (
                <>
                  <li>Schedule professional field verification</li>
                  <li>Implement standard monitoring protocol</li>
                  <li>Conduct routine maintenance of drainage structures</li>
                  <li>Document changes in conditions</li>
                  <li>Review during bi-annual inspection cycle</li>
                </>
              )}
              {getRiskCategory().category === 'Low' && (
                <>
                  <li>Maintain standard documentation</li>
                  <li>Include in routine maintenance schedule</li>
                  <li>No immediate action required</li>
                  <li>Monitor during normal operations</li>
                </>
              )}
              {getRiskCategory().category === 'Very Low' && (
                <>
                  <li>No specific action required</li>
                  <li>Document in Quick Capture app during routine visits</li>
                  <li>Follow standard maintenance procedures</li>
                </>
              )}
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
