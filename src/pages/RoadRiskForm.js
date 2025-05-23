                  <div className="matrix-result" style={{ backgroundColor: riskAssessment.color }}>
                    <span className="result-label">Matrix Result:</span>
                    <span className="result-value">{riskAssessment.matrixRisk}</span>
                  </div>
                </div>
              </div>

              {/* Professional Override Section */}
              <div className="professional-override-section">
                <div className="override-header">
                  <h3>Professional Override</h3>
                  <p>Adjust risk levels based on additional professional considerations not captured in the standard assessment.</p>
                </div>

                {!showOverride && !riskAssessment.isOverridden && (
                  <div className="override-controls">
                    <button 
                      className="override-button primary"
                      onClick={() => setShowOverride(true)}
                    >
                      Apply Professional Override
                    </button>
                    <p className="override-description">
                      Use this if site-specific conditions, local knowledge, or professional judgment 
                      suggests different risk levels than calculated.
                    </p>
                  </div>
                )}

                {showOverride && (
                  <div className="override-form">
                    <div className="override-inputs">
                      <div className="override-field">
                        <label>Override Hazard Level:</label>
                        <select 
                          value={overrideHazard || riskAssessment.hazard.level} 
                          onChange={(e) => setOverrideHazard(e.target.value)}
                        >
                          {matrixCalculator.getRiskLevels().map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        <span className="current-value">
                          (Calculated: {riskAssessment.hazard.level})
                        </span>
                      </div>

                      <div className="override-field">
                        <label>Override Consequence Level:</label>
                        <select 
                          value={overrideConsequence || riskAssessment.consequence.level} 
                          onChange={(e) => setOverrideConsequence(e.target.value)}
                        >
                          {matrixCalculator.getRiskLevels().map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        <span className="current-value">
                          (Calculated: {riskAssessment.consequence.level})
                        </span>
                      </div>

                      <div className="override-field">
                        <label>Justification for Override (Required):</label>
                        <textarea
                          value={overrideJustification}
                          onChange={(e) => setOverrideJustification(e.target.value)}
                          placeholder="Explain the professional reasoning for overriding the calculated risk levels. Include specific site conditions, local knowledge, or other factors not captured in the standard assessment..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="override-actions">
                      <button 
                        className="override-button primary"
                        onClick={applyOverride}
                        disabled={!overrideJustification.trim()}
                      >
                        Apply Override
                      </button>
                      <button 
                        className="override-button secondary"
                        onClick={() => {
                          setShowOverride(false);
                          setOverrideHazard(null);
                          setOverrideConsequence(null);
                          setOverrideJustification('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {riskAssessment.isOverridden && (
                  <div className="override-summary">
                    <h4>Override Applied</h4>
                    <div className="override-details">
                      {riskAssessment.overrideDetails?.hazardChanged && (
                        <p><strong>Hazard Level:</strong> {riskAssessment.overrideDetails.originalHazard} → {riskAssessment.overrideDetails.newHazard}</p>
                      )}
                      {riskAssessment.overrideDetails?.consequenceChanged && (
                        <p><strong>Consequence Level:</strong> {riskAssessment.overrideDetails.originalConsequence} → {riskAssessment.overrideDetails.newConsequence}</p>
                      )}
                      <div className="override-justification">
                        <strong>Professional Justification:</strong>
                        <p>{riskAssessment.overrideJustification}</p>
                      </div>
                    </div>
                    <div className="override-management">
                      <button 
                        className="modify-override-button"
                        onClick={modifyOverride}
                      >
                        Modify Override
                      </button>
                      <button 
                        className="reset-override-button"
                        onClick={resetOverride}
                      >
                        Reset to Calculated Risk
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Final Risk Display */}
              <div className="final-risk-section">
                <div className="risk-category" style={{ backgroundColor: riskAssessment.finalColor }}>
                  <h3 className="risk-category-label">
                    {riskAssessment.isOverridden ? 'Final Risk Level (Professional Override Applied)' : 'Final Risk Level'}
                  </h3>
                  <div className="risk-category-value">{riskAssessment.finalRisk}</div>
                </div>

                <div className="category-requirements">
                  <h3 className="requirements-header">Professional Requirements</h3>
                  {riskAssessment.finalRisk === 'Very High' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> Full professional team with CRP and specialist PORs. Geometric design required. Multiple field reviews.</p>
                      <p><strong>Inspection Frequency:</strong> Frequent during wet season, annual otherwise.</p>
                      <p><strong>Documentation:</strong> Formal assurance statements, detailed documentation package, LRM database entry, inspections and risk mitigation.</p>
                    </div>
                  )}
                  {riskAssessment.finalRisk === 'High' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> CRP and road activity POR (may be same person for simple roads). Specialist consultation. Field reviews at critical stages.</p>
                      <p><strong>Inspection Frequency:</strong> Annual.</p>
                      <p><strong>Documentation:</strong> Assurance statements, documentation of field reviews, maintenance/inspection or deactivation plans.</p>
                    </div>
                  )}
                  {riskAssessment.finalRisk === 'Moderate' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> CRP and road activity POR oversight. Standard designs with field verification.</p>
                      <p><strong>Inspection Frequency:</strong> Bi-annual.</p>
                      <p><strong>Documentation:</strong> Basic assurance documentation, regular monitoring schedule.</p>
                    </div>
                  )}
                  {riskAssessment.finalRisk === 'Low' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> Standard oversight by qualified professionals. Routine field reviews.</p>
                      <p><strong>Inspection Frequency:</strong> As needed.</p>
                      <p><strong>Documentation:</strong> Standard recordkeeping for events.</p>
                    </div>
                  )}
                  {riskAssessment.finalRisk === 'Very Low' && (
                    <div className="requirements-content">
                      <p><strong>Professional Team:</strong> Routine professional oversight.</p>
                      <p><strong>Inspection Frequency:</strong> During routine maintenance.</p>
                      <p><strong>Documentation:</strong> Basic documentation in Quick Capture app.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="action-recommendations">
                <h3 className="recommendations-header">Recommended Actions</h3>
                <ul className="recommendations-list">
                  {riskAssessment.finalRisk === 'Very High' && (
                    <>
                      <li>Immediate professional assessment required</li>
                      <li>Implement access controls until remediation complete</li>
                      <li>Develop comprehensive risk mitigation plan</li>
                      <li>Schedule frequent monitoring during wet season</li>
                      <li>Allocate budget for major engineering works</li>
                    </>
                  )}
                  {riskAssessment.finalRisk === 'High' && (
                    <>
                      <li>Professional assessment required within 30 days</li>
                      <li>Develop maintenance/inspection plan</li>
                      <li>Consider temporary drainage improvements</li>
                      <li>Schedule annual professional inspection</li>
                      <li>Plan for potential major repairs in next budget cycle</li>
                    </>
                  )}
                  {riskAssessment.finalRisk === 'Moderate' && (
                    <>
                      <li>Schedule professional field verification</li>
                      <li>Implement standard monitoring protocol</li>
                      <li>Conduct routine maintenance of drainage structures</li>
                      <li>Document changes in conditions</li>
                      <li>Review during bi-annual inspection cycle</li>
                    </>
                  )}
                  {riskAssessment.finalRisk === 'Low' && (
                    <>
                      <li>Maintain standard documentation</li>
                      <li>Include in routine maintenance schedule</li>
                      <li>No immediate action required</li>
                      <li>Monitor during normal operations</li>
                    </>
                  )}
                  {riskAssessment.finalRisk === 'Very Low' && (
                    <>
                      <li>No specific action required</li>
                      <li>Document in Quick Capture app during routine visits</li>
                      <li>Follow standard maintenance procedures</li>
                    </>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="no-assessment">
              <p>Complete the Hazard and Consequence factor assessments to view risk results.</p>
            </div>
          )}
          
          <div className="section-nav-buttons">
            <button 
              type="button" 
              className="section-nav-button prev"
              onClick={() => setActiveSection('optional')}
            >
              Previous: Optional Assessments
            </button>
            <div></div> {/* Empty div for spacing */}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="form-actions">
        <button 
          className="action-button primary"
          onClick={handleSaveProgress}
        >
          Save Progress
        </button>
        <button 
          className="action-button secondary"
          onClick={handleResetForm}
        >
          Reset Form
        </button>
        <Link to="/" className="action-button tertiary">Return to Home</Link>
      </div>
    </div>
  );
}

export default RoadRiskForm;