      {/* Results Section - Enhanced */}
      {activeSection === 'results' && (
        <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
          <h2 className="section-header" style={{ color: '#4caf50' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
            Risk Assessment Results
          </h2>
          
          {riskAssessment ? (
            <div className="risk-results-container">
              {/* Risk Calculation Flow */}
              <div className="risk-calculation-display">
                <div className="calculation-step">
                  <div className="step-header">
                    <span className="step-number">1</span>
                    <h4>Hazard Assessment</h4>
                  </div>
                  <div className="score-card hazard-card">
                    <div className="score-main">
                      <span className="score-value">{riskAssessment.hazard.score}</span>
                      <span className="score-label">Total Score</span>
                    </div>
                    <div className="score-description">
                      {riskAssessment.hazard.description}
                    </div>
                  </div>
                </div>

                <div className="calculation-operator">
                  <span className="operator-symbol">×</span>
                  <span className="operator-label">Risk Matrix</span>
                </div>

                <div className="calculation-step">
                  <div className="step-header">
                    <span className="step-number">2</span>
                    <h4>Consequence Assessment</h4>
                  </div>
                  <div className="score-card consequence-card">
                    <div className="score-main">
                      <span className="score-value">{riskAssessment.consequence.score}</span>
                      <span className="score-label">Total Score</span>
                    </div>
                    <div className="score-description">
                      {riskAssessment.consequence.description}
                    </div>
                  </div>
                </div>

                <div className="calculation-operator">
                  <span className="operator-symbol">=</span>
                  <span className="operator-label">Final Result</span>
                </div>

                <div className="calculation-step">
                  <div className="step-header">
                    <span className="step-number">3</span>
                    <h4>Risk Level</h4>
                  </div>
                  <div className={`score-card risk-result-card ${riskAssessment.finalRisk.toLowerCase().replace(' ', '-')}-risk`}>
                    <div className="risk-level-main">
                      <span className="risk-level-badge">{riskAssessment.finalRisk.toUpperCase()}</span>
                      <span className="risk-score-display">Score: {riskAssessment.riskScore}</span>
                    </div>
                    <div className="risk-reasoning">
                      {riskAssessment.reasoning}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Summary Card */}
              <div className="risk-summary-card">
                <div className="summary-header">
                  <h3>Assessment Summary</h3>
                  <div className={`risk-status-badge ${riskAssessment.finalRisk.toLowerCase().replace(' ', '-')}-risk`}>
                    {riskAssessment.finalRisk.toUpperCase()} RISK
                  </div>
                </div>
                
                <div className="summary-details">
                  <div className="detail-item">
                    <span className="detail-label">Assessment Date:</span>
                    <span className="detail-value">{basicInfo.assessmentDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Road Segment:</span>
                    <span className="detail-value">{basicInfo.roadName || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Assessor:</span>
                    <span className="detail-value">{basicInfo.assessor || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Calculation Method:</span>
                    <span className="detail-value">Hazard × Consequence Matrix</span>
                  </div>
                </div>
              </div>

              {/* Professional Override Section */}
              {riskAssessment.isOverridden ? (
                <div className="override-applied-card">
                  <div className="override-header">
                    <h4>🔄 Professional Override Applied</h4>
                  </div>
                  <div className="override-details">
                    <div className="override-comparison">
                      <div className="original-result">
                        <span className="comparison-label">Original Assessment:</span>
                        <span className="comparison-value">{riskAssessment.riskLevel}</span>
                      </div>
                      <div className="override-arrow">→</div>
                      <div className="override-result">
                        <span className="comparison-label">Professional Override:</span>
                        <span className={`comparison-value ${riskAssessment.finalRisk.toLowerCase().replace(' ', '-')}-risk`}>
                          {riskAssessment.finalRisk}
                        </span>
                      </div>
                    </div>
                    <div className="override-justification">
                      <strong>Justification:</strong>
                      <p>{riskAssessment.overrideJustification}</p>
                    </div>
                    <div className="override-actions">
                      <button 
                        type="button" 
                        className="override-action-button modify"
                        onClick={modifyOverride}
                      >
                        Modify Override
                      </button>
                      <button 
                        type="button" 
                        className="override-action-button remove"
                        onClick={resetOverride}
                      >
                        Remove Override
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="professional-override-card">
                  <div className="override-header">
                    <h4>⚖️ Professional Override</h4>
                    <p>If professional judgment suggests a different risk level, you can override the calculated result:</p>
                  </div>
                  <button 
                    type="button" 
                    className="show-override-button"
                    onClick={() => setShowOverride(true)}
                  >
                    Apply Professional Override
                  </button>
                </div>
              )}

              {/* Override Form */}
              {showOverride && (
                <div className="override-form-card">
                  <div className="override-form-header">
                    <h4>Apply Professional Override</h4>
                    <p>Override the calculated risk level based on professional judgment and site-specific factors.</p>
                  </div>
                  
                  <div className="override-form-content">
                    <div className="form-group">
                      <label htmlFor="override-risk-level">Override Risk Level:</label>
                      <select
                        id="override-risk-level"
                        value={overrideRiskLevel}
                        onChange={(e) => setOverrideRiskLevel(e.target.value)}
                        className="override-select"
                      >
                        <option value="">Select Risk Level</option>
                        <option value="Low">Low Risk</option>
                        <option value="Moderate">Moderate Risk</option>
                        <option value="High">High Risk</option>
                        <option value="Very High">Very High Risk</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="override-justification">Professional Justification:</label>
                      <textarea
                        id="override-justification"
                        value={overrideJustification}
                        onChange={(e) => setOverrideJustification(e.target.value)}
                        placeholder="Provide detailed professional justification for the override, including specific site conditions, professional experience, or additional factors not captured in the standard assessment..."
                        rows={5}
                        className="override-textarea"
                        required
                      />
                    </div>
                    
                    <div className="override-form-actions">
                      <button 
                        type="button" 
                        className="override-action-button apply"
                        onClick={applyOverride}
                        disabled={!overrideRiskLevel || !overrideJustification.trim()}
                      >
                        Apply Override
                      </button>
                      <button 
                        type="button" 
                        className="override-action-button cancel"
                        onClick={() => setShowOverride(false)}
                      >
                        Cancel Override
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Assessment Information */}
              {(optionalAssessments.geotechnicalEnabled || optionalAssessments.infrastructureEnabled) && (
                <div className="additional-assessments-card">
                  <h4>📋 Additional Assessments Completed</h4>
                  <div className="assessment-badges">
                    {optionalAssessments.geotechnicalEnabled && (
                      <span className="assessment-badge geotechnical">
                        🏔️ Geotechnical Assessment
                      </span>
                    )}
                    {optionalAssessments.infrastructureEnabled && (
                      <span className="assessment-badge infrastructure">
                        🏗️ Infrastructure Assessment
                      </span>
                    )}
                  </div>
                  <p className="assessment-note">
                    Additional detailed assessments have been completed and should be considered 
                    alongside this risk calculation for comprehensive project planning.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="no-results-card">
              <div className="no-results-icon">📊</div>
              <h3>Assessment Incomplete</h3>
              <p>Complete both the <strong>Hazard Factors</strong> and <strong>Consequence Factors</strong> assessments to view your risk calculation results.</p>
              <div className="completion-status">
                <div className="status-item">
                  <span className={`status-indicator ${Object.values(hazardFactors).filter((val, idx) => idx < 5 && val !== null).length === 5 ? 'complete' : 'incomplete'}`}></span>
                  <span>Hazard Factors ({Object.values(hazardFactors).filter((val, idx) => idx < 5 && val !== null).length}/5 complete)</span>
                </div>
                <div className="status-item">
                  <span className={`status-indicator ${Object.values(consequenceFactors).filter((val, idx) => idx < 4 && val !== null).length === 4 ? 'complete' : 'incomplete'}`}></span>
                  <span>Consequence Factors ({Object.values(consequenceFactors).filter((val, idx) => idx < 4 && val !== null).length}/4 complete)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}