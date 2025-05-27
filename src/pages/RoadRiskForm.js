                    <p><strong>Overridden to:</strong> {riskAssessment.finalRisk}</p>
                    <p><strong>Justification:</strong> {riskAssessment.overrideJustification}</p>
                    <div className="override-actions">
                      <button 
                        type="button" 
                        className="override-button modify"
                        onClick={modifyOverride}
                      >
                        Modify Override
                      </button>
                      <button 
                        type="button" 
                        className="override-button reset"
                        onClick={resetOverride}
                      >
                        Remove Override
                      </button>
                    </div>
                  </div>
                )}
                
                {!riskAssessment.isOverridden && (
                  <div className="professional-override-section">
                    <h4>Professional Override</h4>
                    <p>If professional judgment suggests a different risk level, you can override the matrix result:</p>
                    <button 
                      type="button" 
                      className="override-button show"
                      onClick={() => setShowOverride(true)}
                    >
                      Apply Professional Override
                    </button>
                  </div>
                )}
                
                {showOverride && (
                  <div className="override-form">
                    <h4>Professional Override</h4>
                    <div className="form-group">
                      <label htmlFor="override-risk-level">Override Risk Level:</label>
                      <select
                        id="override-risk-level"
                        value={overrideRiskLevel}
                        onChange={(e) => setOverrideRiskLevel(e.target.value)}
                      >
                        <option value="">Select Risk Level</option>
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        <option value="Extreme">Extreme</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="override-justification">Justification:</label>
                      <textarea
                        id="override-justification"
                        value={overrideJustification}
                        onChange={(e) => setOverrideJustification(e.target.value)}
                        placeholder="Provide detailed justification for the override..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="override-actions">
                      <button 
                        type="button" 
                        className="override-button apply"
                        onClick={applyOverride}
                        disabled={!overrideRiskLevel || !overrideJustification.trim()}
                      >
                        Apply Override
                      </button>
                      <button 
                        type="button" 
                        className="override-button cancel"
                        onClick={() => setShowOverride(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-results">
              <p>Complete the Hazard and Consequence factor assessments to see risk calculation results.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Fixed Action Buttons */}
      <div className="form-actions">
        <button 
          type="button" 
          className="action-button save"
          onClick={handleSaveProgress}
        >
          Save Progress
        </button>
        <button 
          type="button" 
          className="action-button reset"
          onClick={handleResetForm}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
}

export default RoadRiskForm;