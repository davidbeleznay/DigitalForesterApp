/**
 * Look up recommended culvert size from the California Method table
 * REVISED - More conservative professional California Method implementation 
 * @param {number} width - Stream width in meters
 * @param {number} depth - Stream depth in meters
 * @returns {number} Recommended culvert size in mm
 */
export const lookupCulvertSizeFromTable = (width, depth) => {
  // REVISED: Conservative California Method lookup table based on professional standards
  // This version errs on the side of slightly smaller, more appropriate sizes
  
  console.log(`California Method lookup: Width=${width}m, Depth=${depth}m`);
  
  // Very small streams (0-0.6m width)
  if (width <= 0.6) {
    if (depth <= 0.1) return 450;
    if (depth <= 0.2) return 600;
    if (depth <= 0.3) return 700;
    if (depth <= 0.4) return 750;
    if (depth <= 0.6) return 900;
    return 1000; // depth > 0.6m
  }
  
  // Small streams (0.6-1.2m width) - REVISED for more appropriate sizing
  if (width <= 1.2) {
    if (depth <= 0.1) return 600;
    if (depth <= 0.2) return 700;
    if (depth <= 0.3) return 900;
    if (depth <= 0.4) return 1000;
    if (depth <= 0.6) return 1200;
    if (depth <= 0.8) return 1400;
    return 1500; // depth > 0.8m
  }
  
  // Medium streams (1.2-2.0m width) - FIXED: More conservative approach
  if (width <= 2.0) {
    if (depth <= 0.1) return 700;
    if (depth <= 0.2) return 900;   // Conservative: 2m × 0.2m → 900mm
    if (depth <= 0.3) return 1000;  // REVISED: was 1200, now more conservative
    if (depth <= 0.4) return 1200;  // REVISED: was 1400, now 1200 
    if (depth <= 0.6) return 1400;  // REVISED: was 1600, now 1400
    if (depth <= 0.8) return 1600;  // REVISED: was 1800, now 1600
    return 1800; // depth > 0.8m (was 2100, now 1800)
  }
  
  // Large streams (2.0-3.0m width) - REVISED for better accuracy
  if (width <= 3.0) {
    if (depth <= 0.1) return 900;
    if (depth <= 0.2) return 1000;  // REVISED: was 1200, now 1000
    if (depth <= 0.3) return 1200;  // REVISED: was 1500, now 1200
    if (depth <= 0.4) return 1500;  // REVISED: was 1800, now 1500
    if (depth <= 0.6) return 1800;  // REVISED: was 2100, now 1800
    if (depth <= 0.8) return 2100;  // REVISED: was 2400, now 2100
    if (depth <= 1.0) return 2100;  // Keep at 2100
    return 2400; // depth > 1.0m (was 3000, now 2400)
  }
  
  // Very large streams (3.0-4.0m width)
  if (width <= 4.0) {
    if (depth <= 0.1) return 1200;
    if (depth <= 0.2) return 1400;  // REVISED: was 1500, now 1400
    if (depth <= 0.3) return 1600;  // REVISED: was 1800, now 1600
    if (depth <= 0.4) return 1800;  // REVISED: was 2100, now 1800
    if (depth <= 0.6) return 2100;  // REVISED: was 2400, now 2100
    if (depth <= 0.8) return 2400;  // REVISED: was 3000, now 2400
    if (depth <= 1.0) return 2400;  // Keep at 2400
    return 3000; // depth > 1.0m
  }
  
  // Extra large streams (4.0m+ width)
  if (depth <= 0.2) return 1600;   // REVISED: was 1800, now 1600
  if (depth <= 0.4) return 2100;   // REVISED: was 2400, now 2100
  if (depth <= 0.6) return 2400;   // REVISED: was 3000, now 2400
  if (depth <= 0.8) return 3000;   // Keep at 3000
  if (depth <= 1.0) return 3000;   // Keep at 3000
  return 3600; // Very large streams
};