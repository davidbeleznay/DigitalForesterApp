import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calculateCulvert, getClimateFactorPresets } from '../utils/CulvertCalculator';
import CulvertResults from '../components/culvert/CulvertResults';
import '../styles/enhanced-form.css';

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

  // Handle climate preset selection
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
  
  // Continue with rest of component... (validation, calculation, navigation functions)
  // Due to character limits, I'll create this as a separate file update
  
  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>🌊 Culvert Sizing Tool</h1>
        <p>Professional culvert sizing using stream measurements with BC coastal climate projections</p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
      </div>
      {/* Form content will be added in next update */}
    </div>
  );
};

export default CulvertSizingForm;