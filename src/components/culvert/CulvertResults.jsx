import React from 'react';
import './CulvertResults.css';

const CulvertResults = ({ calculationResults }) => {
  const {
    recommendedSize = 2000,
    shape = 'Circular',
    material = 'Corrugated Metal Pipe (CMP)',
    manningsN = 0.024,
    hwdCriterion = 'HW/D ≤ 0.8',
    climateChangeFactor = 1.20,
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
    sizingMethod = 'california' // Default to California Method
  } = calculationResults || {};

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
            {climateChangeFactor && (
              <tr>
                <td>Climate Change Factor:</td>
                <td className="value">{climateChangeFactor}×</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="sizing-method-section">
        <h2 className="green-heading">Sizing Method Comparison</h2>
        
        <div className="method-comparison">
          <div className={`method-box ${sizingMethod === 'california' || governingMethod.includes('California') ? 'highlight' : ''}`}>
            <h3>California Method</h3>
            <p className="method-size">{californiaMethodSize} mm</p>
            <p className="method-details">3× Bankfull Area: {endArea} m²</p>
            <p className="method-note">
              {sizingMethod === 'california' ? 
                "Size determined using California Method Table." : 
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
              <p className="method-size">{Math.max(californiaMethodSize, hydraulicCalculationSize)} mm</p>
              <p className="method-details">
                Larger of: California ({californiaMethodSize}mm) vs Hydraulic ({hydraulicCalculationSize}mm)
              </p>
              <p className="method-note">
                Using the larger of both methods for conservative design.
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
              <td>{californiaMethodSize} mm</td>
              <td>{sizingMethod === 'california' ? '✓ Selected' : 'Reference'}</td>
            </tr>
            <tr>
              <td>Cross-Section</td>
              <td>Area: {bankfullArea} m² × 3 = {endArea} m²</td>
              <td>{californiaMethodSize} mm</td>
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
            </p>

            <div className="formula-box">
              <p className="formula">End Area = ((W₁ + W₂) ÷ 2) × D × 3</p>
              <p className="formula-legend">W₁ = Average Top Width, W₂ = Average Bottom Width, D = Average Depth</p>
            </div>

            <p className="diagram-caption">Cross-Sectional Area Diagram</p>
          </>
        )}

        {sizingMethod === 'hydraulic' && (
          <>
            <p>
              The Hydraulic Method uses Manning's equation to calculate the required culvert size based on flow capacity, channel slope, and roughness coefficients. This method ensures the culvert can handle the design discharge while maintaining acceptable headwater levels.
            </p>

            <div className="formula-box">
              <p className="formula">Q = (1/n) × A × R^(2/3) × S^(1/2)</p>
              <p className="formula-legend">Q = Flow, n = Manning's roughness, A = Area, R = Hydraulic radius, S = Slope</p>
            </div>

            <p className="diagram-caption">Manning's Equation Application</p>
          </>
        )}

        {sizingMethod === 'comparison' && (
          <>
            <p>
              The Method Comparison approach calculates culvert sizes using both the California Method and Hydraulic calculations, then recommends the larger of the two sizes to ensure adequate capacity under all conditions.
            </p>

            <div className="formula-box">
              <p className="formula">Final Size = MAX(California Method Size, Hydraulic Method Size)</p>
              <p className="formula-legend">Conservative approach using the most restrictive requirement</p>
            </div>

            <p className="diagram-caption">Comparative Sizing Analysis</p>
          </>
        )}
      </section>
    </div>
  );
};

export default CulvertResults;