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
    },
    // Bankfull data
    bankfull: {
      width: '', // in meters
      depth: '', // in meters
      areaMethod: 'calculated', // default
    }
  });
  
  // Results state
  const [results, setResults] = useState({
    peakDischarge: null, // m³/s
    requiredCapacity: null, // m³/s (with safety factors)
    recommendedDiameter: null, // mm
    recommendedArea: null, // m²
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
  
  // Calculate time of concentration using California Culvert Practice equation
  const calculateTimeOfConcentration = () => {
    // Formula: Tc = (0.87 * L^3 / H)^0.385 / 60
    // Where: Tc = time of concentration (hours)
    // L = Length of the watershed (km)
    // H = Elevation difference (m)
    
    const L = parseFloat(formData.watershed.length) / 1000; // Convert to km
    const H = parseFloat(formData.watershed.elevationDifference);
    
    if (L && H) {
      const tc = (0.87 * Math.pow(L, 3) / H) ** 0.385 / 60;
      return tc; // In hours
    }
    
    return null;
  };
  
  // Calculate peak discharge using Rational Method
  const calculatePeakDischarge = () => {
    // Formula: Q = C * I * A / 360
    // Where: Q = Peak discharge (m³/s)
    // C = Runoff coefficient
    // I = Rainfall intensity (mm/hr)
    // A = Watershed area (hectares)
    
    const C = parseFloat(formData.watershed.runoffCoefficient);
    const I = parseFloat(formData.watershed.precipitationIntensity);
    const A = parseFloat(formData.watershed.area);
    
    if (C && I && A) {
      const Q = (C * I * A) / 360;
      return Q; // In m³/s
    }
    
    return null;
  };
  
  // Calculate required culvert size
  const calculateCulvertSize = () => {
    // Basic flow
    const Q = calculatePeakDischarge();
    if (!Q) return null;
    
    // Apply safety factors
    const debrisCoefficient = parseFloat(formData.culvert.debrisCoefficient);
    const climateChangeFactor = parseFloat(formData.culvert.climateChangeFactor);
    const requiredCapacity = Q * debrisCoefficient * climateChangeFactor;
    
    // Using Manning's equation approximation for circular culverts
    // D = ((Q * n) / (0.312 * S^0.5))^(3/8) * 1000
    const n = parseFloat(formData.culvert.manningsN);
    const S = parseFloat(formData.culvert.slopeRatio);
    
    if (n && S) {
      // Calculate diameter in millimeters
      const D = ((requiredCapacity * n) / (0.312 * Math.sqrt(S))) ** (3/8) * 1000;
      
      // Calculate area in square meters
      const area = Math.PI * Math.pow(D/2000, 2);
      
      // Check if 3 × bankfull width requirement applies
      let bankfullRecommendation = null;
      if (formData.bankfull.width) {
        const bankfullWidth = parseFloat(formData.bankfull.width);
        const bankfullRequired = 3 * bankfullWidth;
        
        // If circular, convert to equivalent diameter
        const equivalentDiameter = bankfullRequired * 1000;
        
        if (equivalentDiameter > D) {
          bankfullRecommendation = {
            diameter: equivalentDiameter,
            area: Math.PI * Math.pow(equivalentDiameter/2000, 2)
          };
        }
      }
      
      // Use the larger of the two requirements
      const finalDiameter = bankfullRecommendation ? 
        Math.max(D, bankfullRecommendation.diameter) : D;
      const finalArea = bankfullRecommendation ?
        Math.max(area, bankfullRecommendation.area) : area;
      
      // Calculate velocity
      const velocity = requiredCapacity / finalArea;
      
      // Calculate headwater depth ratio (approximate)
      const HW_D = 1.5; // Assuming inlet control with square edge, HW/D around 1.5 at design flow
      
      return {
        peakDischarge: Q,
        requiredCapacity: requiredCapacity,
        recommendedDiameter: finalDiameter,
        recommendedArea: finalArea,
        velocityCheck: velocity,
        headwaterDepthRatio: HW_D,
        isAdequate: velocity < 4.5, // Max velocity should be < 4.5 m/s to prevent erosion
        notes: generateNotes(finalDiameter, velocity, bankfullRecommendation)
      };
    }
    
    return null;
  };
  
  // Generate notes based on calculations
  const generateNotes = (diameter, velocity, bankfullRecommendation) => {
    let notes = '';
    
    // Round to standard culvert sizes
    const standardSizes = [400, 500, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2400];
    const rounded = standardSizes.find(size => size >= diameter) || standardSizes[standardSizes.length - 1];
    
    notes += `Recommended minimum culvert size: ${Math.round(diameter)} mm, rounded to standard size: ${rounded} mm.\n\n`;
    
    if (bankfullRecommendation) {
      notes += `The 3× bankfull width criterion governs this design.\n\n`;
    }
    
    if (velocity > 4.5) {
      notes += `WARNING: Flow velocity (${velocity.toFixed(2)} m/s) exceeds 4.5 m/s. Energy dissipation measures should be implemented at the outlet.\n\n`;
    } else if (velocity > 3.0) {
      notes += `CAUTION: Flow velocity (${velocity.toFixed(2)} m/s) is high. Consider adding riprap at the outlet.\n\n`;
    }
    
    if (formData.culvert.material === 'corrugated_metal') {
      notes += `Note: Corrugated metal culverts should be galvanized or coated for long service life in stream crossings.\n\n`;
    }
    
    notes += `These calculations use the Rational Method and assume inlet control conditions. For high-risk sites or complex hydraulics, consider a detailed hydraulic analysis.`;
    
    return notes;
  };
  
  // Perform calculations
  const calculateResults = () => {
    const results = calculateCulvertSize();
    if (results) {
      setResults(results);
      setShowResults(true);
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
        setFormData({
          ...formData,
          ...parsed,
          watershed: {
            ...formData.watershed,
            ...(parsed.watershed || {})
          },
          culvert: {
            ...formData.culvert,
            ...(parsed.culvert || {})
          },
          bankfull: {
            ...formData.bankfull,
            ...(parsed.bankfull || {})
          }
        });
      } catch (e) {
        console.error('Error parsing saved data', e);
      }
    }
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
          </div>
        );
      
      case 2:
        return (
          <div style={styles.form}>
            <h2 style={{...styles.subHeader, color: '#059669'}}>Watershed Characteristics</h2>
            
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
            </div>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
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
            
            <h2 style={{...styles.subHeader, color: '#059669', marginTop: '24px'}}>Bankfull Measurements</h2>
            
            <div style={{
              display: 'grid', 
              gap: '16px', 
              gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="bankfull.width">Bankfull Width (m)</label>
                <input 
                  type="number"
                  id="bankfull.width"
                  name="bankfull.width"
                  value={formData.bankfull.width}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.5"
                  min="0"
                  step="0.1"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="bankfull.depth">Bankfull Depth (m)</label>
                <input 
                  type="number"
                  id="bankfull.depth"
                  name="bankfull.depth"
                  value={formData.bankfull.depth}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.6"
                  min="0"
                  step="0.1"
                  style={styles.input}
                />
              </div>
            </div>
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
                <label style={styles.label} htmlFor="culvert.manningsN">Manning's n</label>
                <input 
                  type="number"
                  id="culvert.manningsN"
                  name="culvert.manningsN"
                  value={formData.culvert.manningsN}
                  onChange={handleInputChange}
                  min="0.001"
                  max="0.1"
                  step="0.001"
                  style={styles.input}
                />
              </div>
              
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
                <label style={styles.label} htmlFor="culvert.climateChangeFactor">Climate Change Factor</label>
                <input 
                  type="number"
                  id="culvert.climateChangeFactor"
                  name="culvert.climateChangeFactor"
                  value={formData.culvert.climateChangeFactor}
                  onChange={handleInputChange}
                  min="1"
                  max="2"
                  step="0.05"
                  style={styles.input}
                />
                <small style={{color: '#6b7280', marginTop: '4px', display: 'block'}}>
                  Factor for future rainfall increases (1.0 - 2.0)
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
          <strong>Peak Discharge (Q):</strong> {results.peakDischarge?.toFixed(2)} m³/s
        </div>
        
        <div style={{marginBottom: '16px'}}>
          <strong>Required Capacity (with safety factors):</strong> {results.requiredCapacity?.toFixed(2)} m³/s
        </div>
        
        <div style={{marginBottom: '16px'}}>
          <strong>Recommended Culvert Diameter:</strong> {results.recommendedDiameter?.toFixed(0)} mm
        </div>
        
        <div style={{marginBottom: '16px'}}>
          <strong>Recommended Culvert Area:</strong> {results.recommendedArea?.toFixed(2)} m²
        </div>
        
        <div style={{marginBottom: '16px'}}>
          <strong>Flow Velocity:</strong> {results.velocityCheck?.toFixed(2)} m/s
          {results.velocityCheck > 4.5 ? 
            <span style={{color: '#ef4444', marginLeft: '8px'}}>⚠️ High erosion risk</span> : 
            results.velocityCheck > 3.0 ?
            <span style={{color: '#f59e0b', marginLeft: '8px'}}>⚠️ Moderate erosion risk</span> :
            <span style={{color: '#10b981', marginLeft: '8px'}}>✓ Acceptable</span>
          }
        </div>
        
        <div style={{marginBottom: '24px'}}>
          <strong>Headwater Depth Ratio (HW/D):</strong> {results.headwaterDepthRatio?.toFixed(2)}
        </div>
        
        <div style={{
          padding: '16px',
          backgroundColor: '#fff',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          whiteSpace: 'pre-line'
        }}>
          <strong>Notes:</strong>
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
        Enter watershed details to calculate appropriate culvert dimensions.
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
               step === 2 ? 'Watershed Data' : 'Culvert Specs'}
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