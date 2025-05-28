// Road Risk Assessment Form - Updated to Official Scoring System
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatrixRiskAssessment from '../utils/MatrixRiskAssessment';

const RoadRiskForm = () => {
  const navigate = useNavigate();
  const riskCalculator = new MatrixRiskAssessment();

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

  // Hazard Factors State - Updated to match official methodology
  const [hazardFactors, setHazardFactors] = useState({
    terrainStability: null,
    slopeGrade: null,
    geologySoil: null,
    drainageConditions: null,
    failureHistory: null
  });

  // Consequence Factors State - Updated to match official methodology
  const [consequenceFactors, setConsequenceFactors] = useState({
    proximityToWater: null,
    drainageStructureCapacity: null,
    publicIndustrialUse: null,
    environmentalCulturalValues: null
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

  // Calculate Risk Assessment using updated methodology
  const calculateRiskAssessment = () => {
    // Check if required assessments are complete
    const hazardComplete = Object.values(hazardFactors).filter(val => val !== null).length === 5;
    const consequenceComplete = Object.values(consequenceFactors).filter(val => val !== null).length === 4;

    if (!hazardComplete || !consequenceComplete) {
      setRiskAssessment(null);
      return;
    }

    // Calculate hazard score (sum of 5 factors, each rated 2, 4, 6, or 10)
    const hazardScore = Object.values(hazardFactors).reduce((sum, val) => sum + (val || 0), 0);
    
    // Calculate consequence score (sum of 4 factors, each rated 2, 4, 6, or 10)
    const consequenceScore = Object.values(consequenceFactors).reduce((sum, val) => sum + (val || 0), 0);

    // Use MatrixRiskAssessment utility for calculation
    const assessment = riskCalculator.calculateInitialRisk(hazardScore, consequenceScore);
    
    // Add detailed reasoning
    const detailedReasoning = `Based on hazard assessment (${hazardScore}/50 points) and consequence assessment (${consequenceScore}/40 points), the calculated risk score is ${assessment.riskScore} points, resulting in ${assessment.riskLevel} risk classification.`;
    
    setRiskAssessment({
      ...assessment,
      detailedReasoning: detailedReasoning
    });
  };

  // Apply Professional Override
  const applyOverride = () => {
    if (!overrideRiskLevel || !overrideJustification.trim()) return;

    const overriddenAssessment = riskCalculator.applyDirectOverride(
      riskAssessment, 
      overrideRiskLevel, 
      overrideJustification
    );

    setRiskAssessment(overriddenAssessment);
    setShowOverride(false);
    setOverrideRiskLevel('');
    setOverrideJustification('');
  };

  // Reset Override
  const resetOverride = () => {
    setRiskAssessment(prev => ({
      ...prev,
      finalRisk: prev.riskLevel,
      finalColor: prev.color,
      isOverridden: false,
      overrideJustification: '',
      overrideDetails: null
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
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle hazard factor changes
  const handleHazardFactorChange = (factor, value) => {
    setHazardFactors(prev => ({ ...prev, [factor]: parseInt(value) }));
  };

  // Handle consequence factor changes
  const handleConsequenceFactorChange = (factor, value) => {
    setConsequenceFactors(prev => ({ ...prev, [factor]: parseInt(value) }));
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
        <p>Professional risk evaluation using official forest road risk methodology</p>
        <button onClick={() => navigate('/')} className="back-button">
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

        {/* Hazard Factors Section - Updated to Official Methodology */}
        {activeSection === 'hazard' && (
          <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
            <h2 className="section-header" style={{ color: '#ff9800' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #ff9800, #ffb74d)' }}></span>
              Hazard Factors Assessment
            </h2>
            <p className="scoring-explanation">
              Each factor is rated on a 4-point scale: <strong>2 (Low)</strong>, <strong>4 (Moderate)</strong>, <strong>6 (High)</strong>, <strong>10 (Very High)</strong>
            </p>

            <div className="hazard-factors">
              {/* Terrain Stability */}
              <div className="factor-group">
                <h3>1. Terrain Stability</h3>
                <p>Evaluate overall terrain stability and slope conditions</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'Stable terrain (slopes <40%)', description: 'Generally stable conditions with minimal risk' },
                    { value: 4, label: 'Moderately stable (slopes 40-60%)', description: 'Some stability concerns but manageable' },
                    { value: 6, label: 'Potentially unstable (slopes >60%)', description: 'Significant stability concerns present' },
                    { value: 10, label: 'Unstable terrain (Class IV/V)', description: 'High frequency/vulnerability to failure' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="terrainStability"
                        value={option.value}
                        checked={hazardFactors.terrainStability === option.value}
                        onChange={(e) => handleHazardFactorChange('terrainStability', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Slope Grade */}
              <div className="factor-group">
                <h3>2. Slope Grade</h3>
                <p>Assess the steepness of the road gradient</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'Low grade (<8%)', description: 'Minimal erosion and stability risks' },
                    { value: 4, label: 'Moderate grade (8-12%)', description: 'Some erosion potential with proper management' },
                    { value: 6, label: 'Steep grade (12-18%)', description: 'Increased erosion and runoff concerns' },
                    { value: 10, label: 'Very steep grade (>18%)', description: 'High erosion potential and stability risks' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="slopeGrade"
                        value={option.value}
                        checked={hazardFactors.slopeGrade === option.value}
                        onChange={(e) => handleHazardFactorChange('slopeGrade', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Geology/Soil Type */}
              <div className="factor-group">
                <h3>3. Geology/Soil Type</h3>
                <p>Evaluate soil stability and erosion characteristics</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'Cohesive, stable soils/bedrock', description: 'Well-consolidated, erosion-resistant materials' },
                    { value: 4, label: 'Moderately stable soils', description: 'Generally stable with some erosion potential' },
                    { value: 6, label: 'Loose, erodible soils', description: 'Moderate to high erosion susceptibility' },
                    { value: 10, label: 'Highly erodible soils/talus', description: 'Very high erosion risk, unstable materials' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="geologySoil"
                        value={option.value}
                        checked={hazardFactors.geologySoil === option.value}
                        onChange={(e) => handleHazardFactorChange('geologySoil', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Drainage Conditions */}
              <div className="factor-group">
                <h3>4. Drainage Conditions</h3>
                <p>Assess effectiveness of water management and drainage</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'Well-drained, minimal surface water', description: 'Excellent drainage with no water issues' },
                    { value: 4, label: 'Moderate drainage issues', description: 'Some water management concerns' },
                    { value: 6, label: 'Poor drainage, standing water', description: 'Significant drainage problems present' },
                    { value: 10, label: 'Severe drainage, seepage/springs', description: 'Critical water management issues' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="drainageConditions"
                        value={option.value}
                        checked={hazardFactors.drainageConditions === option.value}
                        onChange={(e) => handleHazardFactorChange('drainageConditions', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Road/Slope Failure History */}
              <div className="factor-group">
                <h3>5. Road/Slope Failure History</h3>
                <p>Consider historical performance and failure record</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'No previous failures', description: 'Excellent historical performance record' },
                    { value: 4, label: 'Minor historical issues', description: 'Some minor problems, mostly resolved' },
                    { value: 6, label: 'Moderate historical failures', description: 'Several notable failures or ongoing issues' },
                    { value: 10, label: 'Frequent/significant failures', description: 'History of major failures or chronic problems' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="failureHistory"
                        value={option.value}
                        checked={hazardFactors.failureHistory === option.value}
                        onChange={(e) => handleHazardFactorChange('failureHistory', e.target.value)}
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
                  {Object.values(hazardFactors).reduce((sum, val) => sum + (val || 0), 0)} / 50
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consequence Factors Section - Updated to Official Methodology */}
        {activeSection === 'consequence' && (
          <div className="form-section" style={{ borderTop: '4px solid #f44336' }}>
            <h2 className="section-header" style={{ color: '#f44336' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #f44336, #ef5350)' }}></span>
              Consequence Factors Assessment
            </h2>
            <p className="scoring-explanation">
              Each factor is rated on a 4-point scale: <strong>2 (Low)</strong>, <strong>4 (Moderate)</strong>, <strong>6 (High)</strong>, <strong>10 (Very High)</strong>
            </p>

            <div className="consequence-factors">
              {/* Proximity to Water Resources */}
              <div className="factor-group">
                <h3>1. Proximity to Water Resources</h3>
                <p>Assess potential impacts to water bodies and aquatic resources</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'No water resources nearby (>100m)', description: 'Minimal risk to aquatic resources' },
                    { value: 4, label: 'Non-fish bearing stream (30-100m)', description: 'Limited aquatic resource impacts' },
                    { value: 6, label: 'Fish bearing stream (10-30m)', description: 'Significant potential for aquatic impacts' },
                    { value: 10, label: 'Adjacent to fish stream (<10m) or drinking water', description: 'Critical aquatic resource proximity' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="proximityToWater"
                        value={option.value}
                        checked={consequenceFactors.proximityToWater === option.value}
                        onChange={(e) => handleConsequenceFactorChange('proximityToWater', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Drainage Structure Capacity */}
              <div className="factor-group">
                <h3>2. Drainage Structure Capacity</h3>
                <p>Evaluate adequacy of culverts and drainage infrastructure</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'Adequate for 100+ year events', description: 'Excellent capacity for extreme events' },
                    { value: 4, label: 'Adequate for 50-year events', description: 'Good capacity for major storms' },
                    { value: 6, label: 'Adequate for 25-year events', description: 'Limited capacity, some risk in large storms' },
                    { value: 10, label: 'Undersized or deteriorating', description: 'Inadequate capacity, high failure risk' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="drainageStructureCapacity"
                        value={option.value}
                        checked={consequenceFactors.drainageStructureCapacity === option.value}
                        onChange={(e) => handleConsequenceFactorChange('drainageStructureCapacity', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Public/Industrial Use Level */}
              <div className="factor-group">
                <h3>3. Public/Industrial Use Level</h3>
                <p>Consider traffic volume and importance of road access</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'Minimal use (wilderness road)', description: 'Very low traffic, limited access needs' },
                    { value: 4, label: 'Low volume industrial use', description: 'Occasional industrial traffic only' },
                    { value: 6, label: 'Moderate public/industrial use', description: 'Regular public and industrial access' },
                    { value: 10, label: 'High volume/mainline road', description: 'Critical access route with heavy use' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="publicIndustrialUse"
                        value={option.value}
                        checked={consequenceFactors.publicIndustrialUse === option.value}
                        onChange={(e) => handleConsequenceFactorChange('publicIndustrialUse', e.target.value)}
                      />
                      <div className="option-content" data-score={option.value}>
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Environmental/Cultural Values */}
              <div className="factor-group">
                <h3>4. Environmental/Cultural Values</h3>
                <p>Assess significance of environmental and cultural resources</p>
                <div className="rating-options">
                  {[
                    { value: 2, label: 'No significant values', description: 'Standard forest conditions, no special values' },
                    { value: 4, label: 'Standard riparian/wildlife values', description: 'Typical environmental considerations' },
                    { value: 6, label: 'Important habitat or cultural areas', description: 'Notable environmental or cultural significance' },
                    { value: 10, label: 'Critical habitat or culturally significant', description: 'Highly sensitive or protected areas' }
                  ].map((option) => (
                    <label key={option.value} className="rating-option">
                      <input
                        type="radio"
                        name="environmentalCulturalValues"
                        value={option.value}
                        checked={consequenceFactors.environmentalCulturalValues === option.value}
                        onChange={(e) => handleConsequenceFactorChange('environmentalCulturalValues', e.target.value)}
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
                  {Object.values(consequenceFactors).reduce((sum, val) => sum + (val || 0), 0)} / 40
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
                      <p>Detailed soil and slope stability analysis including cut/fill slopes, bedrock conditions, and groundwater</p>
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
                      <p>Detailed analysis of road surface, ditches, culverts, and overall infrastructure condition</p>
                    </span>
                  </label>
                </div>
              </div>

              {optionalAssessments.geotechnicalEnabled && (
                <div className="detailed-assessment">
                  <h3>🏔️ Geotechnical Assessment</h3>
                  <p>Factors include cut slope height, fill slope height, bedrock condition, groundwater conditions, and erosion evidence.</p>
                  <div className="placeholder-notice">
                    <p>📝 Detailed geotechnical assessment form would be implemented here with Low/Moderate/High ratings for each factor.</p>
                  </div>
                </div>
              )}

              {optionalAssessments.infrastructureEnabled && (
                <div className="detailed-assessment">
                  <h3>🏗️ Infrastructure Assessment</h3>
                  <p>Factors include road surface type/condition, ditch condition, culvert sizing and condition, and road age.</p>
                  <div className="placeholder-notice">
                    <p>📝 Detailed infrastructure assessment form would be implemented here with Good/Fair/Poor ratings for each factor.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section - Enhanced with Official Methodology */}
        {activeSection === 'results' && (
          <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
            <h2 className="section-header" style={{ color: '#4caf50' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
              Risk Assessment Results
            </h2>
            
            {riskAssessment ? (
              <div className="risk-results-container">
                {/* Official Methodology Display */}
                <div className="methodology-display">
                  <h3>📋 Assessment Methodology</h3>
                  <p><strong>Risk Score = Hazard Score × Consequence Score</strong></p>
                  <p>Using official forest road risk assessment scoring system with 4-point scale (2, 4, 6, 10)</p>
                </div>

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
                        <span className="score-label">/ 50 points</span>
                      </div>
                      <div className="score-description">
                        {riskAssessment.hazard.description}
                      </div>
                    </div>
                  </div>

                  <div className="calculation-operator">
                    <span className="operator-symbol">×</span>
                    <span className="operator-label">Multiply</span>
                  </div>

                  <div className="calculation-step">
                    <div className="step-header">
                      <span className="step-number">2</span>
                      <h4>Consequence Assessment</h4>
                    </div>
                    <div className="score-card consequence-card">
                      <div className="score-main">
                        <span className="score-value">{riskAssessment.consequence.score}</span>
                        <span className="score-label">/ 40 points</span>
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
                        {riskAssessment.detailedReasoning}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Management Recommendations */}
                <div className="management-recommendations">
                  <h3>📋 Management Recommendations</h3>
                  <div className="recommendations-list">
                    {riskCalculator.getManagementRecommendations(riskAssessment.finalRisk).map((recommendation, index) => (
                      <div key={index} className="recommendation-item">
                        <span className="recommendation-bullet">•</span>
                        <span className="recommendation-text">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                  <div className="priority-badge">
                    <strong>Priority: {riskAssessment.priority}</strong>
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
                      <p>If professional judgment suggests a different risk level based on site-specific conditions, you can override the calculated result:</p>
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
                      <p>Override the calculated risk level based on professional judgment and site-specific factors not fully captured in the standard assessment.</p>
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
                          placeholder="Provide detailed professional justification for the override, including specific site conditions, professional experience, local knowledge, or additional factors not captured in the standard assessment methodology..."
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
              </div>
            ) : (
              <div className="no-results-card">
                <div className="no-results-icon">📊</div>
                <h3>Assessment Incomplete</h3>
                <p>Complete both the <strong>Hazard Factors</strong> and <strong>Consequence Factors</strong> assessments to view your risk calculation results.</p>
                <div className="completion-status">
                  <div className="status-item">
                    <span className={`status-indicator ${Object.values(hazardFactors).filter(val => val !== null).length === 5 ? 'complete' : 'incomplete'}`}></span>
                    <span>Hazard Factors ({Object.values(hazardFactors).filter(val => val !== null).length}/5 complete)</span>
                  </div>
                  <div className="status-item">
                    <span className={`status-indicator ${Object.values(consequenceFactors).filter(val => val !== null).length === 4 ? 'complete' : 'incomplete'}`}></span>
                    <span>Consequence Factors ({Object.values(consequenceFactors).filter(val => val !== null).length}/4 complete)</span>
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