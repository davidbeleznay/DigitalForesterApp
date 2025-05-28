import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateCulvert, getStandardPipeSizes, getRoughnessCoefficients } from '../utils/CulvertCalculator';
import CulvertResults from '../components/culvert/CulvertResults';
import '../styles/enhanced-form.css';

const CulvertSizingForm = () => {
  const navigate = useNavigate();
  
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
    maxHwdRatio: '0.8', // Default to conservative 0.8 HW/D ratio
    fishPassage: false,
    manningCapacityTest: false, // NEW: Optional Manning capacity test
    climateRatio: '3.0', // Climate ratio (CR) - default 3x bankfull
    latitude: '',
    longitude: ''
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
  
  // Get standard pipe sizes and roughness coefficients
  const standardPipeSizes = getStandardPipeSizes();
  const roughnessCoefficients = getRoughnessCoefficients();

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

  // Toggle Manning capacity test
  const toggleManningTest = () => {
    setFormValues(prev => ({
      ...prev,
      manningCapacityTest: !prev.manningCapacityTest
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
            case error.UNKNOWN_ERROR:
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
  
  // Validate the current stage
  const validateStage = () => {
    const newErrors = {};
    
    if (activeSection === STAGES.SITE_INFO) {
      if (!formValues.culvertId.trim()) {
        newErrors.culvertId = 'Culvert ID is required';
      }
      
      if (!formValues.roadName.trim()) {
        newErrors.roadName = 'Road name is required';
      }
    }
    
    if (activeSection === STAGES.MEASUREMENTS) {
      const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
      
      if (avgTopWidth <= 0) {
        newErrors.topWidthMeasurements = 'At least one valid top width measurement is required';
      }
      
      if (useBottomWidth && avgBottomWidth <= 0) {
        newErrors.bottomWidthMeasurements = 'At least one valid bottom width measurement is required';
      }
      
      if (avgDepth <= 0) {
        newErrors.depthMeasurements = 'At least one valid depth measurement is required';
      }
      
      if (useBottomWidth && avgBottomWidth >= avgTopWidth) {
        newErrors.bottomWidthMeasurements = 'Bottom width should be less than top width for typical stream channels';
      }
    }
    
    if (activeSection === STAGES.SETTINGS) {
      if (!formValues.slopePercent) {
        newErrors.slopePercent = 'Channel slope is required';
      } else if (isNaN(formValues.slopePercent) || parseFloat(formValues.slopePercent) <= 0) {
        newErrors.slopePercent = 'Must be a positive number';
      }
      
      if (!formValues.climateRatio) {
        newErrors.climateRatio = 'Climate ratio is required';
      } else if (isNaN(formValues.climateRatio) || parseFloat(formValues.climateRatio) <= 0) {
        newErrors.climateRatio = 'Must be a positive number';
      }
      
      // Only validate Manning-related fields if the test is enabled
      if (formValues.manningCapacityTest) {
        if (!formValues.maxHwdRatio) {
          newErrors.maxHwdRatio = 'Headwater ratio is required for Manning capacity test';
        } else if (isNaN(formValues.maxHwdRatio) || parseFloat(formValues.maxHwdRatio) <= 0 || parseFloat(formValues.maxHwdRatio) > 1.5) {
          newErrors.maxHwdRatio = 'Must be a positive number between 0 and 1.5';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Calculate culvert size
  const calculateSize = () => {
    if (!validateStage()) return;
    
    setIsLoading(true);
    
    const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
    
    const params = {
      topWidth: avgTopWidth,
      bottomWidth: useBottomWidth ? avgBottomWidth : undefined, // Only pass if using bottom width
      avgStreamDepth: avgDepth,
      slopePercent: parseFloat(formValues.slopePercent),
      climateRatio: parseFloat(formValues.climateRatio),
      streamRoughness: parseFloat(formValues.streamRoughness),
      pipeRoughness: parseFloat(formValues.pipeRoughness),
      maxHwdRatio: formValues.manningCapacityTest ? parseFloat(formValues.maxHwdRatio) : null,
      fishPassage: formValues.fishPassage,
      manningCapacityTest: formValues.manningCapacityTest
    };
    
    // Small delay to allow loading state to be visible
    setTimeout(() => {
      const calculationResults = calculateCulvert(params);
      setResults(calculationResults);
      setActiveSection(STAGES.RESULTS);
      setIsLoading(false);
    }, 500);
  };
  
  // Navigation functions for ribbon
  const goToNextSection = () => {
    if (!validateStage()) return;
    
    if (activeSection === STAGES.SITE_INFO) {
      setActiveSection(STAGES.MEASUREMENTS);
    } else if (activeSection === STAGES.MEASUREMENTS) {
      setActiveSection(STAGES.SETTINGS);
    } else if (activeSection === STAGES.SETTINGS) {
      calculateSize();
    }
  };
  
  const goToPreviousSection = () => {
    if (activeSection === STAGES.MEASUREMENTS) {
      setActiveSection(STAGES.SITE_INFO);
    } else if (activeSection === STAGES.SETTINGS) {
      setActiveSection(STAGES.MEASUREMENTS);
    } else if (activeSection === STAGES.RESULTS) {
      setActiveSection(STAGES.SETTINGS);
    }
  };
  
  // Save the calculation as a draft
  const saveDraft = () => {
    if (!results) return;
    
    // Get existing drafts or create empty array
    const existingDrafts = JSON.parse(localStorage.getItem('culvertDrafts') || '[]');
    
    // Create new draft with calculation results
    const newDraft = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'culvert',
      culvertId: formValues.culvertId,
      roadName: formValues.roadName,
      location: {
        latitude: formValues.latitude,
        longitude: formValues.longitude
      },
      formValues,
      topWidthMeasurements,
      bottomWidthMeasurements,
      depthMeasurements,
      useBottomWidth,
      results
    };
    
    // Add to drafts and save to localStorage
    existingDrafts.push(newDraft);
    localStorage.setItem('culvertDrafts', JSON.stringify(existingDrafts));
    
    // Show success message
    alert('Draft saved successfully!');
  };
  
  // Export results as PDF
  const exportPDF = () => {
    // Future implementation
    alert('PDF export functionality will be implemented in a future update.');
  };

  // Define sections for ribbon navigation
  const sections = [
    { id: STAGES.SITE_INFO, title: 'Site Information', icon: '📋' },
    { id: STAGES.MEASUREMENTS, title: 'Stream Measurements', icon: '📏' },
    { id: STAGES.SETTINGS, title: 'Culvert Settings', icon: '⚙️' },
    { id: STAGES.RESULTS, title: 'Results', icon: '📊' }
  ];

  // Render Site Info stage
  const renderSiteInfoStage = () => {
    return (
      <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
        <h2 className="section-header" style={{ color: '#2196f3' }}>
          <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
          Site Information
        </h2>
        <p>Enter the culvert and road identification details for this assessment.</p>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="culvertId">Culvert ID</label>
            <input
              type="text"
              id="culvertId"
              name="culvertId"
              className={`form-input ${errors.culvertId ? 'error' : ''}`}
              value={formValues.culvertId}
              onChange={handleInputChange}
              placeholder="Enter culvert ID"
            />
            {errors.culvertId && <div className="error-text">{errors.culvertId}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="roadName">Road Name/ID</label>
            <input
              type="text"
              id="roadName"
              name="roadName"
              className={`form-input ${errors.roadName ? 'error' : ''}`}
              value={formValues.roadName}
              onChange={handleInputChange}
              placeholder="Enter road name or ID"
            />
            {errors.roadName && <div className="error-text">{errors.roadName}</div>}
          </div>
          
          <div className="form-group full-width">
            <label>GPS Location</label>
            <div className="gps-section">
              <button 
                type="button"
                className={`gps-button ${isGettingLocation ? 'loading' : ''}`} 
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                📍 {isGettingLocation ? 'Getting Location...' : 'Capture GPS Location'}
              </button>
              
              {locationError && (
                <div className="status-message error">⚠️ {locationError}</div>
              )}
              
              {(formValues.latitude && formValues.longitude) && (
                <div className="location-display">
                  <span className="location-icon">🎯</span>
                  <span className="location-text">
                    {formValues.latitude}, {formValues.longitude}
                  </span>
                </div>
              )}
            </div>
            
            <div className="form-grid" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label htmlFor="latitude">Manual Latitude</label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formValues.latitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 49.2827"
                />
              </div>
              <div className="form-group">
                <label htmlFor="longitude">Manual Longitude</label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formValues.longitude}
                  onChange={handleInputChange}
                  placeholder="e.g., -123.1207"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // SIMPLIFIED: Render Measurements stage
  const renderMeasurementsStage = () => {
    const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
    
    return (
      <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
        <h2 className="section-header" style={{ color: '#ff9800' }}>
          <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #ff9800, #ffb74d)' }}></span>
          Stream Measurements
        </h2>
        <p>Measure the stream at multiple representative cross-sections to determine average bankfull dimensions.</p>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={useBottomWidth}
              onChange={toggleBottomWidth}
            />
            {" "}Include Bottom Width Measurements
          </label>
          <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
            Enable this for incised channels where bottom width differs significantly from top width.
          </p>
        </div>
        
        {/* SIMPLIFIED TOP WIDTH MEASUREMENTS */}
        <div style={{ marginBottom: '32px' }}>
          <h3>Top Width Measurements (m)</h3>
          <p style={{ fontSize: '14px', color: '#666', margin: '8px 0 16px 0' }}>
            Measure the stream width at bankfull level at multiple cross-sections
          </p>
          
          {topWidthMeasurements.map((measurement, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#666', minWidth: '30px' }}>#{index + 1}</span>
              <input
                type="number"
                value={measurement}
                onChange={(e) => handleMeasurementChange(index, e.target.value, topWidthMeasurements, setTopWidthMeasurements)}
                placeholder="Width (m)"
                step="0.1"
                min="0"
                style={{
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  width: '150px'
                }}
              />
              {topWidthMeasurements.length > 1 && (
                <button 
                  type="button"
                  onClick={() => removeMeasurement(index, topWidthMeasurements, setTopWidthMeasurements)}
                  style={{
                    background: '#ff5722',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button"
            onClick={() => addMeasurement(topWidthMeasurements, setTopWidthMeasurements)}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            + Add Measurement
          </button>
          
          {errors.topWidthMeasurements && (
            <div style={{ color: '#f44336', fontSize: '14px', marginTop: '8px' }}>
              {errors.topWidthMeasurements}
            </div>
          )}
        </div>
        
        {/* SIMPLIFIED BOTTOM WIDTH MEASUREMENTS */}
        {useBottomWidth && (
          <div style={{ marginBottom: '32px' }}>
            <h3>Bottom Width Measurements (m)</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0 16px 0' }}>
              Measure the stream width at the channel bottom
            </p>
            
            {bottomWidthMeasurements.map((measurement, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#666', minWidth: '30px' }}>#{index + 1}</span>
                <input
                  type="number"
                  value={measurement}
                  onChange={(e) => handleMeasurementChange(index, e.target.value, bottomWidthMeasurements, setBottomWidthMeasurements)}
                  placeholder="Width (m)"
                  step="0.1"
                  min="0"
                  style={{
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    width: '150px'
                  }}
                />
                {bottomWidthMeasurements.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeMeasurement(index, bottomWidthMeasurements, setBottomWidthMeasurements)}
                    style={{
                      background: '#ff5722',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button 
              type="button"
              onClick={() => addMeasurement(bottomWidthMeasurements, setBottomWidthMeasurements)}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              + Add Measurement
            </button>
            
            {errors.bottomWidthMeasurements && (
              <div style={{ color: '#f44336', fontSize: '14px', marginTop: '8px' }}>
                {errors.bottomWidthMeasurements}
              </div>
            )}
          </div>
        )}
        
        {/* SIMPLIFIED DEPTH MEASUREMENTS */}
        <div style={{ marginBottom: '32px' }}>
          <h3>Depth Measurements (m)</h3>
          <p style={{ fontSize: '14px', color: '#666', margin: '8px 0 16px 0' }}>
            Measure the stream depth at bankfull level
          </p>
          
          {depthMeasurements.map((measurement, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#666', minWidth: '30px' }}>#{index + 1}</span>
              <input
                type="number"
                value={measurement}
                onChange={(e) => handleMeasurementChange(index, e.target.value, depthMeasurements, setDepthMeasurements)}
                placeholder="Depth (m)"
                step="0.1"
                min="0"
                style={{
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  width: '150px'
                }}
              />
              {depthMeasurements.length > 1 && (
                <button 
                  type="button"
                  onClick={() => removeMeasurement(index, depthMeasurements, setDepthMeasurements)}
                  style={{
                    background: '#ff5722',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
                )}
            </div>
          ))}
          
          <button 
            type="button"
            onClick={() => addMeasurement(depthMeasurements, setDepthMeasurements)}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            + Add Measurement
          </button>
          
          {errors.depthMeasurements && (
            <div style={{ color: '#f44336', fontSize: '14px', marginTop: '8px' }}>
              {errors.depthMeasurements}
            </div>
          )}
        </div>
        
        {/* AVERAGES DISPLAY */}
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginTop: '32px' }}>
          <h3>Average Measurements</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div>
              <strong>Average Top Width:</strong> {avgTopWidth.toFixed(1)} m
            </div>
            {useBottomWidth && (
              <div>
                <strong>Average Bottom Width:</strong> {avgBottomWidth.toFixed(1)} m
              </div>
            )}
            <div>
              <strong>Average Depth:</strong> {avgDepth.toFixed(1)} m
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render Settings stage with optional Manning test
  const renderSettingsStage = () => {
    return (
      <div className="form-section" style={{ borderTop: '4px solid #9c27b0' }}>
        <h2 className="section-header" style={{ color: '#9c27b0' }}>
          <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #9c27b0, #ba68c8)' }}></span>
          Culvert Settings
        </h2>
        <p>Configure site parameters and culvert requirements for the sizing calculation.</p>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="slopePercent">Channel Slope (%)</label>
            <input
              type="number"
              id="slopePercent"
              name="slopePercent"
              className={`form-input ${errors.slopePercent ? 'error' : ''}`}
              value={formValues.slopePercent}
              onChange={handleInputChange}
              placeholder="e.g., 2.5"
              step="0.1"
              min="0"
            />
            {errors.slopePercent && <div className="status-message error">{errors.slopePercent}</div>}
            <div className="helper-text">Measure between points 10-20× bankfull width apart</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="climateRatio">Climate Ratio (CR)</label>
            <input
              type="number"
              id="climateRatio"
              name="climateRatio"
              className={`form-input ${errors.climateRatio ? 'error' : ''}`}
              value={formValues.climateRatio}
              onChange={handleInputChange}
              placeholder="e.g., 3.0"
              step="0.1"
              min="0"
            />
            {errors.climateRatio && <div className="status-message error">{errors.climateRatio}</div>}
            <div className="helper-text">Multiplier for bankfull area (typically 3.0 for climate resilience)</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="streamRoughness">Stream Roughness (Manning's n)</label>
            <select
              id="streamRoughness"
              name="streamRoughness"
              value={formValues.streamRoughness}
              onChange={handleInputChange}
            >
              <option value="0.035">Gravel Bed (0.035)</option>
              <option value="0.04">Mixed Bed (0.04)</option>
              <option value="0.045">Cobble Bed (0.045)</option>
              <option value="0.05">Boulder/Bedrock (0.05)</option>
            </select>
            <div className="helper-text">Select based on dominant channel substrate</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="pipeRoughness">Pipe Material</label>
            <select
              id="pipeRoughness"
              name="pipeRoughness"
              value={formValues.pipeRoughness}
              onChange={handleInputChange}
            >
              <option value="0.024">Corrugated Steel (0.024)</option>
              <option value="0.012">Smooth HDPE (0.012)</option>
              <option value="0.013">Concrete (0.013)</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label>
              <input
                type="checkbox"
                name="fishPassage"
                checked={formValues.fishPassage}
                onChange={toggleFishPassage}
              />
              {" "}Fish Passage Required
            </label>
            
            {formValues.fishPassage && (
              <div className="helper-text" style={{ marginTop: '8px', padding: '12px', background: '#e8f5e8', borderRadius: '8px' }}>
                <strong>Note:</strong> For fish passage, culverts will be embedded 20% of the culvert diameter below the stream bed and sized 20% larger to allow for natural substrate accumulation.
              </div>
            )}
          </div>
          
          {/* NEW: OPTIONAL MANNING CAPACITY TEST */}
          <div className="form-group full-width" style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginTop: '20px' }}>
            <label>
              <input
                type="checkbox"
                name="manningCapacityTest"
                checked={formValues.manningCapacityTest}
                onChange={toggleManningTest}
              />
              {" "}Enable Manning Capacity Test (Advanced)
            </label>
            
            <div className="helper-text" style={{ marginTop: '8px' }}>
              <strong>Optional:</strong> Perform hydraulic capacity calculations to verify culvert can handle channel flow. 
              Uses Manning's equation to compare channel capacity vs. culvert capacity. Leave unchecked for simplified sizing.
            </div>
            
            {formValues.manningCapacityTest && (
              <div style={{ marginTop: '16px', padding: '16px', background: '#f0f8ff', borderRadius: '8px', border: '1px solid #2196f3' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#2196f3' }}>Manning Capacity Test Settings</h4>
                
                <div className="form-group">
                  <label htmlFor="maxHwdRatio">Maximum Headwater Ratio (HW/D)</label>
                  <input
                    type="number"
                    id="maxHwdRatio"
                    name="maxHwdRatio"
                    className={`form-input ${errors.maxHwdRatio ? 'error' : ''}`}
                    value={formValues.maxHwdRatio}
                    onChange={handleInputChange}
                    placeholder="e.g., 0.8"
                    step="0.1"
                    min="0"
                    max="1.5"
                  />
                  {errors.maxHwdRatio && <div className="status-message error">{errors.maxHwdRatio}</div>}
                  <div className="helper-text">Conservative value is 0.8. Maximum recommended is 1.5.</div>
                </div>
                
                <div className="helper-text" style={{ background: '#fff', padding: '12px', borderRadius: '6px', marginTop: '12px' }}>
                  <strong>Manning Test Process:</strong>
                  <br />1. Calculate channel flow capacity: Q<sub>ch</sub> = (1/n) × A × R<sup>2/3</sup> × S<sup>1/2</sup>
                  <br />2. Calculate culvert flow capacity: Q<sub>culv</sub> = C<sub>d</sub> × A × √(2gH)
                  <br />3. If Q<sub>culv</sub> &lt; Q<sub>ch</sub>, increase pipe size until capacities match
                  <br />4. Large culverts (≥2m or Q&gt;6 m³/s) trigger professional review requirement
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Render Results stage
  const renderResultsStage = () => {
    if (!results) {
      return (
        <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
          <h2 className="section-header" style={{ color: '#4caf50' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
            Calculation Results
          </h2>
          <div className="status-message error">
            No calculation results available. Please go back and complete the form.
          </div>
        </div>
      );
    }
    
    // Format calculator results for the CulvertResults component
    const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
    
    // Transform measurements into the format needed by the CulvertResults component
    const formattedMeasurements = topWidthMeasurements
      .filter(m => m && !isNaN(parseFloat(m)))
      .map((m, index) => {
        const depth = depthMeasurements[index] || avgDepth;
        const bottom = useBottomWidth && bottomWidthMeasurements[index] 
          ? bottomWidthMeasurements[index] 
          : (avgBottomWidth || avgTopWidth * 0.7);
          
        return {
          id: index + 1,
          top: parseFloat(m),
          bottom: parseFloat(bottom),
          depth: parseFloat(depth)
        };
      });
    
    // Create enhanced calculationResults object
    const calculationResults = {
      // finalSize is the overall recommended pipe size from the calculator
      recommendedSize: results.finalSize,
      shape: "Circular",
      material: formValues.pipeRoughness === "0.024" ? "Corrugated Metal Pipe (CMP)" : 
               formValues.pipeRoughness === "0.012" ? "Smooth HDPE" : "Concrete",
      manningsN: parseFloat(formValues.pipeRoughness),
      hwdCriterion: formValues.manningCapacityTest ? `HW/D ≤ ${formValues.maxHwdRatio}` : "Not applied (simplified sizing)",
      climateChangeFactor: parseFloat(formValues.climateRatio),
      governingMethod: results.governingMethod,
      californiaMethodSize: results.californiaSize,
      hydraulicCalculationSize: results.hydraulicSize,
      manningTestApplied: formValues.manningCapacityTest,
      bankfullArea: parseFloat(results.streamArea),
      endArea: parseFloat(results.requiredCulvertArea),
      designDischarge: parseFloat(results.bankfullFlow),
      measurements: formattedMeasurements,
      avgWidth: avgTopWidth,
      avgBottom: avgBottomWidth,
      avgDepth: avgDepth,
      requiresProfessional: results.requiresProfessional || false
    };
    
    return (
      <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
        <h2 className="section-header" style={{ color: '#4caf50' }}>
          <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
          Culvert Sizing Results
        </h2>
        
        {results.requiresProfessional && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <h4 style={{ color: '#856404', margin: '0 0 8px 0' }}>⚠️ Professional Review Required</h4>
            <p style={{ color: '#856404', margin: 0 }}>
              This culvert design requires professional engineering review due to large size (≥2m diameter) or high flow capacity (&gt;6 m³/s).
            </p>
          </div>
        )}
        
        <CulvertResults calculationResults={calculationResults} />
        
        <div className="form-grid" style={{ marginTop: '24px' }}>
          <button 
            type="button"
            className="gps-button"
            onClick={saveDraft}
          >
            💾 Save Draft
          </button>
          
          <button 
            type="button"
            className="gps-button"
            onClick={exportPDF}
          >
            📄 Export PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>🌊 Culvert Sizing Tool</h1>
        <p>Professional culvert sizing using stream measurements and hydraulic calculations</p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
      </div>

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
        {/* Site Information Section */}
        {activeSection === STAGES.SITE_INFO && renderSiteInfoStage()}

        {/* Stream Measurements Section */}
        {activeSection === STAGES.MEASUREMENTS && renderMeasurementsStage()}

        {/* Culvert Settings Section */}
        {activeSection === STAGES.SETTINGS && renderSettingsStage()}

        {/* Results Section */}
        {activeSection === STAGES.RESULTS && renderResultsStage()}
      </div>

      {/* Navigation Buttons */}
      {activeSection !== STAGES.RESULTS && (
        <div className="form-grid" style={{ marginTop: '24px' }}>
          {activeSection !== STAGES.SITE_INFO && (
            <button 
              type="button"
              className="gps-button"
              onClick={goToPreviousSection}
              style={{ backgroundColor: '#666' }}
            >
              ← Previous
            </button>
          )}
          
          <button 
            type="button"
            className={`gps-button ${isLoading ? 'loading' : ''}`}
            onClick={goToNextSection}
            disabled={isLoading}
          >
            {isLoading ? 'Calculating...' : activeSection === STAGES.SETTINGS ? 'Calculate Size' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CulvertSizingForm;