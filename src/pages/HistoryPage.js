import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HistoryPage() {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  
  useEffect(() => {
    // Load history from localStorage
    const historyData = localStorage.getItem('assessmentHistory');
    if (historyData) {
      setAssessmentHistory(JSON.parse(historyData));
    }
  }, []);
  
  // Format date for display
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get badge color based on assessment type
  const getBadgeColor = (type) => {
    switch(type) {
      case 'roadRisk':
        return { bg: '#e6f7ff', text: '#0066cc' };
      case 'culvertSizing':
        return { bg: '#e6ffed', text: '#006633' };
      default:
        return { bg: '#f5f5f5', text: '#666666' };
    }
  };
  
  // Get title based on assessment data
  const getAssessmentTitle = (assessment) => {
    if (assessment.type === 'roadRisk') {
      return assessment.data?.basicInfo?.roadName || 'Untitled Road Risk Assessment';
    } else if (assessment.type === 'culvertSizing') {
      return assessment.data?.title || 'Untitled Culvert Sizing';
    }
    return 'Untitled Assessment';
  };
  
  // Get location info
  const getLocationInfo = (assessment) => {
    if (assessment.type === 'roadRisk' && assessment.data?.basicInfo) {
      const { startKm, endKm } = assessment.data.basicInfo;
      
      if (startKm && endKm) {
        return `KM ${startKm} - ${endKm}`;
      }
      
      if (startKm) {
        return `KM ${startKm}`;
      }
    } else if (assessment.type === 'culvertSizing' && assessment.data) {
      return assessment.data.location || 'No location';
    }
    
    return 'No location';
  };
  
  // Get risk level if it's a road risk assessment
  const getRiskLevel = (assessment) => {
    if (assessment.type !== 'roadRisk' || !assessment.data) return null;
    
    const hazardScore = Object.values(assessment.data.hazardFactors || {}).reduce((sum, score) => sum + score, 0);
    const consequenceScore = Object.values(assessment.data.consequenceFactors || {}).reduce((sum, score) => sum + score, 0);
    const riskScore = hazardScore * consequenceScore;
    
    if (riskScore > 1000) return { level: 'Very High', color: '#F44336' };
    if (riskScore >= 500) return { level: 'High', color: '#FF9800' };
    if (riskScore >= 250) return { level: 'Moderate', color: '#FFC107' };
    if (riskScore >= 150) return { level: 'Low', color: '#4CAF50' };
    return { level: 'Very Low', color: '#2196F3' };
  };
  
  // Handle view assessment (placeholder for future implementation)
  const handleViewAssessment = (assessment) => {
    // For now just log the assessment, in the future this would open a detailed view
    console.log("Viewing assessment:", assessment);
    alert(`Viewing assessment: ${getAssessmentTitle(assessment)}`);
    // Future implementation would navigate to a detailed view page
  };
  
  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: '#1976D2'}}>Assessment History</h1>
        <Link to="/" style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          Back to Dashboard
        </Link>
      </div>
      
      {assessmentHistory.length === 0 ? (
        <div style={{
          padding: '30px', 
          textAlign: 'center', 
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          color: '#666'
        }}>
          <p style={{fontSize: '1.1rem', marginBottom: '15px'}}>No completed assessments found</p>
          <p>Completed assessments will appear here once you export them</p>
        </div>
      ) : (
        <div>
          {assessmentHistory.map((assessment, index) => {
            const badgeColor = getBadgeColor(assessment.type);
            const riskLevel = assessment.type === 'roadRisk' ? getRiskLevel(assessment) : null;
            
            return (
              <div key={index} style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #eee'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                  <div>
                    <h3 style={{margin: '0 0 8px 0', color: '#333'}}>
                      {getAssessmentTitle(assessment)}
                    </h3>
                    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                      <span style={{
                        fontSize: '0.8rem',
                        backgroundColor: badgeColor.bg,
                        color: badgeColor.text,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {assessment.type === 'roadRisk' ? 'Road Risk' : 'Culvert Sizing'}
                      </span>
                      
                      {riskLevel && (
                        <span style={{
                          fontSize: '0.8rem',
                          backgroundColor: `${riskLevel.color}22`,
                          color: riskLevel.color,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          {riskLevel.level} Risk
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '0.9rem', color: '#666', marginBottom: '4px'}}>
                      {formatDate(assessment.completedAt)}
                    </div>
                    <div style={{fontSize: '0.9rem', color: '#666'}}>
                      {assessment.inspector ? `Inspector: ${assessment.inspector}` : ''}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderTop: '1px solid #eee',
                  borderBottom: '1px solid #eee',
                  marginBottom: '12px',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  <span>{getLocationInfo(assessment)}</span>
                  <span>{assessment.photoCount ? `${assessment.photoCount} photos` : 'No photos'}</span>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                  <button 
                    onClick={() => handleViewAssessment(assessment)}
                    style={{
                      backgroundColor: '#1976D2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;