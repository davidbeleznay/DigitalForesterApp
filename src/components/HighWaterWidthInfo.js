import React from 'react';
import { getHighWaterWidthDescription } from '../utils/CulvertCalculator';

const HighWaterWidthInfo = () => {
  // Render a detailed help card about high water width measurement
  return (
    <div className="high-water-info">
      <div className="info-header">
        <h3>How to Measure High Water Width</h3>
        <div className="info-icon">📏</div>
      </div>
      
      <div className="info-content">
        <p>
          The high water width (W₁) is measured at the high water mark, which is the level reached during bankfull flow conditions. This is typically indicated by:
        </p>
        
        <ul className="info-list">
          <li>Rafted debris deposits along the banks</li>
          <li>Recent scour marks from stream flow</li>
          <li>The point below which vegetation is lacking</li>
          <li>A distinct change in bank material or soil</li>
          <li>The level that approximates the mean annual flood (Q₂)</li>
        </ul>
        
        <div className="measurement-steps">
          <p className="step-title">To measure high water width:</p>
          <ol>
            <li>Identify a uniform stream reach with clear high water indicators.</li>
            <li>Select 3-5 representative cross-sections along this reach.</li>
            <li>At each cross-section, stretch a measuring tape straight across from high water mark to high water mark.</li>
            <li>Record each measurement and calculate the average.</li>
          </ol>
        </div>
        
        <div className="important-note">
          <p>
            <strong>Note:</strong> The high water width is the most critical measurement for properly sizing culverts using the California Method, as it directly corresponds to the required hydraulic capacity of the structure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HighWaterWidthInfo;
