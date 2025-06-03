/**
 * Look up recommended culvert size from the California Method table
 * REVISED - More conservative and accurate California Method implementation 
 * @param {number} width - Stream width in meters
 * @param {number} depth - Stream depth in meters
 * @returns {number} Recommended culvert size in mm
 */
export const lookupCulvertSizeFromTable = (width, depth) => {
  // REVISED: More conservative California Method lookup table
  // This version provides more appropriate sizing for typical forest road applications
  
  // Very small streams (0-0.6m width)
  if (width <= 0.6) {
    if (depth <= 0.1) return 450;
    if (depth <= 0.2) return 600;
    if (depth <= 0.3) return 700;
    if (depth <= 0.4) return 750;
    if (depth <= 0.6) return 900;
    return 1000; // depth > 0.6m
  }
  
  // Small streams (0.6-1.2m width) 
  if (width <= 1.2) {
    if (depth <= 0.1) return 600;
    if (depth <= 0.2) return 700;
    if (depth <= 0.3) return 900;
    if (depth <= 0.4) return 1000;
    if (depth <= 0.6) return 1200;
    if (depth <= 0.8) return 1400;
    return 1500; // depth > 0.8m
  }
  
  // Medium streams (1.2-2.0m width) - FIXED: More appropriate sizing
  if (width <= 2.0) {
    if (depth <= 0.1) return 700;
    if (depth <= 0.2) return 900;   // Conservative: 2m × 0.2m → 900mm
    if (depth <= 0.3) return 1000;  // More conservative than before
    if (depth <= 0.4) return 1200;  // Appropriate for medium streams
    if (depth <= 0.6) return 1400;  // Balanced approach
    if (depth <= 0.8) return 1600;  // Conservative for deeper streams
    return 1800; // depth > 0.8m
  }
  
  // Large streams (2.0-3.0m width) - REVISED for better accuracy
  if (width <= 3.0) {
    if (depth <= 0.1) return 900;
    if (depth <= 0.2) return 1000;  // More conservative
    if (depth <= 0.3) return 1200;  // Appropriate sizing
    if (depth <= 0.4) return 1500;  // Better proportions
    if (depth <= 0.6) return 1800;  // Conservative approach
    if (depth <= 0.8) return 2100;  // Adequate for large streams
    if (depth <= 1.0) return 2100;  
    return 2400; // depth > 1.0m
  }
  
  // Very large streams (3.0-4.0m width)
  if (width <= 4.0) {
    if (depth <= 0.1) return 1200;
    if (depth <= 0.2) return 1400;  
    if (depth <= 0.3) return 1600;  
    if (depth <= 0.4) return 1800;  
    if (depth <= 0.6) return 2100;  
    if (depth <= 0.8) return 2400;  
    if (depth <= 1.0) return 2400;  
    return 3000; // depth > 1.0m
  }
  
  // Extra large streams (4.0m+ width)
  if (depth <= 0.2) return 1600;   
  if (depth <= 0.4) return 2100;   
  if (depth <= 0.6) return 2400;   
  if (depth <= 0.8) return 3000;   
  if (depth <= 1.0) return 3000;   
  return 3600; // Very large streams
};