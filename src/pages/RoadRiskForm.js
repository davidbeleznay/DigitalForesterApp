Immediate professional assessment required</li>
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
            <div></div>
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