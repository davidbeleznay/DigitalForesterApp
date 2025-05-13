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
  
  // Handle success case
  return (
    <div className="culvert-results-container">
      <div className="page-header">
        <button onClick={() => navigate('/culvert')} className="back-button">
          <span>← Back to Calculator</span>
        </button>
        <h1 className="page-title">Culvert Results</h1>
      </div>
      
      <div className="card">
        <div className="card-title">California Sizing Method Results</div>
        
        <div className="status-message success">
          Recommended culvert size: {results.selectedPipeSize} mm
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Project Information</h3>
          </div>
          
          <div className="averages-grid">
            <div className="average-item">
              <div className="average-label">Project Name</div>
              <div className="average-value">{location.state?.formValues?.projectName || 'Unnamed Project'}</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Location</div>
              <div className="average-value">{location.state?.formValues?.location || 'Unspecified'}</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Fish Passage Required</div>
              <div className="average-value">{results.fishPassage ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Field Measurements</h3>
          </div>
          
          <div className="averages-grid">
            <div className="average-item">
              <div className="average-label">Bankfull Width</div>
              <div className="average-value">{location.state?.formValues?.bankfullWidth} m</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Bankfull Depth</div>
              <div className="average-value">{location.state?.formValues?.bankfullDepth} m</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Channel Slope</div>
              <div className="average-value">{location.state?.formValues?.slopePercent}%</div>
            </div>
          </div>
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Sizing Details</h3>
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
            
            <div className="averages-grid">
              <div className="average-item">
                <div className="average-label">Required Span (1.2 × W_bf)</div>
                <div className="average-value">{results.spanRequired} m</div>
              </div>
              
              <div className="average-item">
                <div className="average-label">Selected Pipe Size</div>
                <div className="average-value">{results.selectedPipeSize} mm ({results.selectedPipeSizeM} m)</div>
              </div>
              
              <div className="average-item">
                <div className="average-label">Embed Depth</div>
                <div className="average-value">{results.embedDepth} m</div>
              </div>
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
            
            <div className="fish-info">
              <p><strong>Note:</strong> This sizing is appropriate for most conditions but does not account for debris flows, 
              large woody debris, or regional requirements. Consult with a qualified engineer for final design approval.</p>
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
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default CulvertResultScreen;
