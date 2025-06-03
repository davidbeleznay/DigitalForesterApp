import React from 'react';
import './CulvertResults.css';

const CulvertResults = ({ results, formValues, optionalAssessments, climateFactors }) => {
  const calculationResults = results;
  
  if (!calculationResults) {
    return (
      <div className="culvert-results-container">
        <div className="status-message error">
          No calculation results available. Please check your inputs and try again.
        </div>
      </div>
    );
  }

  const {
    finalSize = 2000,
    governingMethod = 'California Method',
    californiaSize = 1200,
    climateAdjustedCaliforniaSize = 1200,
    debrisAdjustedCaliforniaSize = 1200,
    debrisHazardInfo = { hazardClass: 'LOW', debrisMultiplier: 1.00, redFlags: 0, message: '' },
    hydraulicSize = 2000,
    bankfullFlow = "0.00",
    pipeCapacity = "0.00",
    appliedClimateFactor = 1.0,
    topWidth = "1.62",
    bottomWidth = "0.99", 
    streamArea = "0.32",
    californiaArea = "0.97",
    sizingMethod = 'california',
    climateFactorsEnabled = false,
    debrisAssessmentEnabled = false,
    fishPassage = false,
    embedDepth = "0.00",
    notes = "",
    debugInfo = {}
  } = calculationResults;

  // Calculate values for display
  const recommendedSize = finalSize;
  const shape = 'Circular';
  const material = 'Corrugated Metal Pipe (CMP)';
  const manningsN = formValues?.pipeRoughness || 0.024;
  const hwdCriterion = `HW/D ≤ ${formValues?.maxHwdRatio || '0.8'}`;
  const climateFactor = appliedClimateFactor || 1.0;
  const baseCaliforniaSize = californiaSize;
  const withClimateSize = climateAdjustedCaliforniaSize;
  const withDebrisSize = debrisAdjustedCaliforniaSize;
  const climateFactorsApplied = climateFactorsEnabled && climateFactor > 1.0;
  const debrisAssessmentApplied = debrisAssessmentEnabled && debrisHazardInfo.debrisMultiplier > 1.0;

  // Create measurements array from form data
  const avgWidth = parseFloat(topWidth) || 0;
  const avgBottom = parseFloat(bottomWidth) || 0;
  const avgDepth = parseFloat(streamArea) / Math.max(avgWidth, 0.1) || 0;
  const bankfullArea = parseFloat(streamArea) || 0;
  const endArea = parseFloat(californiaArea) || 0;
  const designDischarge = parseFloat(bankfullFlow) || 0;

  return (
    <div className="culvert-results-container">
      <section className="recommended-size-section">
        <h2 className="green-heading">Recommended Culvert Size</h2>
        
        <div className="size-circle">
          <span className="size-value">{recommendedSize} mm</span>
          <span className="size-shape">{shape}</span>
        </div>
        
        <p className="recommendation-text">
          Final recommendation: {recommendedSize}mm diameter {shape.toLowerCase()} culvert based on {governingMethod}.
        </p>

        <table className="specs-table">
          <tbody>
            <tr>
              <td>Selected Method:</td>
              <td className="value">{
                sizingMethod === 'california' ? 'California Method (Default)' :
                sizingMethod === 'hydraulic' ? 'Hydraulic Calculation' :
                sizingMethod === 'comparison' ? 'Method Comparison' :
                'California Method'
              }</td>
            </tr>
            <tr>
              <td>Governing Method:</td>
              <td className="value">{governingMethod}</td>
            </tr>
            <tr>
              <td>Material:</td>
              <td className="value">{material}</td>
            </tr>
            <tr>
              <td>Manning's n:</td>
              <td className="value">{manningsN}</td>
            </tr>
            <tr>
              <td>Headwater Criterion:</td>
              <td className="value">{hwdCriterion}</td>
            </tr>
            {climateFactorsApplied && (
              <tr>
                <td>Climate Change Factor:</td>
                <td className="value">{climateFactor.toFixed(2)}× ({((climateFactor - 1) * 100).toFixed(0)}% increase)</td>
              </tr>
            )}
            {debrisAssessmentApplied && (
              <tr>
                <td>Debris Hazard:</td>
                <td className="value">{debrisHazardInfo.hazardClass} (×{debrisHazardInfo.debrisMultiplier.toFixed(2)} multiplier)</td>
              </tr>
            )}
            {fishPassage && (
              <tr>
                <td>Fish Passage:</td>
                <td className="value">Required (Embed: {embedDepth}m)</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Debris Assessment Results Section */}
      {debrisAssessmentEnabled && (
        <section className="debris-assessment-section">
          <h2 className="green-heading">🪵 Debris Transport Assessment</h2>
          <p className="section-description">
            Professional debris transport hazard evaluation with area multiplier application.
          </p>
          
          <div className={`debris-hazard-result ${debrisHazardInfo.hazardClass.toLowerCase()}`}>
            <div className="hazard-header">
              <h3>Hazard Classification: {debrisHazardInfo.hazardClass}</h3>
              <div className="hazard-badges">
                <span className="red-flags-badge">{debrisHazardInfo.redFlags} Red Flags</span>
                <span className="multiplier-badge">×{debrisHazardInfo.debrisMultiplier.toFixed(2)} Multiplier</span>
              </div>
            </div>
            
            <div className="hazard-message">
              {debrisHazardInfo.message}
            </div>
            
            {debrisHazardInfo.requiresProfessional && (
              <div className="pe-review-notice">
                ⚠️ <strong>Professional Engineer Review Required</strong> - HIGH debris hazard detected
              </div>
            )}
            
            {debrisHazardInfo.mitigationStrategy && (
              <div className="mitigation-strategy">
                <strong>Selected Strategy:</strong> {debrisHazardInfo.mitigationStrategy === 'upsize' ? 'Up-size culvert' : 'Annual clean-out commitment'}
              </div>
            )}
          </div>
          
          <div className="debris-calculation-flow">
            <h4>Debris Multiplier Application</h4>
            <div className="calculation-steps">
              <div className="calc-step">
                <span className="step-label">Base California:</span>
                <span className="step-value">{baseCaliforniaSize} mm</span>
              </div>
              {climateFactorsApplied && (
                <>
                  <span className="arrow">→</span>
                  <div className="calc-step">
                    <span className="step-label">+ Climate Factor:</span>
                    <span className="step-value">{withClimateSize} mm</span>
                  </div>
                </>
              )}
              {debrisAssessmentApplied && (
                <>
                  <span className="arrow">→</span>
                  <div className="calc-step">
                    <span className="step-label">+ Debris Factor:</span>
                    <span className="step-value">{withDebrisSize} mm</span>
                  </div>
                </>
              )}
              <span className="arrow">→</span>
              <div className="calc-step final">
                <span className="step-label">Final Size:</span>
                <span className="step-value">{finalSize} mm</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Climate Factor Comparison Section */}
      {climateFactorsApplied && (
        <section className="climate-comparison-section">
          <h2 className="green-heading">Climate Change Factor Comparison</h2>
          <p className="section-description">
            Comparison of culvert sizing with and without climate change projections for {climateFactors?.planningHorizon || '2050'}.
          </p>
          
          <div className="climate-comparison">
            <div className="climate-box base-scenario">
              <h3>🌤️ Current Climate (No Factor)</h3>
              <p className="climate-size">{baseCaliforniaSize} mm</p>
              <p className="climate-details">F<sub>CC</sub> = 1.00 (no climate adjustment)</p>
              <p className="climate-note">
                Standard California Method sizing for current climate conditions.
              </p>
              <div className="climate-formula">
                <code>Base California Method → {baseCaliforniaSize} mm</code>
              </div>
            </div>
            
            <div className="climate-box adjusted-scenario highlight">
              <h3>🌡️ {climateFactors?.planningHorizon || '2050'} Projections (With Factor)</h3>
              <p className="climate-size">{withClimateSize} mm</p>
              <p className="climate-details">F<sub>CC</sub> = {climateFactor.toFixed(2)} ({((climateFactor - 1) * 100).toFixed(0)}% increase)</p>
              <p className="climate-note">
                Climate-adjusted sizing increases required capacity by {((climateFactor - 1) * 100).toFixed(0)}%.
              </p>
              <div className="climate-formula">
                <code>Climate-adjusted → {withClimateSize} mm</code>
              </div>
              <div className="method-status selected">✓ CLIMATE-ADJUSTED</div>
            </div>
          </div>

          <div className="climate-explanation">
            <h4>Climate Factor Rationale (Coastal BC)</h4>
            <div className="climate-presets">
              <div className="preset-item">
                <strong>Present–2030:</strong> F<sub>CC</sub> = 1.10 (PCIC & EGBC suggest +10% for short-term upgrades)
              </div>
              <div className="preset-item">
                <strong>Mid-century (2050):</strong> F<sub>CC</sub> = 1.20 (Rule-of-thumb used by EGBC when local data are sparse)
              </div>
              <div className="preset-item">
                <strong>Late-century (2080+):</strong> F<sub>CC</sub> = 1.30 coast / 1.25 interior (Consistent with hydrologic projections)
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="sizing-method-section">
        <h2 className="green-heading">Sizing Method Comparison</h2>
        
        <div className="method-comparison">
          <div className={`method-box ${sizingMethod === 'california' || governingMethod.includes('California') ? 'highlight' : ''}`}>
            <h3>California Method</h3>
            <p className="method-size">
              {withDebrisSize} mm
              {climateFactorsApplied && (
                <span className="climate-badge">+{((climateFactor - 1) * 100).toFixed(0)}%</span>
              )}
              {debrisAssessmentApplied && (
                <span className="debris-badge">+{((debrisHazardInfo.debrisMultiplier - 1) * 100).toFixed(0)}%</span>
              )}
            </p>
            <p className="method-details">
              {climateFactorsApplied || debrisAssessmentApplied ? 
                `Adjusted Area: ${(parseFloat(endArea) * climateFactor * debrisHazardInfo.debrisMultiplier).toFixed(2)} m²` :
                `3× Bankfull Area: ${endArea} m²`
              }
            </p>
            <p className="method-note">
              {sizingMethod === 'california' ? 
                (climateFactorsApplied || debrisAssessmentApplied ? 
                  `California Method with adjustments for ${climateFactors?.planningHorizon || '2050'} conditions${debrisAssessmentApplied ? ` and ${debrisHazardInfo.hazardClass} debris hazard` : ''}.` :
                  "Size determined using California Method Table."
                ) : 
                "Standard California Method calculation for comparison."
              }
            </p>
            {(sizingMethod === 'california' || governingMethod.includes('California')) && (
              <div className="method-status selected">✓ SELECTED METHOD</div>
            )}
          </div>
          
          <div className={`method-box ${sizingMethod === 'hydraulic' || governingMethod.includes('Hydraulic') ? 'highlight' : ''}`}>
            <h3>Hydraulic Calculation</h3>
            <p className="method-size">{hydraulicSize} mm</p>
            <p className="method-details">
              {designDischarge > 0 ? `Design Discharge: ${designDischarge} m³/s` : 'Hydraulic parameters not provided'}
            </p>
            <p className="method-note">
              {sizingMethod === 'hydraulic' ? 
                "Manning's equation with slope and roughness parameters." : 
                "Hydraulic check using Manning's equation."
              }
              {parseFloat(pipeCapacity) > 0 && (
                <> Pipe capacity: {pipeCapacity} m³/s</>
              )}
            </p>
            {(sizingMethod === 'hydraulic' || governingMethod.includes('Hydraulic')) && (
              <div className="method-status selected">✓ SELECTED METHOD</div>
            )}
          </div>

          {sizingMethod === 'comparison' && (
            <div className="method-box highlight comparison-box">
              <h3>Method Comparison Result</h3>
              <p className="method-size">
                {Math.max(withDebrisSize, hydraulicSize)} mm
              </p>
              <p className="method-details">
                Larger of: California ({withDebrisSize}mm) vs Hydraulic ({hydraulicSize}mm)
              </p>
              <p className="method-note">
                Using the larger of both methods for conservative design.
                {climateFactorsApplied && ` Climate factor of ${climateFactor.toFixed(2)} applied.`}
                {debrisAssessmentApplied && ` Debris factor of ${debrisHazardInfo.debrisMultiplier.toFixed(2)} applied.`}
              </p>
              <div className="method-status selected">✓ COMPARISON METHOD</div>
            </div>
          )}
        </div>
      </section>

      <section className="calculation-details-section">
        <h2 className="green-heading">Calculation Details</h2>
        
        <table className="calculation-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Key Parameter</th>
              <th>Result</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className={sizingMethod === 'california' ? 'selected-row' : ''}>
              <td>California Table</td>
              <td>Width: {avgWidth.toFixed(2)} m, Depth: {avgDepth.toFixed(2)} m</td>
              <td>{baseCaliforniaSize} mm</td>
              <td>{sizingMethod === 'california' && !climateFactorsApplied && !debrisAssessmentApplied ? '✓ Selected' : 'Base Calculation'}</td>
            </tr>
            {climateFactorsApplied && (
              <tr className={sizingMethod === 'california' ? 'selected-row climate-adjusted' : 'climate-adjusted'}>
                <td>California + Climate</td>
                <td>Area × {climateFactor.toFixed(2)} = {(parseFloat(endArea) * climateFactor).toFixed(2)} m²</td>
                <td>{withClimateSize} mm</td>
                <td>{sizingMethod === 'california' && !debrisAssessmentApplied ? '✓ Selected (Climate)' : 'Climate Reference'}</td>
              </tr>
            )}
            {debrisAssessmentApplied && (
              <tr className={sizingMethod === 'california' ? 'selected-row debris-adjusted' : 'debris-adjusted'}>
                <td>California + Debris</td>
                <td>Area × {debrisHazardInfo.debrisMultiplier.toFixed(2)} = {(parseFloat(endArea) * climateFactor * debrisHazardInfo.debrisMultiplier).toFixed(2)} m²</td>
                <td>{withDebrisSize} mm</td>
                <td>{sizingMethod === 'california' ? '✓ Selected (Debris)' : 'Debris Reference'}</td>
              </tr>
            )}
            <tr>
              <td>Cross-Section</td>
              <td>Area: {bankfullArea.toFixed(2)} m² × 3 = {endArea} m²</td>
              <td>{baseCaliforniaSize} mm</td>
              <td>California Method</td>
            </tr>
            {(sizingMethod === 'hydraulic' || sizingMethod === 'comparison') && (
              <tr className={sizingMethod === 'hydraulic' ? 'selected-row' : ''}>
                <td>Hydraulic</td>
                <td>
                  {designDischarge > 0 ? 
                    `Discharge: ${designDischarge} m³/s, HW/D ≤ ${formValues?.maxHwdRatio || '0.8'}` :
                    'Hydraulic parameters not provided'
                  }
                </td>
                <td>{hydraulicSize} mm</td>
                <td>{sizingMethod === 'hydraulic' ? '✓ Selected' : 'Comparison'}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Debug Information */}
        {debugInfo && Object.keys(debugInfo).length > 0 && (
          <div className="debug-section">
            <h4>Debug Information</h4>
            <div className="debug-info">
              {debugInfo.needsHydraulicCalc !== undefined && (
                <div>Hydraulic calculations needed: {debugInfo.needsHydraulicCalc ? 'Yes' : 'No'}</div>
              )}
              {debugInfo.streamFlowRate && debugInfo.streamFlowRate !== 'N/A' && (
                <div>Stream flow rate: {debugInfo.streamFlowRate} m³/s</div>
              )}
              {debugInfo.streamVelocity && debugInfo.streamVelocity !== 'N/A' && (
                <div>Stream velocity: {debugInfo.streamVelocity} m/s</div>
              )}
              {debugInfo.hydraulicRadius && (
                <div>Hydraulic radius: {debugInfo.hydraulicRadius} m</div>
              )}
              {debugInfo.californiaTableLookup && (
                <div>Table lookup: {debugInfo.californiaTableLookup}</div>
              )}
              {debugInfo.debrisHazard && (
                <div>Debris hazard: {debugInfo.debrisHazard}</div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="measurements-section">
        <h2 className="green-heading">Stream Measurements</h2>
        
        <div className="measurements-summary">
          <div className="measurement-item">
            <span className="label">Average Top Width:</span>
            <span className="value">{avgWidth.toFixed(2)} m</span>
          </div>
          <div className="measurement-item">
            <span className="label">Average Bottom Width:</span>
            <span className="value">{avgBottom.toFixed(2)} m</span>
          </div>
          <div className="measurement-item">
            <span className="label">Stream Area:</span>
            <span className="value">{bankfullArea.toFixed(2)} m²</span>
          </div>
          <div className="measurement-item">
            <span className="label">Required Area (3×):</span>
            <span className="value">{endArea} m²</span>
          </div>
          {climateFactorsApplied && (
            <div className="measurement-item climate-adjusted">
              <span className="label">Climate-Adjusted Area:</span>
              <span className="value">{(parseFloat(endArea) * climateFactor).toFixed(2)} m²</span>
            </div>
          )}
          {debrisAssessmentApplied && (
            <div className="measurement-item debris-adjusted">
              <span className="label">Debris-Adjusted Area:</span>
              <span className="value">{(parseFloat(endArea) * climateFactor * debrisHazardInfo.debrisMultiplier).toFixed(2)} m²</span>
            </div>
          )}
        </div>
      </section>

      <section className="method-explanation-section">
        <h2 className="green-heading">
          {sizingMethod === 'california' ? 'California Method Explanation' :
           sizingMethod === 'hydraulic' ? 'Hydraulic Method Explanation' :
           'Method Comparison Explanation'}
        </h2>
        
        {sizingMethod === 'california' && (
          <>
            <p>
              The California Method uses stream width and depth measurements to determine appropriate culvert size through professional lookup tables. 
              This method is the industry standard for most culvert sizing applications.
              {climateFactorsApplied && ` Climate change factors are applied by increasing the required area by ${((climateFactor - 1) * 100).toFixed(0)}% to account for increased precipitation intensity in ${climateFactors?.planningHorizon || '2050'}.`}
              {debrisAssessmentApplied && ` Debris transport factors are applied with a ${debrisHazardInfo.debrisMultiplier.toFixed(2)}× multiplier for ${debrisHazardInfo.hazardClass} hazard conditions.`}
            </p>

            <div className="formula-box">
              <p className="formula">
                Required Area = ((Top Width + Bottom Width) ÷ 2) × Depth × 3
                {climateFactorsApplied && ` × F_CC`}
                {debrisAssessmentApplied && ` × F_D`}
              </p>
              <p className="formula-legend">
                Then look up appropriate pipe size from California Method table
                {climateFactorsApplied && `, F_CC = Climate Change Factor (${climateFactor.toFixed(2)})`}
                {debrisAssessmentApplied && `, F_D = Debris Factor (${debrisHazardInfo.debrisMultiplier.toFixed(2)})`}
              </p>
            </div>

            {climateFactorsApplied && (
              <div className="climate-note-box">
                <h4>🌡️ Climate Change Considerations</h4>
                <p>
                  A climate factor of {climateFactor.toFixed(2)} has been applied based on {climateFactors?.planningHorizon || '2050'} projections for coastal British Columbia. 
                  This represents a {((climateFactor - 1) * 100).toFixed(0)}% increase in required culvert capacity to accommodate future increased precipitation intensity.
                </p>
              </div>
            )}

            {debrisAssessmentApplied && (
              <div className="debris-note-box">
                <h4>🪵 Debris Transport Considerations</h4>
                <p>
                  A debris factor of {debrisHazardInfo.debrisMultiplier.toFixed(2)} has been applied based on {debrisHazardInfo.hazardClass} hazard assessment with {debrisHazardInfo.redFlags} red flags. 
                  This represents a {((debrisHazardInfo.debrisMultiplier - 1) * 100).toFixed(0)}% increase in required culvert area to accommodate debris transport risks.
                </p>
                {debrisHazardInfo.requiresProfessional && (
                  <p><strong>Professional Engineer review is recommended</strong> due to HIGH debris hazard classification.</p>
                )}
              </div>
            )}
          </>
        )}

        {sizingMethod === 'hydraulic' && (
          <>
            <p>
              The Hydraulic Method uses Manning's equation to calculate the required culvert size based on flow capacity, channel slope, and roughness coefficients. 
              This method ensures the culvert can handle the design discharge while maintaining acceptable headwater levels.
              {climateFactorsApplied && ` Climate change factors increase the design discharge to account for future storm intensification.`}
            </p>

            <div className="formula-box">
              <p className="formula">Q = (1/n) × A × R^(2/3) × S^(1/2)</p>
              <p className="formula-legend">
                Q = Flow, n = Manning's roughness, A = Area, R = Hydraulic radius, S = Slope
                {climateFactorsApplied && ` (Climate factor applied to flow)`}
              </p>
            </div>
          </>
        )}

        {sizingMethod === 'comparison' && (
          <>
            <p>
              The Method Comparison approach calculates culvert sizes using both the California Method and Hydraulic calculations, 
              then recommends the larger of the two sizes to ensure adequate capacity under all conditions.
              {climateFactorsApplied && ` Climate change factors are applied to provide conservative future design.`}
              {debrisAssessmentApplied && ` Debris transport factors are applied for additional safety margin.`}
            </p>

            <div className="formula-box">
              <p className="formula">
                Final Size = MAX(California Method Size, Hydraulic Method Size)
              </p>
              <p className="formula-legend">Conservative approach using the most restrictive requirement</p>
            </div>
          </>
        )}

        {notes && (
          <div className="notes-section">
            <h4>Additional Notes</h4>
            <p>{notes}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CulvertResults;