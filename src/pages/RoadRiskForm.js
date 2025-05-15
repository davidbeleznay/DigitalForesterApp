                  height: '18px',
                  background: 'linear-gradient(to bottom, #00bcd4, #4dd0e1)',
                  borderRadius: '2px'
                }}></span>
                Road Surface Type
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <RiskLevelRadio 
                  name="roadSurfaceType"
                  value="low"
                  currentValue={infrastructureFactors.roadSurfaceType}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.roadSurfaceType.low}
                />
                <RiskLevelRadio 
                  name="roadSurfaceType"
                  value="moderate"
                  currentValue={infrastructureFactors.roadSurfaceType}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.roadSurfaceType.moderate}
                />
                <RiskLevelRadio 
                  name="roadSurfaceType"
                  value="high"
                  currentValue={infrastructureFactors.roadSurfaceType}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.roadSurfaceType.high}
                />
              </div>
            </div>
            
            {/* Ditch Condition */}
            <div style={{
              marginBottom: '30px',
              backgroundColor: 'rgba(0, 188, 212, 0.02)',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h3 style={{ 
                marginBottom: '15px', 
                color: '#333',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                paddingLeft: '15px'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '18px',
                  background: 'linear-gradient(to bottom, #00bcd4, #4dd0e1)',
                  borderRadius: '2px'
                }}></span>
                Ditch Condition
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <RiskLevelRadio 
                  name="ditchCondition"
                  value="low"
                  currentValue={infrastructureFactors.ditchCondition}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.ditchCondition.low}
                />
                <RiskLevelRadio 
                  name="ditchCondition"
                  value="moderate"
                  currentValue={infrastructureFactors.ditchCondition}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.ditchCondition.moderate}
                />
                <RiskLevelRadio 
                  name="ditchCondition"
                  value="high"
                  currentValue={infrastructureFactors.ditchCondition}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.ditchCondition.high}
                />
              </div>
            </div>
            
            {/* Culvert Sizing */}
            <div style={{
              marginBottom: '30px',
              backgroundColor: 'rgba(0, 188, 212, 0.02)',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h3 style={{ 
                marginBottom: '15px', 
                color: '#333',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                paddingLeft: '15px'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '18px',
                  background: 'linear-gradient(to bottom, #00bcd4, #4dd0e1)',
                  borderRadius: '2px'
                }}></span>
                Culvert Sizing
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <RiskLevelRadio 
                  name="culvertSizing"
                  value="low"
                  currentValue={infrastructureFactors.culvertSizing}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.culvertSizing.low}
                />
                <RiskLevelRadio 
                  name="culvertSizing"
                  value="moderate"
                  currentValue={infrastructureFactors.culvertSizing}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.culvertSizing.moderate}
                />
                <RiskLevelRadio 
                  name="culvertSizing"
                  value="high"
                  currentValue={infrastructureFactors.culvertSizing}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.culvertSizing.high}
                />
              </div>
            </div>
            
            {/* Culvert Condition */}
            <div style={{
              marginBottom: '30px',
              backgroundColor: 'rgba(0, 188, 212, 0.02)',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h3 style={{ 
                marginBottom: '15px', 
                color: '#333',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                paddingLeft: '15px'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '18px',
                  background: 'linear-gradient(to bottom, #00bcd4, #4dd0e1)',
                  borderRadius: '2px'
                }}></span>
                Culvert Condition
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <RiskLevelRadio 
                  name="culvertCondition"
                  value="low"
                  currentValue={infrastructureFactors.culvertCondition}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.culvertCondition.low}
                />
                <RiskLevelRadio 
                  name="culvertCondition"
                  value="moderate"
                  currentValue={infrastructureFactors.culvertCondition}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.culvertCondition.moderate}
                />
                <RiskLevelRadio 
                  name="culvertCondition"
                  value="high"
                  currentValue={infrastructureFactors.culvertCondition}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.culvertCondition.high}
                />
              </div>
            </div>
            
            {/* Road Age */}
            <div style={{
              marginBottom: '10px',
              backgroundColor: 'rgba(0, 188, 212, 0.02)',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h3 style={{ 
                marginBottom: '15px', 
                color: '#333',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                paddingLeft: '15px'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '18px',
                  background: 'linear-gradient(to bottom, #00bcd4, #4dd0e1)',
                  borderRadius: '2px'
                }}></span>
                Road Age
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <RiskLevelRadio 
                  name="roadAge"
                  value="low"
                  currentValue={infrastructureFactors.roadAge}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.roadAge.low}
                />
                <RiskLevelRadio 
                  name="roadAge"
                  value="moderate"
                  currentValue={infrastructureFactors.roadAge}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.roadAge.moderate}
                />
                <RiskLevelRadio 
                  name="roadAge"
                  value="high"
                  currentValue={infrastructureFactors.roadAge}
                  onChange={handleInfrastructureChange}
                  label={infrastructureOptions.roadAge.high}
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Risk Result Summary would go here */}
      <div style={{ 
        background: `${riskColors[riskColorKey]}`, 
        padding: '35px', 
        borderRadius: '16px', 
        marginBottom: '28px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${riskTextColors[riskColorKey]}30`,
        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: `linear-gradient(135deg, ${riskTextColors[riskColorKey]}CC, ${riskTextColors[riskColorKey]})`,
          color: 'white',
          padding: '10px 24px',
          borderBottomLeftRadius: '16px',
          fontWeight: '700',
          fontSize: '1.1rem',
          boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>!</span>
          {riskCategory} Risk
        </div>
        
        {/* Abstract background pattern for visual interest */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 20%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.15) 0%, transparent 25%)',
          pointerEvents: 'none'
        }}></div>
        
        <h2 style={{ 
          borderBottom: `1px solid ${riskTextColors[riskColorKey]}40`, 
          paddingBottom: '15px', 
          marginBottom: '25px',
          color: riskTextColors[riskColorKey],
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '5px', 
            height: '24px', 
            backgroundColor: riskTextColors[riskColorKey], 
            marginRight: '12px', 
            verticalAlign: 'middle',
            borderRadius: '3px'
          }}></span>
          Risk Assessment Results
        </h2>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '15px', 
            alignItems: 'center' 
          }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>Hazard Score:</span>
            <span style={{ 
              fontWeight: '600',
              fontSize: '1.1rem',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '10px',
              color: '#ff9800',
              boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>{hazardScore}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '15px', 
            alignItems: 'center' 
          }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>Consequence Score:</span>
            <span style={{ 
              fontWeight: '600',
              fontSize: '1.1rem',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '10px',
              color: '#673ab7',
              boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>{consequenceScore}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '5px', 
            alignItems: 'center',
            marginTop: '30px',
            backgroundColor: 'rgba(255,255,255,0.5)',
            padding: '18px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.4)'
          }}>
            <span style={{ 
              fontWeight: '700', 
              fontSize: '1.4rem', 
              color: '#333'
            }}>Risk Score:</span>
            <span style={{ 
              fontWeight: '700',
              fontSize: '1.8rem',
              padding: '12px 25px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              color: riskTextColors[riskColorKey],
              boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
              border: `1px solid ${riskTextColors[riskColorKey]}30`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {riskScore}
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: `linear-gradient(to right, transparent, ${riskTextColors[riskColorKey]}70, transparent)`,
                opacity: 0.7
              }}></span>
            </span>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '30px',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.4)',
          position: 'relative'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            color: riskTextColors[riskColorKey], 
            fontWeight: '600', 
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              backgroundColor: riskTextColors[riskColorKey],
              color: 'white',
              borderRadius: '50%',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              boxShadow: `0 3px 8px ${riskTextColors[riskColorKey]}50`
            }}>!</span>
            Professional Resource Requirements
          </h3>
          <p style={{ 
            margin: 0, 
            color: '#333', 
            lineHeight: '1.7',
            fontSize: '1.05rem',
            paddingLeft: '40px'
          }}>
            {riskCategory === 'Very High' && 'Full professional team with CRP and specialist PORs. Geometric design required. Multiple field reviews.'}
            {riskCategory === 'High' && 'CRP and road activity POR (may be same person for simple roads). Specialist consultation. Field reviews at critical stages.'}
            {riskCategory === 'Moderate' && 'CRP and road activity POR oversight. Standard designs with field verification.'}
            {riskCategory === 'Low' && 'Standard oversight by qualified professionals. Routine field reviews.'}
            {riskCategory === 'Very Low' && 'Routine professional oversight.'}
          </p>
          {/* Recommended actions section */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: `1px solid ${riskTextColors[riskColorKey]}30`
          }}>
            <h4 style={{
              color: riskTextColors[riskColorKey],
              fontWeight: '600',
              marginBottom: '12px',
              fontSize: '1.1rem'
            }}>Recommended Actions:</h4>
            <ul style={{
              paddingLeft: '60px',
              margin: '0',
              color: '#444',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              {riskCategory === 'Very High' && (
                <>
                  <li>Immediate closure or traffic restriction recommended</li>
                  <li>Develop comprehensive remediation plan</li>
                  <li>Schedule regular monitoring (minimum monthly)</li>
                  <li>Install warning signage</li>
                </>
              )}
              {riskCategory === 'High' && (
                <>
                  <li>Traffic restrictions during wet weather</li>
                  <li>Develop remediation plan within 30 days</li>
                  <li>Schedule monitoring after significant rain events</li>
                  <li>Install cautionary signage</li>
                </>
              )}
              {riskCategory === 'Moderate' && (
                <>
                  <li>Quarterly monitoring recommended</li>
                  <li>Maintenance plans should address identified risks</li>
                  <li>Consider improved drainage works</li>
                </>
              )}
              {riskCategory === 'Low' && (
                <>
                  <li>Annual inspection recommended</li>
                  <li>Include in routine maintenance scheduling</li>
                </>
              )}
              {riskCategory === 'Very Low' && (
                <>
                  <li>Include in regular road inspection cycles</li>
                  <li>No immediate action required</li>
                </>
              )}
            </ul>
          </div>
          
          {/* Display additional assessments summary if they were completed */}
          {(showGeotechnical || showInfrastructure) && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: `1px solid ${riskTextColors[riskColorKey]}30`
            }}>
              <h4 style={{
                color: riskTextColors[riskColorKey],
                fontWeight: '600',
                marginBottom: '12px',
                fontSize: '1.1rem'
              }}>Additional Assessment Factors:</h4>
              
              {showGeotechnical && (
                <div style={{
                  marginBottom: '15px'
                }}>
                  <h5 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px'
                  }}>Geotechnical Considerations</h5>
                  <ul style={{
                    paddingLeft: '25px',
                    margin: '0 0 10px 0',
                    color: '#444',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    {Object.entries(geotechnicalFactors).map(([key, value]) => (
                      <li key={key} style={{
                        marginBottom: '6px',
                        color: value === 'high' ? '#d32f2f' : (value === 'moderate' ? '#ef6c00' : '#2e7d32')
                      }}>
                        <span style={{ fontWeight: '500' }}>{geotechnicalLabels[key]}:</span>{' '}
                        {geotechnicalOptions[key][value]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {showInfrastructure && (
                <div>
                  <h5 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '8px'
                  }}>Infrastructure Elements</h5>
                  <ul style={{
                    paddingLeft: '25px',
                    margin: '0',
                    color: '#444',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    {Object.entries(infrastructureFactors).map(([key, value]) => (
                      <li key={key} style={{
                        marginBottom: '6px',
                        color: value === 'high' ? '#d32f2f' : (value === 'moderate' ? '#ef6c00' : '#2e7d32')
                      }}>
                        <span style={{ fontWeight: '500' }}>{infrastructureLabels[key]}:</span>{' '}
                        {infrastructureOptions[key][value]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Comments & Observations Section */}
      <div className="form-section" style={{ borderTop: '4px solid #ff5722' }}>
        <h2 className="section-header" style={{ color: '#ff5722' }}>
          <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #ff5722, #ff7043)' }}></span>
          Comments & Observations
        </h2>
        
        <textarea
          name="comments"
          value={comments}
          onChange={handleCommentsChange}
          placeholder="Enter any additional observations, notes, or specific concerns about the road section..."
          className="form-input"
          style={{
            minHeight: '150px',
            resize: 'vertical',
            borderColor: '#e0e0e0',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* Comment instruction */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '0.9rem',
          color: '#666',
          padding: '10px 15px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 87, 34, 0.05)',
          border: '1px solid rgba(255, 87, 34, 0.1)'
        }}>
          <span style={{
            color: '#ff5722',
            fontSize: '1.2rem',
            lineHeight: '1'
          }}>💡</span>
          <span>Include details about observed drainage patterns, erosion signs, vegetation conditions, or any other factors that may affect road stability.</span>
        </div>
      </div>
      
      {/* Photo Section would go here */}
      
      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginTop: '30px',
        marginBottom: '30px',
        position: 'sticky',
        bottom: '20px',
        zIndex: 10,
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.7)'
      }} className="action-buttons">
        <button
          type="button"
          onClick={handleSaveAssessment}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #43a047, #66bb6a)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1.1rem',
            boxShadow: '0 4px 10px rgba(76, 175, 80, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{
            width: '24px',
            height: '24px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem'
          }}>
            ✓
          </span>
          Save Assessment
          <span style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shine 2s infinite',
            pointerEvents: 'none'
          }}></span>
        </button>
        
        <button
          type="button"
          onClick={handleSaveDraft}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #f5f5f5, #ffffff)',
            color: '#1976d2',
            border: '1px solid #1976d2',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1.1rem',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(25, 118, 210, 0.1)'
          }}
        >
          <span style={{
            width: '24px',
            height: '24px',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            color: '#1976d2'
          }}>
            💾
          </span>
          Save Draft
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <button
          type="button"
          onClick={handleExportPDF}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #f5f5f5, #eeeeee)',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        >
          <span style={{
            fontSize: '1.2rem'
          }}>
            📄
          </span>
          Export PDF
        </button>
        
        <button
          type="button"
          onClick={handleNewAssessment}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #eceff1, #cfd8dc)',
            color: '#455a64',
            border: '1px solid #b0bec5',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        >
          <span style={{
            fontSize: '1.2rem'
          }}>
            🔄
          </span>
          New Assessment
        </button>
      </div>
      
      {/* Add global animation styles */}
      <style>
        {`
          @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Add responsive styles for mobile */
          @media (max-width: 768px) {
            .score-buttons {
              flex-direction: column;
              gap: 10px;
            }
            
            .coordinate-inputs {
              flex-direction: column;
            }
            
            .action-buttons {
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  );
}

export default RoadRiskForm;