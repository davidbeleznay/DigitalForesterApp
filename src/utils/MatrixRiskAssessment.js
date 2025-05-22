// Matrix Risk Assessment with Professional Override Capability
// Professional risk assessment following industry standards with override capability

class MatrixRiskAssessment {
  constructor() {
    // Standard professional risk matrix (ISO 31000 compliant)
    this.riskMatrix = {
      'Very Low': {
        'Very Low': 'Very Low',
        'Low': 'Very Low', 
        'Moderate': 'Low',
        'High': 'Low',
        'Very High': 'Moderate'
      },
      'Low': {
        'Very Low': 'Very Low',
        'Low': 'Low',
        'Moderate': 'Low', 
        'High': 'Moderate',
        'Very High': 'Moderate'
      },
      'Moderate': {
        'Very Low': 'Low',
        'Low': 'Low',
        'Moderate': 'Moderate',
        'High': 'Moderate', 
        'Very High': 'High'
      },
      'High': {
        'Very Low': 'Low',
        'Low': 'Moderate',
        'Moderate': 'Moderate',
        'High': 'High',
        'Very High': 'High'
      },
      'Very High': {
        'Very Low': 'Moderate',
        'Low': 'Moderate', 
        'Moderate': 'High',
        'High': 'High',
        'Very High': 'Very High'
      }
    };

    this.riskColors = {
      'Very Low': '#388e3c',
      'Low': '#689f38', 
      'Moderate': '#fbc02d',
      'High': '#f57c00',
      'Very High': '#d32f2f'
    };

    this.riskLevels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
  }

  // Convert raw hazard score to risk level with detailed reasoning
  getHazardLevel(hazardScore) {
    let level, reasoning;
    
    if (hazardScore >= 40) {
      level = 'Very High';
      reasoning = 'Multiple high-risk factors present (average 8+ per factor)';
    } else if (hazardScore >= 30) {
      level = 'High';
      reasoning = 'Several significant risk factors (average 6-7.5 per factor)';
    } else if (hazardScore >= 20) {
      level = 'Moderate';
      reasoning = 'Some concerning factors present (average 4-6 per factor)';
    } else if (hazardScore >= 15) {
      level = 'Low';
      reasoning = 'Minimal risk factors (average 3-4 per factor)';
    } else {
      level = 'Very Low';
      reasoning = 'Stable conditions, few concerns (average 2-3 per factor)';
    }

    return { level, reasoning, score: hazardScore };
  }

  // Convert raw consequence score to risk level with detailed reasoning
  getConsequenceLevel(consequenceScore) {
    let level, reasoning;
    
    if (consequenceScore >= 32) {
      level = 'Very High';
      reasoning = 'Severe/irreversible impacts expected (average 8+ per factor)';
    } else if (consequenceScore >= 24) {
      level = 'High';
      reasoning = 'Major regional impacts likely (average 6-8 per factor)';
    } else if (consequenceScore >= 16) {
      level = 'Moderate';
      reasoning = 'Significant local impacts expected (average 4-6 per factor)';
    } else if (consequenceScore >= 12) {
      level = 'Low';
      reasoning = 'Limited local impact (average 3-4 per factor)';
    } else {
      level = 'Very Low';
      reasoning = 'Minimal impact if failure occurs (average 2-3 per factor)';
    }

    return { level, reasoning, score: consequenceScore };
  }

  // Calculate initial risk assessment from scores
  calculateInitialRisk(hazardScore, consequenceScore) {
    const hazardAssessment = this.getHazardLevel(hazardScore);
    const consequenceAssessment = this.getConsequenceLevel(consequenceScore);
    
    const matrixRisk = this.riskMatrix[hazardAssessment.level][consequenceAssessment.level];
    
    return {
      hazard: hazardAssessment,
      consequence: consequenceAssessment,
      matrixRisk: matrixRisk,
      color: this.riskColors[matrixRisk],
      rationale: `${hazardAssessment.level} hazard potential combined with ${consequenceAssessment.level} consequence severity`,
      isCalculated: true,
      isOverridden: false,
      finalRisk: matrixRisk,
      finalColor: this.riskColors[matrixRisk]
    };
  }

  // Apply professional override with justification
  applyOverride(initialAssessment, overrideHazard = null, overrideConsequence = null, justification = '') {
    const hazardLevel = overrideHazard || initialAssessment.hazard.level;
    const consequenceLevel = overrideConsequence || initialAssessment.consequence.level;
    
    const finalRisk = this.riskMatrix[hazardLevel][consequenceLevel];
    
    return {
      ...initialAssessment,
      finalHazardLevel: hazardLevel,
      finalConsequenceLevel: consequenceLevel,
      finalRisk: finalRisk,
      finalColor: this.riskColors[finalRisk],
      isOverridden: overrideHazard !== null || overrideConsequence !== null,
      overrideJustification: justification,
      overrideDetails: {
        hazardChanged: overrideHazard !== null && overrideHazard !== initialAssessment.hazard.level,
        consequenceChanged: overrideConsequence !== null && overrideConsequence !== initialAssessment.consequence.level,
        originalHazard: initialAssessment.hazard.level,
        originalConsequence: initialAssessment.consequence.level,
        newHazard: hazardLevel,
        newConsequence: consequenceLevel
      }
    };
  }

  // Get all possible risk levels for dropdowns
  getRiskLevels() {
    return this.riskLevels;
  }

  // Get risk colors for UI
  getRiskColors() {
    return this.riskColors;
  }
}

export default MatrixRiskAssessment;
