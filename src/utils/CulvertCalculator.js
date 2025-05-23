/**
 * CulvertCalculator.js
 * Utility for calculating culvert dimensions based on watershed characteristics
 * and fish passage requirements using the California Method.
 */

// Standard pipe sizes in mm
const STANDARD_PIPE_SIZES = [450, 600, 700, 750, 800, 900, 1000, 1200, 1400, 1500, 1600, 1800, 2100, 2400, 3000, 3600];

/**
 * Calculate culvert size based on the California Method using average stream width, depth, and slope
 * @param {Object} params - Calculation parameters
 * @param {number} params.topWidth - Top width at high water mark in meters
 * @param {number} params.bottomWidth - Bottom width of stream in meters (optional)
 * @param {number} params.avgStreamDepth - Average bankfull depth in meters
 * @param {number} params.slopePercent - Channel slope in percent
 * @param {number} params.maxHwdRatio - Maximum headwater-to-diameter ratio (default 0.8)
 * @param {boolean} params.fishPassage - Whether fish passage is required
 * @param {number} params.climateChangeFactor - Climate change multiplication factor (default 1.2)
 * @returns {Object} Calculation results including recommended pipe size
 */
export const calculateCulvert = (params) => {
  const {
    topWidth,
    bottomWidth = topWidth * 0.7, // Default to 70% of top width if not provided
    avgStreamDepth,
    slopePercent,
    streamRoughness = 0.04,
    pipeRoughness = 0.024,
    maxHwdRatio = 0.8, // Conservative HW/D ratio (default 0.8)
    fishPassage = false,
    climateChangeFactor = 1.2 // Default climate change factor (20% increase)
  } = params;

  // Convert slope percent to decimal
  const slope = slopePercent / 100;
  
  // Step 1: Look up recommended culvert size from California Method table
  // This is now the primary sizing method
  const recommendedSizeMm = lookupCulvertSizeFromTable(topWidth, avgStreamDepth);
  
  // Step 2: Calculate area based on trapezoidal shape as a reference
  // Area = (topWidth + bottomWidth) * depth / 2
  const streamArea = ((topWidth + bottomWidth) * avgStreamDepth) / 2;
  
  // Step 3: Calculate required culvert area using California Method formula for comparison
  // area = width x depth x 3
  const californiaArea = topWidth * avgStreamDepth * 3;
  
  // Step 4: Calculate required diameter based on the area (A = πr²)
  const requiredDiameterM = 2 * Math.sqrt(californiaArea / Math.PI);
  const requiredDiameterMm = requiredDiameterM * 1000;
  
  // Step 5: Alternative sizing based on bankfull width (1.2 x width)
  const altSpanRequired = 1.2 * topWidth;
  const altSpanRequiredMm = altSpanRequired * 1000;
  
  // Step 6: Select the appropriate pipe size from the lookup table
  let californiaRecommendedSize = recommendedSizeMm;
  
  // Step 7: If fish passage is required, check if we need to increase size
  if (fishPassage) {
    // For fish passage, larger pipes may be needed
    if (topWidth < 1.0) {
      const fishPassageDiameterMm = topWidth * 1500; // 1.5x converted to mm
      if (fishPassageDiameterMm > californiaRecommendedSize) {
        const largerSize = STANDARD_PIPE_SIZES.find(size => size >= fishPassageDiameterMm);
        if (largerSize) californiaRecommendedSize = largerSize;
      }
    }
  }
  
  // Step 8: Calculate embedding depth (20% of pipe diameter if fish passage is required)
  const embedDepth = fishPassage ? 0.2 * (californiaRecommendedSize / 1000) : 0;
  
  // Step 9: Calculate bankfull flow using Manning's equation
  // For trapezoidal channels
  const wettedPerimeter = bottomWidth + 2 * avgStreamDepth * Math.sqrt(1 + Math.pow((topWidth - bottomWidth) / (2 * avgStreamDepth), 2));
  const hydraulicRadius = streamArea / wettedPerimeter;
  
  // Calculate base flow
  const baseFlow = (1 / streamRoughness) * 
                   streamArea * 
                   Math.pow(hydraulicRadius, 2/3) * 
                   Math.pow(slope, 0.5);
  
  // Apply climate change factor to flow
  const bankfullFlow = baseFlow * climateChangeFactor;
  
  // Step 10: Calculate hydraulic sizing using Manning's equation
  // Find the smallest pipe that can handle the design flow with the specified HW/D ratio
  let hydraulicSize = 0;
  let pipeCapacity = 0;
  let headwaterRatio = 0;
  
  // Try each standard pipe size, starting from the smallest
  for (const pipeSize of STANDARD_PIPE_SIZES) {
    const pipeDiameter = pipeSize / 1000; // Convert to meters
    const area = Math.PI * Math.pow(pipeDiameter, 2) / 4;
    const hydraulicRadius = pipeDiameter / 4;
    
    // Calculate capacity with Manning's equation
    const capacity = (1 / pipeRoughness) * 
                     area * 
                     Math.pow(hydraulicRadius, 2/3) * 
                     Math.pow(slope, 0.5);
    
    // Calculate headwater ratio (simplified approximation)
    const hw_ratio = 0.9 * Math.pow(bankfullFlow / (Math.PI * Math.pow(pipeDiameter/2, 2) * Math.sqrt(2 * 9.81 * pipeDiameter)), 0.7);
    
    // Check if this pipe size meets both capacity and headwater criteria
    if (capacity >= bankfullFlow && hw_ratio <= maxHwdRatio) {
      hydraulicSize = pipeSize;
      pipeCapacity = capacity;
      headwaterRatio = hw_ratio;
      break;
    }
    
    // If we've reached the largest pipe size, use it even if it doesn't meet criteria
    if (pipeSize === STANDARD_PIPE_SIZES[STANDARD_PIPE_SIZES.length - 1]) {
      hydraulicSize = pipeSize;
      pipeCapacity = capacity;
      headwaterRatio = hw_ratio;
    }
  }
  
  // Step 11: Determine final size and governing method
  const finalSize = Math.max(californiaRecommendedSize, hydraulicSize);
  const governingMethod = finalSize === hydraulicSize && hydraulicSize > californiaRecommendedSize ? 
    "Hydraulic Calculation (Manning's)" : "California Method";
  
  // Step 12: Check capacity and headwater ratio for the final selected size
  const finalPipeDiameter = finalSize / 1000; // Convert to meters
  const finalArea = Math.PI * Math.pow(finalPipeDiameter, 2) / 4;
  const finalHydraulicRadius = finalPipeDiameter / 4;
  
  const finalCapacity = (1 / pipeRoughness) * 
                        finalArea * 
                        Math.pow(finalHydraulicRadius, 2/3) * 
                        Math.pow(slope, 0.5);
  
  const finalHeadwaterRatio = 0.9 * Math.pow(bankfullFlow / (Math.PI * Math.pow(finalPipeDiameter/2, 2) * Math.sqrt(2 * 9.81 * finalPipeDiameter)), 0.7);
  
  const capacityCheck = finalCapacity >= bankfullFlow;
  const headwaterCheck = finalHeadwaterRatio <= maxHwdRatio;
  
  // Step 13: Compare the California Method result with hydraulic check
  let sizingComparison = "";
  
  if (hydraulicSize > californiaRecommendedSize) {
    sizingComparison = "The hydraulic check suggests a larger pipe size than the California Method table.";
  } else if (requiredDiameterMm > recommendedSizeMm) {
    sizingComparison = "The California Method formula suggests a larger size than the table lookup.";
  } else if (altSpanRequiredMm > recommendedSizeMm) {
    sizingComparison = "The width-based sizing suggests a larger size than the table lookup.";
  } else {
    sizingComparison = "All sizing methods confirm the selected pipe size is appropriate.";
  }

  return {
    topWidth: topWidth.toFixed(2),
    bottomWidth: bottomWidth.toFixed(2),
    streamArea: streamArea.toFixed(2),
    streamShape: Math.abs(topWidth - bottomWidth) < 0.1 ? "Rectangular" : "Trapezoidal",
    incisionRatio: (topWidth / bottomWidth).toFixed(2),
    tableRecommendedSize: recommendedSizeMm,
    californiaSize: californiaRecommendedSize,
    requiredCulvertArea: californiaArea.toFixed(2),
    requiredDiameterM: requiredDiameterM.toFixed(2),
    requiredDiameterMm: Math.round(requiredDiameterMm),
    altSpanRequiredM: altSpanRequired.toFixed(2),
    altSpanRequiredMm: Math.round(altSpanRequiredMm),
    hydraulicSize: hydraulicSize,
    finalSize: finalSize,
    selectedPipeSizeM: (finalSize / 1000).toFixed(2),
    embedDepth: embedDepth.toFixed(2),
    baseFlow: baseFlow.toFixed(2),
    bankfullFlow: bankfullFlow.toFixed(2),
    climateChangeFactor: climateChangeFactor.toFixed(2),
    pipeCapacity: finalCapacity.toFixed(2),
    hydraulicCheck: capacityCheck && headwaterCheck,
    capacityCheck,
    headwaterCheck,
    headwaterRatio: finalHeadwaterRatio.toFixed(2),
    maxHwdRatio: maxHwdRatio.toFixed(2),
    fishPassage,
    governingMethod,
    sizingComparison,
    notes: fishPassage ? 
      "Fish passage requirements applied with 20% embedded culvert." : 
      "California Method table lookup with trapezoidal channel geometry."
  };
};

/**
 * Look up recommended culvert size from the California Method table
 * @param {number} width - Stream width in meters
 * @param {number} depth - Stream depth in meters
 * @returns {number} Recommended culvert size in mm
 */
export const lookupCulvertSizeFromTable = (width, depth) => {
  // Comprehensive lookup table based on the California Method table for culvert sizing
  // Values are in mm for culvert diameter
  const sizingTable = {
    // Width thresholds in meters as keys
    0.3: {
      0.1: 450, 0.2: 450, 0.3: 600, 0.4: 600, 0.5: 700, 0.6: 750,
      0.7: 900, 0.8: 900, 0.9: 1000, 1.0: 1000
    },
    0.6: {
      0.1: 450, 0.2: 600, 0.3: 600, 0.4: 700, 0.5: 800, 0.6: 900,
      0.7: 1000, 0.8: 1000, 0.9: 1200, 1.0: 1200
    },
    0.9: {
      0.1: 450, 0.2: 600, 0.3: 700, 0.4: 800, 0.5: 900, 0.6: 1000,
      0.7: 1200, 0.8: 1200, 0.9: 1400, 1.0: 1400
    },
    1.2: {
      0.1: 450, 0.2: 600, 0.3: 700, 0.4: 900, 0.5: 1000, 0.6: 1200,
      0.7: 1400, 0.8: 1400, 0.9: 1500, 1.0: 1500
    },
    1.5: {
      0.1: 600, 0.2: 700, 0.3: 800, 0.4: 1000, 0.5: 1200, 0.6: 1400,
      0.7: 1500, 0.8: 1500, 0.9: 1800, 1.0: 1800
    },
    1.8: {
      0.1: 600, 0.2: 700, 0.3: 900, 0.4: 1000, 0.5: 1200, 0.6: 1500,
      0.7: 1800, 0.8: 1800, 0.9: 2100, 1.0: 2100
    },
    2.1: {
      0.1: 700, 0.2: 800, 0.3: 1000, 0.4: 1200, 0.5: 1400, 0.6: 1600,
      0.7: 1800, 0.8: 2100, 0.9: 2400, 1.0: 2400
    },
    2.4: {
      0.1: 700, 0.2: 900, 0.3: 1000, 0.4: 1200, 0.5: 1500, 0.6: 1800,
      0.7: 2100, 0.8: 2400, 0.9: 2400, 1.0: 3000
    },
    2.7: {
      0.1: 800, 0.2: 900, 0.3: 1200, 0.4: 1400, 0.5: 1600, 0.6: 1800,
      0.7: 2100, 0.8: 2400, 0.9: 3000, 1.0: 3000
    },
    3.0: {
      0.1: 800, 0.2: 1000, 0.3: 1200, 0.4: 1400, 0.5: 1600, 0.6: 2100,
      0.7: 2400, 0.8: 2400, 0.9: 3000, 1.0: 3000
    },
    3.5: {
      0.1: 900, 0.2: 1000, 0.3: 1400, 0.4: 1600, 0.5: 1800, 0.6: 2100,
      0.7: 2400, 0.8: 3000, 0.9: 3000, 1.0: 3600
    },
    4.0: {
      0.1: 900, 0.2: 1200, 0.3: 1400, 0.4: 1800, 0.5: 2100, 0.6: 2400,
      0.7: 3000, 0.8: 3000, 0.9: 3600, 1.0: 3600
    },
    4.5: {
      0.1: 1000, 0.2: 1200, 0.3: 1500, 0.4: 1800, 0.5: 2100, 0.6: 2400,
      0.7: 3000, 0.8: 3600, 0.9: 3600, 1.0: 3600
    },
    5.0: {
      0.1: 1000, 0.2: 1400, 0.3: 1800, 0.4: 2100, 0.5: 2400, 0.6: 3000,
      0.7: 3600, 0.8: 3600, 0.9: 3600, 1.0: 3600
    }
  };

  // Find the closest width threshold that's <= the given width
  const widthThresholds = Object.keys(sizingTable).map(Number).sort((a, b) => a - b);
  
  // If width exceeds the max table width, use the largest width threshold
  if (width > widthThresholds[widthThresholds.length - 1]) {
    width = widthThresholds[widthThresholds.length - 1];
  }
  
  // Find appropriate width key in the table
  let widthKey = null;
  for (let i = 0; i < widthThresholds.length; i++) {
    if (width <= widthThresholds[i]) {
      widthKey = widthThresholds[i];
      break;
    }
  }
  
  // If no suitable width threshold found, use the largest
  if (!widthKey) {
    widthKey = widthThresholds[widthThresholds.length - 1];
  }
  
  // Find appropriate depth key in the table
  const depthThresholds = Object.keys(sizingTable[widthKey]).map(Number).sort((a, b) => a - b);
  
  // If depth exceeds the max table depth, use the largest depth threshold
  if (depth > depthThresholds[depthThresholds.length - 1]) {
    depth = depthThresholds[depthThresholds.length - 1];
  }
  
  // Find the closest depth threshold that's >= the given depth
  let depthKey = null;
  for (let i = 0; i < depthThresholds.length; i++) {
    if (depth <= depthThresholds[i]) {
      depthKey = depthThresholds[i];
      break;
    }
  }
  
  // If no suitable depth threshold found, use the largest
  if (!depthKey) {
    depthKey = depthThresholds[depthThresholds.length - 1];
  }

  // Return the recommended culvert size
  return sizingTable[widthKey][depthKey];
};

/**
 * Calculate pipe capacity using Manning's equation
 * @param {number} diameter - Pipe diameter in meters
 * @param {number} roughness - Manning's n for pipe
 * @param {number} slope - Channel slope as decimal
 * @returns {number} Flow capacity in cubic meters per second
 */
const calculatePipeCapacity = (diameter, roughness, slope) => {
  const area = Math.PI * Math.pow(diameter, 2) / 4;
  const hydraulicRadius = diameter / 4;
  
  return (1 / roughness) * 
         area * 
         Math.pow(hydraulicRadius, 2/3) * 
         Math.pow(slope, 0.5);
};

/**
 * Get a list of standard pipe sizes
 * @returns {Array} List of standard pipe sizes in mm
 */
export const getStandardPipeSizes = () => {
  return STANDARD_PIPE_SIZES;
};

/**
 * Get the Manning's roughness coefficient for different materials
 * @returns {Object} Object with material types and roughness values
 */
export const getRoughnessCoefficients = () => {
  return {
    stream: {
      gravel: 0.035,
      cobble: 0.045,
      boulder: 0.05,
      mixed: 0.04
    },
    pipe: {
      corrugatedSteel: 0.024,
      smoothHDPE: 0.012,
      concrete: 0.013
    }
  };
};

/**
 * Get description for high water width measurement
 * @returns {string} Detailed description of how to identify and measure high water width
 */
export const getHighWaterWidthDescription = () => {
  return `
    The high water width (W₁) is measured at the high water mark, which is the level reached during bankfull flow conditions. This is typically indicated by:

    - Rafted debris deposits along the banks
    - Recent scour marks from stream flow
    - The point below which vegetation is lacking
    - A distinct change in bank material or soil
    - The level that approximates the mean annual flood (Q₂)

    Measure the high water width at 3-5 representative cross-sections along a uniform stream reach. Stretch a measuring tape straight across from high water mark to high water mark on each bank. Record and average these measurements.

    The high water width is the most critical measurement for properly sizing culverts using the California Method, as it directly corresponds to the required hydraulic capacity of the structure.
  `;
};
