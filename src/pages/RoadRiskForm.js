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
  const [overrideHazard, setOverrideHazard] = useState(null);
  const [overrideConsequence, setOverrideConsequence] = useState(null);
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
    if (!riskAssessment || !overrideJustification.trim()) return;
    
    const overridden = matrixCalculator.applyOverride(
      riskAssessment,
      overrideHazard,
      overrideConsequence,
      overrideJustification
    );
    
    setRiskAssessment(overridden);
    setShowOverride(false);
    
    localStorage.setItem('roadRiskOverride', JSON.stringify({
      overrideHazard,
      overrideConsequence,
      overrideJustification,
      timestamp: new Date().toISOString()
    }));
  };

  // Reset override
  const resetOverride = () => {
    setOverrideHazard(null);
    setOverrideConsequence(null);
    setOverrideJustification('');
    
    if (riskAssessment) {
      const reset = matrixCalculator.calculateInitialRisk(
        riskAssessment.hazard.score,
        riskAssessment.consequence.score
      );
      setRiskAssessment(reset);
    }
    
    localStorage.removeItem('roadRiskOverride');
  };

  // Modify override to allow re-editing - FIX FOR OVERRIDE BUG
  const modifyOverride = () => {
    setShowOverride(true);
    setOverrideHazard(riskAssessment.finalHazardLevel || riskAssessment.hazard.level);
    setOverrideConsequence(riskAssessment.finalConsequenceLevel || riskAssessment.consequence.level);
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
      setOverrideHazard(null);
      setOverrideConsequence(null);
      setOverrideJustification('');
      
      localStorage.removeItem('roadRiskOverride');
      
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
      
      {/* All sections here as before... */}
      
      {/* Results Section - Complete with override functionality */}
      {activeSection === 'results' && (
        <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
          <h2 className="section-header" style={{ color: '#4caf50' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
            Professional Risk Assessment Results
          </h2>
          
          <p className="section-description">
            Matrix-based professional risk assessment with optional override capability.
          </p>
          
          {riskAssessment ? (
            <>
              {/* Risk Calculation Display */}
              <div className="risk-calculation-flow">
                <div className="risk-component">
                  <div className="component-header">
                    <span className="component-label">Hazard Score: {riskAssessment.hazard.score}</span>
                    <span className="component-arrow">→</span>
                    <span className="component-level">{riskAssessment.hazard.level}</span>
                  </div>
                  <div className="component-reasoning">{riskAssessment.hazard.reasoning}</div>
                </div>
                
                <div className="matrix-operator">×</div>
                
                <div className="risk-component">
                  <div className="component-header">
                    <span className="component-label">Consequence Score: {riskAssessment.consequence.score}</span>
                    <span className="component-arrow">→</span>
                    <span className="component-level">{riskAssessment.consequence.level}</span>
                  </div>
                  <div className="component-reasoning">{riskAssessment.consequence.reasoning}</div>
                </div>
                
                <div className="matrix-operator">=</div>
                
                <div className="matrix-result" style={{ backgroundColor: riskAssessment.color }}>
                  <span className="result-label">Matrix Result:</span>
                  <span className="result-value">{riskAssessment.matrixRisk}</span>
                </div>
              </div>

              {/* Professional Override Section */}
              <div className="professional-override-section">
                <div className="override-header">
                  <h3>Professional Override</h3>
                  <p>Adjust risk levels based on additional professional considerations not captured in the standard assessment.</p>
                </div>

                {!showOverride && !riskAssessment.isOverridden && (
                  <div className="override-controls">
                    <button 
                      className="override-button primary"
                      onClick={() => setShowOverride(true)}
                    >
                      Apply Professional Override
                    </button>
                    <p className="override-description">
                      Use this if site-specific conditions, local knowledge, or professional judgment 
                      suggests different risk levels than calculated.
                    </p>
                  </div>
                )}

                {showOverride && (
                  <div className="override-form">
                    <div className="override-inputs">
                      <div className="override-field">
                        <label>Override Hazard Level:</label>
                        <select 
                          value={overrideHazard || riskAssessment.hazard.level} 
                          onChange={(e) => setOverrideHazard(e.target.value)}
                        >
                          {matrixCalculator.getRiskLevels().map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        <span className="current-value">
                          (Calculated: {riskAssessment.hazard.level})
                        </span>
                      </div>

                      <div className="override-field">
                        <label>Override Consequence Level:</label>
                        <select 
                          value={overrideConsequence || riskAssessment.consequence.level} 
                          onChange={(e) => setOverrideConsequence(e.target.value)}
                        >
                          {matrixCalculator.getRiskLevels().map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        <span className="current-value">
                          (Calculated: {riskAssessment.consequence.level})
                        </span>
                      </div>

                      <div className="override-field">
                        <label>Justification for Override (Required):</label>
                        <textarea
                          value={overrideJustification}
                          onChange={(e) => setOverrideJustification(e.target.value)}
                          placeholder="Explain the professional reasoning for overriding the calculated risk levels. Include specific site conditions, local knowledge, or other factors not captured in the standard assessment..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="override-actions">
                      <button 
                        className="override-button primary"
                        onClick={applyOverride}
                        disabled={!overrideJustification.trim()}
                      >
                        Apply Override
                      </button>
                      <button 
                        className="override-button secondary"
                        onClick={() => {
                          setShowOverride(false);
                          setOverrideHazard(null);
                          setOverrideConsequence(null);
                          setOverrideJustification('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {riskAssessment.isOverridden && (
                  <div className="override-summary">
                    <h4>Override Applied</h4>
                    <div className="override-details">
                      {riskAssessment.overrideDetails?.hazardChanged && (
                        <p><strong>Hazard Level:</strong> {riskAssessment.overrideDetails.originalHazard} → {riskAssessment.overrideDetails.newHazard}</p>
                      )}
                      {riskAssessment.overrideDetails?.consequenceChanged && (
                        <p><strong>Consequence Level:</strong> {riskAssessment.overrideDetails.originalConsequence} → {riskAssessment.overrideDetails.newConsequence}</p>
                      )}
                      <div className="override-justification">
                        <strong>Professional Justification:</strong>
                        <p>{riskAssessment.overrideJustification}</p>
                      </div>
                    </div>
                    <div className="override-management">
                      <button 
                        className="modify-override-button"
                        onClick={modifyOverride}
                      >
                        Modify Override
                      </button>
                      <button 
                        className="reset-override-button"
                        onClick={resetOverride}
                      >
                        Reset to Calculated Risk
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Final Risk Display */}
              <div className="final-risk-section">
                <div className="risk-category" style={{ backgroundColor: riskAssessment.finalColor }}>
                  <h3 className="risk-category-label">
                    {riskAssessment.isOverridden ? 'Final Risk Level (Professional Override Applied)' : 'Final Risk Level'}
                  </h3>
                  <div className="risk-category-value">{riskAssessment.finalRisk}</div>
                </div>

                <div className="category-requirements">
                  <h3 className="requirements-header">Professional Requirements</h3>
                  {riskAssessment.finalRisk === 'Very High' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> Full professional team with CRP and specialist PORs. Geometric design required. Multiple field reviews.</p>
                      <p><strong>Inspection Frequency:</strong> Frequent during wet season, annual otherwise.</p>
                      <p><strong>Documentation:</strong> Formal assurance statements, detailed documentation package, LRM database entry, inspections and risk mitigation.</p>
                    </div>
                  )}
                  {riskAssessment.finalRisk === 'High' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> CRP and road activity POR (may be same person for simple roads). Specialist consultation. Field reviews at critical stages.</p>
                      <p><strong>Inspection Frequency:</strong> Annual.</p>
                      <p><strong>Documentation:</strong> Assurance statements, documentation of field reviews, maintenance/inspection or deactivation plans.</p>
                    </div>
                  )}
                  {riskAssessment.finalRisk === 'Moderate' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> CRP and road activity POR oversight. Standard designs with field verification.</p>
                      <p><strong>Inspection Frequency:</strong> Bi-annual.</p>
                      <p><strong>Documentation:</strong> Basic assurance documentation, regular monitoring schedule.</p>
                    </div>
                  )}
                  {riskAssessment.finalRisk === 'Low' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> Standard oversight by qualified professionals. Routine field reviews.</p>
                      <p><strong>Inspection Frequency:</strong> As needed.</p>
                      <p><strong>Documentation:</strong> Standard recordkeeping for events.</p>
                    </div>
                  )}
                  {riskAssessment.finalRisk === 'Very Low' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> Routine professional oversight.</p>
                      <p><strong>Inspection Frequency:</strong> During routine maintenance.</p>
                      <p><strong>Documentation:</strong> Basic documentation in Quick Capture app.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="action-recommendations">
                <h3 className="recommendations-header">Recommended Actions</h3>
                <ul className="recommendations-list">
                  {riskAssessment.finalRisk === 'Very High' && (
                    <>
                      <li>Immediate professional assessment required</li>
                      <li>Implement access controls until remediation complete</li>
                      <li>Develop comprehensive risk mitigation plan</li>
                      <li>Schedule frequent monitoring during wet season</li>
                      <li>Allocate budget for major engineering works</li>
                    </>
                  )}
                  {riskAssessment.finalRisk === 'High' && (
                    <>
                      <li>Professional assessment required within 30 days</li>
                      <li>Develop maintenance/inspection plan</li>
                      <li>Consider temporary drainage improvements</li>
                      <li>Schedule annual professional inspection</li>
                      <li>Plan for potential major repairs in next budget cycle</li>
                    </>
                  )}
                  {riskAssessment.finalRisk === 'Moderate' && (
                    <>
                      <li>Schedule professional field verification</li>
                      <li>Implement standard monitoring protocol</li>
                      <li>Conduct routine maintenance of drainage structures</li>
                      <li>Document changes in conditions</li>
                      <li>Review during bi-annual inspection cycle</li>
                    </>
                  )}
                  {riskAssessment.finalRisk === 'Low' && (
                    <>
                      <li>Maintain standard documentation</li>
                      <li>Include in routine maintenance schedule</li>
                      <li>No immediate action required</li>
                      <li>Monitor during normal operations</li>
                    </>
                  )}
                  {riskAssessment.finalRisk === 'Very Low' && (
                    <>
                      <li>No specific action required</li>
                      <li>Document in Quick Capture app during routine visits</li>
                      <li>Follow standard maintenance procedures</li>
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