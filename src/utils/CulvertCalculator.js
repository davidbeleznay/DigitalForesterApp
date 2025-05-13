// src/utils/CulvertCalculator.js

/**
 * Culvert sizing calculation utility
 * Implements the Bankfull Width method with hydraulic checks
 */

// Standard culvert sizes in mm
export const STANDARD_CULVERT_SIZES = {
  circular: [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400],
  arch: [450, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000],
  box: [600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600]
};

// Manning's roughness coefficients
export const MANNINGS_COEFFICIENTS = {
  stream: 0.04, // Default for natural streams (gravel/cobble)
  cmp: 0.024,   // Corrugated metal pipe
  concrete: 0.013, // Concrete
  hdpe: 0.012,  // High-density polyethylene
  pvc: 0.01     // PVC
};

/**
 * Calculate bankfull dimensions based on stream measurements
 * @param {Object} averages - Object containing averageTopWidth, averageBottomWidth, and averageDepth
 * @returns {Object} - Object with bankfull dimensions and areas
 */
export const calculateBankfullDimensions = (averages) => {
  // Default values if no averages provided
  if (!averages) {
    return {
      bankfullWidth: 0,
      bankfullDepth: 0,
      bankfullArea: 0,
      bankfullPerimeter: 0,
      bankfullHydraulicRadius: 0,
      requiredSpan: 0
    };
  }

  const { topWidth, bottomWidth, depth } = averages;
  
  // Calculate bankfull width (average of top and bottom widths)
  const bankfullWidth = (parseFloat(topWidth) + parseFloat(bottomWidth)) / 2;
  
  // Calculate bankfull depth
  const bankfullDepth = parseFloat(depth);
  
  // Calculate bankfull cross-sectional area (trapezoid formula: A = (a + c) * h / 2)
  const bankfullArea = (parseFloat(topWidth) + parseFloat(bottomWidth)) * bankfullDepth / 2;
  
  // Calculate wetted perimeter (approximate as width + 2*depth)
  const bankfullPerimeter = bankfullWidth + 2 * bankfullDepth;
  
  // Calculate hydraulic radius (area / wetted perimeter)
  const bankfullHydraulicRadius = bankfullArea / bankfullPerimeter;
  
  // Calculate required span using the 1.2 × bankfull width rule
  const requiredSpan = bankfullWidth * 1.2;
  
  return {
    bankfullWidth,
    bankfullDepth,
    bankfullArea,
    bankfullPerimeter,
    bankfullHydraulicRadius,
    requiredSpan
  };
};

/**
 * Calculate bankfull discharge using Manning's equation
 * @param {Object} dimensions - Bankfull dimensions from calculateBankfullDimensions
 * @param {Number} slope - Stream slope in m/m
 * @param {Number} manningsN - Manning's roughness coefficient for the stream
 * @returns {Number} - Bankfull discharge in m³/s
 */
export const calculateBankfullDischarge = (dimensions, slope, manningsN = MANNINGS_COEFFICIENTS.stream) => {
  const { bankfullArea, bankfullHydraulicRadius } = dimensions;
  
  // Manning's equation: Q = (1/n) * A * R^(2/3) * S^(1/2)
  const discharge = (1 / manningsN) * bankfullArea * Math.pow(bankfullHydraulicRadius, 2/3) * Math.pow(slope, 1/2);
  
  return discharge;
};

/**
 * Calculate culvert capacity using Manning's equation for full flow
 * @param {Number} diameter - Culvert diameter in mm
 * @param {String} shape - Culvert shape (circular, arch, box)
 * @param {Number} slope - Stream slope in m/m
 * @param {Number} manningsN - Manning's roughness coefficient for the culvert
 * @returns {Number} - Culvert capacity in m³/s
 */
export const calculateCulvertCapacity = (diameter, shape, slope, manningsN) => {
  // Convert diameter from mm to m
  const culvertDiameter = diameter / 1000;
  
  let area, hydraulicRadius;
  
  // Calculate area and hydraulic radius based on shape
  if (shape === 'circular') {
    // Circular culvert: A = π * D²/4, R = D/4
    area = Math.PI * Math.pow(culvertDiameter, 2) / 4;
    hydraulicRadius = culvertDiameter / 4;
  } else if (shape === 'box') {
    // Box culvert (assuming square): A = D², R = D/4
    area = Math.pow(culvertDiameter, 2);
    hydraulicRadius = culvertDiameter / 4;
  } else if (shape === 'arch') {
    // Arch culvert (approximation): A ≈ 0.8 * D², R ≈ 0.3 * D
    area = 0.8 * Math.pow(culvertDiameter, 2);
    hydraulicRadius = 0.3 * culvertDiameter;
  } else {
    // Default to circular if shape is not recognized
    area = Math.PI * Math.pow(culvertDiameter, 2) / 4;
    hydraulicRadius = culvertDiameter / 4;
  }
  
  // Manning's equation: Q = (1/n) * A * R^(2/3) * S^(1/2)
  const capacity = (1 / manningsN) * area * Math.pow(hydraulicRadius, 2/3) * Math.pow(slope, 1/2);
  
  return capacity;
};

/**
 * Size culvert using the Bankfull Width method with hydraulic sanity check
 * @param {Object} averages - Object containing average measurements
 * @param {Number} slope - Stream slope in m/m
 * @param {Boolean} fishPassage - Whether fish passage is required
 * @param {String} culvertShape - Shape of the culvert
 * @param {Number} manningsN - Manning's roughness for the culvert
 * @returns {Object} - Sizing results
 */
export const sizeCulvertByBankfull = (
  averages,
  slope,
  fishPassage = false,
  culvertShape = 'circular',
  manningsN = MANNINGS_COEFFICIENTS.cmp
) => {
  // Calculate bankfull dimensions
  const dimensions = calculateBankfullDimensions(averages);
  
  // Calculate bankfull discharge
  const bankfullDischarge = calculateBankfullDischarge(dimensions, slope);
  
  // Get the standard sizes for the selected shape
  const standardSizes = STANDARD_CULVERT_SIZES[culvertShape] || STANDARD_CULVERT_SIZES.circular;
  
  // Convert required span from m to mm
  const requiredSpanMm = dimensions.requiredSpan * 1000;
  
  // Find the smallest standard size that meets or exceeds the required span
  let selectedSize = null;
  for (const size of standardSizes) {
    if (size >= requiredSpanMm) {
      selectedSize = size;
      break;
    }
  }
  
  // If no size is large enough, use the largest available
  if (!selectedSize) {
    selectedSize = standardSizes[standardSizes.length - 1];
  }
  
  // Check if the selected size passes the hydraulic requirement
  let hydraulicPass = false;
  let upsizedForHydraulics = false;
  
  // Hydraulic check loop - increase size until it passes
  while (!hydraulicPass && selectedSize) {
    // Calculate culvert capacity
    const culvertCapacity = calculateCulvertCapacity(selectedSize, culvertShape, slope, manningsN);
    
    // Check if capacity meets or exceeds bankfull discharge
    if (culvertCapacity >= bankfullDischarge) {
      hydraulicPass = true;
    } else {
      // Find the next larger size
      const currentIndex = standardSizes.indexOf(selectedSize);
      if (currentIndex < standardSizes.length - 1) {
        selectedSize = standardSizes[currentIndex + 1];
        upsizedForHydraulics = true;
      } else {
        // Already at the largest size, can't upsize further
        break;
      }
    }
  }
  
  // Calculate embed depth (20% of culvert diameter) if fish passage is required
  const embedDepth = fishPassage ? (selectedSize / 1000) * 0.2 : 0;
  
  // Calculate headwater to diameter ratio (approximate)
  // Using H/D ≈ (Q / (D^2.5 * √S))^0.7 for circular culverts
  const headwaterRatio = Math.pow(bankfullDischarge / (Math.pow(selectedSize / 1000, 2.5) * Math.sqrt(slope)), 0.7);
  
  // Determine if headwater criterion is met (H/D ≤ 1.5)
  const headwaterPass = headwaterRatio <= 1.5;
  
  // Final capacity after any upsizing
  const finalCapacity = calculateCulvertCapacity(selectedSize, culvertShape, slope, manningsN);
  
  // Return the results
  return {
    bankfullDimensions: dimensions,
    bankfullDischarge,
    selectedSize,
    culvertShape,
    embedDepth,
    hydraulicPass,
    headwaterRatio,
    headwaterPass,
    upsizedForHydraulics,
    finalCapacity,
    spanRuleApplied: true,
    fishPassageApplied: fishPassage,
    message: generateResultMessage(
      selectedSize, 
      embedDepth, 
      hydraulicPass, 
      headwaterPass, 
      upsizedForHydraulics, 
      fishPassage,
      culvertShape
    )
  };
};

/**
 * Generate a human-readable message about the sizing result
 */
const generateResultMessage = (
  size, 
  embedDepth, 
  hydraulicPass, 
  headwaterPass, 
  upsizedForHydraulics, 
  fishPassage,
  culvertShape
) => {
  let message = `Recommended culvert: ${size}mm ${culvertShape}`;
  
  if (fishPassage) {
    message += ` embedded ${(embedDepth).toFixed(2)}m (20%) for fish passage`;
  }
  
  if (upsizedForHydraulics) {
    message += `. Size was increased to ensure hydraulic capacity.`;
  } else {
    message += `. Size meets the 1.2× bankfull width criterion.`;
  }
  
  if (!hydraulicPass) {
    message += ` WARNING: Even the largest standard size may not have sufficient hydraulic capacity.`;
  }
  
  if (!headwaterPass) {
    message += ` WARNING: Headwater may exceed 1.5× culvert height at bankfull flow.`;
  }
  
  return message;
};

/**
 * Main function to determine optimal culvert size
 * Combines the Bankfull Width method with hydraulic checks
 */
export const determineOptimalCulvertSize = (
  measurements,
  slope,
  bankfullDischarge,
  culvertShape = 'circular',
  manningsN = 0.024,
  maxHwD = 0.8,
  fishPassage = false
) => {
  // Calculate averages from measurements
  const averages = {
    topWidth: calculateAverage(measurements.map(m => parseFloat(m.topWidth))),
    bottomWidth: calculateAverage(measurements.map(m => parseFloat(m.bottomWidth))),
    depth: calculateAverage(measurements.map(m => parseFloat(m.depth)))
  };
  
  // Size culvert using the Bankfull Width method
  const result = sizeCulvertByBankfull(
    averages,
    slope,
    fishPassage,
    culvertShape,
    manningsN
  );
  
  return {
    ...result,
    measurements,
    averages,
    slope,
    userProvidedDischarge: bankfullDischarge,
    maxHwD
  };
};

/**
 * Helper function to calculate average of an array of numbers
 */
const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0 || !numbers.some(n => !isNaN(n))) {
    return 0;
  }
  
  const validNumbers = numbers.filter(n => !isNaN(n));
  const sum = validNumbers.reduce((total, num) => total + num, 0);
  return sum / validNumbers.length;
};