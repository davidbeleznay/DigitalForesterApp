import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MatrixRiskAssessment from '../utils/MatrixRiskAssessment';
import '../styles/RoadRiskForm.css';
import '../styles/MatrixRiskAssessment.css';

function RoadRiskForm() {
  // State for active section
  const [activeSection, setActiveSection] = useState('basic');
  
  // State for basic information
  const [basicInfo, setBasicInfo] = useState(() => {
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
    const savedFactors = localStorage.getItem('roadRiskHazardFactors');
    return savedFactors ? JSON.parse(savedFactors) : {
      terrainStability: null,
      slopeGrade: null,
      geologySoil: null,
      drainageConditions: null,
      roadFailureHistory: null,
      comments: ''
    };
  });

  // State for consequence factors
  const [consequenceFactors, setConsequenceFactors] = useState(() => {
    const savedFactors = localStorage.getItem('roadRiskConsequenceFactors');
    return savedFactors ? JSON.parse(savedFactors) : {
      proximityToWater: null,
      drainageStructure: null,
      publicIndustrialUse: null,
      environmentalValue: null,
      comments: ''
    };
  });

  // State for optional assessment toggles
  const [optionalAssessments, setOptionalAssessments] = useState(() => {
    const savedAssessments = localStorage.getItem('roadRiskOptionalAssessments');
    return savedAssessments ? JSON.parse(savedAssessments) : {
      geotechnicalEnabled: false,
      infrastructureEnabled: false,
      comments: ''
    };
  });

  // State for geotechnical factors
  const [geotechnicalFactors, setGeotechnicalFactors] = useState(() => {
    const savedFactors = localStorage.getItem('roadRiskGeotechnicalFactors');
    return savedFactors ? JSON.parse(savedFactors) : {
      cutSlopeHeight: 'low',
      fillSlopeHeight: 'low',
      bedrockCondition: 'low',
      groundwaterConditions: 'low',
      erosionEvidence: 'low'
    };
  });

  // State for infrastructure factors
  const [infrastructureFactors, setInfrastructureFactors] = useState(() => {
    const savedFactors = localStorage.getItem('roadRiskInfrastructureFactors');
    return savedFactors ? JSON.parse(savedFactors) : {
      roadSurfaceType: 'low',
      ditchCondition: 'low',
      culvertSizing: 'low',
      culvertCondition: 'low',
      roadAge: 'low'
    };
  });

  // Matrix Risk Assessment State
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideRiskLevel, setOverrideRiskLevel] = useState('');
  const [overrideJustification, setOverrideJustification] = useState('');
  const [matrixCalculator] = useState(new MatrixRiskAssessment());

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
  
  // Save states to localStorage when they change
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
    localStorage.setItem('roadRiskOptionalAssessments', JSON.stringify(optionalAssessments));
  }, [optionalAssessments]);

  useEffect(() => {
    localStorage.setItem('roadRiskGeotechnicalFactors', JSON.stringify(geotechnicalFactors));
  }, [geotechnicalFactors]);

  useEffect(() => {
    localStorage.setItem('roadRiskInfrastructureFactors', JSON.stringify(infrastructureFactors));
  }, [infrastructureFactors]);
  
  // Handle basic info input changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle hazard factor selection
  const handleHazardFactorChange = (factor, value) => {
    setHazardFactors(prev => ({ ...prev, [factor]: value }));
  };

  // Handle hazard comments change
  const handleHazardCommentsChange = (e) => {
    setHazardFactors(prev => ({ ...prev, comments: e.target.value }));
  };

  // Handle consequence factor selection
  const handleConsequenceFactorChange = (factor, value) => {
    setConsequenceFactors(prev => ({ ...prev, [factor]: value }));
  };

  // Handle consequence comments change
  const handleConsequenceCommentsChange = (e) => {
    setConsequenceFactors(prev => ({ ...prev, comments: e.target.value }));
  };

  // Handle optional assessment toggle
  const handleOptionalAssessmentToggle = (assessment) => {
    setOptionalAssessments(prev => ({ 
      ...prev, 
      [assessment]: !prev[assessment] 
    }));
  };

  // Handle comments change
  const handleCommentsChange = (e) => {
    setOptionalAssessments(prev => ({
      ...prev,
      comments: e.target.value
    }));
  };

  // Handle geotechnical factor change
  const handleGeotechnicalFactorChange = (factor, value) => {
    setGeotechnicalFactors(prev => ({
      ...prev,
      [factor]: value
    }));
  };

  // Handle infrastructure factor change
  const handleInfrastructureFactorChange = (factor, value) => {
    setInfrastructureFactors(prev => ({
      ...prev,
      [factor]: value
    }));
  };

  // Calculate hazard score
  const calculateHazardScore = () => {
    let total = 0;
    let factorCount = 0;
    
    const scoringFactors = ['terrainStability', 'slopeGrade', 'geologySoil', 'drainageConditions', 'roadFailureHistory'];
    
    scoringFactors.forEach(factor => {
      if (hazardFactors[factor] !== null) {
        total += hazardFactors[factor];
        factorCount++;
      }
    });
    
    return factorCount > 0 ? total : 0;
  };

  // Calculate consequence score
  const calculateConsequenceScore = () => {
    let total = 0;
    let factorCount = 0;
    
    const scoringFactors = ['proximityToWater', 'drainageStructure', 'publicIndustrialUse', 'environmentalValue'];
    
    scoringFactors.forEach(factor => {
      if (consequenceFactors[factor] !== null) {
        total += consequenceFactors[factor];
        factorCount++;
      }
    });
    
    return factorCount > 0 ? total : 0;
  };

  // Calculate matrix risk assessment
  const calculateMatrixRisk = () => {
    const hazardScore = calculateHazardScore();
    const consequenceScore = calculateConsequenceScore();
    
    if (hazardScore > 0 && consequenceScore > 0) {
      const assessment = matrixCalculator.calculateInitialRisk(hazardScore, consequenceScore);
      setRiskAssessment(assessment);
      return assessment;
    }
    return null;
  };

  // Apply professional override
  const applyOverride = () => {
    if (!riskAssessment || !overrideJustification.trim() || !overrideRiskLevel) return;
    
    const overridden = matrixCalculator.applyDirectOverride(
      riskAssessment,
      overrideRiskLevel,
      overrideJustification
    );
    
    setRiskAssessment(overridden);
    setShowOverride(false);
    
    localStorage.setItem('roadRiskDirectOverride', JSON.stringify({
      overrideRiskLevel,
      overrideJustification,
      timestamp: new Date().toISOString()
    }));
  };

  // Reset override
  const resetOverride = () => {
    setOverrideRiskLevel('');
    setOverrideJustification('');
    
    if (riskAssessment) {
      const reset = matrixCalculator.calculateInitialRisk(
        riskAssessment.hazard.score,
        riskAssessment.consequence.score
      );
      setRiskAssessment(reset);
    }
    
    localStorage.removeItem('roadRiskDirectOverride');
  };

  // Modify override to allow re-editing
  const modifyOverride = () => {
    setShowOverride(true);
    setOverrideRiskLevel(riskAssessment.finalRisk);
    setOverrideJustification(riskAssessment.overrideJustification || '');
  };

  // Use GPS location for start coordinates
  const handleUseStartGpsLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBasicInfo(prev => ({
            ...prev,
            startLat: position.coords.latitude.toFixed(6),
            startLong: position.coords.longitude.toFixed(6)
          }));
          alert('GPS coordinates captured successfully for start point!');
        },
        (error) => {
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser/device');
    }
  };

  // Use GPS location for end coordinates
  const handleUseEndGpsLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBasicInfo(prev => ({
            ...prev,
            endLat: position.coords.latitude.toFixed(6),
            endLong: position.coords.longitude.toFixed(6)
          }));
          alert('GPS coordinates captured successfully for end point!');
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
        roadFailureHistory: null,
        comments: ''
      });

      setConsequenceFactors({
        proximityToWater: null,
        drainageStructure: null,
        publicIndustrialUse: null,
        environmentalValue: null,
        comments: ''
      });

      setOptionalAssessments({
        geotechnicalEnabled: false,
        infrastructureEnabled: false,
        comments: ''
      });

      setGeotechnicalFactors({
        cutSlopeHeight: 'low',
        fillSlopeHeight: 'low',
        bedrockCondition: 'low',
        groundwaterConditions: 'low',
        erosionEvidence: 'low'
      });

      setInfrastructureFactors({
        roadSurfaceType: 'low',
        ditchCondition: 'low',
        culvertSizing: 'low',
        culvertCondition: 'low',
        roadAge: 'low'
      });

      setRiskAssessment(null);
      setShowOverride(false);
      setOverrideRiskLevel('');
      setOverrideJustification('');
      
      localStorage.removeItem('roadRiskDirectOverride');
      
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

  // Calculate risk when navigating to results
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (activeSection === 'results') {
      calculateMatrixRisk();
    }
  }, [activeSection, hazardFactors, consequenceFactors]);

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
        <div className="form-section">
          <h2 className="section-header">
            <span className="section-accent"></span>
            Basic Information
          </h2>
          
          <div className="form-group">
            <label htmlFor="roadName">Road Name/Segment*</label>
            <input
              type="text"
              id="roadName"
              name="roadName"
              value={basicInfo.roadName}
              onChange={handleBasicInfoChange}
              required
              placeholder="Enter road name or segment identifier"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startKm">Start KM*</label>
              <input
                type="number"
                id="startKm"
                name="startKm"
                value={basicInfo.startKm}
                onChange={handleBasicInfoChange}
                required
                placeholder="0.0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endKm">End KM*</label>
              <input
                type="number"
                id="endKm"
                name="endKm"
                value={basicInfo.endKm}
                onChange={handleBasicInfoChange}
                required
                placeholder="0.0"
              />
            </div>
          </div>
          
          <div className="location-section">
            <h3>Start Coordinates</h3>
            <div className="form-row">
              <div className="form-group">  
                <label htmlFor="startLat">Latitude</label>
                <input
                  type="number"
                  id="startLat"
                  name="startLat"
                  value={basicInfo.startLat}
                  onChange={handleBasicInfoChange}
                  placeholder="-123.456789"
                  step="0.000001"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="startLong">Longitude</label>
                <input
                  type="number"
                  id="startLong"
                  name="startLong"
                  value={basicInfo.startLong}
                  onChange={handleBasicInfoChange}
                  placeholder="49.123456"
                  step="0.000001"
                />
              </div>
              
              <button 
                type="button" 
                className="gps-button"
                onClick={handleUseStartGpsLocation}
              >
                Use Current Location
              </button>
            </div>
          </div>
          
          <div className="location-section">
            <h3>End Coordinates</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="endLat">Latitude</label>
                <input
                  type="number"
                  id="endLat"
                  name="endLat"
                  value={basicInfo.endLat}
                  onChange={handleBasicInfoChange}
                  placeholder="-123.456789"
                  step="0.000001"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endLong">Longitude</label>
                <input
                  type="number"
                  id="endLong"
                  name="endLong"
                  value={basicInfo.endLong}
                  onChange={handleBasicInfoChange}
                  placeholder="49.123456"
                  step="0.000001"
                />
              </div>
              
              <button 
                type="button" 
                className="gps-button"
                onClick={handleUseEndGpsLocation}
              >
                Use Current Location
              </button>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assessmentDate">Assessment Date*</label>
              <input
                type="date"
                id="assessmentDate"
                name="assessmentDate"
                value={basicInfo.assessmentDate}
                onChange={handleBasicInfoChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="assessor">Assessor Name*</label>
              <input
                type="text"
                id="assessor"
                name="assessor"
                value={basicInfo.assessor}
                onChange={handleBasicInfoChange}
                required
                placeholder="Your name"
              />
            </div>
          </div>
          
          <div className="section-nav-buttons">
            <div></div>
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
            Assess the physical conditions that contribute to the likelihood of road failure. 
            Each factor is rated on a scale where higher scores indicate greater risk.
          </p>

          {/* Terrain Stability */}
          <div className="hazard-factor">
            <h3 className="factor-title">Terrain Stability</h3>
            <p className="factor-description">
              Assess the overall stability of terrain surrounding the road segment, considering slope steepness, geological conditions, and historical stability.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.terrainStability === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('terrainStability', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{hazardScoreExplanations.terrainStability[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Slope Grade */}
          <div className="hazard-factor">
            <h3 className="factor-title">Slope Grade</h3>
            <p className="factor-description">
              Evaluate the average gradient of the road segment, as steeper grades increase erosion potential and runoff velocity.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.slopeGrade === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('slopeGrade', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{hazardScoreExplanations.slopeGrade[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Geology and Soil Conditions */}
          <div className="hazard-factor">
            <h3 className="factor-title">Geology and Soil Conditions</h3>
            <p className="factor-description">
              Consider the type of soils and bedrock present, focusing on their susceptibility to erosion, weathering, and mass movement.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.geologySoil === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('geologySoil', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{hazardScoreExplanations.geologySoil[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Drainage Conditions */}
          <div className="hazard-factor">
            <h3 className="factor-title">Drainage Conditions</h3>
            <p className="factor-description">
              Assess the effectiveness of surface and subsurface drainage, including ditches, culverts, and natural drainage patterns.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.drainageConditions === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('drainageConditions', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{hazardScoreExplanations.drainageConditions[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Road Failure History */}
          <div className="hazard-factor">
            <h3 className="factor-title">Road Failure History</h3>
            <p className="factor-description">
              Review any documented history of road failures, washouts, or maintenance issues in this segment or similar nearby areas.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${hazardFactors.roadFailureHistory === score ? 'selected' : ''}`}
                  onClick={() => handleHazardFactorChange('roadFailureHistory', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{hazardScoreExplanations.roadFailureHistory[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Hazard Comments Section */}
          <div className="full-width-comments">
            <h4>
              <span className="comments-icon">📝</span>
              Additional Hazard Observations
            </h4>
            <textarea
              id="hazard-comments"
              value={hazardFactors.comments}
              onChange={handleHazardCommentsChange}
              placeholder="Document any additional hazard observations, specific site conditions, or factors not captured above... Include details about weather conditions, seasonal variations, unusual geological features, or any other relevant hazard factors that may influence road stability."
              rows={5}
            />
            <div className="comments-helper-text">
              Use this space to provide detailed context about hazard conditions, including seasonal variations, 
              specific measurements, or observations that may not be fully captured in the scoring system above.
            </div>
          </div>

          {/* Current Hazard Score Display */}
          <div className="hazard-score-summary">
            <h4>Current Hazard Assessment</h4>
            <div className="score-summary">
              <div className="score-item">
                <span className="score-label">Total Hazard Score:</span>
                <span className="score-value">{calculateHazardScore()}</span>
              </div>
              <div className="factors-completed">
                {Object.entries(hazardFactors).filter(([key, value]) => key !== 'comments' && value !== null).length} / 5 factors assessed
              </div>
            </div>
          </div>

          {/* Section Navigation */}
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
        <div className="form-section" style={{ borderTop: '4px solid #f44336' }}>
          <h2 className="section-header" style={{ color: '#f44336' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #f44336, #ef5350)' }}></span>
            Consequence Factors
          </h2>
          
          <p className="section-description">
            Evaluate the potential impacts if road failure occurs. These factors assess the severity of environmental, 
            economic, and social consequences rather than the likelihood of failure.
          </p>

          {/* Proximity to Water Resources */}
          <div className="consequence-factor">
            <h3 className="factor-title">Proximity to Water Resources</h3>
            <p className="factor-description">
              Consider the distance to streams, lakes, wetlands, and drinking water sources. Closer proximity increases 
              potential for sediment delivery and water quality impacts.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${consequenceFactors.proximityToWater === score ? 'selected' : ''}`}
                  onClick={() => handleConsequenceFactorChange('proximityToWater', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{consequenceScoreExplanations.proximityToWater[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Drainage Structure Adequacy */}
          <div className="consequence-factor">
            <h3 className="factor-title">Drainage Structure Adequacy</h3>
            <p className="factor-description">
              Assess whether existing culverts, bridges, and drainage systems can handle expected peak flows, 
              including consideration of climate change projections.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${consequenceFactors.drainageStructure === score ? 'selected' : ''}`}
                  onClick={() => handleConsequenceFactorChange('drainageStructure', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{consequenceScoreExplanations.drainageStructure[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Public and Industrial Use */}
          <div className="consequence-factor">
            <h3 className="factor-title">Public and Industrial Use</h3>
            <p className="factor-description">
              Evaluate the importance of the road for public access, emergency services, and industrial operations. 
              Higher use levels increase consequences of road closure or failure.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${consequenceFactors.publicIndustrialUse === score ? 'selected' : ''}`}
                  onClick={() => handleConsequenceFactorChange('publicIndustrialUse', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{consequenceScoreExplanations.publicIndustrialUse[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Environmental and Cultural Values */}
          <div className="consequence-factor">
            <h3 className="factor-title">Environmental and Cultural Values</h3>
            <p className="factor-description">
              Consider the presence of sensitive ecosystems, wildlife habitat, archaeological sites, or areas of 
              cultural significance that could be impacted by road failure or sediment delivery.
            </p>
            <div className="score-buttons">
              {[2, 4, 6, 10].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`score-button ${getScoreButtonColorClass(score)} ${consequenceFactors.environmentalValue === score ? 'selected' : ''}`}
                  onClick={() => handleConsequenceFactorChange('environmentalValue', score)}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-description">{consequenceScoreExplanations.environmentalValue[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Consequence Comments Section */}
          <div className="full-width-comments">
            <h4>
              <span className="comments-icon">🎯</span>
              Additional Impact Considerations
            </h4>
            <textarea
              id="consequence-comments"
              value={consequenceFactors.comments}
              onChange={handleConsequenceCommentsChange}
              placeholder="Document any additional consequence considerations, specific values at risk, or impact factors not captured above... Include details about downstream infrastructure, sensitive areas, economic impacts, emergency access requirements, or other consequences of potential road failure."
              rows={5}
            />
            <div className="comments-helper-text">
              Consider documenting specific downstream infrastructure, economic impacts, emergency access considerations, 
              or unique environmental/cultural values that could be affected by road failure.
            </div>
          </div>

          {/* Current Consequence Score Display */}
          <div className="consequence-score-summary">
            <h4>Current Consequence Assessment</h4>
            <div className="score-summary">
              <div className="score-item">
                <span className="score-label">Total Consequence Score:</span>
                <span className="score-value">{calculateConsequenceScore()}</span>
              </div>
              <div className="factors-completed">
                {Object.entries(consequenceFactors).filter(([key, value]) => key !== 'comments' && value !== null).length} / 4 factors assessed
              </div>
            </div>
          </div>

          {/* Section Navigation */}
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
      
      {/* Results Section */}
      {activeSection === 'results' && (
        <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
          <h2 className="section-header" style={{ color: '#4caf50' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
            Risk Assessment Results
          </h2>
          
          {riskAssessment ? (
            <div className="matrix-risk-assessment">
              <div className="risk-results-summary">
                <div className="risk-score-display">
                  <div className="score-item">
                    <span className="score-label">Hazard Score:</span>
                    <span className="score-value">{riskAssessment.hazard.score}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Consequence Score:</span>
                    <span className="score-value">{riskAssessment.consequence.score}</span>
                  </div>
                  <div className={`risk-level-display ${riskAssessment.finalRisk.toLowerCase()}-risk`}>
                    <span className="risk-level-label">Risk Level:</span>
                    <span className="risk-level-value">{riskAssessment.finalRisk.toUpperCase()}</span>
                  </div>
                </div>
                
                {riskAssessment.isOverridden && (
                  <div className="override-indicator">
                    <h4>Professional Override Applied</h4>
                    <p><strong>Original Risk Level:</strong> {riskAssessment.originalRisk}</p>
                    <p><strong>Overridden to:</strong> {riskAssessment.finalRisk}</p>
                    <p><strong>Justification:</strong> {riskAssessment.overrideJustification}</p>
                    <div className="override-actions">
                      <button 
                        type="button" 
                        className="override-button modify"
                        onClick={modifyOverride}
                      >
                        Modify Override
                      </button>
                      <button 
                        type="button" 
                        className="override-button reset"
                        onClick={resetOverride}
                      >
                        Remove Override
                      </button>
                    </div>
                  </div>
                )}
                
                {!riskAssessment.isOverridden && (
                  <div className="professional-override-section">
                    <h4>Professional Override</h4>
                    <p>If professional judgment suggests a different risk level, you can override the matrix result:</p>
                    <button 
                      type="button" 
                      className="override-button show"
                      onClick={() => setShowOverride(true)}
                    >
                      Apply Professional Override
                    </button>
                  </div>
                )}
                
                {showOverride && (
                  <div className="override-form">
                    <h4>Professional Override</h4>
                    <div className="form-group">
                      <label htmlFor="override-risk-level">Override Risk Level:</label>
                      <select
                        id="override-risk-level"
                        value={overrideRiskLevel}
                        onChange={(e) => setOverrideRiskLevel(e.target.value)}
                      >
                        <option value="">Select Risk Level</option>
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        <option value="Extreme">Extreme</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="override-justification">Justification:</label>
                      <textarea
                        id="override-justification"
                        value={overrideJustification}
                        onChange={(e) => setOverrideJustification(e.target.value)}
                        placeholder="Provide detailed justification for the override..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="override-actions">
                      <button 
                        type="button" 
                        className="override-button apply"
                        onClick={applyOverride}
                        disabled={!overrideRiskLevel || !overrideJustification.trim()}
                      >
                        Apply Override
                      </button>
                      <button 
                        type="button" 
                        className="override-button cancel"
                        onClick={() => setShowOverride(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-results">
              <p>Complete the Hazard and Consequence factor assessments to see risk calculation results.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Fixed Action Buttons */}
      <div className="form-actions">
        <button 
          type="button" 
          className="action-button save"
          onClick={handleSaveProgress}
        >
          Save Progress
        </button>
        <button 
          type="button" 
          className="action-button reset"
          onClick={handleResetForm}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
}

export default RoadRiskForm;