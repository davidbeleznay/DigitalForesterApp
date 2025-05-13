// src/utils/CulvertCalculator.js

/**
 * Culvert sizing calculation utility
 * Implements the California Method for culvert sizing
 */

// Calculate bankfull dimensions based on stream measurements
export const calculateBankfullDimensions = (measurements) => {
  // If no measurements provided, return default values
  if (!measurements || measurements.length === 0) {
    return {
      averageWidth: 0,
      averageDepth: 0,
      bankfullArea: 0,
      endArea: 0
    };
  }

  // Calculate average top width, bottom width, and depth
  let totalTopWidth = 0;
  let totalBottomWidth = 0;
  let totalDepth = 0;
  
  measurements.forEach(m => {
    totalTopWidth += parseFloat(m.topWidth || 0);
    totalBottomWidth += parseFloat(m.bottomWidth || 0);
    totalDepth += parseFloat(m.depth || 0);
  });
  
  const count = measurements.length;
  const averageTopWidth = totalTopWidth / count;
  const averageBottomWidth = totalBottomWidth / count;
  const averageDepth = totalDepth / count;
  
  // Calculate average width (average of top and bottom)
  const averageWidth = (averageTopWidth + averageBottomWidth) / 2;
  
  // Calculate bankfull cross-sectional area
  // Using trapezoid formula: A = (a + c) * h / 2
  // where a = top width, c = bottom width, h = depth
  const bankfullArea = (averageTopWidth + averageBottomWidth) * averageDepth / 2;
  
  // Calculate end area using California Method (3 * bankfull area)
  const endArea = bankfullArea * 3;
  
  return {
    averageWidth,
    averageDepth,
    bankfullArea,
    endArea
  };
};

// Determine culvert size from California Method lookup table
export const determineCulvertSizeFromTable = (averageWidth, averageDepth) => {
  // Convert measurements from m to mm if needed
  const width = averageWidth * 1000; // Convert to mm
  const depth = averageDepth * 100; // Convert to cm
  
  // Find the closest match in the lookup table
  // First find the closest width row
  const widthRow = CALIFORNIA_METHOD_TABLE.findIndex(row => 
    row.width >= width
  );
  
  // If no match found, use the largest size
  if (widthRow === -1) {
    return {
      size: 'C100',
      message: 'Stream width exceeds table limits. Consider a bridge or arch culvert.'
    };
  }
  
  // Find the closest depth column
  const depthCol = DEPTH_COLUMNS.findIndex(d => 
    d >= depth
  );
  
  // If no match found, use the largest depth
  const colIndex = depthCol === -1 ? DEPTH_COLUMNS.length - 1 : depthCol;
  
  // Get the recommended culvert size
  const culvertSize = CALIFORNIA_METHOD_TABLE[widthRow].sizes[colIndex];
  
  // Check if it's a C100 (special case)
  if (culvertSize === 'C100') {
    return {
      size: 'C100',
      message: 'Stream size requires a bridge or arch culvert (C100 in table).'
    };
  }
  
  return {
    size: culvertSize,
    message: 'Size determined using California Method Table.'
  };
};

// Calculate culvert size based on bankfull discharge and headwater criterion
export const calculateCulvertSizeFromDischarge = (
  bankfullDischarge, 
  culvertShape = 'circular',
  manningsN = 0.024,
  slope = 0.02,
  maxHwD = 0.8
) => {
  // Apply a safety factor to the discharge (typically 1.5-2x for 50-year event)
  const designDischarge = bankfullDischarge * 1.5;
  
  // Start with smallest standard size and increase until criteria are met
  const standardSizes = STANDARD_CULVERT_SIZES[culvertShape];
  let selectedSize = null;
  let message = '';
  
  for (const size of standardSizes) {
    // Convert size from mm to m
    const diameter = size / 1000;
    
    // Calculate culvert capacity using Manning's equation
    // Q = (1/n) * A * R^(2/3) * S^(1/2)
    // For a circular culvert at full flow:
    // A = π * D²/4
    // R = D/4
    
    // Cross-sectional area
    const area = Math.PI * Math.pow(diameter, 2) / 4;
    
    // Hydraulic radius
    const hydraulicRadius = diameter / 4;
    
    // Calculate discharge capacity using Manning's equation
    const capacity = (1 / manningsN) * area * Math.pow(hydraulicRadius, 2/3) * Math.pow(slope, 1/2);
    
    // Calculate headwater depth to diameter ratio
    // Simplified approach using culvert nomographs approximation
    // HW/D ≈ (Q / (D^2.5 * √S))^0.7
    const hwD = Math.pow(designDischarge / (Math.pow(diameter, 2.5) * Math.sqrt(slope)), 0.7);
    
    // Check if this size meets criteria
    if (capacity >= designDischarge && hwD <= maxHwD) {
      selectedSize = size;
      message = `${size}mm culvert selected based on discharge capacity and headwater criterion (HW/D = ${hwD.toFixed(2)}).`;
      break;
    }
  }
  
  // If no size meets criteria, recommend the largest standard size with a warning
  if (!selectedSize) {
    selectedSize = standardSizes[standardSizes.length - 1];
    message = `Warning: Even the largest standard size (${selectedSize}mm) may not meet criteria. Consider multiple culverts or alternative designs.`;
  }
  
  return {
    size: selectedSize,
    message
  };
};

// Determine final culvert size based on both methods
export const determineOptimalCulvertSize = (
  streamMeasurements,
  slope,
  bankfullDischarge,
  culvertShape = 'circular',
  manningsN = 0.024,
  maxHwD = 0.8
) => {
  // Get dimensions from stream measurements
  const dimensions = calculateBankfullDimensions(streamMeasurements);
  
  // Get size recommendation from California Method table
  const tableResult = determineCulvertSizeFromTable(
    dimensions.averageWidth,
    dimensions.averageDepth
  );
  
  // Get size recommendation from discharge calculation
  const dischargeResult = calculateCulvertSizeFromDischarge(
    bankfullDischarge,
    culvertShape,
    manningsN,
    slope,
    maxHwD
  );
  
  // Parse sizes to numeric values for comparison
  const tableSize = typeof tableResult.size === 'string' 
    ? parseInt(tableResult.size.replace('C', '')) || 0
    : tableResult.size;
    
  const dischargeSize = dischargeResult.size;
  
  // Select the larger of the two methods
  const finalSize = Math.max(tableSize, dischargeSize);
  
  // Determine which method governed the design
  const governingMethod = finalSize === tableSize 
    ? 'California Method Table (3x Bankfull)' 
    : 'Hydraulic Calculation (Manning\'s)';
  
  return {
    bankfullDimensions: dimensions,
    californiaSizing: tableResult,
    hydraulicSizing: dischargeResult,
    finalSize,
    governingMethod,
    message: `Final recommendation: ${finalSize}mm diameter ${culvertShape} culvert based on ${governingMethod}.`
  };
};

// Standard culvert sizes by shape (in mm)
export const STANDARD_CULVERT_SIZES = {
  circular: [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400],
  arch: [450, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000],
  box: [600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600]
};

// Depth columns from the California Method table (in cm)
export const DEPTH_COLUMNS = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50];

// California Method lookup table
// Width is in mm, and sizes are in mm (or "C100" for bridge/arch recommendation)
export const CALIFORNIA_METHOD_TABLE = [
  { width: 100, sizes: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600] },
  { width: 200, sizes: [600, 600, 600, 600, 600, 600, 600, 600, 700, 700] },
  { width: 300, sizes: [600, 600, 600, 600, 600, 700, 700, 700, 800, 800] },
  { width: 400, sizes: [600, 600, 600, 600, 700, 700, 800, 800, 900, 900] },
  { width: 500, sizes: [600, 600, 600, 700, 800, 800, 900, 900, 1000, 1000] },
  { width: 600, sizes: [600, 600, 700, 700, 800, 900, 900, 1000, 1200, 1200] },
  { width: 700, sizes: [600, 600, 700, 800, 800, 900, 1000, 1200, 1200, 1200] },
  { width: 800, sizes: [600, 600, 700, 800, 900, 1000, 1200, 1200, 1400, 1400] },
  { width: 900, sizes: [600, 600, 800, 900, 1000, 1200, 1200, 1400, 1400, 1400] },
  { width: 1000, sizes: [600, 700, 800, 900, 1000, 1200, 1200, 1400, 1400, 1600] },
  { width: 1100, sizes: [600, 700, 800, 900, 1200, 1200, 1400, 1400, 1500, 1600] },
  { width: 1200, sizes: [600, 700, 900, 1000, 1200, 1400, 1400, 1500, 1600, 1800] },
  { width: 1300, sizes: [600, 800, 900, 1000, 1200, 1400, 1400, 1500, 1600, 1800] },
  { width: 1400, sizes: [600, 800, 900, 1200, 1200, 1400, 1500, 1600, 1800, 1800] },
  { width: 1500, sizes: [600, 800, 1000, 1200, 1200, 1400, 1500, 1600, 1800, 1800] },
  { width: 1600, sizes: [600, 800, 1000, 1200, 1400, 1400, 1600, 1800, 1800, 1900] },
  { width: 1700, sizes: [600, 900, 1000, 1200, 1400, 1400, 1600, 1800, 1900, 1900] },
  { width: 1800, sizes: [700, 900, 1000, 1200, 1400, 1500, 1600, 1800, 1900, 'C100'] },
  { width: 1900, sizes: [700, 900, 1200, 1400, 1400, 1500, 1600, 1800, 1900, 'C100'] },
  { width: 2000, sizes: [700, 900, 1200, 1400, 1500, 1600, 1800, 1800, 1900, 'C100'] },
  { width: 2100, sizes: [700, 900, 1200, 1400, 1500, 1600, 1800, 1800, 1900, 'C100'] },
  { width: 2200, sizes: [700, 1000, 1200, 1400, 1500, 1800, 1800, 1900, 'C100', 'C100'] },
  { width: 2300, sizes: [700, 1000, 1200, 1400, 1500, 1800, 1800, 1900, 'C100', 'C100'] },
  { width: 2400, sizes: [700, 1000, 1400, 1400, 1600, 1800, 1800, 'C100', 'C100', 'C100'] },
  { width: 2500, sizes: [700, 1000, 1400, 1400, 1600, 1800, 1900, 'C100', 'C100', 'C100'] },
  { width: 2600, sizes: [800, 1000, 1400, 1400, 1600, 1800, 1900, 'C100', 'C100', 'C100'] },
  { width: 2700, sizes: [800, 1200, 1400, 1500, 1800, 1800, 'C100', 'C100', 'C100', 'C100'] },
  { width: 2800, sizes: [800, 1200, 1400, 1500, 1800, 1800, 'C100', 'C100', 'C100', 'C100'] },
  { width: 2900, sizes: [800, 1200, 1400, 1500, 1800, 1900, 'C100', 'C100', 'C100', 'C100'] },
  { width: 3000, sizes: [800, 1200, 1400, 1600, 1800, 1900, 'C100', 'C100', 'C100', 'C100'] },
  { width: 3100, sizes: [800, 1200, 1400, 1600, 1800, 1900, 'C100', 'C100', 'C100', 'C100'] },
  { width: 3200, sizes: [800, 1200, 1400, 1600, 1800, 1900, 'C100', 'C100', 'C100', 'C100'] },
  { width: 3300, sizes: [800, 1200, 1400, 1600, 1800, 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 3400, sizes: [800, 1200, 1400, 1800, 1900, 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 3500, sizes: [900, 1200, 1500, 1800, 1900, 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 3600, sizes: [900, 1200, 1500, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 3700, sizes: [900, 1200, 1500, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 3800, sizes: [900, 1400, 1500, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 3900, sizes: [900, 1400, 1500, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4000, sizes: [900, 1400, 1600, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4100, sizes: [900, 1400, 1600, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4200, sizes: [900, 1400, 1600, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4300, sizes: [900, 1400, 1600, 1900, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4400, sizes: [1000, 1400, 1600, 1900, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4500, sizes: [1000, 1400, 1600, 1900, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4600, sizes: [1000, 1400, 1800, 1900, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4700, sizes: [1000, 1400, 1800, 1900, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4800, sizes: [1000, 1400, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 4900, sizes: [1000, 1400, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] },
  { width: 5000, sizes: [1000, 1600, 1800, 'C100', 'C100', 'C100', 'C100', 'C100', 'C100', 'C100'] }
];