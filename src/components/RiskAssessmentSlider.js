import React from 'react';
import '../styles/RiskAssessmentSlider.css';

const RiskAssessmentSlider = ({ 
  label, 
  factor, 
  value, 
  onChange, 
  riskLevels,
  displayMode = 'slider' // 'slider' or 'table'
}) => {
  const getRiskLevel = (val) => {
    if (val <= 33) return 'low';
    if (val <= 66) return 'moderate';
    return 'high';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'high': return '#f44336';
      default: return '#999';
    }
  };

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    onChange(factor, getRiskLevel(newValue));
  };

  const getSliderValue = () => {
    switch (value) {
      case 'low': return 16;
      case 'moderate': return 50;
      case 'high': return 84;
      default: return 16;
    }
  };

  const currentRiskLevel = getRiskLevel(getSliderValue());
  const currentColor = getRiskColor(currentRiskLevel);

  if (displayMode === 'table') {
    return (
      <div className="risk-table-row">
        <div className="risk-factor-label">{label}</div>
        <div className="risk-level-cells">
          {Object.entries(riskLevels).map(([level, description]) => (
            <div 
              key={level}
              className={`risk-cell ${value === level ? 'selected' : ''}`}
              onClick={() => onChange(factor, level)}
              style={{
                borderColor: value === level ? getRiskColor(level) : '#ddd',
                backgroundColor: value === level ? `${getRiskColor(level)}15` : 'transparent'
              }}
            >
              <div className="risk-cell-content">{description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="risk-slider-container">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span 
          className="slider-value" 
          style={{ color: currentColor }}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)} Risk
        </span>
      </div>
      
      <div className="slider-wrapper">
        <input
          type="range"
          min="0"
          max="100"
          value={getSliderValue()}
          onChange={handleSliderChange}
          className="risk-slider"
          style={{
            background: `linear-gradient(to right, 
              #4CAF50 0%, #4CAF50 33%, 
              #FF9800 33%, #FF9800 66%, 
              #f44336 66%, #f44336 100%)`
          }}
        />
        
        <div className="slider-labels">
          <span className="slider-label-item low">Low</span>
          <span className="slider-label-item moderate">Moderate</span>
          <span className="slider-label-item high">High</span>
        </div>
      </div>
      
      <div className="risk-description" style={{ borderColor: currentColor }}>
        <strong>{value.charAt(0).toUpperCase() + value.slice(1)} Risk:</strong> {riskLevels[value]}
      </div>
    </div>
  );
};

export default RiskAssessmentSlider;