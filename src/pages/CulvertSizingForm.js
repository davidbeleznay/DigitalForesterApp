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
    slopePercent: '',
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
  const [debugInfo, setDebugInfo] = useState('');

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
      setDebugInfo(prev => prev + '\n💾 Saved to history');
    } catch (error) {
      console.error('Error saving assessment:', error);
      setDebugInfo(prev => prev + `\n⚠️ Save error: ${error.message}`);
    }
  }, [id, formValues, optionalAssessments, climateFactors, debrisAssessment, topWidthMeasurements, bottomWidthMeasurements, depthMeasurements, useBottomWidth]);

  const handleCalculate = useCallback(() => {
    setErrors({});
    setDebugInfo('Starting calculation...');
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setDebugInfo(prev => prev + '\n❌ Validation failed!');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
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

      {/* Basic form content - simplified for build success */}
      <div className="form-content">
        {activeSection === STAGES.SITE_INFO && (
          <div className="form-section">
            <h3>Site Information</h3>
            <div className="form-group">
              <label>Culvert ID</label>
              <input
                type="text"
                name="culvertId"
                value={formValues.culvertId}
                onChange={handleInputChange}
                className={errors.culvertId ? 'error' : ''}
              />
              {errors.culvertId && <div className="status-message error">{errors.culvertId}</div>}
            </div>
            <div className="form-group">
              <label>Road Name</label>
              <input
                type="text"
                name="roadName"
                value={formValues.roadName}
                onChange={handleInputChange}
                className={errors.roadName ? 'error' : ''}
              />
              {errors.roadName && <div className="status-message error">{errors.roadName}</div>}
            </div>
            <button onClick={captureGPSLocation} disabled={isGettingLocation}>
              {isGettingLocation ? 'Getting Location...' : 'Capture GPS'}
            </button>
            {locationError && <div className="status-message error">{locationError}</div>}
          </div>
        )}

        {activeSection === STAGES.MEASUREMENTS && (
          <div className="form-section">
            <h3>Stream Measurements</h3>
            <div className="form-group">
              <label>Top Width (m)</label>
              {topWidthMeasurements.map((measurement, index) => (
                <div key={index}>
                  <input
                    type="number"
                    value={measurement}
                    onChange={(e) => handleMeasurementChange(index, e.target.value, setTopWidthMeasurements)}
                    step="0.1"
                  />
                  {topWidthMeasurements.length > 1 && (
                    <button onClick={() => removeMeasurement(index, setTopWidthMeasurements)}>Remove</button>
                  )}
                </div>
              ))}
              <button onClick={() => addMeasurement(setTopWidthMeasurements)}>Add Measurement</button>
              {errors.topWidthMeasurements && <div className="status-message error">{errors.topWidthMeasurements}</div>}
            </div>

            <div className="form-group">
              <input
                type="checkbox"
                checked={useBottomWidth}
                onChange={toggleBottomWidth}
              />
              <label>Include Bottom Width</label>
            </div>

            {useBottomWidth && (
              <div className="form-group">
                <label>Bottom Width (m)</label>
                {bottomWidthMeasurements.map((measurement, index) => (
                  <div key={index}>
                    <input
                      type="number"
                      value={measurement}
                      onChange={(e) => handleMeasurementChange(index, e.target.value, setBottomWidthMeasurements)}
                      step="0.1"
                    />
                    {bottomWidthMeasurements.length > 1 && (
                      <button onClick={() => removeMeasurement(index, setBottomWidthMeasurements)}>Remove</button>
                    )}
                  </div>
                ))}
                <button onClick={() => addMeasurement(setBottomWidthMeasurements)}>Add Measurement</button>
              </div>
            )}

            <div className="form-group">
              <label>Depth (m)</label>
              {depthMeasurements.map((measurement, index) => (
                <div key={index}>
                  <input
                    type="number"
                    value={measurement}
                    onChange={(e) => handleMeasurementChange(index, e.target.value, setDepthMeasurements)}
                    step="0.1"
                  />
                  {depthMeasurements.length > 1 && (
                    <button onClick={() => removeMeasurement(index, setDepthMeasurements)}>Remove</button>
                  )}
                </div>
              ))}
              <button onClick={() => addMeasurement(setDepthMeasurements)}>Add Measurement</button>
              {errors.depthMeasurements && <div className="status-message error">{errors.depthMeasurements}</div>}
            </div>
          </div>
        )}

        {activeSection === STAGES.SETTINGS && (
          <div className="form-section">
            <h3>Settings</h3>
            
            <div className="form-group">
              <label>Sizing Method</label>
              <select name="sizingMethod" value={formValues.sizingMethod} onChange={handleInputChange}>
                <option value="california">California Method</option>
                <option value="hydraulic">Hydraulic Calculation</option>
                <option value="comparison">Method Comparison</option>
              </select>
            </div>

            <div className="form-group">
              <input
                type="checkbox"
                checked={formValues.fishPassage}
                onChange={toggleFishPassage}
              />
              <label>Fish Passage Required</label>
            </div>

            <div className="form-group">
              <input
                type="checkbox"
                checked={optionalAssessments.climateFactorsEnabled}
                onChange={() => toggleOptionalAssessment('climateFactorsEnabled')}
              />
              <label>Climate Factors</label>
            </div>

            {optionalAssessments.climateFactorsEnabled && (
              <div>
                <h4>Climate Presets</h4>
                {Object.entries(climatePresets).map(([year, preset]) => (
                  <button
                    key={year}
                    onClick={() => handleClimatePresetChange(year)}
                    className={climateFactors.selectedPreset === year ? 'selected' : ''}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            <div className="form-group">
              <input
                type="checkbox"
                checked={optionalAssessments.debrisAssessmentEnabled}
                onChange={() => toggleOptionalAssessment('debrisAssessmentEnabled')}
              />
              <label>Debris Assessment</label>
            </div>

            {optionalAssessments.debrisAssessmentEnabled && (
              <div>
                <h4>Debris Hazard Indicators</h4>
                {Object.entries(debrisAssessment).filter(([key]) => key !== 'debrisMitigationStrategy').map(([key, value]) => (
                  <div key={key}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleDebrisAssessmentChange(key, e.target.checked)}
                    />
                    <label>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
                  </div>
                ))}
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