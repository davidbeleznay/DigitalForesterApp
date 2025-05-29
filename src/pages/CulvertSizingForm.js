import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calculateCulvert, getClimateFactorPresets } from '../utils/CulvertCalculator';
import CulvertResults from '../components/culvert/CulvertResults';
import '../styles/enhanced-form.css';
import '../styles/culvert-form.css';

const CulvertSizingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing assessments
  
  // Define form stages to match the ribbon navigation style
  const STAGES = {
    SITE_INFO: 'site_info',
    MEASUREMENTS: 'measurements',
    SETTINGS: 'settings',
    RESULTS: 'results'
  };
  
  // Form state
  const [activeSection, setActiveSection] = useState(STAGES.SITE_INFO);
  const [formValues, setFormValues] = useState({
    culvertId: '',
    roadName: '',
    slopePercent: '',
    streamRoughness: '0.04',
    pipeRoughness: '0.024',
    maxHwdRatio: '0.8',
    fishPassage: false,
    latitude: '',
    longitude: '',
    sizingMethod: 'california' // DEFAULT TO CALIFORNIA METHOD
  });
  
  // Optional assessment toggles
  const [optionalAssessments, setOptionalAssessments] = useState({
    hydraulicCapacityEnabled: false, // Manning capacity test
    climateFactorsEnabled: false,    // Climate change factors
    debrisAssessmentEnabled: false   // Debris and sediment assessment
  });
  
  // Climate factors state - Enhanced with BC coastal presets
  const [climateFactors, setClimateFactors] = useState({
    planningHorizon: '2050',         // Planning year - default to mid-century
    precipitationIncrease: '20',     // % increase in precipitation
    temperatureIncrease: '2.0',      // °C temperature increase
    stormIntensityFactor: '1.2',     // Storm intensity multiplier
    selectedPreset: '2050'           // Track selected preset
  });
  
  // Get climate factor presets
  const climatePresets = getClimateFactorPresets();
  
  // Debris assessment state
  const [debrisAssessment, setDebrisAssessment] = useState({
    debrisRisk: 'moderate',          // low, moderate, high
    largeWoodPresence: false,        // Large wood upstream
    sedimentLoad: 'normal',          // low, normal, high
    maintenanceAccess: 'good',       // poor, fair, good
    blockageFactor: '1.0'            // Multiplier for debris blockage
  });
  
  // SIMPLIFIED MEASUREMENTS - just simple strings for each measurement type
  const [topWidthMeasurements, setTopWidthMeasurements] = useState(['']);
  const [bottomWidthMeasurements, setBottomWidthMeasurements] = useState(['']);
  const [depthMeasurements, setDepthMeasurements] = useState(['']);
  
  // Track if bottom width is being used
  const [useBottomWidth, setUseBottomWidth] = useState(false);
  
  // Results state
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Load existing assessment if editing
  useEffect(() => {
    if (id) {
      // Load assessment from localStorage or API
      const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      const assessment = assessmentHistory.find(a => a.id === id);
      
      if (assessment && assessment.type === 'culvertSizing') {
        // Load form data from assessment
        const data = assessment.data;
        setFormValues(data.formValues || formValues);
        setOptionalAssessments(data.optionalAssessments || optionalAssessments);
        setClimateFactors(data.climateFactors || climateFactors);
        setDebrisAssessment(data.debrisAssessment || debrisAssessment);
        setTopWidthMeasurements(data.topWidthMeasurements || ['']);
        setBottomWidthMeasurements(data.bottomWidthMeasurements || ['']);
        setDepthMeasurements(data.depthMeasurements || ['']);
        setUseBottomWidth(data.useBottomWidth || false);
        
        // If there are results, load them too
        if (data.results) {
          setResults(data.results);
          setActiveSection(STAGES.RESULTS);
        }
      }
    }
  }, [id]);

  // Handle input changes for form values
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle climate factors changes - Enhanced with preset support
  const handleClimateFactorChange = (name, value) => {
    setClimateFactors(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle climate preset selection - FIXED LOGIC
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

  // Handle debris assessment changes
  const handleDebrisAssessmentChange = (name, value) => {
    setDebrisAssessment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle optional assessments
  const toggleOptionalAssessment = (assessmentType) => {
    setOptionalAssessments(prev => ({
      ...prev,
      [assessmentType]: !prev[assessmentType]
    }));
  };
  
  // Toggle bottom width measurements
  const toggleBottomWidth = () => {
    setUseBottomWidth(!useBottomWidth);
    
    // If turning off bottom width, clear the measurements
    if (useBottomWidth) {
      setBottomWidthMeasurements(['']);
    }
  };
  
  // SIMPLIFIED: Add measurement to array
  const addMeasurement = (measurements, setMeasurements) => {
    setMeasurements([...measurements, '']);
  };
  
  // SIMPLIFIED: Remove measurement from array
  const removeMeasurement = (index, measurements, setMeasurements) => {
    if (measurements.length <= 1) return; // Keep at least one measurement
    const newMeasurements = measurements.filter((_, i) => i !== index);
    setMeasurements(newMeasurements);
  };
  
  // SIMPLIFIED: Handle changing measurement value
  const handleMeasurementChange = (index, value, measurements, setMeasurements) => {
    const newMeasurements = [...measurements];
    newMeasurements[index] = value;
    setMeasurements(newMeasurements);
  };
  
  // SIMPLIFIED: Calculate averages from measurements
  const calculateAverages = () => {
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
      : useBottomWidth ? 0 : avgTopWidth * 0.7; // Default to 70% of top width if not provided
    
    const avgDepth = validDepths.length > 0 
      ? validDepths.reduce((sum, val) => sum + val, 0) / validDepths.length 
      : 0;
    
    return { avgTopWidth, avgBottomWidth, avgDepth };
  };
  
  // Toggle fish passage requirement
  const toggleFishPassage = () => {
    setFormValues(prev => ({
      ...prev,
      fishPassage: !prev.fishPassage
    }));
  };
  
  // Get current location using GPS
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');
    
    if (navigator.geolocation) {
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
          console.error('Error getting location:', error);
          let errorMessage = 'Unable to get current location.';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please check your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred getting location.';
              break;
          }
          
          setLocationError(errorMessage);
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();

    // Basic site information validation
    if (!formValues.culvertId.trim()) {
      newErrors.culvertId = 'Culvert ID is required';
    }
    if (!formValues.roadName.trim()) {
      newErrors.roadName = 'Road name is required';
    }

    // Measurement validation
    if (avgTopWidth <= 0) {
      newErrors.topWidthMeasurements = 'At least one valid top width measurement is required';
    }
    if (avgDepth <= 0) {
      newErrors.depthMeasurements = 'At least one valid depth measurement is required';
    }
    
    // Validate bottom width if using it
    if (useBottomWidth && avgBottomWidth <= 0) {
      newErrors.bottomWidthMeasurements = 'Valid bottom width measurements are required when enabled';
    }

    // Hydraulic parameters validation (only if hydraulic capacity test is enabled)
    if (optionalAssessments.hydraulicCapacityEnabled || formValues.sizingMethod !== 'california') {
      if (!formValues.slopePercent || parseFloat(formValues.slopePercent) <= 0) {
        newErrors.slopePercent = 'Stream slope is required for hydraulic calculations';
      }
      if (!formValues.streamRoughness || parseFloat(formValues.streamRoughness) <= 0) {
        newErrors.streamRoughness = 'Stream roughness coefficient is required for hydraulic calculations';
      }
    }

    return newErrors;
  };

  // Calculate culvert size
  const handleCalculate = () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();

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

      const calculationResults = calculateCulvert(calculationParams);
      setResults(calculationResults);
      setActiveSection(STAGES.RESULTS);

      // Save to assessment history
      saveAssessment(calculationResults, calculationParams);
      
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({ calculation: 'An error occurred during calculation. Please check your inputs.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Save assessment to history
  const saveAssessment = (calculationResults, calculationParams) => {
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

    // Get existing history
    const existingHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    
    // Update existing or add new
    const existingIndex = existingHistory.findIndex(a => a.id === assessmentData.id);
    if (existingIndex >= 0) {
      // Update existing assessment
      existingHistory[existingIndex] = assessmentData;
    } else {
      // Add new assessment
      existingHistory.unshift(assessmentData);
    }

    // Save back to localStorage
    localStorage.setItem('assessmentHistory', JSON.stringify(existingHistory));
  };

  // Navigation handlers
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

  // Render site information section
  const renderSiteInfoSection = () => (
    <div className="form-section">
      <div className="section-header">
        <span className="nav-icon">📋</span>
        <div>
          <h3>Site Information</h3>
          <p>Enter basic identification and location details for this culvert assessment.</p>
        </div>
      </div>

      <div className="factor-group">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="culvertId">Culvert ID *</label>
            <input
              type="text"
              id="culvertId"
              name="culvertId"
              value={formValues.culvertId}
              onChange={handleInputChange}
              placeholder="e.g., CUL-001, Site-A"
              className={errors.culvertId ? 'error' : ''}
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
              placeholder="e.g., Forest Service Road 100"
              className={errors.roadName ? 'error' : ''}
            />
            {errors.roadName && <div className="status-message error">{errors.roadName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formValues.latitude}
              onChange={handleInputChange}
              step="0.000001"
              placeholder="e.g., 49.123456"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              id="longitude"  
              name="longitude"
              value={formValues.longitude}
              onChange={handleInputChange}
              step="0.000001"
              placeholder="e.g., -123.123456"
            />
          </div>

          <div className="form-group full-width">
            <div className="gps-section">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className={`gps-button ${isGettingLocation ? 'loading' : ''}`}
              >
                <span className="location-icon">📍</span>
                {isGettingLocation ? 'Getting Location...' : 'Get GPS Location'}
              </button>
              {locationError && <div className="status-message error">{locationError}</div>}
              {formValues.latitude && formValues.longitude && (
                <div className="location-display">
                  <span className="location-icon">📍</span>
                  <span>Location: {formValues.latitude}, {formValues.longitude}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render measurements section
  const renderMeasurementsSection = () => (
    <div className="form-section">
      <div className="section-header">
        <span className="nav-icon">📏</span>
        <div>
          <h3>Stream Measurements</h3>
          <p>Enter field measurements for bankfull stream dimensions. Multiple measurements will be averaged.</p>
        </div>
      </div>

      {/* Top Width Measurements */}
      <div className="factor-group">
        <h4>Top Width Measurements (Required)</h4>
        <p className="helper-text">
          Measure the stream width at bankfull stage (high water mark) in meters.
        </p>
        
        <div className="measurement-grid">
          {topWidthMeasurements.map((measurement, index) => (
            <div key={index} className="measurement-item">
              <div className="measurement-item-header">
                <div className="measurement-number">#{index + 1}</div>
                {topWidthMeasurements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMeasurement(index, topWidthMeasurements, setTopWidthMeasurements)}
                    className="remove-button"
                    disabled={topWidthMeasurements.length <= 1}
                  >
                    ✕
                  </button>
                )}
              </div>
              <input
                type="number"
                value={measurement}
                onChange={(e) => handleMeasurementChange(index, e.target.value, topWidthMeasurements, setTopWidthMeasurements)}
                placeholder="e.g., 2.5"
                step="0.1"
                min="0"
                className="measurement-input"
              />
              <div className="helper-text">meters</div>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={() => addMeasurement(topWidthMeasurements, setTopWidthMeasurements)}
          className="gps-button"
          style={{marginTop: '16px'}}
        >
          + Add Top Width Measurement
        </button>
        
        {errors.topWidthMeasurements && <div className="status-message error">{errors.topWidthMeasurements}</div>}
      </div>

      {/* Bottom Width Toggle and Measurements */}
      <div className="factor-group">
        <div className="feature-toggle">
          <input
            type="checkbox"
            id="useBottomWidth"
            checked={useBottomWidth}
            onChange={toggleBottomWidth}
          />
          <label htmlFor="useBottomWidth">
            Include Bottom Width Measurements (For Incised/Trapezoidal Channels)
          </label>
        </div>

        {useBottomWidth && (
          <>
            <h4>Bottom Width Measurements</h4>
            <p className="helper-text">
              Measure the stream bottom width (wetted width) in meters for incised channels.
            </p>
            
            <div className="measurement-grid">
              {bottomWidthMeasurements.map((measurement, index) => (
                <div key={index} className="measurement-item">
                  <div className="measurement-item-header">
                    <div className="measurement-number">#{index + 1}</div>
                    {bottomWidthMeasurements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeasurement(index, bottomWidthMeasurements, setBottomWidthMeasurements)}
                        className="remove-button"
                        disabled={bottomWidthMeasurements.length <= 1}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    value={measurement}
                    onChange={(e) => handleMeasurementChange(index, e.target.value, bottomWidthMeasurements, setBottomWidthMeasurements)}
                    placeholder="e.g., 1.8"
                    step="0.1"
                    min="0"
                    className="measurement-input"
                  />
                  <div className="helper-text">meters</div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => addMeasurement(bottomWidthMeasurements, setBottomWidthMeasurements)}
              className="gps-button"
              style={{marginTop: '16px'}}
            >
              + Add Bottom Width Measurement
            </button>
            
            {errors.bottomWidthMeasurements && <div className="status-message error">{errors.bottomWidthMeasurements}</div>}
          </>
        )}
      </div>

      {/* Depth Measurements */}
      <div className="factor-group">
        <h4>Depth Measurements (Required)</h4>
        <p className="helper-text">
          Measure the bankfull depth (vertical distance from water surface to stream bottom) in meters.
        </p>
        
        <div className="measurement-grid">
          {depthMeasurements.map((measurement, index) => (
            <div key={index} className="measurement-item">
              <div className="measurement-item-header">
                <div className="measurement-number">#{index + 1}</div>
                {depthMeasurements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMeasurement(index, depthMeasurements, setDepthMeasurements)}
                    className="remove-button"
                    disabled={depthMeasurements.length <= 1}
                  >
                    ✕
                  </button>
                )}
              </div>
              <input
                type="number"
                value={measurement}
                onChange={(e) => handleMeasurementChange(index, e.target.value, depthMeasurements, setDepthMeasurements)}
                placeholder="e.g., 0.8"
                step="0.1"
                min="0"
                className="measurement-input"
              />
              <div className="helper-text">meters</div>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={() => addMeasurement(depthMeasurements, setDepthMeasurements)}
          className="gps-button"
          style={{marginTop: '16px'}}
        >
          + Add Depth Measurement
        </button>
        
        {errors.depthMeasurements && <div className="status-message error">{errors.depthMeasurements}</div>}
      </div>

      {/* Show measurement averages */}
      {(() => {
        const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
        if (avgTopWidth > 0 || avgDepth > 0) {
          return (
            <div className="factor-group">
              <h4>Calculated Averages</h4>
              <div className="total-score-display">
                <div className="form-grid">
                  <div className="form-group">
                    <div className="total-score-label">Top Width</div>
                    <div className="total-score-value">{avgTopWidth.toFixed(2)} m</div>
                  </div>
                  {useBottomWidth && (
                    <div className="form-group">
                      <div className="total-score-label">Bottom Width</div>
                      <div className="total-score-value">{avgBottomWidth.toFixed(2)} m</div>
                    </div>
                  )}
                  <div className="form-group">
                    <div className="total-score-label">Depth</div>
                    <div className="total-score-value">{avgDepth.toFixed(2)} m</div>
                  </div>
                  <div className="form-group">
                    <div className="total-score-label">Stream Area</div>
                    <div className="total-score-value">{(((avgTopWidth + avgBottomWidth) * avgDepth) / 2).toFixed(2)} m²</div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );

  // Render settings section (method selection and optional assessments)
  const renderSettingsSection = () => (
    <div className="form-section">
      <div className="section-header">
        <span className="nav-icon">⚙️</span>
        <div>
          <h3>Sizing Method & Options</h3>
          <p>Select sizing method and configure optional assessments for enhanced culvert design.</p>
        </div>
      </div>

      {/* Sizing Method Selection */}
      <div className="factor-group">
        <h4>Sizing Method Selection</h4>
        <div className="rating-options">
          <label className="rating-option">
            <input
              type="radio"
              name="sizingMethod"
              value="california"
              checked={formValues.sizingMethod === 'california'}
              onChange={handleInputChange}
            />
            <div className="option-content score-2">
              <div className="option-header">
                <div className="option-label">California Method</div>
                <div className="score-badge">Default</div>
              </div>
              <div className="option-description">
                Industry standard using bankfull area × 3 with professional lookup table. Recommended for most applications.
              </div>
            </div>
          </label>

          <label className="rating-option">
            <input
              type="radio"
              name="sizingMethod"
              value="hydraulic"
              checked={formValues.sizingMethod === 'hydraulic'}
              onChange={handleInputChange}
            />
            <div className="option-content score-4">
              <div className="option-header">
                <div className="option-label">Hydraulic Calculation</div>
                <div className="score-badge">Advanced</div>
              </div>
              <div className="option-description">
                Advanced Manning's equation approach requiring slope and roughness parameters.
              </div>
            </div>
          </label>

          <label className="rating-option">
            <input
              type="radio"
              name="sizingMethod"
              value="comparison"
              checked={formValues.sizingMethod === 'comparison'}
              onChange={handleInputChange}
            />
            <div className="option-content score-6">
              <div className="option-header">
                <div className="option-label">Method Comparison</div>
                <div className="score-badge">Conservative</div>
              </div>
              <div className="option-description">
                Conservative approach using the larger of both California and Hydraulic methods.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Hydraulic Parameters (shown when needed) */}
      {(formValues.sizingMethod !== 'california' || optionalAssessments.hydraulicCapacityEnabled) && (
        <div className="factor-group">
          <h4>Hydraulic Parameters</h4>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="slopePercent">Stream Slope (%)</label>
              <input
                type="number"
                id="slopePercent"
                name="slopePercent"
                value={formValues.slopePercent}
                onChange={handleInputChange}
                step="0.1"
                min="0.1"
                max="20"
                placeholder="e.g., 2.0"
                className={errors.slopePercent ? 'error' : ''}
              />
              {errors.slopePercent && <div className="status-message error">{errors.slopePercent}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="streamRoughness">Stream Roughness (n)</label>
              <select
                id="streamRoughness"
                name="streamRoughness"
                value={formValues.streamRoughness}
                onChange={handleInputChange}
                className={errors.streamRoughness ? 'error' : ''}
              >
                <option value="0.035">0.035 - Gravel bed</option>
                <option value="0.04">0.040 - Mixed gravel/cobble</option>
                <option value="0.045">0.045 - Cobble bed</option>
                <option value="0.05">0.050 - Boulder/rough bed</option>
              </select>
              {errors.streamRoughness && <div className="status-message error">{errors.streamRoughness}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="pipeRoughness">Pipe Roughness (n)</label>
              <select
                id="pipeRoughness"
                name="pipeRoughness"
                value={formValues.pipeRoughness}
                onChange={handleInputChange}
              >
                <option value="0.012">0.012 - Smooth HDPE</option>
                <option value="0.013">0.013 - Concrete</option>
                <option value="0.024">0.024 - Corrugated steel</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxHwdRatio">Max HW/D Ratio</label>
              <input
                type="number"
                id="maxHwdRatio"
                name="maxHwdRatio"
                value={formValues.maxHwdRatio}
                onChange={handleInputChange}
                step="0.1"
                min="0.5"
                max="1.5"
                placeholder="0.8"
              />
            </div>
          </div>
        </div>
      )}

      {/* Fish Passage */}
      <div className="factor-group">
        <div className="feature-toggle">
          <input
            type="checkbox"
            id="fishPassage"
            checked={formValues.fishPassage}
            onChange={toggleFishPassage}
          />
          <label htmlFor="fishPassage">
            Fish Passage Required
          </label>
        </div>
        {formValues.fishPassage && (
          <p className="helper-text">
            Fish passage requirements will ensure minimum 1.2× stream width and 20% embedment depth.
          </p>
        )}
      </div>

      {/* Climate Change Factors */}
      <div className="factor-group">
        <div className="feature-toggle">
          <input
            type="checkbox"
            id="climateFactorsEnabled"
            checked={optionalAssessments.climateFactorsEnabled}
            onChange={() => toggleOptionalAssessment('climateFactorsEnabled')}
          />
          <label htmlFor="climateFactorsEnabled">
            Apply Climate Change Factors (Coastal BC)
          </label>
        </div>

        {optionalAssessments.climateFactorsEnabled && (
          <div>
            <h4>BC Coastal Climate Projections</h4>
            <p className="helper-text">
              Select a planning horizon based on PCIC & EGBC recommendations for coastal British Columbia.
            </p>

            <div className="rating-options">
              {Object.entries(climatePresets).map(([year, preset]) => (
                <label key={year} className="rating-option">
                  <input
                    type="radio"
                    name="climatePreset"
                    value={year}
                    checked={climateFactors.selectedPreset === year}
                    onChange={() => handleClimatePresetChange(year)}
                  />
                  <div className={`option-content ${climateFactors.selectedPreset === year ? 'score-2' : 'score-4'}`}>
                    <div className="option-header">
                      <div className="option-label">{preset.label}</div>
                      <div className="score-badge">F_CC = {preset.factor.toFixed(2)}</div>
                    </div>
                    <div className="option-description">{preset.description}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="scoring-explanation">
              <h5>Climate Change Rationale</h5>
              <p>
                These factors are based on Pacific Climate Impacts Consortium (PCIC) and Engineers and 
                Geoscientists BC (EGBC) recommendations for infrastructure design under changing climate conditions. 
                The factors account for increased precipitation intensity and frequency of extreme events along 
                the BC coast.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional Assessments Toggle */}
      <div className="factor-group">
        <div className="feature-toggle">
          <input
            type="checkbox"
            id="hydraulicCapacityEnabled"
            checked={optionalAssessments.hydraulicCapacityEnabled}
            onChange={() => toggleOptionalAssessment('hydraulicCapacityEnabled')}
          />
          <label htmlFor="hydraulicCapacityEnabled">
            Enable Hydraulic Capacity Verification
          </label>
        </div>
        {optionalAssessments.hydraulicCapacityEnabled && (
          <p className="helper-text">
            Verify the selected culvert size meets hydraulic capacity requirements using Manning's equation.
          </p>
        )}
      </div>
    </div>
  );

  // Render results section
  const renderResultsSection = () => (
    <div className="form-section">
      <div className="section-header">
        <span className="nav-icon">📊</span>
        <div>
          <h3>Calculation Results</h3>
          <p>Culvert sizing results with method comparison and climate factor analysis.</p>
        </div>
      </div>

      {results && (
        <CulvertResults 
          results={results}
          formValues={formValues}
          optionalAssessments={optionalAssessments}
          climateFactors={climateFactors}
        />
      )}

      {/* Action buttons */}
      <div className="form-grid" style={{marginTop: '24px'}}>
        <button 
          onClick={() => setActiveSection(STAGES.SETTINGS)} 
          className="gps-button"
          style={{background: 'linear-gradient(135deg, #ff9800, #ffb74d)'}}
        >
          ← Modify Settings
        </button>
        <button 
          onClick={() => navigate('/history')} 
          className="gps-button"
        >
          View Assessment History →
        </button>
      </div>
    </div>
  );

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

      {/* Form Content */}
      <div className="form-content">
        {activeSection === STAGES.SITE_INFO && renderSiteInfoSection()}
        {activeSection === STAGES.MEASUREMENTS && renderMeasurementsSection()}
        {activeSection === STAGES.SETTINGS && renderSettingsSection()}
        {activeSection === STAGES.RESULTS && renderResultsSection()}

        {/* Error display */}
        {errors.calculation && (
          <div className="status-message error" style={{marginTop: '20px'}}>
            {errors.calculation}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="form-grid" style={{marginTop: '32px', gap: '16px'}}>
          {activeSection !== STAGES.SITE_INFO && (
            <button 
              onClick={handlePrevious} 
              className="gps-button"
              style={{background: 'linear-gradient(135deg, #607d8b, #78909c)'}}
              disabled={isLoading}
            >
              ← Previous
            </button>
          )}
          
          {activeSection !== STAGES.RESULTS && (
            <button 
              onClick={handleNext}
              className="gps-button"
              disabled={isLoading}
            >
              {isLoading ? 'Calculating...' : 
               activeSection === STAGES.SETTINGS ? 'Calculate Culvert Size' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulvertSizingForm;