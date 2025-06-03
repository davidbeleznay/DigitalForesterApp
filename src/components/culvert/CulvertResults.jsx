import React from 'react';
import './CulvertResults.css';

const CulvertResults = ({ results, formValues, optionalAssessments, climateFactors }) => {
  // Extract data from results object - FIXED PROP NAME
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

  // Create measurements array from form data (simplified)
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

      {/* Simplified results display for basic functionality */}
      <section className="calculation-details-section">
        <h2 className="green-heading">Method Summary</h2>
        
        <div className="method-summary">
          <p><strong>California Method:</strong> {baseCaliforniaSize} mm</p>
          {climateFactorsApplied && (
            <p><strong>With Climate Factor:</strong> {withClimateSize} mm</p>
          )}
          {debrisAssessmentApplied && (
            <p><strong>With Debris Factor:</strong> {withDebrisSize} mm</p>
          )}
          <p><strong>Hydraulic Method:</strong> {hydraulicSize} mm</p>
          <p><strong>Final Recommendation:</strong> {finalSize} mm</p>
        </div>

        <div className="measurements-summary">
          <h3>Stream Measurements</h3>
          <p>Width: {avgWidth.toFixed(2)} m, Depth: {avgDepth.toFixed(2)} m</p>
          <p>Stream Area: {bankfullArea.toFixed(2)} m²</p>
          <p>Required Area: {endArea} m²</p>
          {designDischarge > 0 && <p>Design Discharge: {designDischarge} m³/s</p>}
        </div>

        {notes && (
          <div className="notes-section">
            <h4>Notes</h4>
            <p>{notes}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CulvertResults;