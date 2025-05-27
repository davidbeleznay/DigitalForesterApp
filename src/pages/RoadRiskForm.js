// Road Risk Assessment Form - Complete Implementation
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoadRiskForm = () => {
  const navigate = useNavigate();

  // Form sections
  const [activeSection, setActiveSection] = useState('basic');

  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    assessmentDate: new Date().toISOString().split('T')[0],
    roadName: '',
    assessor: '',
    location: '',
    weatherConditions: '',
    notes: ''
  });

  // Hazard Factors State
  const [hazardFactors, setHazardFactors] = useState({
    slope: null,
    soilStability: null,
    drainageAdequacy: null,
    roadSurfaceCondition: null,
    vegetationCover: null
  });

  // Consequence Factors State
  const [consequenceFactors, setConsequenceFactors] = useState({
    environmentalSensitivity: null,
    downstreamInfrastructure: null,
    accessImportance: null,
    economicImpact: null
  });

  // Optional Assessments State
  const [optionalAssessments, setOptionalAssessments] = useState({
    geotechnicalEnabled: false,
    infrastructureEnabled: false,
    geotechnical: {},
    infrastructure: {}
  });

  // Results and Override State
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideRiskLevel, setOverrideRiskLevel] = useState('');
  const [overrideJustification, setOverrideJustification] = useState('');

  // Calculate Risk Assessment
  const calculateRiskAssessment = () => {
    // Check if required assessments are complete
    const hazardComplete = Object.values(hazardFactors).filter((val, idx) => idx < 5 && val !== null).length === 5;
    const consequenceComplete = Object.values(consequenceFactors).filter((val, idx) => idx < 4 && val !== null).length === 4;

    if (!hazardComplete || !consequenceComplete) {
      setRiskAssessment(null);
      return;
    }

    // Calculate hazard score
    const hazardScore = Object.values(hazardFactors).reduce((sum, val) => sum + (val || 0), 0);
    const hazardLevel = hazardScore <= 10 ? 'Low' : hazardScore <= 15 ? 'Moderate' : hazardScore <= 20 ? 'High' : 'Very High';

    // Calculate consequence score
    const consequenceScore = Object.values(consequenceFactors).reduce((sum, val) => sum + (val || 0), 0);
    const consequenceLevel = consequenceScore <= 8 ? 'Low' : consequenceScore <= 12 ? 'Moderate' : consequenceScore <= 16 ? 'High' : 'Very High';

    // Risk Matrix Calculation
    const riskMatrix = {
      'Low-Low': 'Low',
      'Low-Moderate': 'Low',
      'Low-High': 'Moderate',
      'Low-Very High': 'Moderate',
      'Moderate-Low': 'Low',
      'Moderate-Moderate': 'Moderate',
      'Moderate-High': 'High',
      'Moderate-Very High': 'High',
      'High-Low': 'Moderate',
      'High-Moderate': 'High',
      'High-High': 'High',
      'High-Very High': 'Very High',
      'Very High-Low': 'Moderate',
      'Very High-Moderate': 'High',
      'Very High-High': 'Very High',
      'Very High-Very High': 'Very High'
    };

    const riskKey = `${hazardLevel}-${consequenceLevel}`;
    const calculatedRisk = riskMatrix[riskKey];
    const riskScore = hazardScore * consequenceScore;

    // Risk reasoning
    const reasoning = `Based on ${hazardLevel.toLowerCase()} hazard conditions (score: ${hazardScore}) and ${consequenceLevel.toLowerCase()} potential consequences (score: ${consequenceScore}), the calculated risk level is ${calculatedRisk.toLowerCase()}.`;

    const assessment = {
      hazard: {
        score: hazardScore,
        level: hazardLevel,
        description: `${hazardLevel} hazard conditions based on slope, soil stability, drainage, road surface, and vegetation factors.`
      },
      consequence: {
        score: consequenceScore,
        level: consequenceLevel,
        description: `${consequenceLevel} potential consequences considering environmental sensitivity, infrastructure, access importance, and economic impact.`
      },
      riskLevel: calculatedRisk,
      finalRisk: calculatedRisk,
      riskScore: riskScore,
      reasoning: reasoning,
      isOverridden: false
    };

    setRiskAssessment(assessment);
  };

  // Apply Professional Override
  const applyOverride = () => {
    if (!overrideRiskLevel || !overrideJustification.trim()) return;

    setRiskAssessment(prev => ({
      ...prev,
      finalRisk: overrideRiskLevel,
      isOverridden: true,
      overrideJustification: overrideJustification
    }));

    setShowOverride(false);
    setOverrideRiskLevel('');
    setOverrideJustification('');
  };

  // Reset Override
  const resetOverride = () => {
    setRiskAssessment(prev => ({
      ...prev,
      finalRisk: prev.riskLevel,
      isOverridden: false,
      overrideJustification: ''
    }));
  };

  // Modify Override
  const modifyOverride = () => {
    setOverrideRiskLevel(riskAssessment.finalRisk);
    setOverrideJustification(riskAssessment.overrideJustification);
    setShowOverride(true);
  };

  // Calculate risk whenever factors change
  useEffect(() => {
    calculateRiskAssessment();
  }, [hazardFactors, consequenceFactors]);

  // Handle basic info changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle hazard factor changes
  const handleHazardFactorChange = (factor, value) => {
    setHazardFactors(prev => ({
      ...prev,
      [factor]: parseInt(value)
    }));
  };

  // Handle consequence factor changes
  const handleConsequenceFactorChange = (factor, value) => {
    setConsequenceFactors(prev => ({
      ...prev,
      [factor]: parseInt(value)
    }));
  };

  // Section navigation
  const sections = [
    { id: 'basic', title: 'Basic Information', icon: '📝' },
    { id: 'hazard', title: 'Hazard Factors', icon: '⚠️' },
    { id: 'consequence', title: 'Consequence Factors', icon: '🎯' },
    { id: 'optional', title: 'Optional Assessments', icon: '📊' },
    { id: 'results', title: 'Results', icon: '📈' }
  ];

  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>🛣️ Road Risk Assessment</h1>
        <p>Comprehensive risk evaluation for forest road segments</p>
        <button 
          onClick={() => navigate('/')} 
          className="back-button"
        >
          ← Back to Home
        </button>
      </div>

      {/* Section Navigation */}
      <div className="section-navigation">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-title">{section.title}</span>
          </button>
        ))}
      </div>

      <div className="form-content">
        {/* Basic Information Section */}
        {activeSection === 'basic' && (
          <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
            <h2 className="section-header" style={{ color: '#2196f3' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
              Basic Information
            </h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="assessmentDate">Assessment Date</label>
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
                <label htmlFor="roadName">Road Name/ID</label>
                <input
                  type="text"
                  id="roadName"
                  name="roadName"
                  value={basicInfo.roadName}
                  onChange={handleBasicInfoChange}
                  placeholder="e.g., Forest Service Road 123"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assessor">Assessor Name</label>
                <input
                  type="text"
                  id="assessor"
                  name="assessor"
                  value={basicInfo.assessor}
                  onChange={handleBasicInfoChange}
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location Description</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={basicInfo.location}
                  onChange={handleBasicInfoChange}
                  placeholder="GPS coordinates or landmark description"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weatherConditions">Weather Conditions</label>
                <select
                  id="weatherConditions"
                  name="weatherConditions"
                  value={basicInfo.weatherConditions}
                  onChange={handleBasicInfoChange}
                >
                  <option value="">Select conditions</option>
                  <option value="dry">Dry</option>
                  <option value="recent-rain">Recent Rain</option>
                  <option value="wet">Wet</option>
                  <option value="snow">Snow</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={basicInfo.notes}
                  onChange={handleBasicInfoChange}
                  rows={3}
                  placeholder="Any additional observations or context"
                />
              </div>
            </div>
          </div>
        )}

        {/* Hazard Factors Section */}
        {activeSection === 'hazard' && (
          <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
            <h2 className="section-header" style={{ color: '#ff9800' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #ff9800, #ffb74d)' }}></span>
              Hazard Factors Assessment
            </h2>

            <div className="hazard-factors">
              {/* Slope */}
              <div className="factor-group">
                <h3>Road Slope</h3>
                <p>Evaluate the steepness of the road segment</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'Gentle (0-5%)', description: 'Very stable, minimal erosion risk' },
                    { value: 2, label: 'Moderate (5-15%)', description: 'Generally stable with proper drainage' },
                    { value: 3, label: 'Steep (15-25%)', description: 'Increased erosion and stability concerns' },
                    { value: 4, label: 'Very Steep (25-35%)', description: 'High risk of erosion and failure' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="slope"
                        value={option.value}
                        checked={hazardFactors.slope === option.value}
                        onChange={(e) => handleHazardFactorChange('slope', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Soil Stability */}
              <div className="factor-group">
                <h3>Soil Stability</h3>
                <p>Assess the stability and erosion potential of roadway soils</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'Very Stable', description: 'Rocky, well-consolidated soils' },
                    { value: 2, label: 'Stable', description: 'Firm soils with good structure' },
                    { value: 3, label: 'Moderately Stable', description: 'Some erosion potential, manageable' },
                    { value: 4, label: 'Unstable', description: 'High erosion potential, loose soils' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="soilStability"
                        value={option.value}
                        checked={hazardFactors.soilStability === option.value}
                        onChange={(e) => handleHazardFactorChange('soilStability', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Drainage Adequacy */}
              <div className="factor-group">
                <h3>Drainage Adequacy</h3>
                <p>Evaluate the effectiveness of current drainage systems</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'Excellent', description: 'Well-designed, functioning drainage' },
                    { value: 2, label: 'Good', description: 'Adequate drainage with minor issues' },
                    { value: 3, label: 'Fair', description: 'Some drainage problems, needs attention' },
                    { value: 4, label: 'Poor', description: 'Inadequate drainage, frequent problems' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="drainageAdequacy"
                        value={option.value}
                        checked={hazardFactors.drainageAdequacy === option.value}
                        onChange={(e) => handleHazardFactorChange('drainageAdequacy', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Road Surface Condition */}
              <div className="factor-group">
                <h3>Road Surface Condition</h3>
                <p>Assess the current condition of the road surface</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'Excellent', description: 'Well-maintained, stable surface' },
                    { value: 2, label: 'Good', description: 'Minor wear, generally stable' },
                    { value: 3, label: 'Fair', description: 'Moderate wear, some maintenance needed' },
                    { value: 4, label: 'Poor', description: 'Significant deterioration, safety concerns' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="roadSurfaceCondition"
                        value={option.value}
                        checked={hazardFactors.roadSurfaceCondition === option.value}
                        onChange={(e) => handleHazardFactorChange('roadSurfaceCondition', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vegetation Cover */}
              <div className="factor-group">
                <h3>Vegetation Cover</h3>
                <p>Evaluate vegetation stability and erosion protection</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'Dense/Stable', description: 'Excellent erosion protection' },
                    { value: 2, label: 'Good Coverage', description: 'Good erosion protection' },
                    { value: 3, label: 'Moderate Coverage', description: 'Some erosion protection' },
                    { value: 4, label: 'Sparse Coverage', description: 'Limited erosion protection' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="vegetationCover"
                        value={option.value}
                        checked={hazardFactors.vegetationCover === option.value}
                        onChange={(e) => handleHazardFactorChange('vegetationCover', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total Score Display */}
              <div className="total-score-display">
                <div className="total-score-label">Total Hazard Score:</div>
                <div className="total-score-value">
                  {Object.values(hazardFactors).reduce((sum, val) => sum + (val || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consequence Factors Section */}
        {activeSection === 'consequence' && (
          <div className="form-section" style={{ borderTop: '4px solid #f44336' }}>
            <h2 className="section-header" style={{ color: '#f44336' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #f44336, #ef5350)' }}></span>
              Consequence Factors Assessment
            </h2>

            <div className="consequence-factors">
              {/* Environmental Sensitivity */}
              <div className="factor-group">
                <h3>Environmental Sensitivity</h3>
                <p>Assess potential environmental impacts of road failure</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'Low Sensitivity', description: 'Minimal environmental concerns' },
                    { value: 2, label: 'Moderate Sensitivity', description: 'Some environmental considerations' },
                    { value: 3, label: 'High Sensitivity', description: 'Important environmental values' },
                    { value: 4, label: 'Critical Sensitivity', description: 'Protected or critical habitats' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="environmentalSensitivity"
                        value={option.value}
                        checked={consequenceFactors.environmentalSensitivity === option.value}
                        onChange={(e) => handleConsequenceFactorChange('environmentalSensitivity', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Downstream Infrastructure */}
              <div className="factor-group">
                <h3>Downstream Infrastructure</h3>
                <p>Evaluate potential impacts to downstream facilities</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'No Infrastructure', description: 'No downstream facilities at risk' },
                    { value: 2, label: 'Minor Infrastructure', description: 'Low-value facilities or remote areas' },
                    { value: 3, label: 'Moderate Infrastructure', description: 'Important facilities or access routes' },
                    { value: 4, label: 'Critical Infrastructure', description: 'Essential facilities or major routes' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="downstreamInfrastructure"
                        value={option.value}
                        checked={consequenceFactors.downstreamInfrastructure === option.value}
                        onChange={(e) => handleConsequenceFactorChange('downstreamInfrastructure', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Access Importance */}
              <div className="factor-group">
                <h3>Access Importance</h3>
                <p>Evaluate the importance of maintaining road access</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'Low Importance', description: 'Minimal impact if access lost' },
                    { value: 2, label: 'Moderate Importance', description: 'Some impact, alternatives available' },
                    { value: 3, label: 'High Importance', description: 'Significant impact, limited alternatives' },
                    { value: 4, label: 'Critical Importance', description: 'Essential access, no alternatives' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="accessImportance"
                        value={option.value}
                        checked={consequenceFactors.accessImportance === option.value}
                        onChange={(e) => handleConsequenceFactorChange('accessImportance', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Economic Impact */}
              <div className="factor-group">
                <h3>Economic Impact</h3>
                <p>Assess potential economic consequences of road failure</p>
                <div className="rating-options">
                  {[
                    { value: 1, label: 'Minimal Impact', description: 'Low economic consequences' },
                    { value: 2, label: 'Low Impact', description: 'Some economic impact, manageable' },
                    { value: 3, label: 'Moderate Impact', description: 'Significant economic consequences' },
                    { value: 4, label: 'High Impact', description: 'Major economic losses, regional impact' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="economicImpact"
                        value={option.value}
                        checked={consequenceFactors.economicImpact === option.value}
                        onChange={(e) => handleConsequenceFactorChange('economicImpact', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total Score Display */}
              <div className="total-score-display">
                <div className="total-score-label">Total Consequence Score:</div>
                <div className="total-score-value">
                  {Object.values(consequenceFactors).reduce((sum, val) => sum + (val || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optional Assessments Section */}
        {activeSection === 'optional' && (
          <div className="form-section" style={{ borderTop: '4px solid #9c27b0' }}>
            <h2 className="section-header" style={{ color: '#9c27b0' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #9c27b0, #ba68c8)' }}></span>
              Optional Detailed Assessments
            </h2>

            <div className="optional-assessments">
              <p className="section-description">
                These additional assessments provide more detailed analysis for complex situations.
                They are not required for the basic risk calculation but can inform decision-making.
              </p>

              <div className="assessment-toggles">
                <div className="assessment-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={optionalAssessments.geotechnicalEnabled}
                      onChange={(e) => setOptionalAssessments(prev => ({
                        ...prev,
                        geotechnicalEnabled: e.target.checked
                      }))}
                    />
                    <span className="toggle-content">
                      <strong>🏔️ Geotechnical Assessment</strong>
                      <p>Detailed soil and slope stability analysis</p>
                    </span>
                  </label>
                </div>

                <div className="assessment-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={optionalAssessments.infrastructureEnabled}
                      onChange={(e) => setOptionalAssessments(prev => ({
                        ...prev,
                        infrastructureEnabled: e.target.checked
                      }))}
                    />
                    <span className="toggle-content">
                      <strong>🏗️ Infrastructure Assessment</strong>
                      <p>Detailed analysis of culverts, bridges, and structures</p>
                    </span>
                  </label>
                </div>
              </div>

              {optionalAssessments.geotechnicalEnabled && (
                <div className="detailed-assessment">
                  <h3>🏔️ Geotechnical Assessment</h3>
                  <p>This section would contain detailed geotechnical evaluation fields.</p>
                  <div className="placeholder-notice">
                    <p>📝 Detailed geotechnical assessment form would be implemented here.</p>
                  </div>
                </div>
              )}

              {optionalAssessments.infrastructureEnabled && (
                <div className="detailed-assessment">
                  <h3>🏗️ Infrastructure Assessment</h3>
                  <p>This section would contain detailed infrastructure evaluation fields.</p>
                  <div className="placeholder-notice">
                    <p>📝 Detailed infrastructure assessment form would be implemented here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section - Enhanced */}
        {activeSection === 'results' && (
          <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
            <h2 className="section-header" style={{ color: '#4caf50' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
              Risk Assessment Results
            </h2>
            
            {riskAssessment ? (
              <div className="risk-results-container">
                {/* Risk Calculation Flow */}
                <div className="risk-calculation-display">
                  <div className="calculation-step">
                    <div className="step-header">
                      <span className="step-number">1</span>
                      <h4>Hazard Assessment</h4>
                    </div>
                    <div className="score-card hazard-card">
                      <div className="score-main">
                        <span className="score-value">{riskAssessment.hazard.score}</span>
                        <span className="score-label">Total Score</span>
                      </div>
                      <div className="score-description">
                        {riskAssessment.hazard.description}
                      </div>
                    </div>
                  </div>

                  <div className="calculation-operator">
                    <span className="operator-symbol">×</span>
                    <span className="operator-label">Risk Matrix</span>
                  </div>

                  <div className="calculation-step">
                    <div className="step-header">
                      <span className="step-number">2</span>
                      <h4>Consequence Assessment</h4>
                    </div>
                    <div className="score-card consequence-card">
                      <div className="score-main">
                        <span className="score-value">{riskAssessment.consequence.score}</span>
                        <span className="score-label">Total Score</span>
                      </div>
                      <div className="score-description">
                        {riskAssessment.consequence.description}
                      </div>
                    </div>
                  </div>

                  <div className="calculation-operator">
                    <span className="operator-symbol">=</span>
                    <span className="operator-label">Final Result</span>
                  </div>

                  <div className="calculation-step">
                    <div className="step-header">
                      <span className="step-number">3</span>
                      <h4>Risk Level</h4>
                    </div>
                    <div className={`score-card risk-result-card ${riskAssessment.finalRisk.toLowerCase().replace(' ', '-')}-risk`}>
                      <div className="risk-level-main">
                        <span className="risk-level-badge">{riskAssessment.finalRisk.toUpperCase()}</span>
                        <span className="risk-score-display">Score: {riskAssessment.riskScore}</span>
                      </div>
                      <div className="risk-reasoning">
                        {riskAssessment.reasoning}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Summary Card */}
                <div className="risk-summary-card">
                  <div className="summary-header">
                    <h3>Assessment Summary</h3>
                    <div className={`risk-status-badge ${riskAssessment.finalRisk.toLowerCase().replace(' ', '-')}-risk`}>
                      {riskAssessment.finalRisk.toUpperCase()} RISK
                    </div>
                  </div>
                  
                  <div className="summary-details">
                    <div className="detail-item">
                      <span className="detail-label">Assessment Date:</span>
                      <span className="detail-value">{basicInfo.assessmentDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Road Segment:</span>
                      <span className="detail-value">{basicInfo.roadName || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Assessor:</span>
                      <span className="detail-value">{basicInfo.assessor || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Calculation Method:</span>
                      <span className="detail-value">Hazard × Consequence Matrix</span>
                    </div>
                  </div>
                </div>

                {/* Professional Override Section */}
                {riskAssessment.isOverridden ? (
                  <div className="override-applied-card">
                    <div className="override-header">
                      <h4>🔄 Professional Override Applied</h4>
                    </div>
                    <div className="override-details">
                      <div className="override-comparison">
                        <div className="original-result">
                          <span className="comparison-label">Original Assessment:</span>
                          <span className="comparison-value">{riskAssessment.riskLevel}</span>
                        </div>
                        <div className="override-arrow">→</div>
                        <div className="override-result">
                          <span className="comparison-label">Professional Override:</span>
                          <span className={`comparison-value ${riskAssessment.finalRisk.toLowerCase().replace(' ', '-')}-risk`}>
                            {riskAssessment.finalRisk}
                          </span>
                        </div>
                      </div>
                      <div className="override-justification">
                        <strong>Justification:</strong>
                        <p>{riskAssessment.overrideJustification}</p>
                      </div>
                      <div className="override-actions">
                        <button 
                          type="button" 
                          className="override-action-button modify"
                          onClick={modifyOverride}
                        >
                          Modify Override
                        </button>
                        <button 
                          type="button" 
                          className="override-action-button remove"
                          onClick={resetOverride}
                        >
                          Remove Override
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="professional-override-card">
                    <div className="override-header">
                      <h4>⚖️ Professional Override</h4>
                      <p>If professional judgment suggests a different risk level, you can override the calculated result:</p>
                    </div>
                    <button 
                      type="button" 
                      className="show-override-button"
                      onClick={() => setShowOverride(true)}
                    >
                      Apply Professional Override
                    </button>
                  </div>
                )}

                {/* Override Form */}
                {showOverride && (
                  <div className="override-form-card">
                    <div className="override-form-header">
                      <h4>Apply Professional Override</h4>
                      <p>Override the calculated risk level based on professional judgment and site-specific factors.</p>
                    </div>
                    
                    <div className="override-form-content">
                      <div className="form-group">
                        <label htmlFor="override-risk-level">Override Risk Level:</label>
                        <select
                          id="override-risk-level"
                          value={overrideRiskLevel}
                          onChange={(e) => setOverrideRiskLevel(e.target.value)}
                          className="override-select"
                        >
                          <option value="">Select Risk Level</option>
                          <option value="Low">Low Risk</option>
                          <option value="Moderate">Moderate Risk</option>
                          <option value="High">High Risk</option>
                          <option value="Very High">Very High Risk</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="override-justification">Professional Justification:</label>
                        <textarea
                          id="override-justification"
                          value={overrideJustification}
                          onChange={(e) => setOverrideJustification(e.target.value)}
                          placeholder="Provide detailed professional justification for the override, including specific site conditions, professional experience, or additional factors not captured in the standard assessment..."
                          rows={5}
                          className="override-textarea"
                          required
                        />
                      </div>
                      
                      <div className="override-form-actions">
                        <button 
                          type="button" 
                          className="override-action-button apply"
                          onClick={applyOverride}
                          disabled={!overrideRiskLevel || !overrideJustification.trim()}
                        >
                          Apply Override
                        </button>
                        <button 
                          type="button" 
                          className="override-action-button cancel"
                          onClick={() => setShowOverride(false)}
                        >
                          Cancel Override
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Assessment Information */}
                {(optionalAssessments.geotechnicalEnabled || optionalAssessments.infrastructureEnabled) && (
                  <div className="additional-assessments-card">
                    <h4>📋 Additional Assessments Completed</h4>
                    <div className="assessment-badges">
                      {optionalAssessments.geotechnicalEnabled && (
                        <span className="assessment-badge geotechnical">
                          🏔️ Geotechnical Assessment
                        </span>
                      )}
                      {optionalAssessments.infrastructureEnabled && (
                        <span className="assessment-badge infrastructure">
                          🏗️ Infrastructure Assessment
                        </span>
                      )}
                    </div>
                    <p className="assessment-note">
                      Additional detailed assessments have been completed and should be considered 
                      alongside this risk calculation for comprehensive project planning.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-results-card">
                <div className="no-results-icon">📊</div>
                <h3>Assessment Incomplete</h3>
                <p>Complete both the <strong>Hazard Factors</strong> and <strong>Consequence Factors</strong> assessments to view your risk calculation results.</p>
                <div className="completion-status">
                  <div className="status-item">
                    <span className={`status-indicator ${Object.values(hazardFactors).filter((val, idx) => idx < 5 && val !== null).length === 5 ? 'complete' : 'incomplete'}`}></span>
                    <span>Hazard Factors ({Object.values(hazardFactors).filter((val, idx) => idx < 5 && val !== null).length}/5 complete)</span>
                  </div>
                  <div className="status-item">
                    <span className={`status-indicator ${Object.values(consequenceFactors).filter((val, idx) => idx < 4 && val !== null).length === 4 ? 'complete' : 'incomplete'}`}></span>
                    <span>Consequence Factors ({Object.values(consequenceFactors).filter((val, idx) => idx < 4 && val !== null).length}/4 complete)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadRiskForm;