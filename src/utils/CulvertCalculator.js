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
 * @param {number} params.avgStreamWidth - Average bankfull width in meters
 * @param {number} params.avgStreamDepth - Average bankfull depth in meters
 * @param {number} params.slopePercent - Channel slope in percent
 * @param {boolean} params.fishPassage - Whether fish passage is required
 * @returns {Object} Calculation results including recommended pipe size
 */
export const calculateCulvert = (params) => {
  const {
    avgStreamWidth,
    avgStreamDepth,
    slopePercent,
    streamRoughness = 0.04,
    pipeRoughness = 0.024,
    fishPassage = false
  } = params;

  // Convert slope percent to decimal
  const slope = slopePercent / 100;
  
  // Step 1: Calculate area using California Method (width x depth)
  const streamArea = avgStreamWidth * avgStreamDepth;
  
  // Step 2: Calculate required culvert area using formula: area = width x depth x 3
  const requiredCulvertArea = streamArea * 3;
  
  // Step 3: Calculate required diameter based on the area (A = πr²)
  const requiredDiameterM = 2 * Math.sqrt(requiredCulvertArea / Math.PI);
  const requiredDiameterMm = requiredDiameterM * 1000;
  
  // Step 4: Alternative sizing based on bankfull width (1.2 x width) for comparison
  const altSpanRequired = 1.2 * avgStreamWidth;
  const altSpanRequiredMm = altSpanRequired * 1000;
  
  // Step 5: Find the smallest standard pipe size that meets BOTH requirements
  // - Use the greater of the two required sizes (area-based or width-based)
  const minRequiredDiameterMm = Math.max(requiredDiameterMm, altSpanRequiredMm);
  let selectedPipeSizeMm = STANDARD_PIPE_SIZES.find(size => size >= minRequiredDiameterMm) || STANDARD_PIPE_SIZES[STANDARD_PIPE_SIZES.length - 1];
  
  // Step 6: If fish passage is required, check if we need to increase size
  // For fish passage, the pipe should be at least 1.5 times the bankfull width if bankfull < 1.0m
  if (fishPassage && avgStreamWidth < 1.0) {
    const fishPassageDiameterMm = avgStreamWidth * 1500; // 1.5x converted to mm
    if (fishPassageDiameterMm > selectedPipeSizeMm) {
      selectedPipeSizeMm = STANDARD_PIPE_SIZES.find(size => size >= fishPassageDiameterMm) || selectedPipeSizeMm;
    }
  }
  
  // Step 7: Calculate embedding depth (20% of pipe diameter if fish passage is required)
  const embedDepth = fishPassage ? 0.2 * (selectedPipeSizeMm / 1000) : 0;
  
  // Step 8: Calculate bankfull flow using Manning's equation for hydraulic check
  const bankfullArea = avgStreamWidth * avgStreamDepth;
  const bankfullPerimeter = avgStreamWidth + 2 * avgStreamDepth;
  const bankfullHydraulicRadius = bankfullArea / bankfullPerimeter;
  
  const bankfullFlow = (1 / streamRoughness) * 
                       bankfullArea * 
                       Math.pow(bankfullHydraulicRadius, 2/3) * 
                       Math.pow(slope, 0.5);
  
  // Step 9: Calculate pipe capacity (full-flow approximation)
  const pipeCapacity = calculatePipeCapacity(selectedPipeSizeMm / 1000, pipeRoughness, slope);
  
  // Step 10: Check if pipe capacity meets or exceeds bankfull flow
  let hydraulicCheck = pipeCapacity >= bankfullFlow;
  
  // Step 11: If capacity is insufficient, size up the pipe
  if (!hydraulicCheck) {
    const currentSizeIndex = STANDARD_PIPE_SIZES.indexOf(selectedPipeSizeMm);
    if (currentSizeIndex < STANDARD_PIPE_SIZES.length - 1) {
      selectedPipeSizeMm = STANDARD_PIPE_SIZES[currentSizeIndex + 1];
      const newPipeCapacity = calculatePipeCapacity(selectedPipeSizeMm / 1000, pipeRoughness, slope);
      hydraulicCheck = newPipeCapacity >= bankfullFlow;
    }
  }
  
  // Calculate approximate headwater ratio at bankfull flow
  const headwaterRatio = bankfullFlow / pipeCapacity * 0.8;

  return {
    streamArea: streamArea.toFixed(2),
    requiredCulvertArea: requiredCulvertArea.toFixed(2),
    requiredDiameterM: requiredDiameterM.toFixed(2),
    requiredDiameterMm: Math.round(requiredDiameterMm),
    altSpanRequiredM: altSpanRequired.toFixed(2),
    altSpanRequiredMm: Math.round(altSpanRequiredMm),
    selectedPipeSize: selectedPipeSizeMm,
    selectedPipeSizeM: (selectedPipeSizeMm / 1000).toFixed(2),
    embedDepth: embedDepth.toFixed(2),
    bankfullFlow: bankfullFlow.toFixed(2),
    pipeCapacity: pipeCapacity.toFixed(2),
    hydraulicCheck,
    headwaterRatio: headwaterRatio.toFixed(2),
    fishPassage,
    sizingMethod: "California Method",
    notes: fishPassage ? 
      "Fish passage requirements applied with 20% embedded culvert." : 
      "Standard sizing based on California Method (width × depth × 3)."
  };
};

/**
 * Look up recommended culvert size from the California Method table
 * @param {number} width - Stream width in meters
 * @param {number} depth - Stream depth in meters
 * @returns {number} Recommended culvert size in mm
 */
export const lookupCulvertSizeFromTable = (width, depth) => {
  // Simplified lookup table based on the California Method table
  // Values are in mm for culvert diameter
  const sizingTable = {
    // Format: [width_threshold_m]: { [depth_threshold_m]: size_mm }
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

  // Find the closest width threshold that's >= the given width
  const widthThresholds = Object.keys(sizingTable).map(Number).sort((a, b) => a - b);
  const widthKey = widthThresholds.find(w => w >= width) || widthThresholds[widthThresholds.length - 1];

  // Find the closest depth threshold that's >= the given depth
  const depthThresholds = Object.keys(sizingTable[widthKey]).map(Number).sort((a, b) => a - b);
  const depthKey = depthThresholds.find(d => d >= depth) || depthThresholds[depthThresholds.length - 1];

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
