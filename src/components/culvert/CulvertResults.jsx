import React from 'react';
import './CulvertResults.css';

const CulvertResults = ({ calculationResults }) => {
  const {
    recommendedSize = 2000,
    shape = 'Circular',
    material = 'Corrugated Metal Pipe (CMP)',
    manningsN = 0.024,
    hwdCriterion = 'HW/D ≤ 0.8',
    climateChangeFactor = 1.00,
    governingMethod = 'California Method',
    californiaMethodSize = 1200,
    hydraulicCalculationSize = 2000,
    bankfullArea = 0.32,
    endArea = 0.97,
    designDischarge = 1.20,
    measurements = [
      { id: 1, top: 2, bottom: 0.99, depth: 0.2 },
      { id: 2, top: 2.5, bottom: 0.99, depth: 0.2 }
    ],
    avgWidth = 1.62,
    avgBottom = 0.99,
    avgDepth = 0.20,
    sizingMethod = 'california', // Default to California Method
    climateFactorsApplied = false,
    climateFactors = null,
    appliedClimateFactor = 1.0,
    californiaSize = 1200,
    climateAdjustedCaliforniaSize = 1200
  } = calculationResults || {};

  // Calculate base California Method size without climate factors
  const baseCaliforniaSize = californiaSize;
  const withClimateSize = climateAdjustedCaliforniaSize;
  const climateFactor = appliedClimateFactor || 1.0;

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
            {manningsN && (
              <tr>
                <td>Manning's n:</td>
                <td className="value">{manningsN}</td>
              </tr>
            )}
            <tr>
              <td>Headwater Criterion:</td>
              <td className="value">{hwdCriterion}</td>
            </tr>
            {climateFactorsApplied && (
              <tr>
                <td>Climate Change Factor:</td>
                <td className="value">{climateFactor}× ({((climateFactor - 1) * 100).toFixed(0)}% increase)</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Climate Factor Comparison Section - Show if climate factors are enabled */}
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
                <code>d ≈ {Math.round(2 * Math.sqrt((avgWidth * avgDepth * 3) / Math.PI) * 1000)} mm → rounds to {baseCaliforniaSize} mm</code>
              </div>
            </div>
            
            <div className="climate-box adjusted-scenario highlight">
              <h3>🌡️ {climateFactors?.planningHorizon || '2050'} Projections (With Factor)</h3>
              <p className="climate-size">{withClimateSize} mm</p>
              <p className="climate-details">F<sub>CC</sub> = {climateFactor.toFixed(2)} ({((climateFactor - 1) * 100).toFixed(0)}% increase)</p>
              <p className="climate-note">
                {climateFactor === 1.20 ? 
                  "The +20% climate slider bumps the pipe one commercial size with zero extra math for the user." :
                  `Climate-adjusted sizing increases required area by ${((climateFactor - 1) * 100).toFixed(0)}%.`
                }
              </p>
              <div className="climate-formula">
                <code>A = {(avgWidth * avgDepth * 3 * climateFactor).toFixed(2)} m² → d ≈ {Math.round(2 * Math.sqrt((avgWidth * avgDepth * 3 * climateFactor) / Math.PI) * 1000)} mm → rounds to {withClimateSize} mm</code>
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
                <strong>Late-century (2080+):</strong> F<sub>CC</sub> = 1.30 coast / 1.25 interior (Consistent with hydrologic projections showing 20–30% rises in Q100 for small BC basins)
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
              {climateFactorsApplied ? withClimateSize : baseCaliforniaSize} mm
              {climateFactorsApplied && (
                <span className="climate-badge">+{((climateFactor - 1) * 100).toFixed(0)}%</span>
              )}
            </p>
            <p className="method-details">
              {climateFactorsApplied ? 
                `Climate-Adjusted Area: ${(parseFloat(endArea) * climateFactor).toFixed(2)} m²` :
                `3× Bankfull Area: ${endArea} m²`
              }
            </p>
            <p className="method-note">
              {sizingMethod === 'california' ? 
                (climateFactorsApplied ? 
                  `Climate-adjusted California Method for ${climateFactors?.planningHorizon || '2050'} conditions.` :
                  "Size determined using California Method Table."
                ) : 
                "Standard California Method calculation for comparison."
              }
            </p>
            {sizingMethod === 'california' && (
              <div className="method-status selected">✓ SELECTED METHOD</div>
            )}
          </div>
          
          <div className={`method-box ${sizingMethod === 'hydraulic' || (governingMethod.includes('Hydraulic') && sizingMethod !== 'california') ? 'highlight' : ''}`}>
            <h3>Hydraulic Calculation</h3>
            <p className="method-size">{hydraulicCalculationSize} mm</p>
            <p className="method-details">Design Discharge: {designDischarge} m³/s</p>
            <p className="method-note">
              {sizingMethod === 'hydraulic' ? 
                "Manning's equation with slope and roughness parameters." : 
                hydraulicCalculationSize > 2000 ? 
                  "Warning: Even the largest standard size (2000mm) may not meet criteria. Consider multiple culverts or alternative designs." :
                  "Hydraulic check using Manning's equation."
              }
            </p>
            {sizingMethod === 'hydraulic' && (
              <div className="method-status selected">✓ SELECTED METHOD</div>
            )}
          </div>

          {sizingMethod === 'comparison' && (
            <div className="method-box highlight comparison-box">
              <h3>Method Comparison Result</h3>
              <p className="method-size">
                {Math.max(climateFactorsApplied ? withClimateSize : baseCaliforniaSize, hydraulicCalculationSize)} mm
              </p>
              <p className="method-details">
                Larger of: California ({climateFactorsApplied ? withClimateSize : baseCaliforniaSize}mm) vs Hydraulic ({hydraulicCalculationSize}mm)
              </p>
              <p className="method-note">
                Using the larger of both methods for conservative design.
                {climateFactorsApplied && ` Climate factor of ${climateFactor.toFixed(2)} applied to California Method.`}
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
              <td>Width: {avgWidth} m, Depth: {avgDepth} m</td>
              <td>{baseCaliforniaSize} mm</td>
              <td>{sizingMethod === 'california' && !climateFactorsApplied ? '✓ Selected' : 'Base Calculation'}</td>
            </tr>
            {climateFactorsApplied && (
              <tr className={sizingMethod === 'california' ? 'selected-row climate-adjusted' : 'climate-adjusted'}>
                <td>California + Climate</td>
                <td>Area × {climateFactor.toFixed(2)} = {(parseFloat(endArea) * climateFactor).toFixed(2)} m²</td>
                <td>{withClimateSize} mm</td>
                <td>{sizingMethod === 'california' ? '✓ Selected (Climate)' : 'Climate Reference'}</td>
              </tr>
            )}
            <tr>
              <td>Cross-Section</td>
              <td>Area: {bankfullArea} m² × 3 = {endArea} m²</td>
              <td>{baseCaliforniaSize} mm</td>
              <td>California Method</td>
            </tr>
            {(sizingMethod === 'hydraulic' || sizingMethod === 'comparison') && (
              <tr className={sizingMethod === 'hydraulic' ? 'selected-row' : ''}>
                <td>Hydraulic</td>
                <td>Discharge: {designDischarge} m³/s, HW/D ≤ {hwdCriterion.split('≤')[1]?.trim() || '0.8'}</td>
                <td>{hydraulicCalculationSize} mm</td>
                <td>{sizingMethod === 'hydraulic' ? '✓ Selected' : 'Comparison'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="measurements-section">
        <h2 className="green-heading">Stream Measurements</h2>
        
        <table className="measurements-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Top (m)</th>
              <th>Bottom (m)</th>
              <th>Depth (m)</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map(measurement => (
              <tr key={measurement.id}>
                <td>{measurement.id}</td>
                <td>{measurement.top}</td>
                <td>{measurement.bottom}</td>
                <td>{measurement.depth}</td>
              </tr>
            ))}
            <tr className="average-row">
              <td>Avg</td>
              <td>{avgWidth}</td>
              <td>{avgBottom}</td>
              <td>{avgDepth}</td>
            </tr>
          </tbody>
        </table>

        <div className="measurements-summary">
          <div className="measurement-item">
            <span className="label">Average Width:</span>
            <span className="value">{avgWidth} m</span>
          </div>
          <div className="measurement-item">
            <span className="label">Bankfull Area:</span>
            <span className="value">{bankfullArea} m²</span>
          </div>
          <div className="measurement-item">
            <span className="label">End Area (3×):</span>
            <span className="value">{endArea} m²</span>
          </div>
          {climateFactorsApplied && (
            <div className="measurement-item climate-adjusted">
              <span className="label">Climate-Adjusted Area:</span>
              <span className="value">{(parseFloat(endArea) * climateFactor).toFixed(2)} m²</span>
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
              The California Method (End Area Design Aid) uses the average stream width and depth to determine the appropriate culvert size based on area. This method uses average width × average depth × 3 to result in the end opening area of the culvert.
              {climateFactorsApplied && ` Climate change factors are applied by multiplying the required area by ${climateFactor.toFixed(2)} to account for increased precipitation intensity and flow in ${climateFactors?.planningHorizon || '2050'}.`}
            </p>

            <div className="formula-box">
              <p className="formula">
                {climateFactorsApplied ? 
                  `Climate-Adjusted Area = ((W₁ + W₂) ÷ 2) × D × 3 × F_CC` :
                  `End Area = ((W₁ + W₂) ÷ 2) × D × 3`
                }
              </p>
              <p className="formula-legend">
                W₁ = Average Top Width, W₂ = Average Bottom Width, D = Average Depth
                {climateFactorsApplied && `, F_CC = Climate Change Factor (${climateFactor.toFixed(2)})`}
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

            <p className="diagram-caption">Cross-Sectional Area Diagram {climateFactorsApplied ? '(Climate-Adjusted)' : ''}</p>
          </>
        )}

        {sizingMethod === 'hydraulic' && (
          <>
            <p>
              The Hydraulic Method uses Manning's equation to calculate the required culvert size based on flow capacity, channel slope, and roughness coefficients. This method ensures the culvert can handle the design discharge while maintaining acceptable headwater levels.
              {climateFactorsApplied && ` Climate change factors increase the design discharge by ${((climateFactor - 1) * 100).toFixed(0)}% to account for future storm intensification.`}
            </p>

            <div className="formula-box">
              <p className="formula">Q = (1/n) × A × R^(2/3) × S^(1/2)</p>
              <p className="formula-legend">Q = Flow, n = Manning's roughness, A = Area, R = Hydraulic radius, S = Slope</p>
              {climateFactorsApplied && (
                <p className="formula-legend">Climate-adjusted Q = Base Q × {climateFactor.toFixed(2)}</p>
              )}
            </div>

            <p className="diagram-caption">Manning's Equation Application {climateFactorsApplied ? '(Climate-Adjusted Flow)' : ''}</p>
          </>
        )}

        {sizingMethod === 'comparison' && (
          <>
            <p>
              The Method Comparison approach calculates culvert sizes using both the California Method and Hydraulic calculations, then recommends the larger of the two sizes to ensure adequate capacity under all conditions.
              {climateFactorsApplied && ` Climate change factors of ${climateFactor.toFixed(2)} are applied to both methods for conservative future design.`}
            </p>

            <div className="formula-box">
              <p className="formula">
                Final Size = MAX(California Method Size, Hydraulic Method Size)
                {climateFactorsApplied && ` × Climate Factor`}
              </p>
              <p className="formula-legend">Conservative approach using the most restrictive requirement</p>
            </div>

            <p className="diagram-caption">Comparative Sizing Analysis {climateFactorsApplied ? '(Climate-Adjusted)' : ''}</p>
          </>
        )}
      </section>
    </div>
  );
};

export default CulvertResults;