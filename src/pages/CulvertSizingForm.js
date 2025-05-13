import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateCulvert, getStandardPipeSizes, getRoughnessCoefficients } from '../utils/CulvertCalculator';

const CulvertSizingForm = () => {
  const navigate = useNavigate();
  
  // Define form stages
  const STAGES = {
    SITE_INFO: 'site_info',
    MEASUREMENTS: 'measurements',
    SETTINGS: 'settings',
    RESULTS: 'results'
  };
  
  // Form state
  const [stage, setStage] = useState(STAGES.SITE_INFO);
  const [formValues, setFormValues] = useState({
    culvertId: '',
    roadName: '',
    slopePercent: '',
    streamRoughness: '0.04',
    pipeRoughness: '0.024',
    fishPassage: false,
    latitude: '',
    longitude: ''
  });
  
  // Measurements state
  const [widthMeasurements, setWidthMeasurements] = useState([{ id: 1, value: '' }]);
  const [depthMeasurements, setDepthMeasurements] = useState([{ id: 1, value: '' }]);
  
  // Results state
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
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
  
  // Handle adding a new width measurement
  const addWidthMeasurement = () => {
    const newId = widthMeasurements.length > 0 
      ? Math.max(...widthMeasurements.map(m => m.id)) + 1 
      : 1;
    setWidthMeasurements([...widthMeasurements, { id: newId, value: '' }]);
  };
  
  // Handle adding a new depth measurement
  const addDepthMeasurement = () => {
    const newId = depthMeasurements.length > 0 
      ? Math.max(...depthMeasurements.map(m => m.id)) + 1 
      : 1;
    setDepthMeasurements([...depthMeasurements, { id: newId, value: '' }]);
  };
  
  // Handle removing a width measurement
  const removeWidthMeasurement = (id) => {
    if (widthMeasurements.length <= 1) return; // Keep at least one measurement
    setWidthMeasurements(widthMeasurements.filter(m => m.id !== id));
  };
  
  // Handle removing a depth measurement
  const removeDepthMeasurement = (id) => {
    if (depthMeasurements.length <= 1) return; // Keep at least one measurement
    setDepthMeasurements(depthMeasurements.filter(m => m.id !== id));
  };
  
  // Handle changing measurement value
  const handleMeasurementChange = (id, value, setMeasurements) => {
    setMeasurements(prev => 
      prev.map(m => m.id === id ? { ...m, value } : m)
    );
  };
  
  // Calculate averages from measurements
  const calculateAverages = () => {
    const validWidths = widthMeasurements
      .filter(m => m.value && !isNaN(parseFloat(m.value)))
      .map(m => parseFloat(m.value));
    
    const validDepths = depthMeasurements
      .filter(m => m.value && !isNaN(parseFloat(m.value)))
      .map(m => parseFloat(m.value));
    
    const avgWidth = validWidths.length > 0 
      ? validWidths.reduce((sum, val) => sum + val, 0) / validWidths.length 
      : 0;
    
    const avgDepth = validDepths.length > 0 
      ? validDepths.reduce((sum, val) => sum + val, 0) / validDepths.length 
      : 0;
    
    return { avgWidth, avgDepth };
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
          setErrors(prev => ({
            ...prev,
            location: 'Unable to get current location. Please enter coordinates manually.'
          }));
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setErrors(prev => ({
        ...prev,
        location: 'Geolocation is not supported by this browser.'
      }));
      setIsGettingLocation(false);
    }
  };
  
  // Validate the current stage
  const validateStage = () => {
    const newErrors = {};
    
    if (stage === STAGES.SITE_INFO) {
      if (!formValues.culvertId.trim()) {
        newErrors.culvertId = 'Culvert ID is required';
      }
      
      if (!formValues.roadName.trim()) {
        newErrors.roadName = 'Road name is required';
      }
    }
    
    if (stage === STAGES.MEASUREMENTS) {
      const { avgWidth, avgDepth } = calculateAverages();
      
      if (avgWidth <= 0) {
        newErrors.widthMeasurements = 'At least one valid width measurement is required';
      }
      
      if (avgDepth <= 0) {
        newErrors.depthMeasurements = 'At least one valid depth measurement is required';
      }
    }
    
    if (stage === STAGES.SETTINGS) {
      if (!formValues.slopePercent) {
        newErrors.slopePercent = 'Channel slope is required';
      } else if (isNaN(formValues.slopePercent) || parseFloat(formValues.slopePercent) <= 0) {
        newErrors.slopePercent = 'Must be a positive number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Navigate to the next stage
  const goToNextStage = () => {
    if (!validateStage()) return;
    
    if (stage === STAGES.SITE_INFO) {
      setStage(STAGES.MEASUREMENTS);
    } else if (stage === STAGES.MEASUREMENTS) {
      setStage(STAGES.SETTINGS);
    } else if (stage === STAGES.SETTINGS) {
      calculateSize();
    }
  };
  
  // Navigate to the previous stage
  const goToPreviousStage = () => {
    if (stage === STAGES.MEASUREMENTS) {
      setStage(STAGES.SITE_INFO);
    } else if (stage === STAGES.SETTINGS) {
      setStage(STAGES.MEASUREMENTS);
    } else if (stage === STAGES.RESULTS) {
      setStage(STAGES.SETTINGS);
    }
  };
  
  // Calculate culvert size
  const calculateSize = () => {
    if (!validateStage()) return;
    
    setIsLoading(true);
    
    const { avgWidth, avgDepth } = calculateAverages();
    
    const params = {
      avgStreamWidth: avgWidth,
      avgStreamDepth: avgDepth,
      slopePercent: parseFloat(formValues.slopePercent),
      streamRoughness: parseFloat(formValues.streamRoughness),
      pipeRoughness: parseFloat(formValues.pipeRoughness),
      fishPassage: formValues.fishPassage
    };
    
    // Small delay to allow loading state to be visible
    setTimeout(() => {
      const calculationResults = calculateCulvert(params);
      setResults(calculationResults);
      setStage(STAGES.RESULTS);
      setIsLoading(false);
    }, 500);
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
      widthMeasurements,
      depthMeasurements,
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
  
  // Handle going back to home
  const handleBack = () => {
    navigate('/');
  };
  
  // Render different stages of the form
  const renderStageContent = () => {
    switch (stage) {
      case STAGES.SITE_INFO:
        return renderSiteInfoStage();
      case STAGES.MEASUREMENTS:
        return renderMeasurementsStage();
      case STAGES.SETTINGS:
        return renderSettingsStage();
      case STAGES.RESULTS:
        return renderResultsStage();
      default:
        return renderSiteInfoStage();
    }
  };
  
  // Render Site Info stage
  const renderSiteInfoStage = () => {
    return (
      <div className="card">
        <div className="card-title">Site Information</div>
        <div className="card-description">
          Enter the culvert and road identification details.
        </div>
        
        <div className="form-group">
          <label className="form-label">Culvert ID</label>
          <input
            type="text"
            name="culvertId"
            className={`form-input ${errors.culvertId ? 'error' : ''}`}
            value={formValues.culvertId}
            onChange={handleInputChange}
            placeholder="Enter culvert ID"
          />
          {errors.culvertId && <div className="error-text">{errors.culvertId}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Road Name</label>
          <input
            type="text"
            name="roadName"
            className={`form-input ${errors.roadName ? 'error' : ''}`}
            value={formValues.roadName}
            onChange={handleInputChange}
            placeholder="Enter road name"
          />
          {errors.roadName && <div className="error-text">{errors.roadName}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Location</label>
          
          <button 
            className={`gps-button ${isGettingLocation ? 'loading' : ''}`} 
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? 'Getting Location...' : 'Get GPS Location'}
          </button>
          
          {errors.location && <div className="error-text">{errors.location}</div>}
          
          {(formValues.latitude && formValues.longitude) && (
            <div className="location-display">
              <span className="location-text">
                Lat: {formValues.latitude}, Lng: {formValues.longitude}
              </span>
            </div>
          )}
          
          <div className="manual-location">
            <div className="form-label">Manual Coordinates</div>
            <div className="manual-coords">
              <input
                type="text"
                name="latitude"
                className="form-input"
                value={formValues.latitude}
                onChange={handleInputChange}
                placeholder="Latitude"
              />
              <input
                type="text"
                name="longitude"
                className="form-input"
                value={formValues.longitude}
                onChange={handleInputChange}
                placeholder="Longitude"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render Measurements stage
  const renderMeasurementsStage = () => {
    const { avgWidth, avgDepth } = calculateAverages();
    
    return (
      <div className="card">
        <div className="card-title">Stream Measurements</div>
        <div className="card-description">
          Measure the bankfull width and depth at multiple representative cross-sections of the stream.
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Width Measurements (m)</h3>
            <button className="add-button" onClick={addWidthMeasurement}>
              <span>Add Measurement</span>
            </button>
          </div>
          
          <div className="measurement-grid">
            {widthMeasurements.map(measurement => (
              <div className="measurement-item" key={measurement.id}>
                <div className="measurement-item-header">
                  <span className="measurement-number">#{measurement.id}</span>
                  <button 
                    className="remove-button"
                    onClick={() => removeWidthMeasurement(measurement.id)}
                    disabled={widthMeasurements.length <= 1}
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="number"
                  className="measurement-input"
                  value={measurement.value}
                  onChange={(e) => handleMeasurementChange(measurement.id, e.target.value, setWidthMeasurements)}
                  placeholder="Width"
                  step="0.01"
                  min="0"
                />
              </div>
            ))}
          </div>
          
          {errors.widthMeasurements && <div className="error-text">{errors.widthMeasurements}</div>}
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Depth Measurements (m)</h3>
            <button className="add-button" onClick={addDepthMeasurement}>
              <span>Add Measurement</span>
            </button>
          </div>
          
          <div className="measurement-grid">
            {depthMeasurements.map(measurement => (
              <div className="measurement-item" key={measurement.id}>
                <div className="measurement-item-header">
                  <span className="measurement-number">#{measurement.id}</span>
                  <button 
                    className="remove-button"
                    onClick={() => removeDepthMeasurement(measurement.id)}
                    disabled={depthMeasurements.length <= 1}
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="number"
                  className="measurement-input"
                  value={measurement.value}
                  onChange={(e) => handleMeasurementChange(measurement.id, e.target.value, setDepthMeasurements)}
                  placeholder="Depth"
                  step="0.01"
                  min="0"
                />
              </div>
            ))}
          </div>
          
          {errors.depthMeasurements && <div className="error-text">{errors.depthMeasurements}</div>}
        </div>
        
        <div className="averages-container">
          <h3>Average Measurements</h3>
          <div className="averages-grid">
            <div className="average-item">
              <div className="average-label">Average Width</div>
              <div className="average-value">{avgWidth.toFixed(2)} m</div>
            </div>
            <div className="average-item">
              <div className="average-label">Average Depth</div>
              <div className="average-value">{avgDepth.toFixed(2)} m</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render Settings stage
  const renderSettingsStage = () => {
    return (
      <div className="card">
        <div className="card-title">Culvert Settings</div>
        <div className="card-description">
          Enter additional site parameters and culvert requirements.
        </div>
        
        <div className="form-group">
          <label className="form-label">Channel Slope (%)</label>
          <input
            type="number"
            name="slopePercent"
            className={`form-input ${errors.slopePercent ? 'error' : ''}`}
            value={formValues.slopePercent}
            onChange={handleInputChange}
            placeholder="e.g., 2.5"
            step="0.1"
            min="0"
          />
          {errors.slopePercent && <div className="error-text">{errors.slopePercent}</div>}
          <div className="helper-text">Measure between points 10-20× bankfull width apart</div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Stream Roughness (Manning's n)</label>
          <select
            name="streamRoughness"
            className="form-input"
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
          <label className="form-label">Pipe Material</label>
          <select
            name="pipeRoughness"
            className="form-input"
            value={formValues.pipeRoughness}
            onChange={handleInputChange}
          >
            <option value="0.024">Corrugated Steel (0.024)</option>
            <option value="0.012">Smooth HDPE (0.012)</option>
            <option value="0.013">Concrete (0.013)</option>
          </select>
        </div>
        
        <div className="form-group fish-passage-group">
          <label className="form-label">
            <input
              type="checkbox"
              name="fishPassage"
              checked={formValues.fishPassage}
              onChange={toggleFishPassage}
            />
            {" "}Fish Passage Required
          </label>
          
          {formValues.fishPassage && (
            <div className="fish-passage-note">
              <strong>Note:</strong> For fish passage, culverts will be embedded 20% of the culvert diameter below the stream bed.
              This allows for natural substrate to accumulate in the culvert bottom.
            </div>
          )}
          
          <div className="fish-info">
            <span className="fish-badge">Fish Passage</span>
            <p>When enabled, culverts will be sized and embedded to facilitate fish movement through the structure.</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Render Results stage
  const renderResultsStage = () => {
    if (!results) {
      return (
        <div className="card">
          <div className="status-message error">
            No calculation results available. Please go back and complete the form.
          </div>
        </div>
      );
    }
    
    const { avgWidth, avgDepth } = calculateAverages();
    
    return (
      <div className="card">
        <div className="card-title">California Method Results</div>
        
        <div className="status-message success">
          Recommended culvert size: {results.selectedPipeSize} mm
        </div>
        
        <div className="culvert-sizing-visual">
          {/* Simplified culvert visualization */}
          <div className="culvert-diagram">
            <div className="stream-bed">
              <div className="stream-level" style={{ height: '20px' }}></div>
            </div>
            <div className="culvert-pipe" style={{ 
              height: `${Math.min(100, results.selectedPipeSize / 20)}px`,
              width: `${Math.min(300, results.selectedPipeSize / 8)}px`
            }}>
              {results.fishPassage && (
                <div className="embed-area" style={{ 
                  height: `${Math.min(100, results.selectedPipeSize / 20) * 0.2}px`
                }}></div>
              )}
            </div>
            <div className="stream-bed">
              <div className="stream-level" style={{ height: '20px' }}></div>
            </div>
          </div>
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Site Information</h3>
          </div>
          
          <div className="averages-grid">
            <div className="average-item">
              <div className="average-label">Culvert ID</div>
              <div className="average-value">{formValues.culvertId}</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Road Name</div>
              <div className="average-value">{formValues.roadName}</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Fish Passage</div>
              <div className="average-value">{formValues.fishPassage ? 'Required' : 'Not Required'}</div>
            </div>
          </div>
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Stream Measurements</h3>
          </div>
          
          <div className="averages-grid">
            <div className="average-item">
              <div className="average-label">Average Width</div>
              <div className="average-value">{avgWidth.toFixed(2)} m</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Average Depth</div>
              <div className="average-value">{avgDepth.toFixed(2)} m</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Channel Slope</div>
              <div className="average-value">{formValues.slopePercent}%</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Stream Area</div>
              <div className="average-value">{results.streamArea} m²</div>
            </div>
          </div>
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>California Method Sizing</h3>
          </div>
          
          <div className="averages-grid">
            <div className="average-item">
              <div className="average-label">Required Culvert Area</div>
              <div className="average-value">{results.requiredCulvertArea} m²</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Required Diameter</div>
              <div className="average-value">{results.requiredDiameterM} m</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Selected Pipe Size</div>
              <div className="average-value">{results.selectedPipeSize} mm</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Embed Depth</div>
              <div className="average-value">{results.embedDepth} m</div>
            </div>
          </div>
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Hydraulic Check</h3>
          </div>
          
          <div className="averages-grid">
            <div className="average-item">
              <div className="average-label">Bankfull Flow</div>
              <div className="average-value">{results.bankfullFlow} m³/s</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Pipe Capacity</div>
              <div className="average-value">{results.pipeCapacity} m³/s</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Hydraulic Check</div>
              <div className="average-value" style={{ color: results.hydraulicCheck ? 'var(--success-color)' : 'var(--error-color)' }}>
                {results.hydraulicCheck ? 'PASS' : 'FAIL'}
              </div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Headwater Ratio</div>
              <div className="average-value">{results.headwaterRatio}</div>
            </div>
          </div>
        </div>
        
        <div className="card-description">
          <div className="method-description">
            <h3>Summary and Recommendations</h3>
            
            {results.hydraulicCheck ? (
              <p>The selected {results.selectedPipeSize} mm culvert meets both the California Method requirements (width × depth × 3) 
              and passes the hydraulic capacity check. This size is appropriate for your site conditions.</p>
            ) : (
              <p>The selected culvert does not pass the hydraulic capacity check. Consider using a larger size or 
              adjusting the design parameters.</p>
            )}
            
            {results.fishPassage && (
              <p>Fish passage requirements are met with a {results.selectedPipeSize} mm culvert embedded {results.embedDepth} m 
              below the stream bed. Ensure natural substrate accumulates in the culvert bottom.</p>
            )}
            
            {parseFloat(results.headwaterRatio) > 1.5 && (
              <p className="error-text">Warning: The headwater ratio exceeds 1.5, which may cause upstream ponding or pressure flow. 
              Consider a larger culvert size to reduce the headwater depth.</p>
            )}
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="gps-button"
            onClick={saveDraft}
          >
            Save Draft
          </button>
          
          <button 
            className="gps-button"
            onClick={exportPDF}
          >
            Export as PDF
          </button>
        </div>
      </div>
    );
  };
  
  // Render navigation buttons
  const renderNavButtons = () => {
    if (stage === STAGES.RESULTS) {
      return (
        <div className="action-buttons">
          <button 
            className="gps-button"
            onClick={handleBack}
          >
            Return to Home
          </button>
          
          <button 
            className="gps-button"
            onClick={goToPreviousStage}
          >
            Back to Settings
          </button>
        </div>
      );
    }
    
    return (
      <div className="action-buttons">
        {stage !== STAGES.SITE_INFO && (
          <button 
            className="gps-button"
            onClick={goToPreviousStage}
            style={{ backgroundColor: 'var(--secondary-color)' }}
          >
            Previous
          </button>
        )}
        
        <button 
          className={`gps-button ${isLoading ? 'loading' : ''}`}
          onClick={goToNextStage}
          disabled={isLoading}
        >
          {isLoading ? 'Calculating...' : stage === STAGES.SETTINGS ? 'Calculate Size' : 'Next'}
        </button>
      </div>
    );
  };
  
  // Render progress indicator
  const renderProgressIndicator = () => {
    const stages = [
      { key: STAGES.SITE_INFO, label: 'Site Info' },
      { key: STAGES.MEASUREMENTS, label: 'Measurements' },
      { key: STAGES.SETTINGS, label: 'Settings' },
      { key: STAGES.RESULTS, label: 'Results' }
    ];
    
    return (
      <div className="progress-indicator">
        {stages.map((s, index) => (
          <div 
            key={s.key} 
            className={`progress-step ${stage === s.key ? 'active' : ''} ${
              stages.indexOf(stages.find(item => item.key === stage)) >= index ? 'completed' : ''
            }`}
          >
            <div className="progress-number">{index + 1}</div>
            <div className="progress-label">{s.label}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="culvert-form-container">
      <div className="page-header">
        <button onClick={handleBack} className="back-button">
          <span>← Back</span>
        </button>
        <h1 className="page-title">Culvert Sizing Tool</h1>
      </div>
      
      {renderProgressIndicator()}
      {renderStageContent()}
      {renderNavButtons()}
    </div>
  );
};

export default CulvertSizingForm;
