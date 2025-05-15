            onClick={handleToggleAdditionalFactors}
            style={{
              ...buttonBaseStyle,
              width: '100%',
              backgroundColor: showAdditionalFactors ? '#e8eaf6' : '#3f51b5',
              color: showAdditionalFactors ? '#3f51b5' : 'white',
              border: `1px solid ${showAdditionalFactors ? '#c5cae9' : '#3f51b5'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              boxShadow: showAdditionalFactors ? 'none' : '0 4px 10px rgba(63, 81, 181, 0.2)'
            }}
          >
            <span>{showAdditionalFactors ? 'Hide Additional Factors' : 'Show Additional Factors'}</span>
            <span style={{
              fontSize: '1.2rem', 
              transform: showAdditionalFactors ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ▼
            </span>
          </button>
        </div>
        
        {/* Geotechnical and Infrastructure Factors (Toggleable) */}
        {showAdditionalFactors && (
          <>
            {/* Geotechnical Considerations */}
            <div style={sectionStyle}>
              <h2 style={sectionHeaderStyle}>Geotechnical Considerations</h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0'}}>
                  <thead>
                    <tr style={{backgroundColor: '#f7f9fa'}}>
                      <th style={{padding: '15px 12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>Factor</th>
                      <th style={{padding: '15px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>2</th>
                      <th style={{padding: '15px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>4</th>
                      <th style={{padding: '15px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>6</th>
                      <th style={{padding: '15px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>10</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{borderBottom: '1px solid #e0e0e0', backgroundColor: geotechnicalFactors.cutSlopeHeight === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                                  geotechnicalFactors.cutSlopeHeight === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                                  geotechnicalFactors.cutSlopeHeight === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                                  geotechnicalFactors.cutSlopeHeight === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Cut Slope Height</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('cutSlopeHeight', geotechnicalFactors.cutSlopeHeight, handleGeotechnicalChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Low<br/>(&lt;2m)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('cutSlopeHeight', geotechnicalFactors.cutSlopeHeight, handleGeotechnicalChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Moderate<br/>(2-5m)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('cutSlopeHeight', geotechnicalFactors.cutSlopeHeight, handleGeotechnicalChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>High<br/>(5-10m)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('cutSlopeHeight', geotechnicalFactors.cutSlopeHeight, handleGeotechnicalChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Very high<br/>(&gt;10m)</div>
                      </td>
                    </tr>
                    
                    <tr style={{borderBottom: '1px solid #e0e0e0', backgroundColor: geotechnicalFactors.fillSlopeHeight === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                                  geotechnicalFactors.fillSlopeHeight === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                                  geotechnicalFactors.fillSlopeHeight === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                                  geotechnicalFactors.fillSlopeHeight === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Fill Slope Height</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('fillSlopeHeight', geotechnicalFactors.fillSlopeHeight, handleGeotechnicalChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Low<br/>(&lt;3m)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('fillSlopeHeight', geotechnicalFactors.fillSlopeHeight, handleGeotechnicalChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Moderate<br/>(3-6m)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('fillSlopeHeight', geotechnicalFactors.fillSlopeHeight, handleGeotechnicalChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>High<br/>(6-12m)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('fillSlopeHeight', geotechnicalFactors.fillSlopeHeight, handleGeotechnicalChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Very high<br/>(&gt;12m)</div>
                      </td>
                    </tr>
                    
                    <tr style={{borderBottom: '1px solid #e0e0e0', backgroundColor: geotechnicalFactors.bedrockCondition === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                                  geotechnicalFactors.bedrockCondition === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                                  geotechnicalFactors.bedrockCondition === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                                  geotechnicalFactors.bedrockCondition === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Bedrock Condition</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('bedrockCondition', geotechnicalFactors.bedrockCondition, handleGeotechnicalChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Solid, no<br/>fractures</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('bedrockCondition', geotechnicalFactors.bedrockCondition, handleGeotechnicalChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Minor<br/>fracturing</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('bedrockCondition', geotechnicalFactors.bedrockCondition, handleGeotechnicalChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Moderate<br/>fracturing</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('bedrockCondition', geotechnicalFactors.bedrockCondition, handleGeotechnicalChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Heavily<br/>fractured/sheared</div>
                      </td>
                    </tr>
                    
                    <tr style={{borderBottom: '1px solid #e0e0e0', backgroundColor: geotechnicalFactors.groundwaterConditions === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                                  geotechnicalFactors.groundwaterConditions === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                                  geotechnicalFactors.groundwaterConditions === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                                  geotechnicalFactors.groundwaterConditions === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Groundwater Conditions</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('groundwaterConditions', geotechnicalFactors.groundwaterConditions, handleGeotechnicalChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Dry, no<br/>seepage</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('groundwaterConditions', geotechnicalFactors.groundwaterConditions, handleGeotechnicalChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Damp, minor<br/>seepage</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('groundwaterConditions', geotechnicalFactors.groundwaterConditions, handleGeotechnicalChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Wet, moderate<br/>seepage</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('groundwaterConditions', geotechnicalFactors.groundwaterConditions, handleGeotechnicalChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Flowing<br/>groundwater</div>
                      </td>
                    </tr>
                    
                    <tr style={{backgroundColor: geotechnicalFactors.erosionEvidence === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                geotechnicalFactors.erosionEvidence === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                geotechnicalFactors.erosionEvidence === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                geotechnicalFactors.erosionEvidence === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Erosion Evidence</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('erosionEvidence', geotechnicalFactors.erosionEvidence, handleGeotechnicalChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>No visible<br/>erosion</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('erosionEvidence', geotechnicalFactors.erosionEvidence, handleGeotechnicalChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Minor<br/>surface erosion</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('erosionEvidence', geotechnicalFactors.erosionEvidence, handleGeotechnicalChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Moderate<br/>gullying</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('erosionEvidence', geotechnicalFactors.erosionEvidence, handleGeotechnicalChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Severe gullying/<br/>slumping</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Infrastructure Elements */}
            <div style={sectionStyle}>
              <h2 style={sectionHeaderStyle}>Infrastructure Elements</h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0'}}>
                  <thead>
                    <tr style={{backgroundColor: '#f7f9fa'}}>
                      <th style={{padding: '15px 12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>Factor</th>
                      <th style={{padding: '15px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>2</th>
                      <th style={{padding: '15px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>4</th>
                      <th style={{padding: '15px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>6</th>
                      <th style={{padding: '15px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', fontSize: '1rem', fontWeight: '600', color: '#2c3e50', width: '20%'}}>10</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{borderBottom: '1px solid #e0e0e0', backgroundColor: infrastructureFactors.roadSurfaceType === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                                  infrastructureFactors.roadSurfaceType === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                                  infrastructureFactors.roadSurfaceType === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                                  infrastructureFactors.roadSurfaceType === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Road Surface Type</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('roadSurfaceType', infrastructureFactors.roadSurfaceType, handleInfrastructureChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Paved or<br/>well-graveled</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('roadSurfaceType', infrastructureFactors.roadSurfaceType, handleInfrastructureChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Adequate<br/>gravel</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('roadSurfaceType', infrastructureFactors.roadSurfaceType, handleInfrastructureChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Minimal<br/>gravel</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('roadSurfaceType', infrastructureFactors.roadSurfaceType, handleInfrastructureChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Native soil<br/>(no gravel)</div>
                      </td>
                    </tr>
                    
                    <tr style={{borderBottom: '1px solid #e0e0e0', backgroundColor: infrastructureFactors.ditchCondition === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                                  infrastructureFactors.ditchCondition === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                                  infrastructureFactors.ditchCondition === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                                  infrastructureFactors.ditchCondition === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Ditch Condition</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('ditchCondition', infrastructureFactors.ditchCondition, handleInfrastructureChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Well-maintained,<br/>clear</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('ditchCondition', infrastructureFactors.ditchCondition, handleInfrastructureChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Minor<br/>vegetation/debris</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('ditchCondition', infrastructureFactors.ditchCondition, handleInfrastructureChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Partially<br/>blocked</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('ditchCondition', infrastructureFactors.ditchCondition, handleInfrastructureChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Blocked or<br/>non-functional</div>
                      </td>
                    </tr>
                    
                    <tr style={{borderBottom: '1px solid #e0e0e0', backgroundColor: infrastructureFactors.culvertSizing === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                                  infrastructureFactors.culvertSizing === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                                  infrastructureFactors.culvertSizing === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                                  infrastructureFactors.culvertSizing === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Culvert Sizing</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('culvertSizing', infrastructureFactors.culvertSizing, handleInfrastructureChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Sized for<br/>100-year event</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('culvertSizing', infrastructureFactors.culvertSizing, handleInfrastructureChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Sized for<br/>50-year event</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('culvertSizing', infrastructureFactors.culvertSizing, handleInfrastructureChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Sized for<br/>25-year event</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('culvertSizing', infrastructureFactors.culvertSizing, handleInfrastructureChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Undersized/<br/>inadequate</div>
                      </td>
                    </tr>
                    
                    <tr style={{borderBottom: '1px solid #e0e0e0', backgroundColor: infrastructureFactors.culvertCondition === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                                  infrastructureFactors.culvertCondition === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                                  infrastructureFactors.culvertCondition === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                                  infrastructureFactors.culvertCondition === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Culvert Condition</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('culvertCondition', infrastructureFactors.culvertCondition, handleInfrastructureChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Excellent<br/>condition</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('culvertCondition', infrastructureFactors.culvertCondition, handleInfrastructureChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Good, minor<br/>issues</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('culvertCondition', infrastructureFactors.culvertCondition, handleInfrastructureChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Fair, some<br/>deterioration</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('culvertCondition', infrastructureFactors.culvertCondition, handleInfrastructureChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Poor, damaged<br/>or blocked</div>
                      </td>
                    </tr>
                    
                    <tr style={{backgroundColor: infrastructureFactors.roadAge === 2 ? 'rgba(232, 245, 233, 0.2)' : 
                                                infrastructureFactors.roadAge === 4 ? 'rgba(255, 248, 225, 0.2)' : 
                                                infrastructureFactors.roadAge === 6 ? 'rgba(255, 243, 224, 0.2)' :
                                                infrastructureFactors.roadAge === 10 ? 'rgba(255, 235, 238, 0.2)' : 'transparent'}}>
                      <td style={{padding: '18px 12px', fontWeight: '600', fontSize: '0.95rem', color: '#34495e', verticalAlign: 'middle'}}>Road Age</td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('roadAge', infrastructureFactors.roadAge, handleInfrastructureChange, 2)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Recent<br/>(&lt;5 years)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('roadAge', infrastructureFactors.roadAge, handleInfrastructureChange, 4)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Moderate<br/>(5-15 years)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('roadAge', infrastructureFactors.roadAge, handleInfrastructureChange, 6)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Older<br/>(15-30 years)</div>
                      </td>
                      <td style={{padding: '12px 8px', textAlign: 'center', verticalAlign: 'top'}}>
                        {renderRiskRadio('roadAge', infrastructureFactors.roadAge, handleInfrastructureChange, 10)}
                        <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginTop: '6px', lineHeight: '1.3'}}>Historic<br/>(&gt;30 years)</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {/* Photo Upload Section */}
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Photo Documentation</h2>
          <p style={{marginBottom: '20px', color: '#7f8c8d', fontSize: '0.95rem'}}>
            Add photographs of the road conditions, hazards, drainage structures, or other relevant features.
          </p>
          
          {/* Simple photo placeholder UI */}
          <div>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.2s ease',
              backgroundColor: '#f9f9f9'
            }} onClick={handleAddPhoto}>
              <div style={{fontSize: '36px', color: '#7f8c8d', marginBottom: '10px'}}>📷</div>
              <p style={{color: '#34495e', marginBottom: '5px', fontWeight: '600'}}>
                Click to add a photo
              </p>
              <p style={{color: '#7f8c8d', fontSize: '0.9rem'}}>
                (Photo functionality will be implemented in the next version)
              </p>
            </div>
            
            {/* Photo preview grid */}
            {photos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '15px',
                marginTop: '20px'
              }}>
                {photos.map(photo => (
                  <div key={photo.id} style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff'
                  }}>
                    <img 
                      src={photo.dataUrl} 
                      alt={photo.name} 
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedPhotos = photos.filter(p => p.id !== photo.id);
                        setPhotos(updatedPhotos);
                        saveToLocalStorage({
                          basicInfo,
                          hazardFactors,
                          consequenceFactors,
                          showAdditionalFactors,
                          geotechnicalFactors,
                          infrastructureFactors,
                          comments,
                          photos: updatedPhotos
                        });
                      }}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: 'rgba(231, 76, 60, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        opacity: 0.8
                      }}
                      title="Remove photo"
                    >
                      ×
                    </button>
                    <div style={{
                      padding: '8px 10px',
                      fontSize: '0.85rem',
                      color: '#34495e',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      backgroundColor: '#f9f9f9',
                      borderTop: '1px solid #eee'
                    }}>
                      {photo.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Comments Section */}
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Comments & Observations</h2>
          
          <div style={{marginBottom: '20px'}}>
            <textarea 
              name="comments"
              value={comments}
              onChange={handleCommentsChange}
              placeholder="Enter any additional observations, notes, or specific concerns about the road section..."
              style={{
                ...inputStyle,
                minHeight: '120px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px', marginBottom: '50px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', gap: '16px'}}>
            <button 
              type="button"
              onClick={handleSaveAssessment}
              style={{
                ...buttonBaseStyle,
                flex: 1,
                backgroundColor: '#4CAF50',
                color: 'white',
                boxShadow: '0 4px 10px rgba(76, 175, 80, 0.2)'
              }}
            >
              Save Assessment
            </button>
            
            <button 
              type="button"
              onClick={handleSaveDraft}
              style={{
                ...buttonBaseStyle,
                flex: 1,
                backgroundColor: '#ffffff',
                color: '#3498db',
                border: '1px solid #3498db'
              }}
            >
              Save Draft
            </button>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', gap: '16px'}}>
            <button 
              type="button"
              onClick={handleExportPDF}
              style={{
                ...buttonBaseStyle,
                flex: 1,
                backgroundColor: '#f5f5f5',
                color: '#34495e',
                border: '1px solid #ddd'
              }}
            >
              Export PDF
            </button>
            
            <button 
              type="button"
              onClick={handleNewAssessment}
              style={{
                ...buttonBaseStyle,
                flex: 1,
                backgroundColor: '#f5f5f5',
                color: '#34495e',
                border: '1px solid #ddd'
              }}
            >
              New Assessment
            </button>
          </div>
          
          <Link 
            to="/"
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#ecf0f1',
              color: '#7f8c8d',
              border: '1px solid #ddd',
              textAlign: 'center',
              marginTop: '8px'
            }}
          >
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RoadRiskForm;