import React, { forwardRef } from 'react';

const PDFExport = forwardRef(({ formData, riskScore, riskCategory, riskColor, requirements }, ref) => {
  // Calculate hazard and consequence scores
  const hazardScore = Object.values(formData.hazardFactors).reduce((sum, score) => sum + score, 0);
  const consequenceScore = Object.values(formData.consequenceFactors).reduce((sum, score) => sum + score, 0);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Helper to get rating name based on score
  const getRiskRating = (score) => {
    switch (score) {
      case 2: return 'Low';
      case 4: return 'Moderate';
      case 6: return 'High';
      case 10: return 'Very High';
      default: return '';
    }
  };
  
  return (
    <div ref={ref} style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      color: '#333'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        borderBottom: '2px solid #1976D2',
        paddingBottom: '20px'
      }}>
        <h1 style={{ color: '#1976D2', margin: '0 0 10px 0' }}>Road Risk Assessment Report</h1>
        <p style={{ fontSize: '16px', margin: '0' }}>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1976D2', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Basic Information</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', width: '200px', fontWeight: 'bold' }}>Road Name:</td>
              <td style={{ padding: '8px 0' }}>{formData.basicInfo.roadName || 'Not specified'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Road Segment:</td>
              <td style={{ padding: '8px 0' }}>
                {formData.basicInfo.startKm && formData.basicInfo.endKm ? 
                  `KM ${formData.basicInfo.startKm} - ${formData.basicInfo.endKm}` : 
                  (formData.basicInfo.startKm ? `KM ${formData.basicInfo.startKm}` : 'Not specified')}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Start Coordinates:</td>
              <td style={{ padding: '8px 0' }}>
                {formData.basicInfo.startLat && formData.basicInfo.startLong ? 
                  `${formData.basicInfo.startLat}, ${formData.basicInfo.startLong}` : 
                  'Not specified'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>End Coordinates:</td>
              <td style={{ padding: '8px 0' }}>
                {formData.basicInfo.endLat && formData.basicInfo.endLong ? 
                  `${formData.basicInfo.endLat}, ${formData.basicInfo.endLong}` : 
                  'Not specified'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Assessment Date:</td>
              <td style={{ padding: '8px 0' }}>{formatDate(formData.basicInfo.date)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Inspector Name:</td>
              <td style={{ padding: '8px 0' }}>{formData.basicInfo.inspector || 'Not specified'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ 
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: `${riskColor.bg}`,
        borderRadius: '8px',
        border: `1px solid ${riskColor.text}`
      }}>
        <h2 style={{ color: riskColor.text, margin: '0 0 15px 0', textAlign: 'center' }}>
          Risk Assessment Results
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Hazard Score</div>
            <div style={{ fontSize: '24px' }}>{hazardScore}</div>
          </div>
          
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
            ×
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Consequence Score</div>
            <div style={{ fontSize: '24px' }}>{consequenceScore}</div>
          </div>
          
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
            =
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Risk Score</div>
            <div style={{ fontSize: '24px' }}>{riskScore}</div>
          </div>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '15px',
        }}>
          <span style={{ 
            display: 'inline-block',
            padding: '5px 15px',
            backgroundColor: riskColor.text,
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '20px'
          }}>
            {riskCategory} Risk
          </span>
        </div>
        
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '4px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Professional Requirements:</div>
          <div>{requirements}</div>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1976D2', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Hazard Factors (Likelihood)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Factor</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Rating</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Terrain Stability</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.hazardFactors.terrainStability)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.hazardFactors.terrainStability}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Slope Grade</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.hazardFactors.slopeGrade)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.hazardFactors.slopeGrade}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Geology/Soil</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.hazardFactors.geologySoil)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.hazardFactors.geologySoil}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Drainage Conditions</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.hazardFactors.drainageConditions)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.hazardFactors.drainageConditions}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Road Failure History</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.hazardFactors.roadFailureHistory)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.hazardFactors.roadFailureHistory}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <td style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Total Hazard Score</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}></td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                {hazardScore}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1976D2', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Consequence Factors (Severity)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Factor</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Rating</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Proximity to Water</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.consequenceFactors.proximityToWater)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.consequenceFactors.proximityToWater}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Drainage Structure</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.consequenceFactors.drainageStructure)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.consequenceFactors.drainageStructure}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Public/Industrial Use</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.consequenceFactors.publicIndustrialUse)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.consequenceFactors.publicIndustrialUse}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Environmental Value</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {getRiskRating(formData.consequenceFactors.environmentalValue)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                {formData.consequenceFactors.environmentalValue}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <td style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Total Consequence Score</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}></td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                {consequenceScore}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {formData.comments && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#1976D2', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Comments</h2>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px', 
            marginTop: '10px',
            whiteSpace: 'pre-line' 
          }}>
            {formData.comments}
          </div>
        </div>
      )}
      
      {/* Photo placeholder section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1976D2', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Photos</h2>
        <div style={{ 
          padding: '30px', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '8px', 
          marginTop: '10px',
          textAlign: 'center',
          color: '#666',
          border: '1px dashed #ccc'
        }}>
          No photos available
        </div>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        borderTop: '1px solid #ddd', 
        paddingTop: '20px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        <p>This assessment was generated by Digital Forester App on {new Date().toLocaleDateString()}</p>
        <p>© 2025 Forest Management Technologies</p>
      </div>
    </div>
  );
});

export default PDFExport;