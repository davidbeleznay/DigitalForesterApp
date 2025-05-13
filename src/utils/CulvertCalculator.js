/**
 * CulvertCalculator.js
 * Utility for calculating culvert dimensions based on watershed characteristics
 * and fish passage requirements.
 */

// Standard pipe sizes in mm
const STANDARD_PIPE_SIZES = [450, 600, 750, 900, 1200, 1500, 1800, 2100, 2400, 3000, 3600];

/**
 * Calculate culvert size based on bankfull width
 * @param {Object} params - Calculation parameters
 * @param {number} params.bankfullWidth - Bankfull width in meters
 * @param {number} params.bankfullDepth - Mean bankfull depth in meters
 * @param {number} params.slopePercent - Channel slope in percent
 * @param {number} params.streamRoughness - Manning's n for stream (default 0.04)
 * @param {number} params.pipeRoughness - Manning's n for pipe (default 0.024)
 * @param {boolean} params.fishPassage - Whether fish passage is required
 * @returns {Object} Calculation results including recommended pipe size
 */
export const calculateCulvert = (params) => {
  const {
    bankfullWidth,
    bankfullDepth,
    slopePercent,
    streamRoughness = 0.04,
    pipeRoughness = 0.024,
    fishPassage = false
  } = params;

  // Convert slope percent to decimal
  const slope = slopePercent / 100;
  
  // Step 1: Calculate minimum span based on bankfull width (California method)
  const spanRequired = 1.2 * bankfullWidth;
  
  // Step 2: Find the smallest standard pipe size that meets the span requirement
  // Convert to mm for comparison with standard sizes
  const spanRequiredMm = spanRequired * 1000;
  let selectedPipeSizeMm = STANDARD_PIPE_SIZES.find(size => size >= spanRequiredMm) || STANDARD_PIPE_SIZES[STANDARD_PIPE_SIZES.length - 1];
  
  // Step 3: Calculate embedding depth (20% of pipe diameter if fish passage is required)
  const embedDepth = fishPassage ? 0.2 * (selectedPipeSizeMm / 1000) : 0;
  
  // Step 4: Calculate bankfull flow using Manning's equation
  const bankfullArea = bankfullWidth * bankfullDepth;
  const bankfullPerimeter = bankfullWidth + 2 * bankfullDepth;
  const bankfullHydraulicRadius = bankfullArea / bankfullPerimeter;
  
  const bankfullFlow = (1 / streamRoughness) * 
                       bankfullArea * 
                       Math.pow(bankfullHydraulicRadius, 2/3) * 
                       Math.pow(slope, 0.5);
  
  // Step 5: Calculate pipe capacity (full-flow approximation)
  const pipeCapacity = calculatePipeCapacity(selectedPipeSizeMm / 1000, pipeRoughness, slope);
  
  // Step 6: Check if pipe capacity meets or exceeds bankfull flow
  let hydraulicCheck = pipeCapacity >= bankfullFlow;
  
  // Step 7: If capacity is insufficient, size up the pipe
  if (!hydraulicCheck) {
    const currentSizeIndex = STANDARD_PIPE_SIZES.indexOf(selectedPipeSizeMm);
    if (currentSizeIndex < STANDARD_PIPE_SIZES.length - 1) {
      selectedPipeSizeMm = STANDARD_PIPE_SIZES[currentSizeIndex + 1];
      const newPipeCapacity = calculatePipeCapacity(selectedPipeSizeMm / 1000, pipeRoughness, slope);
      hydraulicCheck = newPipeCapacity >= bankfullFlow;
    }
  }
  
  // Calculate approximate headwater ratio at bankfull flow
  // This is a simplified approximation
  const headwaterRatio = bankfullFlow / pipeCapacity * 0.8;

  return {
    spanRequired: spanRequired.toFixed(2),
    spanRequiredMm: spanRequiredMm.toFixed(0),
    selectedPipeSize: selectedPipeSizeMm,
    selectedPipeSizeM: (selectedPipeSizeMm / 1000).toFixed(2),
    embedDepth: embedDepth.toFixed(2),
    bankfullFlow: bankfullFlow.toFixed(2),
    pipeCapacity: pipeCapacity.toFixed(2),
    hydraulicCheck,
    headwaterRatio: headwaterRatio.toFixed(2),
    fishPassage
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
