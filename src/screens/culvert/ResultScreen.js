import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CulvertResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results || null;
  
  // Handle no results case
  if (!results) {
    return (
      <div className="culvert-results-container">
        <div className="page-header">
          <button onClick={() => navigate('/culvert')} className="back-button">
            <span>← Back to Calculator</span>
          </button>
          <h1 className="page-title">Culvert Results</h1>
        </div>
        
        <div className="card">
          <div className="status-message error">
            No calculation results found. Please return to the calculator and perform a calculation.
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="gps-button"
            onClick={() => navigate('/culvert')}
          >
            Return to Calculator
          </button>
        </div>
      </div>
    );
  }

  // Determine the governing method and final recommendation
  const californiaSize = results.selectedPipeSize;
  const hydraulicSize = results.hydraulicUpsizedPipeSize;
  const finalSize = hydraulicSize > californiaSize ? hydraulicSize : californiaSize;
  const governingMethod = hydraulicSize > californiaSize ? 
    "Hydraulic Calculation (Manning's)" : 
    "California Method";
  
  // Extract form values from location state
  const formValues = location.state?.formValues || {};
  const topWidth = parseFloat(results.topWidth);
  const bottomWidth = parseFloat(results.bottomWidth);
  const avgDepth = parseFloat(location.state?.formValues?.avgStreamDepth || 0);
  const slopePercent = parseFloat(formValues.slopePercent || 0);
  const streamArea = parseFloat(results.streamArea);
  
  // Handle going back to calculator
  const handleBack = () => {
    navigate('/culvert');
  };
  
  // Format numerical values for display
  const formatValue = (value, unit = '', precision = 2) => {
    if (typeof value === 'number') {
      return `${value.toFixed(precision)} ${unit}`;
    }
    return `${value} ${unit}`;
  };
  
  return (
    <div className="culvert-results-container">
      <div className="page-header">
        <button onClick={handleBack} className="back-button">
          <span>← Back to Calculator</span>
        </button>
        <h1 className="page-title">Culvert Results</h1>
      </div>
      
      {/* Recommended Culvert Size - Large Circle Visualization */}
      <div className="card">
        <h2 className="result-section-title">Recommended Culvert Size</h2>
        
        <div className="size-circle-container">
          <div className="size-circle">
            <div className="size-value">{finalSize} mm</div>
            <div className="size-type">Circular</div>
          </div>
        </div>
        
        <div className="final-recommendation">
          Final recommendation: {finalSize}mm diameter circular culvert based on {governingMethod}.
        </div>
        
        <table className="parameters-table">
          <tbody>
            <tr>
              <td>Governing Method:</td>
              <td className="parameter-value">{governingMethod}</td>
            </tr>
            <tr>
              <td>Material:</td>
              <td className="parameter-value">
                {formValues.pipeRoughness === '0.024' ? 'Corrugated Metal Pipe (CMP)' :
                formValues.pipeRoughness === '0.012' ? 'Smooth HDPE' :
                'Concrete'}
              </td>
            </tr>
            <tr>
              <td>Manning's n:</td>
              <td className="parameter-value">{formValues.pipeRoughness}</td>
            </tr>
            <tr>
              <td>Headwater Criterion:</td>
              <td className="parameter-value">HW/D ≤ {results.maxHwdRatio}</td>
            </tr>
            <tr>
              <td>Fish Passage:</td>
              <td className="parameter-value">{results.fishPassage ? 'Required' : 'Not Required'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Sizing Method Comparison */}
      <div className="card">
        <h2 className="result-section-title">Sizing Method Comparison</h2>
        
        <div className="method-comparison">
          <div className="method-card california">
            <h3>California Method</h3>
            <div className="method-size">{californiaSize} mm</div>
            <div className="method-detail">3× Bankfull Area: {(streamArea * 3).toFixed(2)} m²</div>
            <div className="method-note">Size determined using California Method Table.</div>
          </div>
          
          <div className="method-card hydraulic">
            <h3>Hydraulic Calculation</h3>
            <div className="method-size">{hydraulicSize} mm</div>
            <div className="method-detail">Design Discharge: {results.bankfullFlow} m³/s</div>
            {hydraulicSize > californiaSize && (
              <div className="method-warning">
                Warning: The hydraulic calculation suggests a larger size than the California Method.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Calculation Details */}
      <div className="card">
        <h2 className="result-section-title">Calculation Details</h2>
        
        <table className="calculation-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Key Parameter</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>California Table</td>
              <td>Width: {topWidth} m Depth: {avgDepth} m</td>
              <td>{californiaSize} mm</td>
            </tr>
            <tr>
              <td>Cross-Section</td>
              <td>Area: {streamArea} m² × 3 = {(streamArea * 3).toFixed(2)} m²</td>
              <td>{californiaSize} mm</td>
            </tr>
            <tr>
              <td>Hydraulic</td>
              <td>Discharge: {results.bankfullFlow} m³/s HW/D ≤ {results.maxHwdRatio}</td>
              <td>{hydraulicSize} mm</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Stream Measurements */}
      <div className="card">
        <h2 className="result-section-title">Stream Measurements</h2>
        
        <table className="measurements-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Top (m)</th>
              <th>Bottom (m)</th>
              <th>Depth (m)</th>
            </tr>
          </thead>
          <tbody>
            {location.state?.topWidthMeasurements?.map((tw, index) => {
              const bw = location.state.bottomWidthMeasurements && location.state.bottomWidthMeasurements[index] 
                ? location.state.bottomWidthMeasurements[index]
                : { value: '-' };
              const depth = location.state.depthMeasurements && location.state.depthMeasurements[index]
                ? location.state.depthMeasurements[index]
                : { value: '-' };
              
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{tw.value}</td>
                  <td>{bw.value}</td>
                  <td>{depth.value}</td>
                </tr>
              );
            })}
            {/* Average row */}
            <tr className="avg-row">
              <td>Avg</td>
              <td>{topWidth}</td>
              <td>{bottomWidth}</td>
              <td>{avgDepth}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Site Information */}
      <div className="card">
        <h2 className="result-section-title">Site Information</h2>
        
        <div className="site-info-grid">
          <div className="info-item">
            <div className="info-label">Culvert ID</div>
            <div className="info-value">{formValues.culvertId}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Road Name</div>
            <div className="info-value">{formValues.roadName}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Fish Passage</div>
            <div className="info-value">{results.fishPassage ? 'Required' : 'Not Required'}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Stream Shape</div>
            <div className="info-value">{results.streamShape}</div>
          </div>
        </div>
        
        <div className="stream-measurements-grid">
          <div className="measurement-item">
            <div className="measurement-label">Top Width</div>
            <div className="measurement-value">{formatValue(topWidth, 'm')}</div>
          </div>
          
          <div className="measurement-item">
            <div className="measurement-label">Depth</div>
            <div className="measurement-value">{formatValue(avgDepth, 'm')}</div>
          </div>
          
          <div className="measurement-item">
            <div className="measurement-label">Channel Slope</div>
            <div className="measurement-value">{formatValue(slopePercent, '%')}</div>
          </div>
          
          <div className="measurement-item">
            <div className="measurement-label">Stream Area</div>
            <div className="measurement-value">{formatValue(streamArea, 'm²')}</div>
          </div>
        </div>
      </div>
      
      {/* Hydraulic Check Results */}
      <div className="card">
        <h2 className="result-section-title">Hydraulic Check</h2>
        
        <div className="hydraulic-grid">
          <div className="hydraulic-item">
            <div className="hydraulic-label">Bankfull Flow</div>
            <div className="hydraulic-value">{formatValue(results.bankfullFlow, 'm³/s')}</div>
          </div>
          
          <div className="hydraulic-item">
            <div className="hydraulic-label">Pipe Capacity</div>
            <div className="hydraulic-value">{formatValue(results.pipeCapacity, 'm³/s')}</div>
          </div>
          
          <div className="hydraulic-item">
            <div className="hydraulic-label">Capacity Check</div>
            <div className={`hydraulic-value ${results.capacityCheck ? 'pass' : 'fail'}`}>
              {results.capacityCheck ? 'PASS' : 'FAIL'}
            </div>
          </div>
          
          <div className="hydraulic-item">
            <div className="hydraulic-label">Headwater Ratio</div>
            <div className="hydraulic-value">{formatValue(results.headwaterRatio, '', 2)}</div>
          </div>
          
          <div className="hydraulic-item">
            <div className="hydraulic-label">Max HW/D Ratio</div>
            <div className="hydraulic-value">{formatValue(results.maxHwdRatio, '', 2)}</div>
          </div>
          
          <div className="hydraulic-item">
            <div className="hydraulic-label">Headwater Check</div>
            <div className={`hydraulic-value ${results.headwaterCheck ? 'pass' : 'fail'}`}>
              {results.headwaterCheck ? 'PASS' : 'FAIL'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="gps-button"
          onClick={() => navigate('/culvert')}
        >
          New Calculation
        </button>
        
        <button 
          className="gps-button"
          onClick={() => {
            alert('PDF export functionality will be implemented in a future update.');
          }}
        >
          Export Report
        </button>
      </div>
    </div>
  );
};

export default CulvertResultScreen;
