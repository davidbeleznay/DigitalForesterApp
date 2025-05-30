import React, { useState, useEffect } from 'react';
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
    slopePercent: '',
    streamRoughness: '0.04',
    pipeRoughness: '0.024',
    maxHwdRatio: '0.8',
    fishPassage: false,
    latitude: '',
    longitude: '',
    sizingMethod: 'california' // Default to California Method
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
        
        // Restore form values
        if (data.formValues) {
          setFormValues(data.formValues);
        }
        
        // Restore optional assessments
        if (data.optionalAssessments) {
          setOptionalAssessments(data.optionalAssessments);
        }
        
        // Restore climate factors
        if (data.climateFactors) {
          setClimateFactors(data.climateFactors);
        }
        
        // Restore debris assessment
        if (data.debrisAssessment) {
          setDebrisAssessment(data.debrisAssessment);
        }
        
        // Restore measurements
        if (data.topWidthMeasurements) {
          setTopWidthMeasurements(data.topWidthMeasurements);
        }
        if (data.bottomWidthMeasurements) {
          setBottomWidthMeasurements(data.bottomWidthMeasurements);
        }
        if (data.depthMeasurements) {
          setDepthMeasurements(data.depthMeasurements);
        }
        if (data.useBottomWidth !== undefined) {
          setUseBottomWidth(data.useBottomWidth);
        }
        
        // Restore results if they exist
        if (data.results) {
          setResults(data.results);
          setActiveSection(STAGES.RESULTS);
        }
      }
    }
  }, [id]);

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
  
  const addMeasurement = (measurements, setMeasurements) => {
    setMeasurements([...measurements, '']);
  };
  
  const removeMeasurement = (index, measurements, setMeasurements) => {
    if (measurements.length <= 1) return;
    const newMeasurements = measurements.filter((_, i) => i !== index);
    setMeasurements(newMeasurements);
  };
  
  const handleMeasurementChange = (index, value, measurements, setMeasurements) => {
    const newMeasurements = [...measurements];
    newMeasurements[index] = value;
    setMeasurements(newMeasurements);
  };
  
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
      : useBottomWidth ? 0 : avgTopWidth * 0.7;
    
    const avgDepth = validDepths.length > 0 
      ? validDepths.reduce((sum, val) => sum + val, 0) / validDepths.length 
      : 0;
    
    return { avgTopWidth, avgBottomWidth, avgDepth };
  };
  
  const toggleFishPassage = () => {
    setFormValues(prev => ({
      ...prev,
      fishPassage: !prev.fishPassage
    }));
  };

  // GPS Location Capture
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

  // Form validation
  const validateForm = () => {
    console.log('🔍 Starting form validation...');
    const newErrors = {};
    const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
    
    console.log('📏 Calculated averages:', { avgTopWidth, avgBottomWidth, avgDepth });

    // Basic site information validation
    if (!formValues.culvertId.trim()) {
      newErrors.culvertId = 'Culvert ID is required';
      console.log('❌ Missing culvert ID');
    }
    if (!formValues.roadName.trim()) {
      newErrors.roadName = 'Road name is required';
      console.log('❌ Missing road name');
    }

    // Measurement validation
    if (avgTopWidth <= 0) {
      newErrors.topWidthMeasurements = 'At least one valid top width measurement is required';
      console.log('❌ Invalid top width measurements:', topWidthMeasurements);
    }
    if (avgDepth <= 0) {
      newErrors.depthMeasurements = 'At least one valid depth measurement is required';
      console.log('❌ Invalid depth measurements:', depthMeasurements);
    }
    
    // Validate bottom width if using it
    if (useBottomWidth && avgBottomWidth <= 0) {
      newErrors.bottomWidthMeasurements = 'Valid bottom width measurements are required when enabled';
      console.log('❌ Invalid bottom width measurements:', bottomWidthMeasurements);
    }

    // Hydraulic parameters validation
    if (optionalAssessments.hydraulicCapacityEnabled || formValues.sizingMethod !== 'california') {
      if (!formValues.slopePercent || parseFloat(formValues.slopePercent) <= 0) {
        newErrors.slopePercent = 'Stream slope is required for hydraulic calculations';
        console.log('❌ Missing slope for hydraulic calculations');
      }
      if (!formValues.streamRoughness || parseFloat(formValues.streamRoughness) <= 0) {
        newErrors.streamRoughness = 'Stream roughness coefficient is required for hydraulic calculations';
        console.log('❌ Missing stream roughness');
      }
    }

    console.log('📋 Validation results:', { 
      errorCount: Object.keys(newErrors).length, 
      errors: newErrors 
    });
    
    return newErrors;
  };

  // Calculate culvert size
  const handleCalculate = () => {
    console.log('🚀 Calculate button clicked!');
    console.log('📊 Current form state:', {
      formValues,
      topWidthMeasurements,
      depthMeasurements,
      optionalAssessments,
      activeSection
    });
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ Validation failed:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    console.log('✅ Validation passed, starting calculation...');
    setIsLoading(true);
    setErrors({});

    try {
      const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
      console.log('📏 Using averages for calculation:', { avgTopWidth, avgBottomWidth, avgDepth });

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

      console.log('🔧 Calculation parameters:', calculationParams);
      console.log('📞 Calling calculateCulvert function...');
      
      const calculationResults = calculateCulvert(calculationParams);
      
      console.log('✅ Calculation completed successfully!');
      console.log('📊 Results:', calculationResults);
      
      setResults(calculationResults);
      setActiveSection(STAGES.RESULTS);

      // Save to assessment history
      saveAssessment(calculationResults, calculationParams);
      
    } catch (error) {
      console.error('💥 Calculation error:', error);
      console.error('Error stack:', error.stack);
      setErrors({ calculation: `Calculation error: ${error.message}. Please check your inputs and try again.` });
    } finally {
      console.log('🏁 Calculation process finished');
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

    const existingHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    const existingIndex = existingHistory.findIndex(a => a.id === assessmentData.id);
    if (existingIndex >= 0) {
      existingHistory[existingIndex] = assessmentData;
    } else {
      existingHistory.unshift(assessmentData);
    }

    localStorage.setItem('assessmentHistory', JSON.stringify(existingHistory));
  };

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
        console.log('⏭️ Next button clicked from Settings - calling handleCalculate()');
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
        </div>
      </div>

      {/* GPS Location Section */}
      <div className="factor-group">
        <h4>GPS Coordinates (Optional)</h4>
        <p className="helper-text">
          Capture GPS coordinates for accurate site location. Click the GPS button to automatically capture your current location.
        </p>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formValues.latitude}
              onChange={handleInputChange}
              placeholder="e.g., 49.2827"
              step="0.000001"
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
              placeholder="e.g., -123.1207"
              step="0.000001"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={captureGPSLocation}
          disabled={isGettingLocation}
          className="gps-button"
        >
          {isGettingLocation ? '📍 Getting Location...' : '📍 Capture GPS Location'}
        </button>

        {locationError && (
          <div className="status-message error">{locationError}</div>
        )}
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
        
        {topWidthMeasurements.map((measurement, index) => (
          <div key={index} className="measurement-input-row">
            <input
              type="number"
              value={measurement}
              onChange={(e) => handleMeasurementChange(index, e.target.value, topWidthMeasurements, setTopWidthMeasurements)}
              placeholder="e.g., 2.5"
              step="0.1"
              min="0"
            />
            <span className="unit-label">meters</span>
            {topWidthMeasurements.length > 1 && (
              <button
                type="button"
                onClick={() => removeMeasurement(index, topWidthMeasurements, setTopWidthMeasurements)}
                className="remove-measurement-btn"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => addMeasurement(topWidthMeasurements, setTopWidthMeasurements)}
          className="add-measurement-btn"
        >
          + Add Top Width Measurement
        </button>
        
        {errors.topWidthMeasurements && <div className="status-message error">{errors.topWidthMeasurements}</div>}
      </div>

      {/* Bottom Width Measurements (Optional) */}
      <div className="factor-group">
        <div className="feature-toggle">
          <input
            type="checkbox"
            id="useBottomWidth"
            checked={useBottomWidth}
            onChange={toggleBottomWidth}
          />
          <label htmlFor="useBottomWidth">
            Measure Bottom Width (Optional - for incised channels)
          </label>
        </div>
        
        {useBottomWidth && (
          <>
            <p className="helper-text">
              Measure the bottom width of the stream channel (water surface width during low flow) in meters.
            </p>
            
            {bottomWidthMeasurements.map((measurement, index) => (
              <div key={index} className="measurement-input-row">
                <input
                  type="number"
                  value={measurement}
                  onChange={(e) => handleMeasurementChange(index, e.target.value, bottomWidthMeasurements, setBottomWidthMeasurements)}
                  placeholder="e.g., 1.8"
                  step="0.1"
                  min="0"
                />
                <span className="unit-label">meters</span>
                {bottomWidthMeasurements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMeasurement(index, bottomWidthMeasurements, setBottomWidthMeasurements)}
                    className="remove-measurement-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addMeasurement(bottomWidthMeasurements, setBottomWidthMeasurements)}
              className="add-measurement-btn"
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
        
        {depthMeasurements.map((measurement, index) => (
          <div key={index} className="measurement-input-row">
            <input
              type="number"
              value={measurement}
              onChange={(e) => handleMeasurementChange(index, e.target.value, depthMeasurements, setDepthMeasurements)}
              placeholder="e.g., 0.8"
              step="0.1"
              min="0"
            />
            <span className="unit-label">meters</span>
            {depthMeasurements.length > 1 && (
              <button
                type="button"
                onClick={() => removeMeasurement(index, depthMeasurements, setDepthMeasurements)}
                className="remove-measurement-btn"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => addMeasurement(depthMeasurements, setDepthMeasurements)}
          className="add-measurement-btn"
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

  // Render settings section
  const renderSettingsSection = () => (
    <div className="form-section">
      <div className="section-header">
        <span className="nav-icon">⚙️</span>
        <div>
          <h3>Sizing Method & Options</h3>
          <p>Select sizing method and configure optional assessments for enhanced culvert design.</p>
        </div>
      </div>

      {/* Method Selection */}
      <div className="factor-group">
        <h4>Sizing Method Selection</h4>
        <p className="helper-text">
          Choose the calculation method for determining culvert size. California Method is recommended for most applications.
        </p>
        
        <div className="method-selection">
          <div className={`method-card ${formValues.sizingMethod === 'california' ? 'selected' : ''}`}>
            <input
              type="radio"
              id="method-california"
              name="sizingMethod"
              value="california"
              checked={formValues.sizingMethod === 'california'}
              onChange={handleInputChange}
            />
            <label htmlFor="method-california">
              <h5>California Method (Default)</h5>
              <p>Industry standard using bankfull area × 3 with professional lookup tables. Recommended for most culvert sizing applications.</p>
              <span className="method-badge default">Recommended</span>
            </label>
          </div>

          <div className={`method-card ${formValues.sizingMethod === 'hydraulic' ? 'selected' : ''}`}>
            <input
              type="radio"
              id="method-hydraulic"
              name="sizingMethod"
              value="hydraulic"
              checked={formValues.sizingMethod === 'hydraulic'}
              onChange={handleInputChange}
            />
            <label htmlFor="method-hydraulic">
              <h5>Hydraulic Calculation</h5>
              <p>Advanced Manning's equation approach using channel slope and roughness parameters. Requires additional hydraulic data.</p>
              <span className="method-badge alternative">Alternative</span>
            </label>
          </div>

          <div className={`method-card ${formValues.sizingMethod === 'comparison' ? 'selected' : ''}`}>
            <input
              type="radio"
              id="method-comparison"
              name="sizingMethod"
              value="comparison"
              checked={formValues.sizingMethod === 'comparison'}
              onChange={handleInputChange}
            />
            <label htmlFor="method-comparison">
              <h5>Method Comparison</h5>
              <p>Conservative approach using the larger of both California Method and Hydraulic calculations. Most conservative design.</p>
              <span className="method-badge conservative">Conservative</span>
            </label>
          </div>
        </div>
      </div>

      {/* Hydraulic Parameters - Show when needed */}
      {(formValues.sizingMethod === 'hydraulic' || formValues.sizingMethod === 'comparison' || optionalAssessments.hydraulicCapacityEnabled) && (
        <div className="factor-group">
          <h4>Hydraulic Parameters</h4>
          <p className="helper-text">
            Required for hydraulic calculations. Enter stream slope and roughness coefficients.
          </p>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="slopePercent">Stream Slope (%)</label>
              <input
                type="number"
                id="slopePercent"
                name="slopePercent"
                value={formValues.slopePercent}
                onChange={handleInputChange}
                placeholder="e.g., 2.5"
                step="0.1"
                min="0"
                className={errors.slopePercent ? 'error' : ''}
              />
              {errors.slopePercent && <div className="status-message error">{errors.slopePercent}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="streamRoughness">Stream Roughness (n)</label>
              <input
                type="number"
                id="streamRoughness"
                name="streamRoughness"
                value={formValues.streamRoughness}
                onChange={handleInputChange}
                placeholder="0.04"
                step="0.001"
                min="0"
                className={errors.streamRoughness ? 'error' : ''}
              />
              {errors.streamRoughness && <div className="status-message error">{errors.streamRoughness}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="pipeRoughness">Pipe Roughness (n)</label>
              <input
                type="number"
                id="pipeRoughness"
                name="pipeRoughness"
                value={formValues.pipeRoughness}
                onChange={handleInputChange}
                placeholder="0.024"
                step="0.001"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxHwdRatio">Max HW/D Ratio</label>
              <input
                type="number"
                id="maxHwdRatio"
                name="maxHwdRatio"
                value={formValues.maxHwdRatio}
                onChange={handleInputChange}
                placeholder="0.8"
                step="0.1"
                min="0"
                max="2"
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

      {/* Optional Assessments */}
      <div className="factor-group">
        <h4>Optional Assessments</h4>
        <p className="helper-text">
          Enable additional assessments for enhanced culvert design considerations.
        </p>

        {/* Climate Change Factors */}
        <div className="assessment-toggle">
          <div className="feature-toggle">
            <input
              type="checkbox"
              id="climateFactorsEnabled"
              checked={optionalAssessments.climateFactorsEnabled}
              onChange={() => toggleOptionalAssessment('climateFactorsEnabled')}
            />
            <label htmlFor="climateFactorsEnabled">
              🌡️ Climate Change Projections (Coastal BC)
            </label>
          </div>
          
          {optionalAssessments.climateFactorsEnabled && (
            <div className="climate-factors-section">
              <p className="helper-text">
                Apply climate change factors based on PCIC & EGBC recommendations for coastal British Columbia.
              </p>
              
              <div className="climate-presets">
                {Object.entries(climatePresets).map(([year, preset]) => (
                  <div
                    key={year}
                    className={`climate-preset-card ${climateFactors.selectedPreset === year ? 'selected' : ''}`}
                    onClick={() => handleClimatePresetChange(year)}
                  >
                    <div className="preset-header">
                      <h5>{preset.label}</h5>
                      <span className="climate-factor">F_CC = {preset.factor.toFixed(2)}</span>
                    </div>
                    <p className="preset-description">{preset.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Debris Transport Assessment */}
        <div className="assessment-toggle">
          <div className="feature-toggle">
            <input
              type="checkbox"
              id="debrisAssessmentEnabled"
              checked={optionalAssessments.debrisAssessmentEnabled}
              onChange={() => toggleOptionalAssessment('debrisAssessmentEnabled')}
            />
            <label htmlFor="debrisAssessmentEnabled">
              🪵 Debris Transport Assessment
            </label>
          </div>
          
          {optionalAssessments.debrisAssessmentEnabled && (
            <div className="debris-assessment-section">
              <p className="helper-text">
                Evaluate debris transport hazard potential and apply appropriate area multipliers.
              </p>
              
              <div className="debris-checklist">
                <h5>Debris Hazard Indicators</h5>
                
                <div className="debris-factor">
                  <input
                    type="checkbox"
                    id="steepUpslopeOrSlideScars"
                    checked={debrisAssessment.steepUpslopeOrSlideScars}
                    onChange={(e) => handleDebrisAssessmentChange('steepUpslopeOrSlideScars', e.target.checked)}
                  />
                  <label htmlFor="steepUpslopeOrSlideScars">
                    Steep upslope areas or evidence of landslide scars
                  </label>
                </div>

                <div className="debris-factor">
                  <input
                    type="checkbox"
                    id="evidenceOfPastDebrisFlow"
                    checked={debrisAssessment.evidenceOfPastDebrisFlow}
                    onChange={(e) => handleDebrisAssessmentChange('evidenceOfPastDebrisFlow', e.target.checked)}
                  />
                  <label htmlFor="evidenceOfPastDebrisFlow">
                    Evidence of past debris flows or torrents
                  </label>
                </div>

                <div className="debris-factor">
                  <input
                    type="checkbox"
                    id="steepChannelReach"
                    checked={debrisAssessment.steepChannelReach}
                    onChange={(e) => handleDebrisAssessmentChange('steepChannelReach', e.target.checked)}
                  />
                  <label htmlFor="steepChannelReach">
                    Steep channel reach upstream of crossing (>15% grade)
                  </label>
                </div>

                <div className="debris-factor">
                  <input
                    type="checkbox"
                    id="largeWoodyDebrisPresent"
                    checked={debrisAssessment.largeWoodyDebrisPresent}
                    onChange={(e) => handleDebrisAssessmentChange('largeWoodyDebrisPresent', e.target.checked)}
                  />
                  <label htmlFor="largeWoodyDebrisPresent">
                    Large woody debris present in channel
                  </label>
                </div>

                <div className="debris-factor">
                  <input
                    type="checkbox"
                    id="gapHighRating"
                    checked={debrisAssessment.gapHighRating}
                    onChange={(e) => handleDebrisAssessmentChange('gapHighRating', e.target.checked)}
                  />
                  <label htmlFor="gapHighRating">
                    GAP analysis rates debris potential as HIGH
                  </label>
                </div>
              </div>

              <div className="debris-strategy">
                <h5>Mitigation Strategy</h5>
                <div className="strategy-options">
                  <div className="strategy-option">
                    <input
                      type="radio"
                      id="upsize"
                      name="debrisMitigationStrategy"
                      value="upsize"
                      checked={debrisAssessment.debrisMitigationStrategy === 'upsize'}
                      onChange={(e) => handleDebrisAssessmentChange('debrisMitigationStrategy', e.target.value)}
                    />
                    <label htmlFor="upsize">Up-size culvert for debris transport</label>
                  </div>
                  <div className="strategy-option">
                    <input
                      type="radio"
                      id="cleanout"
                      name="debrisMitigationStrategy"
                      value="cleanout"
                      checked={debrisAssessment.debrisMitigationStrategy === 'cleanout'}
                      onChange={(e) => handleDebrisAssessmentChange('debrisMitigationStrategy', e.target.value)}
                    />
                    <label htmlFor="cleanout">Annual clean-out commitment</label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
              style={{
                background: isLoading 
                  ? 'linear-gradient(135deg, #999, #bbb)' 
                  : 'linear-gradient(135deg, #4caf50, #66bb6a)',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? '🔄 Calculating...' : 
               activeSection === STAGES.SETTINGS ? '🧮 Calculate Culvert Size' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulvertSizingForm;