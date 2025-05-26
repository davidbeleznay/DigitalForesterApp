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

  // Matrix Risk Assessment State - Updated for new system
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

  // Apply professional override - Fixed function name
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
      
      {/* Hazard, Consequence, Optional sections would go here - truncated for length */}
      
      {/* Results Section - Simplified display */}
      {activeSection === 'results' && (
        <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
          <h2 className="section-header" style={{ color: '#4caf50' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
            Risk Assessment Results
          </h2>
          
          <p className="section-description">
            Risk calculation using Hazard × Consequence methodology.
          </p>
          
          {riskAssessment ? (
            <>
              {/* Final Risk Assessment Display */}
              <div className="final-risk-display">
                <div className="final-risk-header">
                  <h3>Final Risk Assessment</h3>
                </div>
                <div 
                  className="final-risk-result"
                  style={{ 
                    backgroundColor: riskAssessment.isOverridden 
                      ? riskAssessment.finalColor
                      : riskAssessment.color 
                  }}
                >
                  <span className="final-risk-label">Overall Risk Level:</span>
                  <span className="final-risk-value">
                    {riskAssessment.isOverridden ? riskAssessment.finalRisk : riskAssessment.riskLevel}
                  </span>
                  <span className="final-risk-score">
                    (Score: {riskAssessment.riskScore})
                  </span>
                </div>
                <div className="final-risk-reasoning">
                  {riskAssessment.isOverridden 
                    ? `Professional override applied: ${riskAssessment.overrideJustification}`
                    : riskAssessment.reasoning
                  }
                </div>
              </div>

              {/* Risk Ranges Display */}
              <div className="risk-ranges-display">
                <h3>Risk Ranges</h3>
                <div className="ranges-grid">
                  <div className="range-item low">
                    <span className="range-label">Low Risk:</span>
                    <span className="range-values">64-250</span>
                  </div>
                  <div className="range-item moderate">
                    <span className="range-label">Moderate Risk:</span>
                    <span className="range-values">251-750</span>
                  </div>
                  <div className="range-item high">
                    <span className="range-label">High Risk:</span>
                    <span className="range-values">751-1400</span>
                  </div>
                  <div className="range-item very-high">
                    <span className="range-label">Very High Risk:</span>
                    <span className="range-values">1401-2000</span>
                  </div>
                </div>
              </div>

              {/* Professional Override Section */}
              <div className="professional-override-section">
                <div className="override-header">
                  <h3>Professional Override</h3>
                  <p>Override the calculated risk level based on additional professional considerations.</p>
                </div>

                {!showOverride && !riskAssessment.isOverridden && (
                  <div className="override-controls">
                    <div className="current-risk-display">
                      <span className="current-risk-label">Current Risk:</span>
                      <span className="current-risk-value" style={{ backgroundColor: riskAssessment.color }}>
                        {riskAssessment.riskLevel}
                      </span>
                      <span className="current-risk-score">(Score: {riskAssessment.riskScore})</span>
                    </div>
                    <button 
                      className="override-button primary"
                      onClick={() => setShowOverride(true)}
                    >
                      Apply Professional Override
                    </button>
                    <p className="override-description">
                      Use this if site-specific conditions, local knowledge, or professional judgment 
                      suggests a different risk level than calculated.
                    </p>
                  </div>
                )}

                {showOverride && (
                  <div className="override-form">
                    <div className="override-inputs">
                      <div className="current-vs-override">
                        <div className="current-assessment">
                          <span className="assessment-label">Current Risk:</span>
                          <span className="assessment-value" style={{ backgroundColor: riskAssessment.color }}>
                            {riskAssessment.riskLevel}
                          </span>
                          <span className="assessment-score">(Score: {riskAssessment.riskScore})</span>
                        </div>
                        <div className="override-arrow">↓</div>
                        <div className="override-selection">
                          <label>Override to:</label>
                          <select 
                            value={overrideRiskLevel} 
                            onChange={(e) => setOverrideRiskLevel(e.target.value)}
                          >
                            <option value="">Select Risk Level</option>
                            {matrixCalculator.getRiskLevels().map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="override-field">
                        <label>Justification for Override (Required):</label>
                        <textarea
                          value={overrideJustification}
                          onChange={(e) => setOverrideJustification(e.target.value)}
                          placeholder="Explain the professional reasoning for overriding the calculated risk level..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="override-actions">
                      <button 
                        className="override-button primary"
                        onClick={applyOverride}
                        disabled={!overrideJustification.trim() || !overrideRiskLevel}
                      >
                        Apply Override
                      </button>
                      <button 
                        className="override-button secondary"
                        onClick={() => setShowOverride(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {riskAssessment.isOverridden && (
                  <div className="override-applied">
                    <div className="override-summary">
                      <h4>Professional Override Applied</h4>
                      <div className="override-change-display">
                        <div className="original-risk">
                          <span className="change-label">Original:</span>
                          <span className="change-value" style={{ backgroundColor: riskAssessment.color }}>
                            {riskAssessment.riskLevel}
                          </span>
                          <span className="change-score">(Score: {riskAssessment.riskScore})</span>
                        </div>
                        <div className="change-arrow">→</div>
                        <div className="final-risk">
                          <span className="change-label">Final:</span>
                          <span className="change-value" style={{ backgroundColor: riskAssessment.finalColor }}>
                            {riskAssessment.finalRisk}
                          </span>
                          <span className="change-label">(Professional Override)</span>
                        </div>
                      </div>
                      <div className="override-justification">
                        <strong>Justification:</strong> {riskAssessment.overrideJustification}
                      </div>
                    </div>
                    <div className="override-actions">
                      <button 
                        className="override-button secondary"
                        onClick={modifyOverride}
                      >
                        Modify Override
                      </button>
                      <button 
                        className="override-button tertiary"
                        onClick={resetOverride}
                      >
                        Remove Override
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Risk Management Recommendations */}
              <div className="risk-recommendations">
                <h3>Recommended Actions</h3>
                <ul className="recommendations-list">
                  {(riskAssessment.isOverridden ? riskAssessment.finalRisk : riskAssessment.riskLevel) === 'Very High' && (
                    <>
                      <li>Immediate professional assessment required</li>
                      <li>Implement access controls until remediation complete</li>
                      <li>Develop comprehensive risk mitigation plan</li>
                      <li>Schedule frequent monitoring during wet season</li>
                      <li>Allocate budget for major engineering works</li>
                    </>
                  )}
                  {(riskAssessment.isOverridden ? riskAssessment.finalRisk : riskAssessment.riskLevel) === 'High' && (
                    <>
                      <li>Professional assessment required within 30 days</li>
                      <li>Develop maintenance/inspection plan</li>
                      <li>Consider temporary drainage improvements</li>
                      <li>Schedule annual professional inspection</li>
                      <li>Plan for potential major repairs in next budget cycle</li>
                    </>
                  )}
                  {(riskAssessment.isOverridden ? riskAssessment.finalRisk : riskAssessment.riskLevel) === 'Moderate' && (
                    <>
                      <li>Schedule professional field verification</li>
                      <li>Implement standard monitoring protocol</li>
                      <li>Conduct routine maintenance of drainage structures</li>
                      <li>Document changes in conditions</li>
                      <li>Review during bi-annual inspection cycle</li>
                    </>
                  )}
                  {(riskAssessment.isOverridden ? riskAssessment.finalRisk : riskAssessment.riskLevel) === 'Low' && (
                    <>
                      <li>Maintain standard documentation</li>
                      <li>Include in routine maintenance schedule</li>
                      <li>No immediate action required</li>
                      <li>Monitor during normal operations</li>
                    </>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="no-assessment">
              <p>Complete the Hazard and Consequence factor assessments to view risk results.</p>
            </div>
          )}
          
          <div className="section-nav-buttons">
            <button 
              type="button" 
              className="section-nav-button prev"
              onClick={() => setActiveSection('optional')}
            >
              Previous: Optional Assessments
            </button>
            <div></div>
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