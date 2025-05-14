import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RiskLevelSelector from '../components/RiskLevelSelector';
import RiskSelector from '../components/RiskSelector';
import { 
  RISK_FACTORS, 
  RISK_RATING_OPTIONS, 
  calculateRiskScore, 
  getRiskCategory, 
  getRecommendation 
} from '../constants/riskFactors';

/**
 * Road Risk Assessment Form
 * A tool for evaluating and documenting forest road risk factors
 */
function RoadRiskForm() {
  // Initialize default form state
  const initialState = {
    siteName: '',
    location: '',
    assessor: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    ratings: {},
    riskFactors: {}
  };

  // Set up state
  const [formData, setFormData] = useState(initialState);
  const [riskScore, setRiskScore] = useState(0);
  const [riskCategory, setRiskCategory] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  // Initialize risk factors with default values
  useEffect(() => {
    const defaultRiskFactors = {};
    const defaultRatings = {};

    Object.keys(RISK_FACTORS).forEach(key => {
      defaultRiskFactors[key] = RISK_FACTORS[key].defaultValue;
      defaultRatings[key] = 4; // Default to medium-low risk
    });

    setFormData(prev => ({
      ...prev,
      riskFactors: defaultRiskFactors,
      ratings: defaultRatings
    }));
  }, []);

  // Calculate risk score whenever ratings change
  useEffect(() => {
    const score = calculateRiskScore(formData.ratings);
    setRiskScore(score);
    
    const category = getRiskCategory(score);
    setRiskCategory(category);
    
    const rec = getRecommendation(category);
    setRecommendation(rec);
  }, [formData.ratings]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle risk factor level changes
  const handleRiskFactorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      riskFactors: {
        ...prev.riskFactors,
        [name]: value
      }
    }));
  };

  // Handle risk rating changes
  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [name]: parseInt(value, 10)
      }
    }));
  };

  // Save assessment to local storage and navigate to dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate unique ID for this assessment
    const id = `road-risk-${Date.now()}`;
    
    // Format data for storage
    const assessmentData = {
      id,
      type: 'roadRisk',
      title: formData.siteName || 'Untitled Road Assessment',
      dateCreated: new Date().toISOString(),
      data: {
        ...formData,
        riskScore,
        riskCategory,
        recommendation
      }
    };
    
    // Get existing history from localStorage
    const existingHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    
    // Add new assessment to history
    const updatedHistory = [assessmentData, ...existingHistory];
    
    // Save to localStorage
    localStorage.setItem('assessmentHistory', JSON.stringify(updatedHistory));
    
    setSubmitted(true);
    
    // Redirect to history page after a short delay
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  // Reset form to initial state
  const handleReset = () => {
    const defaultRiskFactors = {};
    const defaultRatings = {};

    Object.keys(RISK_FACTORS).forEach(key => {
      defaultRiskFactors[key] = RISK_FACTORS[key].defaultValue;
      defaultRatings[key] = 4; // Default to medium-low risk
    });

    setFormData({
      ...initialState,
      date: new Date().toISOString().split('T')[0],
      riskFactors: defaultRiskFactors,
      ratings: defaultRatings
    });
    
    setSubmitted(false);
  };

  return (
    <div className="road-risk-form" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Road Risk Assessment</h1>
      
      {submitted ? (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#d4edda', 
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center' 
        }}>
          <h3>Assessment Saved!</h3>
          <p>Redirecting to history page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Site Information Section */}
          <div className="form-section" style={{ marginBottom: '20px' }}>
            <h2>Site Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label htmlFor="siteName">Site Name</label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div>
                <label htmlFor="assessor">Assessor</label>
                <input
                  type="text"
                  id="assessor"
                  name="assessor"
                  value={formData.assessor}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
            </div>
          </div>

          {/* Risk Factors Section */}
          <div className="form-section" style={{ marginBottom: '20px' }}>
            <h2>Risk Factors</h2>
            <p>Assess each factor by severity level and numeric rating</p>
            
            {Object.keys(RISK_FACTORS).map(factor => (
              <div key={factor} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>{RISK_FACTORS[factor].title}</h3>
                
                <div style={{ marginBottom: '10px' }}>
                  <label>Risk Level</label>
                  <RiskLevelSelector
                    name={factor}
                    value={formData.riskFactors[factor]}
                    onChange={handleRiskFactorChange}
                    descriptions={RISK_FACTORS[factor].descriptions}
                  />
                </div>
                
                <div>
                  <label>Risk Rating (2-10)</label>
                  <RiskSelector
                    name={factor}
                    value={formData.ratings[factor]}
                    onChange={handleRatingChange}
                    options={RISK_RATING_OPTIONS}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional Notes Section */}
          <div className="form-section" style={{ marginBottom: '20px' }}>
            <h2>Additional Notes</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              style={{ width: '100%', padding: '8px' }}
              placeholder="Enter any additional observations or recommendations..."
            />
          </div>

          {/* Results Section */}
          <div className="form-section" style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#f8f9fa',
            borderRadius: '5px'
          }}>
            <h2>Assessment Results</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <h3>Risk Score</h3>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  padding: '10px',
                  backgroundColor: riskCategory === 'high' ? '#f8d7da' : 
                                  riskCategory === 'moderate' ? '#fff3cd' : '#d4edda',
                  borderRadius: '5px',
                  textAlign: 'center'
                }}>
                  {riskScore}
                </div>
              </div>
              <div>
                <h3>Risk Category</h3>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  padding: '10px',
                  backgroundColor: riskCategory === 'high' ? '#f8d7da' : 
                                  riskCategory === 'moderate' ? '#fff3cd' : '#d4edda',
                  borderRadius: '5px',
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}>
                  {riskCategory || 'Not calculated'}
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '15px' }}>
              <h3>Recommendation</h3>
              <p style={{ 
                padding: '10px', 
                backgroundColor: '#e2e3e5', 
                borderRadius: '5px' 
              }}>
                {recommendation}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/" style={{ 
              padding: '10px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              Cancel
            </Link>
            
            <div>
              <button 
                type="button" 
                onClick={handleReset}
                style={{ 
                  padding: '10px 15px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
              
              <button 
                type="submit"
                style={{ 
                  padding: '10px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save Assessment
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default RoadRiskForm;
