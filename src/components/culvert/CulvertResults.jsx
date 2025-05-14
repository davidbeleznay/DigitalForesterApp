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
    governingMethod = 'Hydraulic Calculation (Manning\'s)',
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
    avgDepth = 0.20
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
            <tr>
              <td>Climate Change Factor:</td>
              <td className="value">{climateChangeFactor}×</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sizing-method-section">
        <h2 className="green-heading">Sizing Method Comparison</h2>
        
        <div className="method-comparison">
          <div className="method-box">
            <h3>California Method</h3>
            <p className="method-size">{californiaMethodSize} mm</p>
            <p className="method-details">3× Bankfull Area: {endArea} m²</p>
            <p className="method-note">Size determined using California Method Table.</p>
          </div>
          
          <div className="method-box highlight">
            <h3>Hydraulic Calculation</h3>
            <p className="method-size">{hydraulicCalculationSize} mm</p>
            <p className="method-details">Design Discharge: {designDischarge} m³/s</p>
            <p className="method-note warning">Warning: Even the largest standard size (2000mm) may not meet criteria. Consider multiple culverts or alternative designs.</p>
          </div>
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>California Table</td>
              <td>Width: {avgWidth} m Depth: {avgDepth} m</td>
              <td>{californiaMethodSize} mm</td>
            </tr>
            <tr>
              <td>Cross-Section</td>
              <td>Area: {bankfullArea} m² × 3 = {endArea} m²</td>
              <td>{californiaMethodSize} mm</td>
            </tr>
            <tr>
              <td>Hydraulic</td>
              <td>Discharge: {designDischarge} m³/s HW/D ≤ 0.8</td>
              <td>{hydraulicCalculationSize} mm</td>
            </tr>
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
        <h2 className="green-heading">California Method Explanation</h2>
        
        <p>
          The California Method (End Area Design Aid) uses the average stream width and depth to determine the appropriate culvert size based on area. This method uses average width × average depth × 3 to result in the end opening area of the culvert.
        </p>

        <div className="formula-box">
          <p className="formula">End Area = ((W₁ + W₂) ÷ 2) × D × 3</p>
          <p className="formula-legend">W₁ = Average Top Width, W₂ = Average Bottom Width, D = Average Depth</p>
        </div>

        <p className="diagram-caption">Cross-Sectional Area Diagram</p>
      </section>
    </div>
  );
};

export default CulvertResults;