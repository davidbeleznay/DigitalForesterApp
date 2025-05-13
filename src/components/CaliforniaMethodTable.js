import React from 'react';

const CaliforniaMethodTable = () => {
  // Table data for the California Method sizing table
  const widthThresholds = [0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0];
  const depthThresholds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  
  // Culvert sizes in mm for the table
  const culvertSizes = {
    0.3: { 0.1: 450, 0.2: 450, 0.3: 600, 0.4: 600, 0.5: 700, 0.6: 750 },
    0.6: { 0.1: 450, 0.2: 600, 0.3: 600, 0.4: 700, 0.5: 800, 0.6: 900 },
    0.9: { 0.1: 450, 0.2: 600, 0.3: 700, 0.4: 800, 0.5: 900, 0.6: 1000 },
    1.2: { 0.1: 450, 0.2: 600, 0.3: 700, 0.4: 900, 0.5: 1000, 0.6: 1200 },
    1.5: { 0.1: 600, 0.2: 700, 0.3: 800, 0.4: 1000, 0.5: 1200, 0.6: 1400 },
    1.8: { 0.1: 600, 0.2: 700, 0.3: 900, 0.4: 1000, 0.5: 1200, 0.6: 1500 },
    2.1: { 0.1: 700, 0.2: 800, 0.3: 1000, 0.4: 1200, 0.5: 1400, 0.6: 1600 },
    2.4: { 0.1: 700, 0.2: 900, 0.3: 1000, 0.4: 1200, 0.5: 1500, 0.6: 1800 },
    2.7: { 0.1: 800, 0.2: 900, 0.3: 1200, 0.4: 1400, 0.5: 1600, 0.6: 1800 },
    3.0: { 0.1: 800, 0.2: 1000, 0.3: 1200, 0.4: 1400, 0.5: 1600, 0.6: 2100 }
  };
  
  return (
    <div className="california-method-container">
      <h3>California Method Culvert Sizing Table</h3>
      <p className="california-description">
        The California Method determines culvert size based on the high water width (W₁) and depth (D). 
        The table below shows recommended culvert sizes in millimeters for non-fish streams.
      </p>
      
      <div className="california-table-container">
        <table className="california-table">
          <thead>
            <tr className="table-header-row">
              <th>Average Stream<br />Width (m)</th>
              {depthThresholds.map(depth => (
                <th key={`depth-${depth}`}>
                  Average Depth<br />{depth} m
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {widthThresholds.map(width => (
              <tr key={`width-${width}`}>
                <td className="table-header-col">{width}</td>
                {depthThresholds.map(depth => (
                  <td key={`${width}-${depth}`}>
                    {culvertSizes[width][depth]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="table-note">
        Note: For fish-bearing streams, culverts should be embedded at least 20% of their diameter below the stream bed 
        and may need to be sized up to accommodate fish passage requirements.
      </p>
      
      <div className="california-explanation">
        <p>
          The California Method is a well-established approach for sizing culverts on forest roads. It takes into account 
          the high water width and depth to determine a culvert size that can adequately handle bankfull flow conditions 
          while providing room for debris passage.
        </p>
        <p>
          For channels wider than 3.0 meters or deeper than 0.6 meters, consider using a bridge structure or consulting 
          with a qualified engineer for a custom design.
        </p>
        <p>
          The hydraulic capacity check serves as a secondary verification that the selected culvert size can pass the 
          expected flow with an appropriate headwater-to-diameter ratio.
        </p>
      </div>
    </div>
  );
};

export default CaliforniaMethodTable;
