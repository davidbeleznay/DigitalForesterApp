import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateCulvert, getStandardPipeSizes, getRoughnessCoefficients } from '../utils/CulvertCalculator';

const CulvertSizingForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    projectName: '',
    location: '',
    bankfullWidth: '',
    bankfullDepth: '',
    slopePercent: '',
    streamRoughness: '0.04',
    pipeRoughness: '0.024',
    fishPassage: false
  });
  
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bankfull');
  
  const standardPipeSizes = getStandardPipeSizes();
  const roughnessCoefficients = getRoughnessCoefficients();

  // Handle input changes
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
  
  // Toggle fish passage requirement and adjust form values
  const toggleFishPassage = () => {
    setFormValues(prev => ({
      ...prev,
      fishPassage: !prev.fishPassage
    }));
  };
  
  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    if (!formValues.bankfullWidth) {
      newErrors.bankfullWidth = 'Bankfull width is required';
    } else if (isNaN(formValues.bankfullWidth) || parseFloat(formValues.bankfullWidth) <= 0) {
      newErrors.bankfullWidth = 'Must be a positive number';
    }
    
    if (!formValues.bankfullDepth) {
      newErrors.bankfullDepth = 'Bankfull depth is required';
    } else if (isNaN(formValues.bankfullDepth) || parseFloat(formValues.bankfullDepth) <= 0) {
      newErrors.bankfullDepth = 'Must be a positive number';
    }
    
    if (!formValues.slopePercent) {
      newErrors.slopePercent = 'Slope is required';
    } else if (isNaN(formValues.slopePercent) || parseFloat(formValues.slopePercent) <= 0) {
      newErrors.slopePercent = 'Must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Calculate culvert size
  const calculateSize = () => {
    if (!validateForm()) return;
    
    const params = {
      bankfullWidth: parseFloat(formValues.bankfullWidth),
      bankfullDepth: parseFloat(formValues.bankfullDepth),
      slopePercent: parseFloat(formValues.slopePercent),
      streamRoughness: parseFloat(formValues.streamRoughness),
      pipeRoughness: parseFloat(formValues.pipeRoughness),
      fishPassage: formValues.fishPassage
    };
    
    const calculationResults = calculateCulvert(params);
    setResults(calculationResults);
    setShowResults(true);
  };
  
  // Save the calculation as a draft
  const saveDraft = () => {
    if (!validateForm()) return;
    
    // Get existing drafts or create empty array
    const existingDrafts = JSON.parse(localStorage.getItem('culvertDrafts') || '[]');
    
    // Create new draft with calculation results
    const newDraft = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'culvert',
      name: formValues.projectName || 'Unnamed Project',
      location: formValues.location || 'Unknown Location',
      formValues,
      results
    };
    
    // Add to drafts and save to localStorage
    existingDrafts.push(newDraft);
    localStorage.setItem('culvertDrafts', JSON.stringify(existingDrafts));
    
    // Show success message or navigate
    alert('Draft saved successfully!');
  };
  
  // Handle going back to home
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="culvert-form-container">
      <div className="page-header">
        <button onClick={handleBack} className="back-button">
          <span>← Back</span>
        </button>
        <h1 className="page-title">Culvert Sizing Tool</h1>
      </div>
      
      <div className="card">
        <div className="card-title">Project Information</div>
        <div className="form-group">
          <label className="form-label">Project Name</label>
          <input
            type="text"
            name="projectName"
            className="form-input"
            value={formValues.projectName}
            onChange={handleInputChange}
            placeholder="Enter project name"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-input"
            value={formValues.location}
            onChange={handleInputChange}
            placeholder="Enter location description"
          />
        </div>
      </div>
      
      <div className="card">
        <div className="card-title">Sizing Method</div>
        <div className="card-description">
          Choose which method to use for determining culvert size. The California sizing method uses bankfull width, while the hydraulic check verifies capacity.
        </div>
        
        <div className="options-container">
          <button 
            className={`option-button ${selectedMethod === 'bankfull' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('bankfull')}
          >
            California Sizing Method (Primary)
          </button>
          <button 
            className={`option-button ${selectedMethod === 'hydraulic' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('hydraulic')}
          >
            Hydraulic Capacity Check
          </button>
        </div>
        
        {selectedMethod === 'bankfull' && (
          <div className="info-card">
            <div className="method-description">
              <strong>California Sizing Method:</strong> This approach sizes culverts based on bankfull width (W_bf) 
              using the formula: Inside diameter = 1.2 × W_bf. This simple rule captures most channel-forming flows 
              while providing space for debris passage. Round up to the next standard pipe size.
            </div>
          </div>
        )}
        
        {selectedMethod === 'hydraulic' && (
          <div className="info-card">
            <div className="method-description">
              <strong>Hydraulic Capacity Check:</strong> This approach calculates the bankfull flow using Manning's equation 
              and verifies that the selected culvert can pass this flow. This serves as a sanity check on the California sizing method.
            </div>
          </div>
        )}
      </div>
      
      <div className="card">
        <div className="card-title">Field Measurements</div>
        <div className="card-description">
          Enter field measurements to determine appropriate culvert dimensions.
        </div>
        
        <div className="form-group">
          <label className="form-label">Bankfull Width (m)</label>
          <input
            type="number"
            name="bankfullWidth"
            className={`form-input ${errors.bankfullWidth ? 'error' : ''}`}
            value={formValues.bankfullWidth}
            onChange={handleInputChange}
            placeholder="e.g., 2.5"
            step="0.01"
            min="0"
          />
          {errors.bankfullWidth && <div className="error-text">{errors.bankfullWidth}</div>}
          <div className="helper-text">Measure the width at 3-5 cross-sections and average</div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Mean Bankfull Depth (m)</label>
          <input
            type="number"
            name="bankfullDepth"
            className={`form-input ${errors.bankfullDepth ? 'error' : ''}`}
            value={formValues.bankfullDepth}
            onChange={handleInputChange}
            placeholder="e.g., 0.4"
            step="0.01"
            min="0"
          />
          {errors.bankfullDepth && <div className="error-text">{errors.bankfullDepth}</div>}
          <div className="helper-text">Measure depth to bankfull elevation at same sections</div>
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
      
      <div className="action-buttons">
        <button 
          className="gps-button"
          onClick={calculateSize}
        >
          Calculate Size
        </button>
        
        <button 
          className="gps-button"
          onClick={saveDraft}
          disabled={!results}
          style={{ opacity: !results ? 0.7 : 1 }}
        >
          Save Draft
        </button>
      </div>
      
      {showResults && results && (
        <div className="card">
          <div className="card-title">Culvert Size Results</div>
          
          <div className="status-message success">
            California sizing complete. Recommended culvert size: {results.selectedPipeSize} mm
          </div>
          
          <div className="measurement-section">
            <div className="measurement-header">
              <h3>Sizing Details</h3>
            </div>
            
            <div className="averages-grid">
              <div className="average-item">
                <div className="average-label">Required Span</div>
                <div className="average-value">{results.spanRequired} m</div>
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
                <div className="average-label">Capacity Check</div>
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
          
          <div className="measurement-section">
            <div className="measurement-header">
              <h3>Recommendations</h3>
            </div>
            
            <div className="method-description">
              {results.hydraulicCheck ? (
                <p>The selected {results.selectedPipeSize} mm culvert meets both the California sizing requirement (1.2 × bankfull width) 
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
        </div>
      )}
    </div>
  );
};

export default CulvertSizingForm;
