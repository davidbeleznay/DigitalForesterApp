// src/screens/culvert/InputScreen.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdGpsFixed, MdAddCircle, MdRemoveCircle, MdSave, MdInfo, MdLocationOn, MdArrowBack } from 'react-icons/md';
import { determineOptimalCulvertSize } from '../../utils/CulvertCalculator';
import { colors, culvertMaterials, culvertShapes, formatCoordinates } from '../../constants/constants';
import ThemeToggle from '../../components/ThemeToggle';

const InputScreen = () => {
  const navigate = useNavigate();
  
  // Basic culvert identification
  const [culvertId, setCulvertId] = useState('');
  const [roadName, setRoadName] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Stream measurements - separated by type
  const [topWidths, setTopWidths] = useState([{ id: 1, value: '' }]);
  const [bottomWidths, setBottomWidths] = useState([{ id: 1, value: '' }]);
  const [depths, setDepths] = useState([{ id: 1, value: '' }]);
  
  // Stream properties
  const [streamSlope, setStreamSlope] = useState('');
  const [bankfullDischarge, setBankfullDischarge] = useState('');
  const [fishBearing, setFishBearing] = useState(false);
  
  // Culvert specifications
  const [culvertMaterial, setCulvertMaterial] = useState('cmp');
  const [culvertShape, setCulvertShape] = useState('circular');
  const [manningsN, setManningsN] = useState('0.024');
  const [maxHwD, setMaxHwD] = useState('0.8');
  
  // Toggle options
  const [includeClimateChange, setIncludeClimateChange] = useState(true);
  const [useTransportabilityMatrix, setUseTransportabilityMatrix] = useState(true);
  
  // Status message
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success'); // 'success', 'error', 'info'

  // Get current location using Web Geolocation API with better error handling
  const getLocation = () => {
    setLocationError(null);
    setIsGettingLocation(true);
    setStatusMessage('Getting location...');
    setStatusType('info');
    
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support geolocation");
      setStatusMessage('Geolocation not supported by your browser');
      setStatusType('error');
      setIsGettingLocation(false);
      return;
    }
    
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({
        latitude,
        longitude,
      });
      setLocationError(null);
      setStatusMessage('Location captured successfully!');
      setStatusType('success');
      setIsGettingLocation(false);
      
      setTimeout(() => {
        if (statusMessage === 'Location captured successfully!') {
          setStatusMessage('');
        }
      }, 3000);
    };
    
    const handleError = (error) => {
      console.error("Error getting location:", error);
      
      // Human-friendly error messages
      let errorMessage = "";
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission was denied. Please enable location access in your browser settings and try again.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable. Try again or enter coordinates manually.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please try again.";
          break;
        default:
          errorMessage = `Error getting location: ${error.message}`;
      }
      
      setLocationError(errorMessage);
      setStatusMessage(errorMessage);
      setStatusType('error');
      setIsGettingLocation(false);
    };
    
    const options = { 
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };
    
    try {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
    } catch (err) {
      setLocationError(`Unexpected error: ${err.message}`);
      setStatusMessage(`Unexpected error: ${err.message}`);
      setStatusType('error');
      setIsGettingLocation(false);
    }
  };

  // Helper functions for managing measurement arrays
  const addMeasurement = (type) => {
    if (type === 'topWidth') {
      const nextId = Math.max(...topWidths.map(m => m.id), 0) + 1;
      setTopWidths([...topWidths, { id: nextId, value: '' }]);
    } else if (type === 'bottomWidth') {
      const nextId = Math.max(...bottomWidths.map(m => m.id), 0) + 1;
      setBottomWidths([...bottomWidths, { id: nextId, value: '' }]);
    } else if (type === 'depth') {
      const nextId = Math.max(...depths.map(m => m.id), 0) + 1;
      setDepths([...depths, { id: nextId, value: '' }]);
    }
  };

  const removeMeasurement = (type, id) => {
    if (type === 'topWidth' && topWidths.length > 1) {
      setTopWidths(topWidths.filter(m => m.id !== id));
    } else if (type === 'bottomWidth' && bottomWidths.length > 1) {
      setBottomWidths(bottomWidths.filter(m => m.id !== id));
    } else if (type === 'depth' && depths.length > 1) {
      setDepths(depths.filter(m => m.id !== id));
    } else {
      alert(`Cannot Remove: You must have at least one ${type} measurement.`);
    }
  };

  const updateMeasurement = (type, id, value) => {
    if (type === 'topWidth') {
      setTopWidths(topWidths.map(m => m.id === id ? { ...m, value } : m));
    } else if (type === 'bottomWidth') {
      setBottomWidths(bottomWidths.map(m => m.id === id ? { ...m, value } : m));
    } else if (type === 'depth') {
      setDepths(depths.map(m => m.id === id ? { ...m, value } : m));
    }
  };

  // Calculate averages for each measurement type
  const calculateAverage = (measurements) => {
    if (measurements.length === 0) return 0;
    
    const validMeasurements = measurements.filter(m => !isNaN(parseFloat(m.value)) && parseFloat(m.value) > 0);
    if (validMeasurements.length === 0) return 0;
    
    const sum = validMeasurements.reduce((total, m) => total + parseFloat(m.value), 0);
    return (sum / validMeasurements.length).toFixed(2);
  };

  // Get averages for display
  const averages = {
    topWidth: calculateAverage(topWidths),
    bottomWidth: calculateAverage(bottomWidths),
    depth: calculateAverage(depths)
  };

  // Convert separate measurements to the format expected by the calculator
  const convertMeasurementsForCalculation = () => {
    // Create a standard measurements array as expected by the calculator
    // Use the longest array (likely topWidth) as the base length
    const maxLength = Math.max(topWidths.length, bottomWidths.length, depths.length);
    const standardizedMeasurements = [];
    
    for (let i = 0; i < maxLength; i++) {
      standardizedMeasurements.push({
        id: i + 1,
        topWidth: i < topWidths.length && !isNaN(parseFloat(topWidths[i].value)) 
          ? topWidths[i].value 
          : averages.topWidth,
        bottomWidth: i < bottomWidths.length && !isNaN(parseFloat(bottomWidths[i].value)) 
          ? bottomWidths[i].value 
          : averages.bottomWidth,
        depth: i < depths.length && !isNaN(parseFloat(depths[i].value)) 
          ? depths[i].value 
          : averages.depth
      });
    }
    
    return standardizedMeasurements;
  };

  // Calculate culvert size
  const calculateCulvertSize = () => {
    // Validate inputs
    if (!validateInputs()) {
      setStatusMessage('Please fill in all required fields with valid numbers.');
      setStatusType('error');
      return;
    }

    // Convert measurements to the format expected by the calculator
    const standardizedMeasurements = convertMeasurementsForCalculation();

    // Parse numeric inputs
    const slope = parseFloat(streamSlope);
    const discharge = parseFloat(bankfullDischarge);
    const hwD = parseFloat(maxHwD);
    const manningsValue = parseFloat(manningsN);

    // Apply climate change factor if selected
    const climateChangeFactor = includeClimateChange ? 1.2 : 1.0; // 20% increase
    const adjustedDischarge = discharge * climateChangeFactor;

    // Save current form data to localStorage
    saveFormData();

    // Calculate the optimal culvert size
    const result = determineOptimalCulvertSize(
      standardizedMeasurements,
      slope,
      adjustedDischarge,
      culvertShape,
      manningsValue,
      hwD
    );

    // Navigate to the results screen with the calculation results
    navigate('/culvert/result', {
      state: {
        result,
        measurements: standardizedMeasurements,
        averages,
        streamProperties: {
          slope,
          discharge,
          adjustedDischarge,
          fishBearing,
        },
        culvertSpecs: {
          material: culvertMaterial,
          shape: culvertShape,
          manningsN: manningsValue,
          maxHwD: hwD,
        },
        options: {
          includeClimateChange,
          useTransportabilityMatrix,
          climateChangeFactor,
        }
      }
    });
  };

  // Save form data to localStorage
  const saveFormData = () => {
    const formData = {
      culvertId,
      roadName,
      location,
      topWidths,
      bottomWidths,
      depths,
      streamSlope,
      bankfullDischarge,
      fishBearing,
      culvertMaterial,
      culvertShape,
      manningsN,
      maxHwD,
      includeClimateChange,
      useTransportabilityMatrix,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('culvertForm', JSON.stringify(formData));
    
    setStatusMessage('Data saved successfully!');
    setStatusType('success');
    setTimeout(() => {
      if (statusMessage === 'Data saved successfully!') {
        setStatusMessage('');
      }
    }, 3000);
  };

  // Load saved form data if available
  useEffect(() => {
    const savedData = localStorage.getItem('culvertForm');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setCulvertId(data.culvertId || '');
        setRoadName(data.roadName || '');
        setLocation(data.location);
        
        if (data.topWidths && data.topWidths.length > 0) setTopWidths(data.topWidths);
        if (data.bottomWidths && data.bottomWidths.length > 0) setBottomWidths(data.bottomWidths);
        if (data.depths && data.depths.length > 0) setDepths(data.depths);
        
        setStreamSlope(data.streamSlope || '');
        setBankfullDischarge(data.bankfullDischarge || '');
        setFishBearing(data.fishBearing || false);
        
        setCulvertMaterial(data.culvertMaterial || 'cmp');
        setCulvertShape(data.culvertShape || 'circular');
        setManningsN(data.manningsN || '0.024');
        setMaxHwD(data.maxHwD || '0.8');
        
        setIncludeClimateChange(data.includeClimateChange !== undefined ? data.includeClimateChange : true);
        setUseTransportabilityMatrix(data.useTransportabilityMatrix !== undefined ? data.useTransportabilityMatrix : true);
        
        setStatusMessage('Loaded saved data.');
        setStatusType('info');
        setTimeout(() => {
          if (statusMessage === 'Loaded saved data.') {
            setStatusMessage('');
          }
        }, 3000);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Find the Manning's n value for the selected material
  useEffect(() => {
    const material = culvertMaterials.find(m => m.value === culvertMaterial);
    if (material) {
      setManningsN(material.manningsN.toString());
    }
  }, [culvertMaterial]);

  // Validate all required inputs
  const validateInputs = () => {
    // Check if at least one measurement of each type has valid values
    const validTopWidths = topWidths.some(m => !isNaN(parseFloat(m.value)) && parseFloat(m.value) > 0);
    const validBottomWidths = bottomWidths.some(m => !isNaN(parseFloat(m.value)) && parseFloat(m.value) > 0);
    const validDepths = depths.some(m => !isNaN(parseFloat(m.value)) && parseFloat(m.value) > 0);
    
    // Check if other required fields are valid
    const validSlope = !isNaN(parseFloat(streamSlope)) && parseFloat(streamSlope) > 0;
    const validDischarge = !isNaN(parseFloat(bankfullDischarge)) && parseFloat(bankfullDischarge) > 0;
    const validHwD = !isNaN(parseFloat(maxHwD)) && parseFloat(maxHwD) > 0;
    const validManningsN = !isNaN(parseFloat(manningsN)) && parseFloat(manningsN) > 0;
    
    return validTopWidths && validBottomWidths && validDepths && validSlope && validDischarge && validHwD && validManningsN;
  };

  // Render measurement input fields
  const renderMeasurementInputs = (type, measurements, label, placeholder) => {
    return (
      <div className="measurement-section">
        <div className="measurement-header">
          <h3>{label}</h3>
          <button 
            className="add-button"
            onClick={() => addMeasurement(type)}
            aria-label={`Add ${label} measurement`}
          >
            <MdAddCircle size={20} color={colors.primary} />
            <span>Add {label}</span>
          </button>
        </div>
        
        <div className="measurement-grid">
          {measurements.map((measurement, index) => (
            <div key={measurement.id} className="measurement-item">
              <div className="measurement-item-header">
                <span className="measurement-number">{index + 1}</span>
                {measurements.length > 1 && (
                  <button 
                    className="remove-button"
                    onClick={() => removeMeasurement(type, measurement.id)}
                    aria-label={`Remove measurement ${index + 1}`}
                  >
                    <MdRemoveCircle size={18} color={colors.error} />
                  </button>
                )}
              </div>
              <input
                type="number"
                className="measurement-input"
                value={measurement.value}
                onChange={(e) => updateMeasurement(type, measurement.id, e.target.value)}
                placeholder={placeholder}
                step="0.01"
                min="0"
                aria-label={`${label} measurement ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <ThemeToggle />
      
      <div className="page-header">
        <Link to="/" className="back-button">
          <MdArrowBack /> <span>Back</span>
        </Link>
        <h1 className="page-title">Culvert Sizing Tool</h1>
      </div>
      
      {statusMessage && (
        <div className={`status-message ${statusType}`}>
          {statusMessage}
        </div>
      )}

      {/* Culvert ID Section */}
      <div className="card">
        <h2 className="card-title">Culvert ID</h2>
        
        <div className="form-group">
          <label className="form-label">Culvert ID</label>
          <input
            type="text"
            className="form-input"
            value={culvertId}
            onChange={(e) => setCulvertId(e.target.value)}
            placeholder="Enter culvert ID"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Road Name</label>
          <input
            type="text"
            className="form-input"
            value={roadName}
            onChange={(e) => setRoadName(e.target.value)}
            placeholder="Enter road name"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Location</label>
          <div className="location-container">
            {location && (
              <div className="location-display">
                <MdLocationOn size={20} color={colors.primary} />
                <span className="location-text">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </span>
              </div>
            )}
            <button 
              className={`gps-button ${isGettingLocation ? 'loading' : ''}`}
              onClick={getLocation}
              disabled={isGettingLocation}
            >
              <MdGpsFixed size={20} color="white" />
              <span>{isGettingLocation ? 'Getting Location...' : (location ? 'Update Location' : 'Get GPS Location')}</span>
            </button>
            
            {/* Manual location entry option */}
            {(locationError || !navigator.geolocation) && (
              <div className="manual-location">
                <p className="helper-text">You can also enter coordinates manually:</p>
                <div className="manual-coords">
                  <input
                    type="number"
                    placeholder="Latitude"
                    className="form-input"
                    step="0.000001"
                    value={location?.latitude || ''}
                    onChange={(e) => setLocation(prev => ({
                      ...prev,
                      latitude: parseFloat(e.target.value)
                    }))}
                  />
                  <input
                    type="number"
                    placeholder="Longitude"
                    className="form-input"
                    step="0.000001"
                    value={location?.longitude || ''}
                    onChange={(e) => setLocation(prev => ({
                      ...prev,
                      longitude: parseFloat(e.target.value)
                    }))}
                  />
                </div>
              </div>
            )}
          </div>
          {locationError && <p className="error-text">{locationError}</p>}
        </div>
      </div>

      {/* Stream Measurements Section */}
      <div className="card">
        <h2 className="card-title">Stream Measurements</h2>
        <p className="card-description">
          Take measurements at representative locations. The calculator will use averages to determine required culvert size. You can add multiple measurements for each dimension.
        </p>
        
        {/* Top Width Measurements */}
        {renderMeasurementInputs(
          'topWidth', 
          topWidths, 
          'Top Width (m)', 
          'e.g., 2.5'
        )}
        
        {/* Bottom Width Measurements */}
        {renderMeasurementInputs(
          'bottomWidth', 
          bottomWidths, 
          'Bottom Width (m)', 
          'e.g., 2.0'
        )}
        
        {/* Depth Measurements */}
        {renderMeasurementInputs(
          'depth', 
          depths, 
          'Depth (m)', 
          'e.g., 0.5'
        )}
        
        <div className="averages-container">
          <h3>Calculated Averages</h3>
          <div className="averages-grid">
            <div className="average-item">
              <span className="average-label">Avg. Top Width:</span>
              <span className="average-value">{averages.topWidth} m</span>
            </div>
            <div className="average-item">
              <span className="average-label">Avg. Bottom Width:</span>
              <span className="average-value">{averages.bottomWidth} m</span>
            </div>
            <div className="average-item">
              <span className="average-label">Avg. Depth:</span>
              <span className="average-value">{averages.depth} m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Properties Section */}
      <div className="card">
        <h2 className="card-title">Stream Properties</h2>
        
        <div className="form-group">
          <label className="form-label">Stream Slope (m/m)</label>
          <input
            type="number"
            className="form-input"
            value={streamSlope}
            onChange={(e) => setStreamSlope(e.target.value)}
            placeholder="e.g., 0.02"
            step="0.001"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Bankfull Discharge (m³/s)</label>
          <input
            type="number"
            className="form-input"
            value={bankfullDischarge}
            onChange={(e) => setBankfullDischarge(e.target.value)}
            placeholder="e.g., 1.5"
            step="0.1"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Fish Passage Required</label>
          <button 
            className={`toggle-button ${fishBearing ? 'active' : 'inactive'}`}
            onClick={() => setFishBearing(!fishBearing)}
          >
            <span>
              {fishBearing ? 'Yes' : 'No'}
            </span>
          </button>
        </div>
      </div>

      {/* Culvert Specifications Section */}
      <div className="card">
        <h2 className="card-title">Culvert Specifications</h2>
        
        <div className="form-group">
          <label className="form-label">Culvert Material</label>
          <div className="options-container">
            {culvertMaterials.map(material => (
              <button 
                key={material.value}
                className={`option-button ${culvertMaterial === material.value ? 'active' : 'inactive'}`}
                onClick={() => setCulvertMaterial(material.value)}
              >
                <span>
                  {material.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Culvert Shape</label>
          <div className="options-container">
            {culvertShapes.map(shape => (
              <button 
                key={shape.value}
                className={`option-button ${culvertShape === shape.value ? 'active' : 'inactive'}`}
                onClick={() => setCulvertShape(shape.value)}
              >
                <span>
                  {shape.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Manning's n Value</label>
          <input
            type="number"
            className="form-input"
            value={manningsN}
            onChange={(e) => setManningsN(e.target.value)}
            placeholder="e.g., 0.024"
            step="0.001"
            min="0"
          />
          <p className="helper-text">
            Auto-filled based on material selection. Can be manually adjusted.
          </p>
        </div>
        
        <div className="form-group">
          <label className="form-label">Maximum Headwater Depth Ratio (HW/D)</label>
          <input
            type="number"
            className="form-input"
            value={maxHwD}
            onChange={(e) => setMaxHwD(e.target.value)}
            placeholder="e.g., 0.8"
            step="0.1"
            min="0"
            max="2"
          />
          <p className="helper-text">
            Standard design criterion is 0.8 (headwater depth = 0.8 × culvert diameter/height)
          </p>
        </div>
      </div>

      {/* Design Options Section */}
      <div className="card">
        <h2 className="card-title">Design Options</h2>
        
        <div className="form-group">
          <label className="form-label">Include Climate Change Factor (20% increase)</label>
          <button 
            className={`toggle-button ${includeClimateChange ? 'active' : 'inactive'}`}
            onClick={() => setIncludeClimateChange(!includeClimateChange)}
          >
            <span>
              {includeClimateChange ? 'Yes' : 'No'}
            </span>
          </button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Use Transportability Matrix (3x Bankfull Method)</label>
          <button 
            className={`toggle-button ${useTransportabilityMatrix ? 'active' : 'inactive'}`}
            onClick={() => setUseTransportabilityMatrix(!useTransportabilityMatrix)}
          >
            <span>
              {useTransportabilityMatrix ? 'Yes' : 'No'}
            </span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn-secondary"
          onClick={saveFormData}
        >
          <MdSave size={18} />
          <span>Save Draft</span>
        </button>
        
        <button 
          className="btn-primary"
          onClick={calculateCulvertSize}
        >
          <MdInfo size={18} />
          <span>Calculate Culvert Size</span>
        </button>
      </div>
    </div>
  );
};

export default InputScreen;