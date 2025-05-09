import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/sharedStyles';

function CulvertSizingForm() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    inspector: '',
    // Watershed characteristics
    watershed: {
      area: '', // in hectares or km²
      length: '', // in meters
      slope: '', // in percentage
      runoffCoefficient: '0.45', // default medium-forested value
      precipitationIntensity: '', // mm/hr for design storm
      elevationDifference: '', // in meters
      soilType: 'medium', // default soil type
      region: 'bc', // default region (BC or California)
    },
    // Stream geometry
    stream: {
      width: '', // bankfull width in meters
      depth: '', // bankfull depth in meters
      channelSlope: '', // channel slope in percentage
      fishBearing: false, // is this a fish-bearing stream?
      debrisPotential: 'medium', // low, medium, high
    },
    // Culvert specifications
    culvert: {
      material: 'corrugated_metal', // default
      shape: 'circular', // default
      manningsN: '0.024', // default for corrugated metal
      embedmentDepth: '0.2', // default 20% embedment
      slopeRatio: '0.02', // default 2% slope
      debrisCoefficient: '1.2', // default 20% safety factor
      climateChangeFactor: '1.2', // default 20% increase for climate change
      useClimateChangeToggle: true, // default on
      useTransportabilityToggle: true, // default on
    },
    // Bankfull data
    bankfull: {
      width: '', // in meters
      depth: '', // in meters
      areaMethod: 'calculated', // default
    },
    // Design preference
    designPreference: {
      hdRatio: '0.8', // headwater to diameter ratio (default 0.8)
      velocityThreshold: '4.5', // maximum allowable velocity in m/s
      serviceLife: '25', // design service life in years
    }
  });
  
  // Results state
  const [results, setResults] = useState({
    // Hydraulic sizing
    peakDischarge: null, // m³/s
    requiredCapacity: null, // m³/s (with safety factors)
    hydraulicDiameter: null, // mm (based on hydraulic calculations)
    hydraulicArea: null, // m²
    
    // Transportability sizing
    transportabilityDiameter: null, // mm (based on matrix)
    transportabilityReason: '', // reason for the transportability recommendation
    
    // Final recommendation
    recommendedDiameter: null, // mm (larger of hydraulic and transportability)
    recommendedArea: null, // m²
    sizingMethod: '', // which method governs the design?
    standardSize: null, // rounded to standard size
    
    // Performance metrics
    velocityCheck: null, // m/s
    headwaterDepthRatio: null,
    isAdequate: null,
    notes: '',
  });
  
  // Show results section
  const [showResults, setShowResults] = useState(false);
  
  // Current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  
  // Culvert material options
  const culvertMaterials = [
    { value: 'corrugated_metal', label: 'Corrugated Metal', manningsN: '0.024' },
    { value: 'concrete', label: 'Concrete', manningsN: '0.013' },
    { value: 'plastic', label: 'Plastic (HDPE/PVC)', manningsN: '0.010' },
    { value: 'aluminum', label: 'Aluminum', manningsN: '0.021' }
  ];
  
  // Culvert shape options
  const culvertShapes = [
    { value: 'circular', label: 'Circular' },
    { value: 'pipe_arch', label: 'Pipe Arch' },
    { value: 'box', label: 'Box Culvert' },
    { value: 'arch', label: 'Arch Culvert' }
  ];
  
  // Runoff coefficient options
  const runoffCoefficients = [
    { value: '0.35', label: 'Heavily Forested (0.35)' },
    { value: '0.45', label: 'Medium Forested (0.45)' },
    { value: '0.60', label: 'Light Vegetation (0.60)' },
    { value: '0.70', label: 'Sparse Vegetation (0.70)' },
    { value: '0.80', label: 'Cleared Land (0.80)' }
  ];

  // Soil type options
  const soilTypes = [
    { value: 'sandy', label: 'Sandy/Gravel (High Infiltration)' },
    { value: 'medium', label: 'Medium Texture (Moderate Infiltration)' },
    { value: 'clay', label: 'Clay/Silt (Low Infiltration)' },
    { value: 'bedrock', label: 'Shallow Bedrock (Very Low Infiltration)' }
  ];

  // Region options
  const regionOptions = [
    { value: 'bc', label: 'British Columbia' },
    { value: 'california', label: 'California' },
    { value: 'pacific_nw', label: 'Pacific Northwest' }
  ];

  // Debris potential options
  const debrisPotentialOptions = [
    { value: 'low', label: 'Low (minimal woody debris, stable slopes)' },
    { value: 'medium', label: 'Medium (moderate woody debris, some instability)' },
    { value: 'high', label: 'High (significant woody debris, unstable terrain)' }
  ];
  
  // Transportability matrix for sizing based on stream width, slope, and fish presence
  // Values represent minimum culvert diameter in mm as a multiple of bankfull width
  const transportabilityMatrix = {
    nonFishBearing: {
      lowSlope: 1.2, // 1.2 × bankfull width
      mediumSlope: 1.5, // 1.5 × bankfull width
      highSlope: 2.0  // 2.0 × bankfull width
    },
    fishBearing: {
      lowSlope: 1.5, // 1.5 × bankfull width
      mediumSlope: 2.0, // 2.0 × bankfull width
      highSlope: 2.5  // 2.5 × bankfull width
    }
  };
  
  // Standard culvert sizes in mm
  const standardSizes = [400, 500, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2400, 3000];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if this is a nested field
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setFormData({
        ...formData,
        [category]: {
          ...formData[category],
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      ...formData,
      [name.includes('.') ? name.split('.')[0] : name]: 
        name.includes('.') 
          ? {
              ...formData[name.split('.')[0]],
              [name.split('.')[1]]: value
            }
          : value
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    
    // Check if this is a nested field
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setFormData({
        ...formData,
        [category]: {
          ...formData[category],
          [field]: checked
        }
      });
      
      // Auto-save to localStorage on change
      saveToLocalStorage({
        ...formData,
        [category]: {
          ...formData[category],
          [field]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked
      });
      
      // Auto-save to localStorage on change
      saveToLocalStorage({
        ...formData,
        [name]: checked
      });
    }
  };
  
  // Update Manning's N when material changes
  const handleMaterialChange = (e) => {
    const material = e.target.value;
    const selectedMaterial = culvertMaterials.find(m => m.value === material);
    
    setFormData({
      ...formData,
      culvert: {
        ...formData.culvert,
        material: material,
        manningsN: selectedMaterial.manningsN
      }
    });
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      ...formData,
      culvert: {
        ...formData.culvert,
        material: material,
        manningsN: selectedMaterial.manningsN
      }
    });
  };
  
  // Synchronize bankfull width with stream width
  const handleStreamWidthChange = (e) => {
    const width = e.target.value;
    
    setFormData({
      ...formData,
      stream: {
        ...formData.stream,
        width: width
      },
      bankfull: {
        ...formData.bankfull,
        width: width
      }
    });
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      ...formData,
      stream: {
        ...formData.stream,
        width: width
      },
      bankfull: {
        ...formData.bankfull,
        width: width
      }
    });
  };
  
  // Synchronize bankfull depth with stream depth
  const handleStreamDepthChange = (e) => {
    const depth = e.target.value;
    
    setFormData({
      ...formData,
      stream: {
        ...formData.stream,
        depth: depth
      },
      bankfull: {
        ...formData.bankfull,
        depth: depth
      }
    });
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      ...formData,
      stream: {
        ...formData.stream,
        depth: depth
      },
      bankfull: {
        ...formData.bankfull,
        depth: depth
      }
    });
  };
  
  // Calculate Q100 based on region-specific methods
  const calculateQ100 = () => {
    const region = formData.watershed.region;
    const area = parseFloat(formData.watershed.area);
    
    if (!area) return null;
    
    // British Columbia regional regression equations
    if (region === 'bc') {
      // BC Regression Formula (simplified): Q100 = 0.27 × A^0.753
      return 0.27 * Math.pow(area, 0.753);
    }
    // California regional method
    else if (region === 'california') {
      // Rational Method: Q = C * I * A / 360
      const C = parseFloat(formData.watershed.runoffCoefficient);
      const I = parseFloat(formData.watershed.precipitationIntensity);
      
      if (C && I) {
        return (C * I * area) / 360;
      }
      return null;
    }
    // Pacific Northwest regional regression
    else if (region === 'pacific_nw') {
      // PNW Regression Formula (simplified): Q100 = 0.35 × A^0.81
      return 0.35 * Math.pow(area, 0.81);
    }
    
    return null;
  };
  
  // Calculate required culvert size using hydraulic method
  const calculateHydraulicSize = () => {
    // Basic flow
    let Q = calculateQ100();
    if (!Q) return null;
    
    // Apply climate change factor if toggle is on
    if (formData.culvert.useClimateChangeToggle) {
      const climateChangeFactor = parseFloat(formData.culvert.climateChangeFactor);
      Q = Q * climateChangeFactor;
    }
    
    // Apply debris coefficient
    const debrisCoefficient = parseFloat(formData.culvert.debrisCoefficient);
    const requiredCapacity = Q * debrisCoefficient;
    
    // Using Manning's equation approximation for circular culverts
    // D = ((Q * n) / (0.312 * S^0.5))^(3/8) * 1000
    const n = parseFloat(formData.culvert.manningsN);
    const S = parseFloat(formData.culvert.slopeRatio);
    
    if (n && S) {
      // Calculate diameter in millimeters
      const D = ((requiredCapacity * n) / (0.312 * Math.sqrt(S))) ** (3/8) * 1000;
      
      // Calculate area in square meters
      const area = Math.PI * Math.pow(D/2000, 2);
      
      return {
        peakDischarge: Q,
        requiredCapacity: requiredCapacity,
        diameter: D,
        area: area
      };
    }
    
    return null;
  };
  
  // Calculate required culvert size using transportability matrix
  const calculateTransportabilitySize = () => {
    if (!formData.culvert.useTransportabilityToggle) return null;
    
    const streamWidth = parseFloat(formData.stream.width);
    const channelSlope = parseFloat(formData.stream.channelSlope);
    const fishBearing = formData.stream.fishBearing;
    
    if (!streamWidth || !channelSlope) return null;
    
    // Determine slope category
    let slopeCategory;
    if (channelSlope < 2) {
      slopeCategory = 'lowSlope'; // < 2%
    } else if (channelSlope < 5) {
      slopeCategory = 'mediumSlope'; // 2-5%
    } else {
      slopeCategory = 'highSlope'; // > 5%
    }
    
    // Get the width multiplier from the matrix
    const widthMultiplier = fishBearing ? 
      transportabilityMatrix.fishBearing[slopeCategory] : 
      transportabilityMatrix.nonFishBearing[slopeCategory];
    
    // Calculate the required diameter in mm
    const requiredDiameter = streamWidth * widthMultiplier * 1000;
    
    // Calculate area in square meters
    const area = Math.PI * Math.pow(requiredDiameter/2000, 2);
    
    // Determine reason for recommendation
    let reason = fishBearing ? 
      "Fish passage requirements" : 
      "Debris and sediment transport capacity";
    
    if (channelSlope >= 5) {
      reason += " in high gradient stream";
    } else if (channelSlope >= 2) {
      reason += " in moderate gradient stream";
    } else {
      reason += " in low gradient stream";
    }
    
    return {
      diameter: requiredDiameter,
      area: area,
      reason: reason,
      widthMultiplier: widthMultiplier
    };
  };
  
  // Find the nearest standard size
  const findStandardSize = (diameter) => {
    return standardSizes.find(size => size >= diameter) || standardSizes[standardSizes.length - 1];
  };
  
  // Calculate final culvert size recommendation
  const calculateFinalRecommendation = () => {
    // Calculate sizes using both methods
    const hydraulicResults = calculateHydraulicSize();
    const transportabilityResults = calculateTransportabilitySize();
    
    if (!hydraulicResults) return null;
    
    let finalDiameter, finalArea, sizingMethod, transportabilityReason = '';
    
    // If transportability matrix is used and gives larger size, use that
    if (transportabilityResults && transportabilityResults.diameter > hydraulicResults.diameter) {
      finalDiameter = transportabilityResults.diameter;
      finalArea = transportabilityResults.area;
      sizingMethod = 'transportability';
      transportabilityReason = transportabilityResults.reason;
    } else {
      finalDiameter = hydraulicResults.diameter;
      finalArea = hydraulicResults.area;
      sizingMethod = 'hydraulic';
    }
    
    // Round to standard size
    const standardSize = findStandardSize(finalDiameter);
    
    // Calculate velocity
    const velocity = hydraulicResults.requiredCapacity / finalArea;
    
    // Calculate headwater depth ratio (approximate)
    const HW_D = parseFloat(formData.designPreference.hdRatio);
    
    // Determine if velocity is acceptable
    const velocityThreshold = parseFloat(formData.designPreference.velocityThreshold);
    const isAdequate = velocity < velocityThreshold;
    
    return {
      // Hydraulic sizing results
      peakDischarge: hydraulicResults.peakDischarge,
      requiredCapacity: hydraulicResults.requiredCapacity,
      hydraulicDiameter: hydraulicResults.diameter,
      hydraulicArea: hydraulicResults.area,
      
      // Transportability sizing results
      transportabilityDiameter: transportabilityResults ? transportabilityResults.diameter : null,
      transportabilityReason: transportabilityReason,
      
      // Final recommendation
      recommendedDiameter: finalDiameter,
      recommendedArea: finalArea,
      sizingMethod: sizingMethod,
      standardSize: standardSize,
      
      // Performance metrics
      velocityCheck: velocity,
      headwaterDepthRatio: HW_D,
      isAdequate: isAdequate,
      notes: generateNotes(finalDiameter, velocity, sizingMethod, standardSize, transportabilityReason)
    };
  };
  
  // Generate notes based on calculations
  const generateNotes = (diameter, velocity, sizingMethod, standardSize, transportabilityReason) => {
    let notes = '';
    
    // Add sizing method explanation
    if (sizingMethod === 'transportability') {
      notes += `SIZING METHOD: Transportability Matrix Sizing (${transportabilityReason})\n\n`;
    } else {
      notes += `SIZING METHOD: Hydraulic Capacity Sizing\n\n`;
    }
    
    notes += `Recommended minimum culvert size: ${Math.round(diameter)} mm, rounded to standard size: ${standardSize} mm.\n\n`;
    
    // Add velocity warnings
    if (velocity > 4.5) {
      notes += `WARNING: Flow velocity (${velocity.toFixed(2)} m/s) exceeds 4.5 m/s. Energy dissipation measures should be implemented at the outlet.\n\n`;
    } else if (velocity > 3.0) {
      notes += `CAUTION: Flow velocity (${velocity.toFixed(2)} m/s) is high. Consider adding riprap at the outlet.\n\n`;
    }
    
    // Add material-specific notes
    if (formData.culvert.material === 'corrugated_metal') {
      notes += `Note: Corrugated metal culverts should be galvanized or coated for long service life in stream crossings.\n\n`;
    }
    
    // Add fish passage recommendations if applicable
    if (formData.stream.fishBearing) {
      notes += `FISH PASSAGE: This is a fish-bearing stream. The culvert should be embedded to provide natural substrate and maintain stream continuity.\n\n`;
      
      if (formData.culvert.embedmentDepth < 0.2) {
        notes += `RECOMMENDATION: Increase embedment depth to at least 20% of culvert diameter to ensure adequate substrate depth for fish passage.\n\n`;
      }
    }
    
    // Add climate change note if toggle is on
    if (formData.culvert.useClimateChangeToggle) {
      notes += `CLIMATE RESILIENCE: Design includes a climate change factor of ${formData.culvert.climateChangeFactor}× to account for potential increases in peak flows over the service life.\n\n`;
    }
    
    notes += `These calculations are based on ${formData.watershed.region === 'bc' ? 'BC regional regression equations' : formData.watershed.region === 'california' ? 'the Rational Method' : 'PNW regional regression equations'} and assume inlet control conditions. For high-risk sites or complex hydraulics, consider a detailed hydraulic analysis.`;
    
    return notes;
  };
  
  // Perform calculations
  const calculateResults = () => {
    const results = calculateFinalRecommendation();
    if (results) {
      setResults(results);
      setShowResults(true);
      
      // Save results to localStorage
      saveToLocalStorage({
        ...formData,
        results: results
      });
    } else {
      setStatusMessage('Unable to calculate. Please check input values.');
      setShowStatus(true);
      setTimeout(() => {
        setShowStatus(false);
      }, 3000);
    }
  };
  
  // Save form data to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('culvertSizingForm', JSON.stringify(data));
  };
  
  // Save draft explicitly
  const handleSaveDraft = () => {
    saveToLocalStorage(formData);
    setStatusMessage('Draft saved successfully!');
    setShowStatus(true);
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
  };
  
  // Go to next step
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  // Go to previous step
  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('culvertSizingForm');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Make sure we maintain the structure if saved data doesn't have all fields
        const initialFormData = { ...formData };
        setFormData({
          ...initialFormData,
          ...parsed,
          watershed: {
            ...initialFormData.watershed,
            ...(parsed.watershed || {})
          },
          stream: {
            ...initialFormData.stream,
            ...(parsed.stream || {})
          },
          culvert: {
            ...initialFormData.culvert,
            ...(parsed.culvert || {})
          },
          bankfull: {
            ...initialFormData.bankfull,
            ...(parsed.bankfull || {})
          },
          designPreference: {
            ...initialFormData.designPreference,
            ...(parsed.designPreference || {})
          }
        });
        
        // Check if there are saved results to display
        if (parsed.results) {
          setResults(parsed.results);
          setShowResults(true);
        }
      } catch (e) {
        console.error('Error parsing saved data', e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="title">Assessment Title</label>
              <input 
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Maple Creek Culvert Assessment"
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="location">Location</label>
              <input 
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Maple Creek Crossing"
                style={styles.input}
              />
            </div>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="date">Assessment Date</label>
                <input 
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="inspector">Inspector Name</label>
                <input 
                  type="text"
                  id="inspector"
                  name="inspector"
                  value={formData.inspector}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="watershed.region">Region</label>
              <select
                id="watershed.region"
                name="watershed.region"
                value={formData.watershed.region}
                onChange={handleInputChange}
                style={styles.select}
              >
                {regionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small style={{color: '#6b7280', marginTop: '4px', display: 'block'}}>
                Selection determines which regional equations are used for flow estimation
              </small>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div style={styles.form}>
            <h2 style={{...styles.subHeader, color: '#059669'}}>Stream Geometry</h2>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="stream.width">Stream Width (m)</label>
                <input 
                  type="number"
                  id="stream.width"
                  name="stream.width"
                  value={formData.stream.width}
                  onChange={handleStreamWidthChange}
                  placeholder="e.g., 2.5"
                  min="0.1"
                  step="0.1"
                  style={styles.input}
                />
                <small style={{color: '#6b7280', marginTop: '4px', display: 'block'}}>
                  Bankfull or ordinary high water width
                </small>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="stream.depth">Stream Depth (m)</label>
                <input 
                  type="number"
                  id="stream.depth"
                  name="stream.depth"
                  value={formData.stream.depth}
                  onChange={handleStreamDepthChange}
                  placeholder="e.g., 0.6"
                  min="0.1"
                  step="0.1"
                  style={styles.input}
                />
                <small style={{color: '#6b7280', marginTop: '4px', display: 'block'}}>
                  Average or representative depth
                </small>
              </div>
            </div>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="stream.channelSlope">Channel Slope (%)</label>
                <input 
                  type="number"
                  id="stream.channelSlope"
                  name="stream.channelSlope"
                  value={formData.stream.channelSlope}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.5"
                  min="0.1"
                  max="20"
                  step="0.1"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="stream.debrisPotential">Debris Potential</label>
                <select
                  id="stream.debrisPotential"
                  name="stream.debrisPotential"
                  value={formData.stream.debrisPotential}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  {debrisPotentialOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{...styles.formGroup, marginTop: '8px'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input
                  type="checkbox"
                  id="stream.fishBearing"
                  name="stream.fishBearing"
                  checked={formData.stream.fishBearing}
                  onChange={handleCheckboxChange}
                  style={{marginRight: '8px'}}
                />
                <label htmlFor="stream.fishBearing" style={{fontWeight: 'normal'}}>
                  Fish-bearing Stream
                </label>
              </div>
              <small style={{color: '#6b7280', marginTop: '4px', display: 'block', marginLeft: '24px'}}>
                Check if this is a fish-bearing stream requiring passage provisions
              </small>
            </div>
            
            <h2 style={{...styles.subHeader, color: '#059669', marginTop: '24px'}}>Watershed Characteristics</h2>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="watershed.area">Watershed Area (hectares)</label>
                <input 
                  type="number"
                  id="watershed.area"
                  name="watershed.area"
                  value={formData.watershed.area}
                  onChange={handleInputChange}
                  placeholder="e.g., 120"
                  min="0"
                  step="0.1"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="watershed.soilType">Soil/Terrain Type</label>
                <select
                  id="watershed.soilType"
                  name="watershed.soilType"
                  value={formData.watershed.soilType}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  {soilTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {formData.watershed.region === 'california' && (
              <>
                <div style={{
                  display: 'grid', 
                  gap: '16px', 
                  gridTemplateColumns: '1fr 1fr',
                }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="watershed.length">Watershed Length (m)</label>
                    <input 
                      type="number"
                      id="watershed.length"
                      name="watershed.length"
                      value={formData.watershed.length}
                      onChange={handleInputChange}
                      placeholder="e.g., 1500"
                      min="0"
                      step="1"
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="watershed.elevationDifference">Elevation Difference (m)</label>
                    <input 
                      type="number"
                      id="watershed.elevationDifference"
                      name="watershed.elevationDifference"
                      value={formData.watershed.elevationDifference}
                      onChange={handleInputChange}
                      placeholder="e.g., 120"
                      min="0"
                      step="1"
                      style={styles.input}
                    />
                  </div>
                </div>
                
                <div style={{
                  display: 'grid', 
                  gap: '16px', 
                  gridTemplateColumns: '1fr 1fr',
                }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="watershed.precipitationIntensity">Design Storm Intensity (mm/hr)</label>
                    <input 
                      type="number"
                      id="watershed.precipitationIntensity"
                      name="watershed.precipitationIntensity"
                      value={formData.watershed.precipitationIntensity}
                      onChange={handleInputChange}
                      placeholder="e.g., 65"
                      min="0"
                      step="0.1"
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="watershed.runoffCoefficient">Runoff Coefficient</label>
                    <select
                      id="watershed.runoffCoefficient"
                      name="watershed.runoffCoefficient"
                      value={formData.watershed.runoffCoefficient}
                      onChange={handleInputChange}
                      style={styles.select}
                    >
                      {runoffCoefficients.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        );
        
      case 3:
        return (
          <div style={styles.form}>
            <h2 style={{...styles.subHeader, color: '#059669'}}>Culvert Specifications</h2>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="culvert.material">Culvert Material</label>
                <select
                  id="culvert.material"
                  name="culvert.material"
                  value={formData.culvert.material}
                  onChange={handleMaterialChange}
                  style={styles.select}
                >
                  {culvertMaterials.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="culvert.shape">Culvert Shape</label>
                <select
                  id="culvert.shape"
                  name="culvert.shape"
                  value={formData.culvert.shape}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  {culvertShapes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="culvert.slopeRatio">Culvert Slope Ratio</label>
                <input 
                  type="number"
                  id="culvert.slopeRatio"
                  name="culvert.slopeRatio"
                  value={formData.culvert.slopeRatio}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.02"
                  min="0.001"
                  max="0.2"
                  step="0.001"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="culvert.embedmentDepth">Embedment Depth Ratio</label>
                <input 
                  type="number"
                  id="culvert.embedmentDepth"
                  name="culvert.embedmentDepth"
                  value={formData.culvert.embedmentDepth}
                  onChange={handleInputChange}
                  min="0"
                  max="0.5"
                  step="0.05"
                  style={styles.input}
                />
                <small style={{color: '#6b7280', marginTop: '4px', display: 'block'}}>
                  As a fraction of culvert diameter (0.2 = 20%)
                </small>
              </div>
            </div>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="culvert.debrisCoefficient">Debris Factor</label>
                <input 
                  type="number"
                  id="culvert.debrisCoefficient"
                  name="culvert.debrisCoefficient"
                  value={formData.culvert.debrisCoefficient}
                  onChange={handleInputChange}
                  min="1"
                  max="2.5"
                  step="0.1"
                  style={styles.input}
                />
                <small style={{color: '#6b7280', marginTop: '4px', display: 'block'}}>
                  Factor for potential debris blockage (1.0 - 2.5)
                </small>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="designPreference.hdRatio">Headwater/Diameter Ratio</label>
                <input 
                  type="number"
                  id="designPreference.hdRatio"
                  name="designPreference.hdRatio"
                  value={formData.designPreference.hdRatio}
                  onChange={handleInputChange}
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  style={styles.input}
                />
                <small style={{color: '#6b7280', marginTop: '4px', display: 'block'}}>
                  Design HW/D ratio (0.8 is standard practice)
                </small>
              </div>
            </div>
            
            <h2 style={{...styles.subHeader, color: '#059669', marginTop: '24px'}}>Design Toggles</h2>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={{...styles.formGroup, marginTop: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div>
                    <input
                      type="checkbox"
                      id="culvert.useClimateChangeToggle"
                      name="culvert.useClimateChangeToggle"
                      checked={formData.culvert.useClimateChangeToggle}
                      onChange={handleCheckboxChange}
                      style={{marginRight: '8px'}}
                    />
                    <label htmlFor="culvert.useClimateChangeToggle" style={{fontWeight: 'normal'}}>
                      Climate Change Factor
                    </label>
                  </div>
                  {formData.culvert.useClimateChangeToggle && (
                    <input 
                      type="number"
                      id="culvert.climateChangeFactor"
                      name="culvert.climateChangeFactor"
                      value={formData.culvert.climateChangeFactor}
                      onChange={handleInputChange}
                      min="1"
                      max="2"
                      step="0.05"
                      style={{...styles.input, width: '80px'}}
                    />
                  )}
                </div>
                <small style={{color: '#6b7280', marginTop: '4px', display: 'block', marginLeft: '24px'}}>
                  Apply climate change factor to future-proof design
                </small>
              </div>
              
              <div style={{...styles.formGroup, marginTop: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <input
                    type="checkbox"
                    id="culvert.useTransportabilityToggle"
                    name="culvert.useTransportabilityToggle"
                    checked={formData.culvert.useTransportabilityToggle}
                    onChange={handleCheckboxChange}
                    style={{marginRight: '8px'}}
                  />
                  <label htmlFor="culvert.useTransportabilityToggle" style={{fontWeight: 'normal'}}>
                    Transportability Matrix Sizing
                  </label>
                </div>
                <small style={{color: '#6b7280', marginTop: '4px', display: 'block', marginLeft: '24px'}}>
                  Apply stream width-based sizing for debris/sediment transport
                </small>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render results section
  const renderResults = () => {
    if (!showResults) return null;
    
    return (
      <div style={{
        marginTop: '32px',
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: '#f0fdf4',
        border: '1px solid #10b981'
      }}>
        <h2 style={{color: '#059669', marginTop: 0}}>Culvert Sizing Results</h2>
        
        <div style={{marginBottom: '16px'}}>
          <strong>Peak Discharge (Q₁₀₀):</strong> {results.peakDischarge?.toFixed(2)} m³/s
          {formData.culvert.useClimateChangeToggle && (
            <span style={{color: '#059669', marginLeft: '8px'}}>
              (includes {((formData.culvert.climateChangeFactor - 1) * 100).toFixed(0)}% climate factor)
            </span>
          )}
        </div>
        
        <div style={{marginBottom: '16px'}}>
          <strong>Required Capacity:</strong> {results.requiredCapacity?.toFixed(2)} m³/s
          {formData.culvert.debrisCoefficient > 1 && (
            <span style={{color: '#059669', marginLeft: '8px'}}>
              (includes {((formData.culvert.debrisCoefficient - 1) * 100).toFixed(0)}% debris factor)
            </span>
          )}
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Hydraulic sizing panel */}
          <div style={{
            padding: '16px',
            backgroundColor: results.sizingMethod === 'hydraulic' ? '#ecfdf5' : '#f9fafb'
          }}>
            <h3 style={{
              color: results.sizingMethod === 'hydraulic' ? '#059669' : '#4b5563',
              marginTop: 0,
              marginBottom: '8px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              {results.sizingMethod === 'hydraulic' && (
                <span style={{marginRight: '8px'}}>✓</span>
              )}
              Hydraulic Sizing
            </h3>
            <div style={{marginBottom: '8px'}}>
              <strong>Diameter:</strong> {results.hydraulicDiameter?.toFixed(0)} mm
            </div>
            <div>
              <strong>Area:</strong> {results.hydraulicArea?.toFixed(2)} m²
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '8px'
            }}>
              Based on peak flow and Manning's equation
            </div>
          </div>
          
          {/* Transportability sizing panel */}
          <div style={{
            padding: '16px',
            backgroundColor: results.sizingMethod === 'transportability' ? '#ecfdf5' : '#f9fafb'
          }}>
            <h3 style={{
              color: results.sizingMethod === 'transportability' ? '#059669' : '#4b5563',
              marginTop: 0,
              marginBottom: '8px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              {results.sizingMethod === 'transportability' && (
                <span style={{marginRight: '8px'}}>✓</span>
              )}
              Transportability Sizing
            </h3>
            {results.transportabilityDiameter ? (
              <>
                <div style={{marginBottom: '8px'}}>
                  <strong>Diameter:</strong> {results.transportabilityDiameter?.toFixed(0)} mm
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>
                  {results.transportabilityReason}
                </div>
              </>
            ) : (
              <div style={{color: '#6b7280'}}>
                Not applied to this design
              </div>
            )}
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#059669',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '0.875rem', marginBottom: '4px'}}>RECOMMENDED CULVERT SIZE</div>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{results.standardSize} mm</div>
          <div style={{fontSize: '0.875rem', marginTop: '4px'}}>
            ({results.recommendedDiameter?.toFixed(0)} mm before rounding to standard size)
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{marginBottom: '8px'}}>
              <strong>Flow Velocity:</strong> {results.velocityCheck?.toFixed(2)} m/s
              {results.velocityCheck > 4.5 ? 
                <span style={{color: '#ef4444', marginLeft: '8px'}}>⚠️ High erosion risk</span> : 
                results.velocityCheck > 3.0 ?
                <span style={{color: '#f59e0b', marginLeft: '8px'}}>⚠️ Moderate erosion risk</span> :
                <span style={{color: '#10b981', marginLeft: '8px'}}>✓ Acceptable</span>
              }
            </div>
            <div>
              <strong>Headwater Depth Ratio:</strong> {results.headwaterDepthRatio?.toFixed(2)}
            </div>
          </div>
          
          <div>
            <div style={{marginBottom: '8px'}}>
              <strong>Culvert Shape:</strong> {culvertShapes.find(s => s.value === formData.culvert.shape)?.label}
            </div>
            <div>
              <strong>Material:</strong> {culvertMaterials.find(m => m.value === formData.culvert.material)?.label}
            </div>
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          backgroundColor: '#fff',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          whiteSpace: 'pre-line'
        }}>
          <strong>Design Notes:</strong>
          <div style={{marginTop: '8px'}}>{results.notes}</div>
        </div>
      </div>
    );
  };
  
  return (
    <div style={styles.container}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
        <Link to="/" style={{
          ...styles.link,
          display: 'flex',
          alignItems: 'center', 
          marginRight: '12px',
          fontSize: '0.875rem'
        }}>
          <span style={{marginRight: '4px'}}>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <h1 style={{...styles.header, color: '#059669'}}>Culvert Sizing Tool</h1>
      <p style={{color: '#4b5563', marginBottom: '24px'}}>
        Enter stream and watershed details to calculate appropriate culvert dimensions.
      </p>
      
      {showStatus && (
        <div style={styles.statusMessage}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '8px'}}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}
      
      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '32px',
        position: 'relative'
      }}>
        {[1, 2, 3].map(step => (
          <div 
            key={step}
            style={{
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: currentStep >= step ? '#059669' : '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              {step}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: currentStep >= step ? '#059669' : '#6b7280',
              fontWeight: currentStep === step ? 'bold' : 'normal'
            }}>
              {step === 1 ? 'Basic Info' : 
               step === 2 ? 'Stream & Watershed' : 'Culvert Specs'}
            </div>
          </div>
        ))}
        
        {/* Progress line */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          height: '2px',
          backgroundColor: '#d1d5db',
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#059669',
            width: `${(currentStep - 1) * 50}%`
          }} />
        </div>
      </div>
      
      {/* Form Steps */}
      {renderStepContent()}
      
      {/* Results Section */}
      {renderResults()}
      
      {/* Navigation Buttons */}
      <div style={{marginTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
        {currentStep > 1 ? (
          <button 
            type="button"
            onClick={goToPrevStep}
            style={{
              ...styles.secondaryButton
            }}
          >
            Previous
          </button>
        ) : (
          <Link to="/" style={{
            ...styles.secondaryButton,
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Cancel
          </Link>
        )}
        
        <div>
          <button 
            type="button"
            onClick={handleSaveDraft}
            style={{
              ...styles.secondaryButton,
              marginRight: '8px'
            }}
          >
            Save Draft
          </button>
          
          {currentStep < 3 ? (
            <button 
              type="button"
              onClick={goToNextStep}
              style={{
                ...styles.primaryButton,
                backgroundColor: '#059669'
              }}
            >
              Next
            </button>
          ) : (
            <button 
              type="button"
              onClick={calculateResults}
              style={{
                ...styles.primaryButton,
                backgroundColor: '#059669'
              }}
            >
              Calculate
            </button>
          )}
        </div>
      </div>
      
      <div style={{
        marginTop: '48px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p>Data is saved locally on your device</p>
      </div>
    </div>
  );
}

export default CulvertSizingForm;