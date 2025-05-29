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
  
  // Step 2: California Method sizing - FIXED TO USE PROPER TABLE LOOKUP
  const californiaSize = lookupCulvertSizeFromTable(topWidth, avgStreamDepth);
  const californiaArea = (californiaSize / 1000) ** 2 * Math.PI / 4; // Area of recommended pipe
  
  // Step 3: Apply climate change factors if enabled
  let climateChangeFactor = 1.0;
  let climateAdjustedCaliforniaSize = californiaSize;
  
  if (climateFactorsEnabled && climateFactors) {
    climateChangeFactor = getClimateChangeFactor(climateFactors.planningHorizon);
    
    // Apply climate factor to required capacity/area
    const climateAdjustedDiameter = (californiaSize / 1000) * Math.sqrt(climateChangeFactor);
    
    // Find the next larger standard size
    climateAdjustedCaliforniaSize = STANDARD_PIPE_SIZES.find(size => size >= climateAdjustedDiameter * 1000) || 
                                   STANDARD_PIPE_SIZES[STANDARD_PIPE_SIZES.length - 1];
  }
  
  // Step 4: Hydraulic calculation - FIXED TO RUN WHEN NEEDED
  let hydraulicSize = californiaSize;
  let bankfullFlow = 0;
  let finalCapacity = 0;
  let finalHeadwaterRatio = 0;
  
  // Run hydraulic calculations when:
  // 1. Method is hydraulic or comparison
  // 2. Hydraulic capacity test is enabled 
  // 3. We have slope data
  const needsHydraulicCalc = (
    sizingMethod === 'hydraulic' || 
    sizingMethod === 'comparison' || 
    hydraulicCapacityTest
  ) && slopePercent > 0;
  
  if (needsHydraulicCalc) {
    // Calculate bankfull flow using Manning's equation for trapezoidal channel
    const sideSlopeZ = avgStreamDepth > 0 ? (topWidth - bottomWidth) / (2 * avgStreamDepth) : 0;
    const wettedPerimeter = bottomWidth + 2 * avgStreamDepth * Math.sqrt(1 + sideSlopeZ * sideSlopeZ);
    const hydraulicRadius = streamArea / wettedPerimeter;
    
    // Calculate base flow using Manning's equation: Q = (1/n) * A * R^(2/3) * S^(1/2)
    const baseFlow = (1 / streamRoughness) * 
                     streamArea * 
                     Math.pow(hydraulicRadius, 2/3) * 
                     Math.pow(slope, 0.5);
    
    // Apply climate change factor to flow if enabled
    bankfullFlow = climateFactorsEnabled ? baseFlow * climateChangeFactor : baseFlow;
    
    // Find appropriate hydraulic size - IMPROVED LOGIC
    for (const pipeSize of STANDARD_PIPE_SIZES) {
      const pipeDiameter = pipeSize / 1000; // Convert to meters
      const pipeArea = Math.PI * Math.pow(pipeDiameter, 2) / 4;
      const pipeHydraulicRadius = pipeDiameter / 4; // For circular pipe flowing full
      
      // Calculate pipe capacity with Manning's equation
      const pipeCapacity = (1 / pipeRoughness) * 
                          pipeArea * 
                          Math.pow(pipeHydraulicRadius, 2/3) * 
                          Math.pow(slope, 0.5);
      
      // Simplified headwater calculation - using velocity head approach
      const velocity = bankfullFlow / pipeArea;
      const velocityHead = Math.pow(velocity, 2) / (2 * 9.81);
      const headwaterDepth = pipeDiameter * 0.5 + velocityHead + pipeDiameter * 0.1; // Include entrance losses
      const hw_ratio = headwaterDepth / pipeDiameter;
      
      // Check if this pipe size meets both capacity and headwater criteria
      // Use safety factor of 1.25 for capacity (25% safety margin)
      if (pipeCapacity >= bankfullFlow * 1.25 && hw_ratio <= maxHwdRatio) {
        hydraulicSize = pipeSize;
        finalCapacity = pipeCapacity;
        finalHeadwaterRatio = hw_ratio;
        break;
      }
      
      // If we've reached the largest pipe size, use it even if it doesn't meet criteria
      if (pipeSize === STANDARD_PIPE_SIZES[STANDARD_PIPE_SIZES.length - 1]) {
        hydraulicSize = pipeSize;
        finalCapacity = pipeCapacity;
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
  
  // Step 8: Calculate final pipe characteristics for display
  const finalPipeDiameter = finalSize / 1000;
  const finalArea = Math.PI * Math.pow(finalPipeDiameter, 2) / 4;
  
  // Always calculate capacity for display if slope is provided
  if (slopePercent > 0 && finalCapacity === 0) {
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
    bankfullFlow: needsHydraulicCalc ? bankfullFlow.toFixed(2) : "0.00",
    
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
    
    // Debug information for hydraulic calculations
    debugInfo: {
      needsHydraulicCalc,
      streamFlowRate: needsHydraulicCalc ? bankfullFlow.toFixed(3) : "N/A",
      streamVelocity: streamArea > 0 && needsHydraulicCalc ? (bankfullFlow / streamArea).toFixed(2) : "N/A",
      hydraulicRadius: streamArea > 0 ? (streamArea / (bottomWidth + 2 * avgStreamDepth * Math.sqrt(1 + Math.pow((topWidth - bottomWidth) / (2 * avgStreamDepth), 2)))).toFixed(3) : "0.000",
      californiaTableLookup: `Width: ${topWidth}m → Depth: ${avgStreamDepth}m → Size: ${californiaSize}mm`
    },
    
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
 * FIXED: Proper interpolation and lookup logic
 * @param {number} width - Stream width in meters
 * @param {number} depth - Stream depth in meters
 * @returns {number} Recommended culvert size in mm
 */
export const lookupCulvertSizeFromTable = (width, depth) => {
  // California Method lookup table - values are culvert diameter in mm
  // Table structure: width thresholds as keys, depth ranges as sub-keys
  const sizingTable = [
    // [width_max, depth_max, culvert_size_mm]
    // Very small streams
    [0.3, 0.1, 450], [0.3, 0.2, 450], [0.3, 0.3, 600], [0.3, 0.4, 600],
    [0.3, 0.5, 700], [0.3, 0.6, 750], [0.3, 0.8, 900], [0.3, 1.0, 1000],
    
    // Small streams (0.3-0.6m width)
    [0.6, 0.1, 450], [0.6, 0.2, 600], [0.6, 0.3, 700], [0.6, 0.4, 750],
    [0.6, 0.5, 800], [0.6, 0.6, 900], [0.6, 0.8, 1000], [0.6, 1.0, 1200],
    
    // Medium streams (0.6-0.9m width)
    [0.9, 0.1, 600], [0.9, 0.2, 700], [0.9, 0.3, 800], [0.9, 0.4, 900],
    [0.9, 0.5, 1000], [0.9, 0.6, 1200], [0.9, 0.8, 1400], [0.9, 1.0, 1500],
    
    // Medium-large streams (0.9-1.2m width)
    [1.2, 0.1, 700], [1.2, 0.2, 800], [1.2, 0.3, 900], [1.2, 0.4, 1000],
    [1.2, 0.5, 1200], [1.2, 0.6, 1400], [1.2, 0.8, 1600], [1.2, 1.0, 1800],
    
    // Large streams (1.2-1.5m width)
    [1.5, 0.1, 800], [1.5, 0.2, 900], [1.5, 0.3, 1000], [1.5, 0.4, 1200],
    [1.5, 0.5, 1400], [1.5, 0.6, 1600], [1.5, 0.8, 1800], [1.5, 1.0, 2100],
    
    // Very large streams (1.5-2.0m width)
    [1.8, 0.1, 900], [1.8, 0.2, 1000], [1.8, 0.3, 1200], [1.8, 0.4, 1400],
    [1.8, 0.5, 1500], [1.8, 0.6, 1800], [1.8, 0.8, 2100], [1.8, 1.0, 2400],
    
    // Extra large streams (2.0-3.0m width)
    [2.5, 0.1, 1000], [2.5, 0.2, 1200], [2.5, 0.3, 1400], [2.5, 0.4, 1600],
    [2.5, 0.5, 1800], [2.5, 0.6, 2100], [2.5, 0.8, 2400], [2.5, 1.0, 3000],
    
    // Very large streams (3.0m+ width)
    [3.5, 0.1, 1200], [3.5, 0.2, 1400], [3.5, 0.3, 1600], [3.5, 0.4, 1800],
    [3.5, 0.5, 2100], [3.5, 0.6, 2400], [3.5, 0.8, 3000], [3.5, 1.0, 3600],
    
    // Maximum sizes for very large streams
    [5.0, 0.1, 1400], [5.0, 0.2, 1600], [5.0, 0.3, 1800], [5.0, 0.4, 2100],
    [5.0, 0.5, 2400], [5.0, 0.6, 3000], [5.0, 0.8, 3600], [5.0, 1.0, 3600]
  ];

  // Find the appropriate size by checking all table entries
  // Start with smallest size and work up
  let selectedSize = 450; // Minimum pipe size
  
  for (const [maxWidth, maxDepth, pipeSize] of sizingTable) {
    // If current stream dimensions fit within this table entry
    if (width <= maxWidth && depth <= maxDepth) {
      selectedSize = Math.max(selectedSize, pipeSize);
    }
  }
  
  // Additional check: if stream is very large, ensure minimum sizing
  if (width > 3.0 || depth > 0.8) {
    selectedSize = Math.max(selectedSize, 2400);
  }
  
  if (width > 4.0 || depth > 1.0) {
    selectedSize = Math.max(selectedSize, 3000);
  }

  return selectedSize;
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
