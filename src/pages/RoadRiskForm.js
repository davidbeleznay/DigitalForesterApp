                  '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <label style={{fontWeight: 'bold'}}>Culvert Sizing</label>
                  </div>
                  <RiskLevelSelector 
                    name="culvertSizing"
                    value={infrastructureFactors.culvertSizing}
                    onChange={handleInfrastructureChange}
                    descriptions={infrastructureDescriptions.culvertSizing}
                  />
                </div>
                
                <div style={{marginBottom: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <label style={{fontWeight: 'bold'}}>Culvert Condition</label>
                  </div>
                  <RiskLevelSelector 
                    name="culvertCondition"
                    value={infrastructureFactors.culvertCondition}
                    onChange={handleInfrastructureChange}
                    descriptions={infrastructureDescriptions.culvertCondition}
                  />
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <label style={{fontWeight: 'bold'}}>Road Age</label>
                  </div>
                  <RiskLevelSelector 
                    name="roadAge"
                    value={infrastructureFactors.roadAge}
                    onChange={handleInfrastructureChange}
                    descriptions={infrastructureDescriptions.roadAge}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Risk Calculation Section */}
        <div style={{
          backgroundColor: riskColor.bg,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: `1px solid ${riskColor.text}`,
          color: riskColor.text
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '15px', textAlign: 'center'}}>
            Risk Assessment Results
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <div style={{fontSize: '0.9rem', marginBottom: '5px'}}>
              Risk Score = Hazard ({hazardScore}) × Consequence ({consequenceScore})
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              {riskScore}
            </div>
            <div style={{
              padding: '5px 15px',
              borderRadius: '20px',
              backgroundColor: riskColor.text,
              color: '#fff',
              fontWeight: 'bold'
            }}>
              {riskCategory} Risk
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '15px',
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <h3 style={{fontSize: '1rem', marginBottom: '8px', color: '#333'}}>
              Professional Requirements:
            </h3>
            <p style={{color: '#333', fontSize: '0.9rem'}}>
              {requirements}
            </p>
          </div>
        </div>
        
        {/* Photo Capture Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '15px', color: '#1976D2'}}>Photo Documentation</h2>
          <PhotoCapture onPhotoCapture={handlePhotoCapture} />
        </div>
        
        {/* General Comments Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '15px', color: '#1976D2'}}>General Comments</h2>
          <textarea 
            value={comments}
            onChange={handleCommentsChange}
            placeholder="Enter any additional observations, maintenance recommendations, or notes about this road segment..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'inherit',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
        
        {/* Action Buttons */}
        <div style={{marginTop: '30px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'}}>
          <Link to="/" style={{
            display: 'inline-block',
            background: '#ccc',
            color: '#333',
            padding: '12px 24px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Back to Dashboard
          </Link>
          
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            <button 
              type="button"
              onClick={handleSaveDraft}
              style={{
                background: '#1976D2',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Save Draft
            </button>
            
            <button 
              type="button"
              onClick={handleSaveAssessment}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Save Assessment
            </button>
            
            <button 
              type="button"
              onClick={handleTogglePDFPreview}
              style={{
                background: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Preview PDF
            </button>
            
            <button 
              type="button"
              onClick={handleNewAssessment}
              style={{
                background: '#9C27B0',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              New Assessment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RoadRiskForm;