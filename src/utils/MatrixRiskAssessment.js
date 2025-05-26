// Matrix Risk Assessment with Professional Override Capability
// Updated to use Hazard × Consequence calculation with conservative ranges

class MatrixRiskAssessment {
  constructor() {
    // Conservative risk level ranges based on Hazard × Consequence scores
    this.riskRanges = {
      'Low': { min: 64, max: 250 },
      'Moderate': { min: 251, max: 750 },
      'High': { min: 751, max: 1400 },
      'Very High': { min: 1401, max: 2000 }
    };

    this.riskColors = {
      'Low': '#4CAF50',           // Green
      'Moderate': '#FF9800',      // Orange
      'High': '#FF5722',          // Red-Orange  
      'Very High': '#D32F2F'      // Dark Red
    };

    this.riskLevels = ['Low', 'Moderate', 'High', 'Very High'];
  }

  // Calculate risk level from multiplied score with detailed reasoning
  getRiskLevelFromScore(riskScore) {
    let level, reasoning;
    
    if (riskScore >= 1401) {
      level = 'Very High';
      reasoning = 'Critical risk requiring immediate professional attention and comprehensive mitigation';
    } else if (riskScore >= 751) {
      level = 'High';
      reasoning = 'Significant risk requiring prompt professional assessment and active management';
    } else if (riskScore >= 251) {
      level = 'Moderate';
      reasoning = 'Moderate risk requiring professional monitoring and planned maintenance';
    } else if (riskScore >= 64) {
      level = 'Low';
      reasoning = 'Low risk suitable for routine monitoring and standard maintenance';
    } else {
      level = 'Low';
      reasoning = 'Very low risk with minimal management requirements';
    }

    return { level, reasoning, score: riskScore };
  }

  // Get hazard level description for display
  getHazardLevelDescription(hazardScore) {
    if (hazardScore >= 40) {
      return 'Very High hazard potential (multiple critical factors)';
    } else if (hazardScore >= 30) {
      return 'High hazard potential (several significant factors)';
    } else if (hazardScore >= 20) {
      return 'Moderate hazard potential (some concerning factors)';
    } else if (hazardScore >= 15) {
      return 'Low hazard potential (minimal risk factors)';
    } else {
      return 'Very low hazard potential (stable conditions)';
    }
  }

  // Get consequence level description for display
  getConsequenceLevelDescription(consequenceScore) {
    if (consequenceScore >= 32) {
      return 'Very High consequence potential (severe impacts expected)';
    } else if (consequenceScore >= 24) {
      return 'High consequence potential (major impacts likely)';
    } else if (consequenceScore >= 16) {
      return 'Moderate consequence potential (significant local impacts)';
    } else if (consequenceScore >= 12) {
      return 'Low consequence potential (limited impacts)';
    } else {
      return 'Very low consequence potential (minimal impacts)';
    }
  }

  // Calculate initial risk assessment from hazard and consequence scores
  calculateInitialRisk(hazardScore, consequenceScore) {
    // Calculate risk using multiplication
    const riskScore = hazardScore * consequenceScore;
    const riskAssessment = this.getRiskLevelFromScore(riskScore);
    
    return {
      hazard: {
        score: hazardScore,
        description: this.getHazardLevelDescription(hazardScore)
      },
      consequence: {
        score: consequenceScore,
        description: this.getConsequenceLevelDescription(consequenceScore)
      },
      riskScore: riskScore,
      riskLevel: riskAssessment.level,
      reasoning: riskAssessment.reasoning,
      color: this.riskColors[riskAssessment.level],
      isCalculated: true,
      isOverridden: false,
      finalRisk: riskAssessment.level,
      finalColor: this.riskColors[riskAssessment.level]
    };
  }

  // Apply direct professional override of overall risk level
  applyDirectOverride(initialAssessment, overrideRiskLevel, justification = '') {
    if (!this.riskLevels.includes(overrideRiskLevel)) {
      throw new Error(`Invalid risk level: ${overrideRiskLevel}`);
    }

    return {
      ...initialAssessment,
      finalRisk: overrideRiskLevel,
      finalColor: this.riskColors[overrideRiskLevel],
      isOverridden: true,
      overrideJustification: justification,
      overrideDetails: {
        originalRisk: initialAssessment.riskLevel,
        overrideRisk: overrideRiskLevel,
        changed: overrideRiskLevel !== initialAssessment.riskLevel,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Legacy method for backwards compatibility with existing override system
  applyOverride(initialAssessment, overrideHazard = null, overrideConsequence = null, justification = '') {
    // If this is actually a direct override (overrideHazard is a risk level)
    if (overrideHazard && this.riskLevels.includes(overrideHazard)) {
      return this.applyDirectOverride(initialAssessment, overrideHazard, justification);
    }
    
    // Otherwise, treat as legacy matrix override (deprecated but supported)
    console.warn('Legacy matrix override used - consider using applyDirectOverride instead');
    return initialAssessment;
  }

  // Get all possible risk levels for dropdowns
  getRiskLevels() {
    return this.riskLevels;
  }

  // Get risk colors for UI
  getRiskColors() {
    return this.riskColors;
  }

  // Get color for specific risk level
  getRiskColor(riskLevel) {
    return this.riskColors[riskLevel] || '#666';
  }

  // Get risk range information for debugging/display
  getRiskRanges() {
    return this.riskRanges;
  }

  // Calculate what risk level a given hazard/consequence combination would produce
  calculateRiskScore(hazardScore, consequenceScore) {
    return hazardScore * consequenceScore;
  }

  // Validate if scores are within expected ranges
  validateScores(hazardScore, consequenceScore) {
    const minHazard = 8;  // 4 factors × 2 minimum
    const maxHazard = 50; // 5 factors × 10 maximum
    const minConsequence = 8;  // 4 factors × 2 minimum  
    const maxConsequence = 40; // 4 factors × 10 maximum

    const issues = [];
    
    if (hazardScore < minHazard || hazardScore > maxHazard) {
      issues.push(`Hazard score ${hazardScore} outside expected range ${minHazard}-${maxHazard}`);
    }
    
    if (consequenceScore < minConsequence || consequenceScore > maxConsequence) {
      issues.push(`Consequence score ${consequenceScore} outside expected range ${minConsequence}-${maxConsequence}`);
    }
    
    return {
      valid: issues.length === 0,
      issues: issues
    };
  }
}

export default MatrixRiskAssessment;