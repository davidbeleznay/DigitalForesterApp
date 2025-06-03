import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calculateCulvert, getClimateFactorPresets } from '../utils/CulvertCalculator';
import CulvertResults from '../components/culvert/CulvertResults';
import '../styles/enhanced-form.css';
import '../styles/culvert-form.css';

const CulvertSizingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const STAGES = {
    SITE_INFO: 'site_info',
    MEASUREMENTS: 'measurements',  
    SETTINGS: 'settings',
    RESULTS: 'results'
  };
  
  const [activeSection, setActiveSection] = useState(STAGES.SITE_INFO);
  const [formValues, setFormValues] = useState({
    culvertId: '',
    roadName: '',
    slopePercent: '2.0', // Keep default but will be conditionally shown
    streamRoughness: '0.04',
    pipeRoughness: '0.024',
    maxHwdRatio: '0.8',
    fishPassage: false,
    latitude: '',
    longitude: '',
    sizingMethod: 'california'
  });
  
  const [optionalAssessments, setOptionalAssessments] = useState({
    hydraulicCapacityEnabled: false,
    climateFactorsEnabled: false,
    debrisAssessmentEnabled: false
  });
  
  const [climateFactors, setClimateFactors] = useState({
    planningHorizon: '2050',
    precipitationIncrease: '20',
    temperatureIncrease: '2.0', 
    stormIntensityFactor: '1.2',
    selectedPreset: '2050'
  });
  
  const climatePresets = getClimateFactorPresets();
  
  const [debrisAssessment, setDebrisAssessment] = useState({
    steepUpslopeOrSlideScars: false,
    evidenceOfPastDebrisFlow: false,
    steepChannelReach: false,
    largeWoodyDebrisPresent: false,
    gapHighRating: false,
    debrisMitigationStrategy: 'upsize'
  });
  
  const [topWidthMeasurements, setTopWidthMeasurements] = useState(['']);
  const [bottomWidthMeasurements, setBottomWidthMeasurements] = useState(['']);
  const [depthMeasurements, setDepthMeasurements] = useState(['']);
  const [useBottomWidth, setUseBottomWidth] = useState(false);
  
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Load existing assessment if editing
  useEffect(() => {
    if (id) {
      const existingHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      const existingAssessment = existingHistory.find(a => a.id === id);
      
      if (existingAssessment && existingAssessment.data) {
        const data = existingAssessment.data;
        
        if (data.formValues) setFormValues(data.formValues);
        if (data.optionalAssessments) setOptionalAssessments(data.optionalAssessments);
        if (data.climateFactors) setClimateFactors(data.climateFactors);
        if (data.debrisAssessment) setDebrisAssessment(data.debrisAssessment);
        if (data.topWidthMeasurements) setTopWidthMeasurements(data.topWidthMeasurements);
        if (data.bottomWidthMeasurements) setBottomWidthMeasurements(data.bottomWidthMeasurements);
        if (data.depthMeasurements) setDepthMeasurements(data.depthMeasurements);
        if (data.useBottomWidth !== undefined) setUseBottomWidth(data.useBottomWidth);
        
        if (data.results) {
          setResults(data.results);
          setActiveSection(STAGES.RESULTS);
        }
      }
    }
  }, [id, STAGES.RESULTS]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleClimatePresetChange = (presetYear) => {
    const preset = climatePresets[presetYear];
    if (preset) {
      setClimateFactors(prev => ({
        ...prev,
        planningHorizon: presetYear,
        selectedPreset: presetYear,
        precipitationIncrease: ((preset.factor - 1) * 100).toFixed(0),
        stormIntensityFactor: preset.factor.toFixed(2)
      }));
    }
  };

  const handleDebrisAssessmentChange = (name, value) => {
    setDebrisAssessment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleOptionalAssessment = (assessmentType) => {
    setOptionalAssessments(prev => ({
      ...prev,
      [assessmentType]: !prev[assessmentType]
    }));
  };
  
  const toggleBottomWidth = () => {
    setUseBottomWidth(!useBottomWidth);
    if (useBottomWidth) {
      setBottomWidthMeasurements(['']);
    }
  };
  
  const addMeasurement = (setMeasurements) => {
    setMeasurements(prev => [...prev, '']);
  };
  
  const removeMeasurement = (index, setMeasurements) => {
    setMeasurements(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };
  
  const handleMeasurementChange = (index, value, setMeasurements) => {
    setMeasurements(prev => {
      const newMeasurements = [...prev];
      newMeasurements[index] = value;
      return newMeasurements;
    });
  };
  
  const calculateAverages = useCallback(() => {
    const validTopWidths = topWidthMeasurements
      .filter(m => m && !isNaN(parseFloat(m)))
      .map(m => parseFloat(m));
    
    const validBottomWidths = useBottomWidth 
      ? bottomWidthMeasurements
          .filter(m => m && !isNaN(parseFloat(m)))
          .map(m => parseFloat(m))
      : [];
    
    const validDepths = depthMeasurements
      .filter(m => m && !isNaN(parseFloat(m)))
      .map(m => parseFloat(m));
    
    const avgTopWidth = validTopWidths.length > 0 
      ? validTopWidths.reduce((sum, val) => sum + val, 0) / validTopWidths.length 
      : 0;
    
    const avgBottomWidth = validBottomWidths.length > 0 
      ? validBottomWidths.reduce((sum, val) => sum + val, 0) / validBottomWidths.length 
      : useBottomWidth ? 0 : avgTopWidth * 0.7;
    
    const avgDepth = validDepths.length > 0 
      ? validDepths.reduce((sum, val) => sum + val, 0) / validDepths.length 
      : 0;
    
    return { avgTopWidth, avgBottomWidth, avgDepth };
  }, [topWidthMeasurements, bottomWidthMeasurements, depthMeasurements, useBottomWidth]);
  
  const toggleFishPassage = () => {
    setFormValues(prev => ({
      ...prev,
      fishPassage: !prev.fishPassage
    }));
  };

  const captureGPSLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormValues(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Error getting location: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    const { avgTopWidth, avgDepth } = calculateAverages();

    if (!formValues.culvertId.trim()) {
      newErrors.culvertId = 'Culvert ID is required';
    }
    if (!formValues.roadName.trim()) {
      newErrors.roadName = 'Road name is required';
    }
    if (avgTopWidth <= 0) {
      newErrors.topWidthMeasurements = 'At least one valid top width measurement is required';
    }
    if (avgDepth <= 0) {
      newErrors.depthMeasurements = 'At least one valid depth measurement is required';
    }

    // Validate slope for hydraulic methods
    const needsSlope = formValues.sizingMethod === 'hydraulic' || formValues.sizingMethod === 'comparison';
    if (needsSlope && (!formValues.slopePercent || parseFloat(formValues.slopePercent) <= 0)) {
      newErrors.slopePercent = 'Channel slope is required for hydraulic calculations';
    }

    return newErrors;
  }, [calculateAverages, formValues]);

  const saveAssessment = useCallback((calculationResults, calculationParams) => {
    try {
      const assessmentData = {
        id: id || `culvert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: 'culvertSizing',
        title: formValues.culvertId || 'Untitled Culvert Assessment',
        location: formValues.roadName || 'Unknown Location',
        dateCreated: new Date().toISOString(),
        data: {
          formValues,
          optionalAssessments,
          climateFactors,
          debrisAssessment,
          topWidthMeasurements,
          bottomWidthMeasurements,
          depthMeasurements,
          useBottomWidth,
          results: calculationResults,
          calculationParams
        }
      };

      const existingHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      const existingIndex = existingHistory.findIndex(a => a.id === assessmentData.id);
      if (existingIndex >= 0) {
        existingHistory[existingIndex] = assessmentData;
      } else {
        existingHistory.unshift(assessmentData);
      }

      localStorage.setItem('assessmentHistory', JSON.stringify(existingHistory));
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  }, [id, formValues, optionalAssessments, climateFactors, debrisAssessment, topWidthMeasurements, bottomWidthMeasurements, depthMeasurements, useBottomWidth]);

  const handleCalculate = useCallback(() => {
    console.log('Calculate button clicked!'); // Debug
    setErrors({});
    
    const validationErrors = validateForm();
    console.log('Validation errors:', validationErrors); // Debug
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    console.log('Starting calculation...'); // Debug

    setTimeout(() => {
      try {
        const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
        console.log(`Stream measurements: ${avgTopWidth}m × ${avgDepth}m`); // Debug

        const calculationParams = {
          topWidth: avgTopWidth,
          bottomWidth: useBottomWidth ? avgBottomWidth : avgTopWidth * 0.7,
          avgStreamDepth: avgDepth,
          slopePercent: parseFloat(formValues.slopePercent) || 2.0,
          streamRoughness: parseFloat(formValues.streamRoughness) || 0.04,
          pipeRoughness: parseFloat(formValues.pipeRoughness) || 0.024,
          maxHwdRatio: parseFloat(formValues.maxHwdRatio) || 0.8,
          fishPassage: formValues.fishPassage,
          sizingMethod: formValues.sizingMethod,
          hydraulicCapacityTest: optionalAssessments.hydraulicCapacityEnabled,
          climateFactorsEnabled: optionalAssessments.climateFactorsEnabled,
          climateFactors: optionalAssessments.climateFactorsEnabled ? climateFactors : null,
          debrisAssessmentEnabled: optionalAssessments.debrisAssessmentEnabled,
          debrisAssessment: optionalAssessments.debrisAssessmentEnabled ? debrisAssessment : null
        };

        console.log('Calculation params:', calculationParams); // Debug
        const calculationResults = calculateCulvert(calculationParams);
        console.log('Calculation results:', calculationResults); // Debug
        
        if (!calculationResults) {
          throw new Error('Calculator returned null results');
        }
        
        setResults(calculationResults);
        setActiveSection(STAGES.RESULTS);
        saveAssessment(calculationResults, calculationParams);
        
      } catch (error) {
        console.error('Calculation error:', error);
        setErrors({ calculation: `Calculation error: ${error.message}` });
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }, [formValues, optionalAssessments, climateFactors, debrisAssessment, calculateAverages, validateForm, useBottomWidth, saveAssessment, STAGES.RESULTS]);

  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleNext = () => {
    switch (activeSection) {
      case STAGES.SITE_INFO:
        setActiveSection(STAGES.MEASUREMENTS);
        break;
      case STAGES.MEASUREMENTS:
        setActiveSection(STAGES.SETTINGS);
        break;
      case STAGES.SETTINGS:
        console.log('Settings -> Calculate triggered'); // Debug
        handleCalculate();
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    switch (activeSection) {
      case STAGES.MEASUREMENTS:
        setActiveSection(STAGES.SITE_INFO);
        break;
      case STAGES.SETTINGS:
        setActiveSection(STAGES.MEASUREMENTS);
        break;
      case STAGES.RESULTS:
        setActiveSection(STAGES.SETTINGS);
        break;
      default:
        break;
    }
  };

  // Helper function to determine if hydraulic parameters are needed
  const needsHydraulicParams = () => {
    return formValues.sizingMethod === 'hydraulic' || formValues.sizingMethod === 'comparison';
  };

  return (
    <div className="road-risk-form">
      <div className="form-section">
        <div className="section-header">
          <span className="nav-icon">🌊</span>
          <div>
            <h1>Culvert Sizing Tool</h1>
            <p>Professional culvert sizing using stream measurements with BC coastal climate projections</p>
          </div>
          <button onClick={() => navigate('/')} className="gps-button" style={{marginLeft: 'auto'}}>
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Ribbon Navigation */}
      <div className="section-navigation">
        <button
          className={`nav-button ${activeSection === STAGES.SITE_INFO ? 'active' : ''}`}
          onClick={() => navigateToSection(STAGES.SITE_INFO)}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-title">Site Info</span>
        </button>
        <button
          className={`nav-button ${activeSection === STAGES.MEASUREMENTS ? 'active' : ''}`}
          onClick={() => navigateToSection(STAGES.MEASUREMENTS)}
        >
          <span className="nav-icon">📏</span>
          <span className="nav-title">Measurements</span>
        </button>
        <button
          className={`nav-button ${activeSection === STAGES.SETTINGS ? 'active' : ''}`}
          onClick={() => navigateToSection(STAGES.SETTINGS)}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-title">Settings</span>
        </button>
        <button
          className={`nav-button ${activeSection === STAGES.RESULTS ? 'active' : (results ? 'completed' : '')}`}
          onClick={() => results && navigateToSection(STAGES.RESULTS)}
          disabled={!results}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-title">Results</span>
        </button>
      </div>

      {/* Enhanced form content with proper styling */}
      <div className="form-content">
        {activeSection === STAGES.SITE_INFO && (
          <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
            <h2 className="section-header" style={{ color: '#2196f3' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
              Site Information
            </h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="culvertId">Culvert ID *</label>
                <input
                  type="text"
                  id="culvertId"
                  name="culvertId"
                  value={formValues.culvertId}
                  onChange={handleInputChange}
                  className={errors.culvertId ? 'error' : ''}
                  placeholder="e.g., CU-01, Road-123-CU-1"
                />
                {errors.culvertId && <div className="status-message error">{errors.culvertId}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="roadName">Road Name *</label>
                <input
                  type="text"
                  id="roadName"
                  name="roadName"
                  value={formValues.roadName}
                  onChange={handleInputChange}
                  className={errors.roadName ? 'error' : ''}
                  placeholder="e.g., Forest Service Road 123"
                />
                {errors.roadName && <div className="status-message error">{errors.roadName}</div>}
              </div>
              
              <div className="form-group">
                <div className="gps-section">
                  <button 
                    type="button" 
                    className={`gps-button ${isGettingLocation ? 'loading' : ''}`} 
                    onClick={captureGPSLocation} 
                    disabled={isGettingLocation}
                  >
                    📍 {isGettingLocation ? 'Getting GPS...' : 'Capture GPS Location'}
                  </button>
                  
                  {(formValues.latitude && formValues.longitude) && (
                    <div className="location-display">
                      <span className="location-icon">🎯</span>
                      <span className="location-text">
                        {formValues.latitude}, {formValues.longitude}
                      </span>
                    </div>
                  )}
                  
                  {locationError && <div className="status-message error">⚠️ {locationError}</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === STAGES.MEASUREMENTS && (
          <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
            <h2 className="section-header" style={{ color: '#4caf50' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
              Stream Measurements
            </h2>
            <p className="section-description">
              Measure at the bankfull (high-water) mark indicated by debris deposits, scour lines, or vegetation changes.
            </p>
            
            {/* Top Width Measurements */}
            <div className="form-group">
              <label>Top Width at High Water Mark * (meters)</label>
              <div className="helper-text">
                Most critical measurement - measure from high-water mark to high-water mark across the stream channel
              </div>
              {topWidthMeasurements.map((measurement, index) => (
                <div key={index} className="measurement-input-row">
                  <input
                    type="number"
                    value={measurement}
                    onChange={(e) => handleMeasurementChange(index, e.target.value, setTopWidthMeasurements)}
                    step="0.1"
                    placeholder={`Measurement ${index + 1}`}
                  />
                  <span className="unit-label">meters</span>
                  {topWidthMeasurements.length > 1 && (
                    <button 
                      type="button"
                      className="remove-measurement-btn"
                      onClick={() => removeMeasurement(index, setTopWidthMeasurements)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button"
                className="add-measurement-btn"
                onClick={() => addMeasurement(setTopWidthMeasurements)}
              >
                + Add Another Top Width Measurement
              </button>
              {errors.topWidthMeasurements && <div className="status-message error">{errors.topWidthMeasurements}</div>}
            </div>

            {/* Bottom Width Toggle */}
            <div className="feature-toggle">
              <input
                type="checkbox"
                id="useBottomWidth"
                checked={useBottomWidth}
                onChange={toggleBottomWidth}
              />
              <label htmlFor="useBottomWidth">
                Include Bottom Width Measurements (for trapezoidal channels)
              </label>
            </div>

            {/* Bottom Width Measurements */}
            {useBottomWidth && (
              <div className="form-group">
                <label>Bottom Width (meters)</label>
                <div className="helper-text">
                  Width of stream channel at the bottom/thalweg level
                </div>
                {bottomWidthMeasurements.map((measurement, index) => (
                  <div key={index} className="measurement-input-row">
                    <input
                      type="number"
                      value={measurement}
                      onChange={(e) => handleMeasurementChange(index, e.target.value, setBottomWidthMeasurements)}
                      step="0.1"
                      placeholder={`Bottom measurement ${index + 1}`}
                    />
                    <span className="unit-label">meters</span>
                    {bottomWidthMeasurements.length > 1 && (
                      <button 
                        type="button"
                        className="remove-measurement-btn"
                        onClick={() => removeMeasurement(index, setBottomWidthMeasurements)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  className="add-measurement-btn"
                  onClick={() => addMeasurement(setBottomWidthMeasurements)}
                >
                  + Add Another Bottom Width Measurement
                </button>
              </div>
            )}

            {/* Depth Measurements */}
            <div className="form-group">
              <label>Stream Depth * (meters)</label>
              <div className="helper-text">
                Vertical depth from high-water mark to stream bottom at representative cross-sections
              </div>
              {depthMeasurements.map((measurement, index) => (
                <div key={index} className="measurement-input-row">
                  <input
                    type="number"
                    value={measurement}
                    onChange={(e) => handleMeasurementChange(index, e.target.value, setDepthMeasurements)}
                    step="0.1"
                    placeholder={`Depth ${index + 1}`}
                  />
                  <span className="unit-label">meters</span>
                  {depthMeasurements.length > 1 && (
                    <button 
                      type="button"
                      className="remove-measurement-btn"
                      onClick={() => removeMeasurement(index, setDepthMeasurements)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button"
                className="add-measurement-btn"
                onClick={() => addMeasurement(setDepthMeasurements)}
              >
                + Add Another Depth Measurement
              </button>
              {errors.depthMeasurements && <div className="status-message error">{errors.depthMeasurements}</div>}
            </div>

            {/* Measurement Summary */}
            {(() => {
              const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
              const streamArea = ((avgTopWidth + avgBottomWidth) * avgDepth) / 2;
              
              if (avgTopWidth > 0 && avgDepth > 0) {
                return (
                  <div className="total-score-display">
                    <div className="total-score-label">Calculated Stream Characteristics:</div>
                    <div style={{marginTop: '8px', fontSize: '14px'}}>
                      <div><strong>Average Top Width:</strong> {avgTopWidth.toFixed(2)} m</div>
                      {useBottomWidth && <div><strong>Average Bottom Width:</strong> {avgBottomWidth.toFixed(2)} m</div>}
                      <div><strong>Average Depth:</strong> {avgDepth.toFixed(2)} m</div>
                      <div><strong>Cross-sectional Area:</strong> {streamArea.toFixed(2)} m²</div>
                      <div><strong>Required Culvert Area (3×):</strong> {(streamArea * 3).toFixed(2)} m²</div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}

        {activeSection === STAGES.SETTINGS && (
          <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
            <h2 className="section-header" style={{ color: '#ff9800' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #ff9800, #ffb74d)' }}></span>
              Calculation Settings
            </h2>
            
            {/* Sizing Method Selection */}
            <div className="form-group">
              <label>Sizing Method</label>
              <div className="method-selection">
                <div className={`method-card ${formValues.sizingMethod === 'california' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sizingMethod"
                    value="california"
                    checked={formValues.sizingMethod === 'california'}
                    onChange={handleInputChange}
                  />
                  <label>
                    <h5>California Method <span className="method-badge default">Default</span></h5>
                    <p>Industry standard using stream cross-section measurements and professional lookup tables. Most widely accepted approach for forest road culverts.</p>
                  </label>
                </div>
                
                <div className={`method-card ${formValues.sizingMethod === 'hydraulic' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sizingMethod"
                    value="hydraulic"
                    checked={formValues.sizingMethod === 'hydraulic'}
                    onChange={handleInputChange}
                  />
                  <label>
                    <h5>Hydraulic Calculation <span className="method-badge alternative">Advanced</span></h5>
                    <p>Manning's equation-based flow calculations considering channel slope and roughness. Requires channel slope information.</p>
                  </label>
                </div>
                
                <div className={`method-card ${formValues.sizingMethod === 'comparison' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sizingMethod"
                    value="comparison"
                    checked={formValues.sizingMethod === 'comparison'}
                    onChange={handleInputChange}
                  />
                  <label>
                    <h5>Method Comparison <span className="method-badge conservative">Conservative</span></h5>
                    <p>Calculate both California and Hydraulic methods, then recommend the larger size for maximum safety margin.</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Channel Slope - ONLY show when hydraulic calculations are needed */}
            {needsHydraulicParams() && (
              <div className="form-group">
                <label htmlFor="slopePercent">Channel Slope (%) *</label>
                <input
                  type="number"
                  id="slopePercent"
                  name="slopePercent"
                  value={formValues.slopePercent}
                  onChange={handleInputChange}
                  step="0.1"
                  placeholder="e.g., 2.5"
                  className={errors.slopePercent ? 'error' : ''}
                />
                <div className="helper-text">
                  Channel gradient in percent. Required for Manning's equation hydraulic calculations.
                </div>
                {errors.slopePercent && <div className="status-message error">{errors.slopePercent}</div>}
              </div>
            )}

            {/* Fish Passage Toggle */}
            <div className="feature-toggle">
              <input
                type="checkbox"
                id="fishPassage"
                checked={formValues.fishPassage}
                onChange={toggleFishPassage}
              />
              <label htmlFor="fishPassage">
                Fish Passage Required (20% embedded installation)
              </label>
            </div>

            {/* Climate Factors */}
            <div className="feature-toggle">
              <input
                type="checkbox"
                id="climateFactorsEnabled"
                checked={optionalAssessments.climateFactorsEnabled}
                onChange={() => toggleOptionalAssessment('climateFactorsEnabled')}
              />
              <label htmlFor="climateFactorsEnabled">
                Apply Climate Change Factors (Coastal BC Projections)
              </label>
            </div>

            {optionalAssessments.climateFactorsEnabled && (
              <div className="climate-factors-section">
                <h4>Select Climate Planning Horizon</h4>
                <div className="climate-presets">
                  {Object.entries(climatePresets).map(([year, preset]) => (
                    <div
                      key={year}
                      className={`climate-preset-card ${climateFactors.selectedPreset === year ? 'selected' : ''}`}
                      onClick={() => handleClimatePresetChange(year)}
                    >
                      <div className="preset-header">
                        <h5>{preset.label}</h5>
                        <span className="climate-factor">+{((preset.factor - 1) * 100).toFixed(0)}%</span>
                      </div>
                      <p className="preset-description">{preset.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Debris Assessment */}
            <div className="feature-toggle">
              <input
                type="checkbox"
                id="debrisAssessmentEnabled"
                checked={optionalAssessments.debrisAssessmentEnabled}
                onChange={() => toggleOptionalAssessment('debrisAssessmentEnabled')}
              />
              <label htmlFor="debrisAssessmentEnabled">
                Debris Transport Hazard Assessment
              </label>
            </div>

            {optionalAssessments.debrisAssessmentEnabled && (
              <div className="debris-assessment-section">
                <h4>Debris Hazard Indicators</h4>
                <p style={{fontSize: '14px', color: '#666', marginBottom: '16px'}}>
                  Check all conditions that apply to the site. Each factor increases debris transport risk.
                </p>
                
                <div className="debris-checklist">
                  {[
                    { key: 'steepUpslopeOrSlideScars', label: 'Steep upslope terrain or landslide scars visible' },
                    { key: 'evidenceOfPastDebrisFlow', label: 'Evidence of past debris flows in the watershed' },
                    { key: 'steepChannelReach', label: 'Steep channel reach upstream of crossing (>15% grade)' },
                    { key: 'largeWoodyDebrisPresent', label: 'Large woody debris present in channel' },
                    { key: 'gapHighRating', label: 'GAP analysis rates debris hazard as HIGH' }
                  ].map(factor => (
                    <div key={factor.key} className="debris-factor">
                      <input
                        type="checkbox"
                        id={factor.key}
                        checked={debrisAssessment[factor.key]}
                        onChange={(e) => handleDebrisAssessmentChange(factor.key, e.target.checked)}
                      />
                      <label htmlFor={factor.key}>{factor.label}</label>
                    </div>
                  ))}
                </div>

                <div className="debris-strategy">
                  <h5>Mitigation Strategy</h5>
                  <div className="strategy-options">
                    <div className="strategy-option">
                      <input
                        type="radio"
                        name="debrisMitigationStrategy"
                        value="upsize"
                        checked={debrisAssessment.debrisMitigationStrategy === 'upsize'}
                        onChange={(e) => handleDebrisAssessmentChange('debrisMitigationStrategy', e.target.value)}
                      />
                      <label>Up-size culvert to handle debris (Recommended)</label>
                    </div>
                    <div className="strategy-option">
                      <input
                        type="radio"
                        name="debrisMitigationStrategy"
                        value="cleanout"
                        checked={debrisAssessment.debrisMitigationStrategy === 'cleanout'}
                        onChange={(e) => handleDebrisAssessmentChange('debrisMitigationStrategy', e.target.value)}
                      />
                      <label>Annual debris clean-out commitment</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Hydraulic Parameters - ONLY when hydraulic calculations are needed */}
            {needsHydraulicParams() && (
              <div style={{marginTop: '24px'}}>
                <h4>Advanced Hydraulic Parameters</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="streamRoughness">Stream Roughness (Manning's n)</label>
                    <select
                      id="streamRoughness"
                      name="streamRoughness"
                      value={formValues.streamRoughness}
                      onChange={handleInputChange}
                    >
                      <option value="0.035">0.035 - Gravel bed, straight</option>
                      <option value="0.04">0.040 - Mixed gravel/cobble (default)</option>
                      <option value="0.045">0.045 - Cobble bed, some boulders</option>
                      <option value="0.05">0.050 - Boulder/bedrock, irregular</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="pipeRoughness">Pipe Roughness (Manning's n)</label>
                    <select
                      id="pipeRoughness"
                      name="pipeRoughness"
                      value={formValues.pipeRoughness}
                      onChange={handleInputChange}
                    >
                      <option value="0.024">0.024 - Corrugated steel (default)</option>
                      <option value="0.012">0.012 - Smooth HDPE</option>
                      <option value="0.013">0.013 - Concrete pipe</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="maxHwdRatio">Max Headwater/Diameter Ratio</label>
                    <select
                      id="maxHwdRatio"
                      name="maxHwdRatio"
                      value={formValues.maxHwdRatio}
                      onChange={handleInputChange}
                    >
                      <option value="0.5">0.5 - Very conservative</option>
                      <option value="0.8">0.8 - Conservative (default)</option>
                      <option value="1.0">1.0 - Moderate risk</option>
                      <option value="1.2">1.2 - Higher risk</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === STAGES.RESULTS && results && (
          <CulvertResults 
            results={results}
            formValues={formValues}
            optionalAssessments={optionalAssessments}
            climateFactors={climateFactors}
          />
        )}

        {errors.calculation && (
          <div className="status-message error">{errors.calculation}</div>
        )}

        <div className="form-grid" style={{marginTop: '32px', gap: '16px'}}>
          {activeSection !== STAGES.SITE_INFO && (
            <button onClick={handlePrevious} disabled={isLoading}>
              ← Previous
            </button>
          )}
          
          {activeSection !== STAGES.RESULTS && (
            <button 
              onClick={handleNext}
              disabled={isLoading}
              className="primary-button"
            >
              {isLoading ? '🔄 Calculating...' : 
               activeSection === STAGES.SETTINGS ? '🧮 Calculate' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulvertSizingForm;