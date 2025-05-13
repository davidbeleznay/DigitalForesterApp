// src/screens/culvert/InputScreen.js

import React, { useState, useEffect } from 'react';
import { 
  useGeolocated 
} from "react-geolocated";
import { useNavigate } from 'react-router-dom';
import { MdGpsFixed, MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { determineOptimalCulvertSize } from '../../utils/CulvertCalculator';
import { colors, culvertMaterials, culvertShapes } from '../../constants/constants';
import ThemeToggle from '../../components/ThemeToggle';

const InputScreen = () => {
  const navigate = useNavigate();
  
  // Basic culvert identification
  const [culvertId, setCulvertId] = useState('');
  const [roadName, setRoadName] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Stream measurements
  const [measurements, setMeasurements] = useState([
    { id: 1, topWidth: '', bottomWidth: '', depth: '' }
  ]);
  
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

  // Use react-geolocated hook for location services
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } = 
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  // Update location when coords change
  useEffect(() => {
    if (coords) {
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setLocationError(null);
    }
  }, [coords]);

  const getLocation = () => {
    if (!isGeolocationAvailable) {
      setLocationError("Your browser does not support geolocation");
      return;
    }
    
    if (!isGeolocationEnabled) {
      setLocationError("Geolocation is not enabled");
      return;
    }
    
    getPosition();
  };

  // Add a new measurement row
  const addMeasurement = () => {
    const nextId = Math.max(...measurements.map(m => m.id), 0) + 1;
    setMeasurements([...measurements, { id: nextId, topWidth: '', bottomWidth: '', depth: '' }]);
  };

  // Remove a measurement row
  const removeMeasurement = (id) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter(m => m.id !== id));
    } else {
      alert('Cannot Remove: You must have at least one measurement.');
    }
  };

  // Update a specific measurement field
  const updateMeasurement = (id, field, value) => {
    setMeasurements(measurements.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  // Calculate average measurements
  const calculateAverages = () => {
    if (measurements.length === 0) return { topWidth: 0, bottomWidth: 0, depth: 0 };
    
    const sumTopWidth = measurements.reduce((sum, m) => sum + parseFloat(m.topWidth || 0), 0);
    const sumBottomWidth = measurements.reduce((sum, m) => sum + parseFloat(m.bottomWidth || 0), 0);
    const sumDepth = measurements.reduce((sum, m) => sum + parseFloat(m.depth || 0), 0);
    
    return {
      topWidth: (sumTopWidth / measurements.length).toFixed(2),
      bottomWidth: (sumBottomWidth / measurements.length).toFixed(2),
      depth: (sumDepth / measurements.length).toFixed(2),
    };
  };

  // Calculate culvert size
  const calculateCulvertSize = () => {
    // Validate inputs
    if (!validateInputs()) {
      alert('Invalid Inputs: Please fill in all required fields with valid numbers.');
      return;
    }

    // Parse numeric inputs
    const slope = parseFloat(streamSlope);
    const discharge = parseFloat(bankfullDischarge);
    const hwD = parseFloat(maxHwD);
    const manningsValue = parseFloat(manningsN);

    // Apply climate change factor if selected
    const climateChangeFactor = includeClimateChange ? 1.2 : 1.0; // 20% increase
    const adjustedDischarge = discharge * climateChangeFactor;

    // Calculate the optimal culvert size
    const result = determineOptimalCulvertSize(
      measurements,
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
        measurements,
        averages: calculateAverages(),
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

  // Validate all required inputs
  const validateInputs = () => {
    // Check if all measurements have valid values
    const validMeasurements = measurements.every(m => 
      !isNaN(parseFloat(m.topWidth)) && 
      !isNaN(parseFloat(m.bottomWidth)) && 
      !isNaN(parseFloat(m.depth)) &&
      parseFloat(m.topWidth) > 0 &&
      parseFloat(m.bottomWidth) > 0 &&
      parseFloat(m.depth) > 0
    );

    // Check if other required fields are valid
    const validSlope = !isNaN(parseFloat(streamSlope)) && parseFloat(streamSlope) > 0;
    const validDischarge = !isNaN(parseFloat(bankfullDischarge)) && parseFloat(bankfullDischarge) > 0;
    const validHwD = !isNaN(parseFloat(maxHwD)) && parseFloat(maxHwD) > 0;
    const validManningsN = !isNaN(parseFloat(manningsN)) && parseFloat(manningsN) > 0;

    return validMeasurements && validSlope && validDischarge && validHwD && validManningsN;
  };

  // Find the Manning's n value for the selected material
  useEffect(() => {
    const material = culvertMaterials.find(m => m.value === culvertMaterial);
    if (material) {
      setManningsN(material.manningsN.toString());
    }
  }, [culvertMaterial]);

  return (
    <div className="container">
      <ThemeToggle />

      {/* Culvert ID Section */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Culvert ID</h2>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Culvert ID</label>
          <input
            type="text"
            style={styles.input}
            value={culvertId}
            onChange={(e) => setCulvertId(e.target.value)}
            placeholder="Enter culvert ID"
          />
        </div>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Road Name</label>
          <input
            type="text"
            style={styles.input}
            value={roadName}
            onChange={(e) => setRoadName(e.target.value)}
            placeholder="Enter road name"
          />
        </div>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Location</label>
          <button 
            style={styles.gpsButton} 
            onClick={getLocation}
          >
            <MdGpsFixed size={24} color="white" />
            <span style={styles.gpsButtonText}>
              {location ? 
                `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 
                'Get GPS Location'}
            </span>
          </button>
          {locationError && <p style={styles.errorText}>{locationError}</p>}
        </div>
      </div>

      {/* Stream Measurements Section */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Stream Measurements</h2>
        <p style={styles.description}>
          Measure the stream at representative locations to determine average dimensions. The California Method uses average width × average height × 3 to calculate the required end area.
        </p>
        
        {measurements.map((measurement, index) => (
          <div key={measurement.id} style={styles.measurementRow}>
            <div style={styles.measurementHeader}>
              <h3 style={styles.measurementTitle}>Measurement {index + 1}</h3>
              {measurements.length > 1 && (
                <button 
                  onClick={() => removeMeasurement(measurement.id)}
                  style={styles.removeButton}
                >
                  <MdRemoveCircle size={24} color={colors.error} />
                </button>
              )}
            </div>
            
            <div style={styles.fieldRow}>
              <div style={{...styles.fieldGroup, ...styles.fieldHalf}}>
                <label style={styles.label}>Top Width (m)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={measurement.topWidth}
                  onChange={(e) => updateMeasurement(measurement.id, 'topWidth', e.target.value)}
                  placeholder="0.0"
                />
              </div>
              
              <div style={{...styles.fieldGroup, ...styles.fieldHalf}}>
                <label style={styles.label}>Bottom Width (m)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={measurement.bottomWidth}
                  onChange={(e) => updateMeasurement(measurement.id, 'bottomWidth', e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>
            
            <div style={styles.fieldRow}>
              <div style={{...styles.fieldGroup, ...styles.fieldHalf}}>
                <label style={styles.label}>Depth (m)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={measurement.depth}
                  onChange={(e) => updateMeasurement(measurement.id, 'depth', e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button 
          style={styles.addButton}
          onClick={addMeasurement}
        >
          <MdAddCircle size={20} color={colors.primary} />
          <span style={styles.addButtonText}>Add Measurement</span>
        </button>
        
        <div style={styles.averageSection}>
          <h3 style={styles.averageTitle}>Calculated Averages:</h3>
          <div style={styles.averageRow}>
            <div style={styles.averageItem}>
              <p style={styles.averageLabel}>Avg. Top Width:</p>
              <p style={styles.averageValue}>{calculateAverages().topWidth} m</p>
            </div>
            <div style={styles.averageItem}>
              <p style={styles.averageLabel}>Avg. Bottom Width:</p>
              <p style={styles.averageValue}>{calculateAverages().bottomWidth} m</p>
            </div>
            <div style={styles.averageItem}>
              <p style={styles.averageLabel}>Avg. Depth:</p>
              <p style={styles.averageValue}>{calculateAverages().depth} m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Properties Section */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Stream Properties</h2>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Stream Slope (m/m)</label>
          <input
            type="number"
            style={styles.input}
            value={streamSlope}
            onChange={(e) => setStreamSlope(e.target.value)}
            placeholder="e.g., 0.02"
          />
        </div>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Bankfull Discharge (m³/s)</label>
          <input
            type="number"
            style={styles.input}
            value={bankfullDischarge}
            onChange={(e) => setBankfullDischarge(e.target.value)}
            placeholder="e.g., 1.5"
          />
        </div>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Fish Passage Required</label>
          <button 
            style={{
              ...styles.toggleButton,
              ...(fishBearing ? styles.toggleActive : styles.toggleInactive)
            }}
            onClick={() => setFishBearing(!fishBearing)}
          >
            <span style={fishBearing ? styles.toggleActiveText : styles.toggleInactiveText}>
              {fishBearing ? 'Yes' : 'No'}
            </span>
          </button>
        </div>
      </div>

      {/* Culvert Specifications Section */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Culvert Specifications</h2>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Culvert Material</label>
          <div style={styles.optionsContainer}>
            {culvertMaterials.map(material => (
              <button 
                key={material.value}
                style={{
                  ...styles.optionButton,
                  ...(culvertMaterial === material.value ? styles.optionActive : styles.optionInactive)
                }}
                onClick={() => setCulvertMaterial(material.value)}
              >
                <span style={culvertMaterial === material.value ? styles.optionActiveText : styles.optionInactiveText}>
                  {material.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Culvert Shape</label>
          <div style={styles.optionsContainer}>
            {culvertShapes.map(shape => (
              <button 
                key={shape.value}
                style={{
                  ...styles.optionButton,
                  ...(culvertShape === shape.value ? styles.optionActive : styles.optionInactive)
                }}
                onClick={() => setCulvertShape(shape.value)}
              >
                <span style={culvertShape === shape.value ? styles.optionActiveText : styles.optionInactiveText}>
                  {shape.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Manning's n Value</label>
          <input
            type="number"
            style={styles.input}
            value={manningsN}
            onChange={(e) => setManningsN(e.target.value)}
            placeholder="e.g., 0.024"
          />
          <p style={styles.helperText}>
            Auto-filled based on material selection. Can be manually adjusted.
          </p>
        </div>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Maximum Headwater Depth Ratio (HW/D)</label>
          <input
            type="number"
            style={styles.input}
            value={maxHwD}
            onChange={(e) => setMaxHwD(e.target.value)}
            placeholder="e.g., 0.8"
          />
          <p style={styles.helperText}>
            Standard design criterion is 0.8 (headwater depth = 0.8 × culvert diameter/height)
          </p>
        </div>
      </div>

      {/* Design Options Section */}
      <div className="card">
        <h2 style={styles.sectionTitle}>Design Options</h2>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Include Climate Change Factor (20% increase)</label>
          <button 
            style={{
              ...styles.toggleButton,
              ...(includeClimateChange ? styles.toggleActive : styles.toggleInactive)
            }}
            onClick={() => setIncludeClimateChange(!includeClimateChange)}
          >
            <span style={includeClimateChange ? styles.toggleActiveText : styles.toggleInactiveText}>
              {includeClimateChange ? 'Yes' : 'No'}
            </span>
          </button>
        </div>
        
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Use Transportability Matrix (3x Bankfull Method)</label>
          <button 
            style={{
              ...styles.toggleButton,
              ...(useTransportabilityMatrix ? styles.toggleActive : styles.toggleInactive)
            }}
            onClick={() => setUseTransportabilityMatrix(!useTransportabilityMatrix)}
          >
            <span style={useTransportabilityMatrix ? styles.toggleActiveText : styles.toggleInactiveText}>
              {useTransportabilityMatrix ? 'Yes' : 'No'}
            </span>
          </button>
        </div>
      </div>

      {/* Calculate Button */}
      <button 
        className="btn btn-primary"
        style={{width: '100%', marginBottom: '32px'}}
        onClick={calculateCulvertSize}
      >
        <span>Calculate Culvert Size</span>
      </button>
    </div>
  );
};

const styles = {
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: colors.primary,
  },
  description: {
    fontSize: '14px',
    color: colors.lightText,
    marginBottom: '16px',
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldHalf: {
    width: '48%',
  },
  label: {
    fontSize: '16px',
    marginBottom: '8px',
    color: colors.text,
    display: 'block',
  },
  input: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '4px',
    padding: '12px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
  },
  helperText: {
    fontSize: '12px',
    color: colors.lightText,
    marginTop: '4px',
  },
  gpsButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  gpsButtonText: {
    color: 'white',
    fontSize: '16px',
    marginLeft: '8px',
  },
  errorText: {
    color: colors.error,
    marginTop: '4px',
  },
  measurementRow: {
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '16px',
  },
  measurementHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  measurementTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.text,
    margin: 0,
  },
  removeButton: {
    padding: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  addButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    marginBottom: '16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  addButtonText: {
    color: colors.primary,
    fontSize: '16px',
    marginLeft: '8px',
    fontWeight: 'bold',
  },
  averageSection: {
    backgroundColor: colors.background,
    borderRadius: '4px',
    padding: '12px',
  },
  averageTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: colors.text,
    margin: 0,
  },
  averageRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  averageItem: {
    marginRight: '16px',
    marginBottom: '8px',
  },
  averageLabel: {
    fontSize: '14px',
    color: colors.lightText,
    margin: 0,
  },
  averageValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.primary,
    margin: 0,
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  optionButton: {
    border: '1px solid',
    borderRadius: '4px',
    padding: '10px',
    marginRight: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    background: 'none',
  },
  optionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  optionActiveText: {
    color: colors.white,
  },
  optionInactiveText: {
    color: colors.text,
  },
  toggleButton: {
    border: '1px solid',
    borderRadius: '4px',
    padding: '12px',
    width: '80px',
    cursor: 'pointer',
    background: 'none',
    textAlign: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  toggleActiveText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  toggleInactiveText: {
    color: colors.text,
  },
};

export default InputScreen;