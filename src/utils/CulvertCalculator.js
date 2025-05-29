/**
 * CulvertCalculator.js
 * Utility for calculating culvert dimensions based on watershed characteristics
 * and fish passage requirements using the California Method with climate change considerations.
 */

// Standard pipe sizes in mm
const STANDARD_PIPE_SIZES = [450, 600, 700, 750, 800, 900, 1000, 1200, 1400, 1500, 1600, 1800, 2100, 2400, 3000, 3600];

/**
 * Get climate change factor based on planning horizon for coastal BC
 * @param {string} planningHorizon - Planning year (2030, 2050, 2080, 2100)
 * @returns {number} Climate change multiplication factor
 */
export const getClimateChangeFactor = (planningHorizon) => {
  const factors = {
    '2030': 1.10, // Present-2030: +10% (PCIC & EGBC suggest for short-term upgrades)
    '2050': 1.20, // Mid-century: +20% (Rule-of-thumb used by EGBC when local data are sparse)
    '2080': 1.30, // Late-century: +30% coast / +25% interior (consistent with hydrologic projections)
    '2100': 1.30  // End-of-century: +30% coast / +25% interior
  };
  
  return factors[planningHorizon] || 1.20; // Default to mid-century if not specified
};

/**
 * Calculate culvert size based on the California Method using average stream width, depth, and slope
 * Enhanced with proper method selection and climate change factors
 * @param {Object} params - Calculation parameters
 * @param {number} params.topWidth - Top width at high water mark in meters
 * @param {number} params.bottomWidth - Bottom width of stream in meters (optional)
 * @param {number} params.avgStreamDepth - Average bankfull depth in meters
 * @param {number} params.slopePercent - Channel slope in percent
 * @param {number} params.maxHwdRatio - Maximum headwater-to-diameter ratio (default 0.8)
 * @param {boolean} params.fishPassage - Whether fish passage is required
 * @param {string} params.sizingMethod - Sizing method: 'california', 'hydraulic', or 'comparison'
 * @param {boolean} params.climateFactorsEnabled - Whether to apply climate factors
 * @param {Object} params.climateFactors - Climate change parameters
 * @returns {Object} Calculation results including recommended pipe size
 */
export const calculateCulvert = (params) => {
  const {
    topWidth,
    bottomWidth = topWidth * 0.7, // Default to 70% of top width if not provided
    avgStreamDepth,
    slopePercent = 2.0,
    streamRoughness = 0.04,
    pipeRoughness = 0.024,
    maxHwdRatio = 0.8, // Conservative HW/D ratio (default 0.8)
    fishPassage = false,
    sizingMethod = 'california', // Default to California Method
    hydraulicCapacityTest = false,
    climateFactorsEnabled = false,
    climateFactors = null,
    debrisAssessmentEnabled = false,
    debrisAssessment = null
  } = params;

  // Convert slope percent to decimal
  const slope = slopePercent ? slopePercent / 100 : 0.02; // Default 2% slope
  
  // Step 1: Calculate base stream characteristics
  const streamArea = ((topWidth + bottomWidth) * avgStreamDepth) / 2;
  
  // Step 2: California Method sizing
  const californiaArea = topWidth * avgStreamDepth * 3;
  const californiaSize = lookupCulvertSizeFromTable(topWidth, avgStreamDepth);
  
  // Step 3: Apply climate change factors if enabled
  let climateChangeFactor = 1.0;
  let climateAdjustedCaliforniaSize = californiaSize;
  
  if (climateFactorsEnabled && climateFactors) {
    climateChangeFactor = getClimateChangeFactor(climateFactors.planningHorizon);
    
    // Apply climate factor to the required area
    const climateAdjustedArea = californiaArea * climateChangeFactor;
    const climateAdjustedDiameter = 2 * Math.sqrt(climateAdjustedArea / Math.PI) * 1000;
    
    // Find the next larger standard size
    climateAdjustedCaliforniaSize = STANDARD_PIPE_SIZES.find(size => size >= climateAdjustedDiameter) || 
                                   STANDARD_PIPE_SIZES[STANDARD_PIPE_SIZES.length - 1];
  }
  
  // Step 4: Hydraulic calculation (if required)
  let hydraulicSize = californiaSize;
  let bankfullFlow = 0;
  let finalCapacity = 0;
  let finalHeadwaterRatio = 0;
  
  if (hydraulicCapacityTest && slopePercent) {
    // Calculate bankfull flow using Manning's equation
    const wettedPerimeter = bottomWidth + 2 * avgStreamDepth * Math.sqrt(1 + Math.pow((topWidth - bottomWidth) / (2 * avgStreamDepth), 2));
    const hydraulicRadius = streamArea / wettedPerimeter;
    
    // Calculate base flow
    const baseFlow = (1 / streamRoughness) * 
                     streamArea * 
                     Math.pow(hydraulicRadius, 2/3) * 
                     Math.pow(slope, 0.5);
    
    // Apply climate change factor to flow if enabled
    bankfullFlow = climateFactorsEnabled ? baseFlow * climateChangeFactor : baseFlow;
    
    // Find appropriate hydraulic size
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
        finalCapacity = capacity;
        finalHeadwaterRatio = hw_ratio;
        break;
      }
      
      // If we've reached the largest pipe size, use it even if it doesn't meet criteria
      if (pipeSize === STANDARD_PIPE_SIZES[STANDARD_PIPE_SIZES.length - 1]) {
        hydraulicSize = pipeSize;
        finalCapacity = capacity;
        finalHeadwaterRatio = hw_ratio;
      }
    }
  }
  
  // Step 5: Determine final size based on method selection
  let finalSize = californiaSize;
  let governingMethod = "California Method";
  
  switch (sizingMethod) {
    case 'california':
      finalSize = climateFactorsEnabled ? climateAdjustedCaliforniaSize : californiaSize;
      governingMethod = climateFactorsEnabled ? 
        `California Method with ${(climateChangeFactor * 100 - 100).toFixed(0)}% Climate Factor` : 
        "California Method";
      break;
      
    case 'hydraulic':
      finalSize = hydraulicSize;
      governingMethod = climateFactorsEnabled ? 
        `Hydraulic Calculation with ${(climateChangeFactor * 100 - 100).toFixed(0)}% Climate Factor` : 
        "Hydraulic Calculation";
      break;
      
    case 'comparison':
      const californiaFinal = climateFactorsEnabled ? climateAdjustedCaliforniaSize : californiaSize;
      finalSize = Math.max(californiaFinal, hydraulicSize);
      governingMethod = finalSize === hydraulicSize ? 
        "Hydraulic Calculation (Conservative)" : 
        "California Method (Conservative)";
      if (climateFactorsEnabled) {
        governingMethod += ` with ${(climateChangeFactor * 100 - 100).toFixed(0)}% Climate Factor`;
      }
      break;
  }
  
  // Step 6: Apply fish passage adjustments
  if (fishPassage) {
    const fishPassageSize = Math.max(finalSize, topWidth * 1200); // 1.2x width converted to mm
    if (fishPassageSize > finalSize) {
      finalSize = STANDARD_PIPE_SIZES.find(size => size >= fishPassageSize) || finalSize;
      governingMethod += " (Fish Passage Required)";
    }
  }
  
  // Step 7: Check if professional review is required
  const requiresProfessional = finalSize >= 2000 || bankfullFlow > 6.0;
  
  // Step 8: Calculate final pipe characteristics
  const finalPipeDiameter = finalSize / 1000;
  const finalArea = Math.PI * Math.pow(finalPipeDiameter, 2) / 4;
  
  if (!hydraulicCapacityTest && slopePercent) {
    // Calculate capacity for display even if not used for sizing
    const finalHydraulicRadius = finalPipeDiameter / 4;
    finalCapacity = (1 / pipeRoughness) * 
                    finalArea * 
                    Math.pow(finalHydraulicRadius, 2/3) * 
                    Math.pow(slope, 0.5);
  }

  return {
    // Basic measurements
    topWidth: topWidth.toFixed(2),
    bottomWidth: bottomWidth.toFixed(2),
    streamArea: streamArea.toFixed(2),
    streamShape: Math.abs(topWidth - bottomWidth) < 0.1 ? "Rectangular" : "Trapezoidal",
    
    // California Method results
    californiaSize: californiaSize,
    californiaArea: californiaArea.toFixed(2),
    
    // Climate-adjusted California Method results
    climateAdjustedCaliforniaSize: climateFactorsEnabled ? climateAdjustedCaliforniaSize : californiaSize,
    climateChangeFactor: climateChangeFactor.toFixed(2),
    
    // Hydraulic results
    hydraulicSize: hydraulicSize,
    bankfullFlow: bankfullFlow.toFixed(2),
    
    // Final results
    finalSize: finalSize,
    selectedPipeSizeM: (finalSize / 1000).toFixed(2),
    governingMethod,
    requiresProfessional,
    
    // Additional parameters
    pipeCapacity: finalCapacity.toFixed(2),
    headwaterRatio: finalHeadwaterRatio.toFixed(2),
    maxHwdRatio: maxHwdRatio.toFixed(2),
    fishPassage,
    
    // Method and climate information
    sizingMethod,
    climateFactorsEnabled,
    appliedClimateFactor: climateChangeFactor,
    
    // Required culvert area for display
    requiredCulvertArea: (climateFactorsEnabled ? californiaArea * climateChangeFactor : californiaArea).toFixed(2),
    
    // Embed depth for fish passage
    embedDepth: fishPassage ? (0.2 * (finalSize / 1000)).toFixed(2) : "0.00",
    
    // Notes
    notes: climateFactorsEnabled ? 
      `California Method with ${climateFactors?.planningHorizon || '2050'} climate projections (${(climateChangeFactor * 100 - 100).toFixed(0)}% increase)` :
      fishPassage ? 
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
 * Get practical climate change slider values for coastal BC
 * @returns {Object} Climate change factors with descriptions
 */
export const getClimateFactorPresets = () => {
  return {
    '2030': {
      factor: 1.10,
      description: 'Present–2030: +10% (PCIC & EGBC suggest for short-term upgrades)',
      label: 'Short-term (2030)'
    },
    '2050': {
      factor: 1.20,
      description: 'Mid-century: +20% (Rule-of-thumb used by EGBC when local data are sparse)',
      label: 'Mid-century (2050)'
    },
    '2080': {
      factor: 1.30,
      description: 'Late-century: +30% coast / +25% interior (Consistent with hydrologic projections)',
      label: 'Late-century (2080)'
    },
    '2100': {
      factor: 1.30,
      description: 'End-of-century: +30% coast / +25% interior',
      label: 'End-of-century (2100)'
    }
  };
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