import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles/RoadRiskForm.css';

function EditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewAssessment = id === 'new';
  
  // State for active section
  const [activeSection, setActiveSection] = useState('basic');
  
  // State for basic information
  const [basicInfo, setBasicInfo] = useState({
    roadName: '',
    startKm: '',
    endKm: '',
    startLat: '',
    startLong: '',
    endLat: '',
    endLong: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: ''
  });

  // State for hazard factors
  const [hazardFactors, setHazardFactors] = useState({
    terrainStability: null,
    slopeGrade: null,
    geologySoil: null,
    drainageConditions: null,
    roadFailureHistory: null
  });

  // State for consequence factors
  const [consequenceFactors, setConsequenceFactors] = useState({
    proximityToWater: null,
    drainageStructure: null,
    publicIndustrialUse: null,
    environmentalValue: null
  });

  // State for optional assessment toggles
  const [optionalAssessments, setOptionalAssessments] = useState({
    geotechnicalEnabled: false,
    infrastructureEnabled: false,
    comments: ''
  });

  // State for geotechnical factors
  const [geotechnicalFactors, setGeotechnicalFactors] = useState({
    cutSlopeHeight: 'low',
    fillSlopeHeight: 'low',
    bedrockCondition: 'low',
    groundwaterConditions: 'low',
    erosionEvidence: 'low'
  });

  // State for infrastructure factors
  const [infrastructureFactors, setInfrastructureFactors] = useState({
    roadSurfaceType: 'low',
    ditchCondition: 'low',
    culvertSizing: 'low',
    culvertCondition: 'low',
    roadAge: 'low'
  });

  // State for assessment metadata
  const [assessmentMetadata, setAssessmentMetadata] = useState({
    id: 'new',
    dateCreated: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
    type: 'roadRisk'
  });

  // State for hazard scores explanation
  const hazardScoreExplanations = {
    terrainStability: {
      2: 'Stable terrain (slopes <40%)',
      4: 'Moderately stable (slopes 40-60%)',
      6: 'Potentially unstable (slopes >60%)',
      10: 'Unstable terrain (Class IV/V or high frequency/vuln.)'
    },
    slopeGrade: {
      2: 'Low grade (<8%)',
      4: 'Moderate grade (8-12%)',
      6: 'Steep grade (12-18%)',
      10: 'Very steep grade (>18%)'
    },
    geologySoil: {
      2: 'Cohesive, stable soils/bedrock',
      4: 'Moderately stable soils',
      6: 'Loose, erodible soils',
      10: 'Highly erodible soils/talus deposits'
    },
    drainageConditions: {
      2: 'Well-drained, minimal surface water',
      4: 'Moderate drainage issues',
      6: 'Poor drainage, standing water',
      10: 'Severe drainage issues, seepage/springs'
    },
    roadFailureHistory: {
      2: 'No previous failures',
      4: 'Minor historical issues',
      6: 'Moderate historical failures',
      10: 'Frequent/significant failures'
    }
  };

  // State for consequence scores explanation
  const consequenceScoreExplanations = {
    proximityToWater: {
      2: 'No water resources nearby (>100m)',
      4: 'Non-fish bearing stream (30-100m)',
      6: 'Fish bearing stream (10-30m)',
      10: 'Adjacent to fish stream (<10m) or drinking water intake'
    },
    drainageStructure: {
      2: 'Adequate for 100+ year events',
      4: 'Adequate for 50-year events',
      6: 'Adequate for 25-year events',
      10: 'Undersized or deteriorating'
    },
    publicIndustrialUse: {
      2: 'Minimal use (wilderness road)',
      4: 'Low volume industrial use',
      6: 'Moderate public/industrial use',
      10: 'High volume/mainline road'
    },
    environmentalValue: {
      2: 'No significant values',
      4: 'Standard riparian/wildlife values',
      6: 'Important habitat or cultural areas',
      10: 'Critical habitat or culturally significant site'
    }
  };

  // Load the assessment data from localStorage or assessment history
  useEffect(() => {
    if (isNewAssessment) {
      // This is a new assessment, set defaults
      // Defaults are already set in state, nothing to do here
      return;
    }
    
    // Try to load from assessment history
    try {
      const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      const assessment = assessmentHistory.find(item => item.id === id);
      
      if (assessment && assessment.type === 'roadRisk') {
        // Set metadata
        setAssessmentMetadata({
          id: assessment.id,
          dateCreated: assessment.dateCreated || new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
          type: 'roadRisk'
        });
        
        // Set form data from assessment data
        if (assessment.data) {
          if (assessment.data.basicInfo) {
            setBasicInfo(assessment.data.basicInfo);
          }
          
          if (assessment.data.hazardFactors) {
            setHazardFactors(assessment.data.hazardFactors);
          }
          
          if (assessment.data.consequenceFactors) {
            setConsequenceFactors(assessment.data.consequenceFactors);
          }
          
          if (assessment.data.optionalAssessments) {
            setOptionalAssessments(assessment.data.optionalAssessments);
          }
          
          if (assessment.data.geotechnicalFactors) {
            setGeotechnicalFactors(assessment.data.geotechnicalFactors);
          }
          
          if (assessment.data.infrastructureFactors) {
            setInfrastructureFactors(assessment.data.infrastructureFactors);
          }
        }
      } else {
        // Assessment not found in history, check legacy localStorage
        loadFromLegacyStorage();
      }
    } catch (error) {
      console.error('Error loading assessment data:', error);
      // Try loading from legacy localStorage
      loadFromLegacyStorage();
    }
  }, [id, isNewAssessment]);
  
  // Load data from legacy localStorage
  const loadFromLegacyStorage = () => {
    try {
      // Basic info
      const savedBasicInfo = localStorage.getItem('roadRiskBasicInfo');
      if (savedBasicInfo) {
        setBasicInfo(JSON.parse(savedBasicInfo));
      }
      
      // Hazard factors
      const savedHazardFactors = localStorage.getItem('roadRiskHazardFactors');
      if (savedHazardFactors) {
        setHazardFactors(JSON.parse(savedHazardFactors));
      }
      
      // Consequence factors
      const savedConsequenceFactors = localStorage.getItem('roadRiskConsequenceFactors');
      if (savedConsequenceFactors) {
        setConsequenceFactors(JSON.parse(savedConsequenceFactors));
      }
      
      // Optional assessments
      const savedOptionalAssessments = localStorage.getItem('roadRiskOptionalAssessments');
      if (savedOptionalAssessments) {
        setOptionalAssessments(JSON.parse(savedOptionalAssessments));
      }
      
      // Geotechnical factors
      const savedGeotechnicalFactors = localStorage.getItem('roadRiskGeotechnicalFactors');
      if (savedGeotechnicalFactors) {
        setGeotechnicalFactors(JSON.parse(savedGeotechnicalFactors));
      }
      
      // Infrastructure factors
      const savedInfrastructureFactors = localStorage.getItem('roadRiskInfrastructureFactors');
      if (savedInfrastructureFactors) {
        setInfrastructureFactors(JSON.parse(savedInfrastructureFactors));
      }
    } catch (error) {
      console.error('Error loading from legacy storage:', error);
    }
  };
  
  // Save all form data to localStorage
  useEffect(() => {
    // Always save to legacy storage as a local draft
    localStorage.setItem('roadRiskBasicInfo', JSON.stringify(basicInfo));
    localStorage.setItem('roadRiskHazardFactors', JSON.stringify(hazardFactors));
    localStorage.setItem('roadRiskConsequenceFactors', JSON.stringify(consequenceFactors));
    localStorage.setItem('roadRiskOptionalAssessments', JSON.stringify(optionalAssessments));
    localStorage.setItem('roadRiskGeotechnicalFactors', JSON.stringify(geotechnicalFactors));
    localStorage.setItem('roadRiskInfrastructureFactors', JSON.stringify(infrastructureFactors));
  }, [
    basicInfo, 
    hazardFactors, 
    consequenceFactors, 
    optionalAssessments, 
    geotechnicalFactors, 
    infrastructureFactors
  ]);
  
  // Handle basic info input changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle hazard factor selection
  const handleHazardFactorChange = (factor, value) => {
    setHazardFactors(prev => ({ ...prev, [factor]: value }));
  };

  // Handle consequence factor selection
  const handleConsequenceFactorChange = (factor, value) => {
    setConsequenceFactors(prev => ({ ...prev, [factor]: value }));
  };

  // Handle optional assessment toggle
  const handleOptionalAssessmentToggle = (assessment) => {
    setOptionalAssessments(prev => ({ 
      ...prev, 
      [assessment]: !prev[assessment] 
    }));
  };

  // Handle comments change
  const handleCommentsChange = (e) => {
    setOptionalAssessments(prev => ({
      ...prev,
      comments: e.target.value
    }));
  };

  // Handle geotechnical factor change
  const handleGeotechnicalFactorChange = (factor, value) => {
    setGeotechnicalFactors(prev => ({
      ...prev,
      [factor]: value
    }));
  };

  // Handle infrastructure factor change
  const handleInfrastructureFactorChange = (factor, value) => {
    setInfrastructureFactors(prev => ({
      ...prev,
      [factor]: value
    }));
  };

  // Calculate hazard score
  const calculateHazardScore = () => {
    let total = 0;
    let factorCount = 0;
    
    Object.values(hazardFactors).forEach(value => {
      if (value !== null) {
        total += value;
        factorCount++;
      }
    });
    
    return factorCount > 0 ? total : 0;
  };

  // Calculate consequence score
  const calculateConsequenceScore = () => {
    let total = 0;
    let factorCount = 0;
    
    Object.values(consequenceFactors).forEach(value => {
      if (value !== null) {
        total += value;
        factorCount++;
      }
    });
    
    return factorCount > 0 ? total : 0;
  };

  // Calculate total risk score (hazard x consequence)
  const calculateRiskScore = () => {
    const hazardScore = calculateHazardScore();
    const consequenceScore = calculateConsequenceScore();
    
    return hazardScore * consequenceScore;
  };

  // Determine risk category
  const getRiskCategory = () => {
    const riskScore = calculateRiskScore();
    
    if (riskScore >= 300) return { category: 'Very High', color: '#d32f2f' };
    if (riskScore >= 200) return { category: 'High', color: '#f57c00' };
    if (riskScore >= 100) return { category: 'Moderate', color: '#fbc02d' };
    if (riskScore >= 50) return { category: 'Low', color: '#689f38' };
    return { category: 'Very Low', color: '#388e3c' };
  };
  
  // Use GPS location for start coordinates
  const handleUseStartGpsLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBasicInfo(prev => ({
            ...prev,
            startLat: position.coords.latitude.toFixed(6),
            startLong: position.coords.longitude.toFixed(6)
          }));
          alert('GPS coordinates captured successfully for start point!');
        },
        (error) => {
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser/device');
    }
  };

  // Use GPS location for end coordinates
  const handleUseEndGpsLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBasicInfo(prev => ({
            ...prev,
            endLat: position.coords.latitude.toFixed(6),
            endLong: position.coords.longitude.toFixed(6)
          }));
          alert('GPS coordinates captured successfully for end point!');
        },
        (error) => {
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser/device');
    }
  };
  
  // Save assessment
  const handleSaveAssessment = () => {
    try {
      // Get existing assessments from localStorage
      const existingAssessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      
      // Prepare the assessment data
      const assessmentData = {
        basicInfo,
        hazardFactors,
        consequenceFactors,
        optionalAssessments,
        geotechnicalFactors,
        infrastructureFactors,
        riskScore: calculateRiskScore(),
        riskCategory: getRiskCategory().category
      };
      
      // Prepare the assessment object
      const newAssessment = {
        id: isNewAssessment ? `road-risk-${Date.now()}` : assessmentMetadata.id,
        type: 'roadRisk',
        title: basicInfo.roadName || 'Untitled Road Risk Assessment',
        dateCreated: isNewAssessment ? new Date().toISOString() : assessmentMetadata.dateCreated,
        dateUpdated: new Date().toISOString(),
        data: assessmentData
      };
      
      // Update or add the assessment
      let updatedAssessments;
      
      if (isNewAssessment) {
        // Add to the beginning of the array
        updatedAssessments = [newAssessment, ...existingAssessments];
      } else {
        // Replace existing assessment
        updatedAssessments = existingAssessments.map(assessment => 
          assessment.id === newAssessment.id ? newAssessment : assessment
        );
      }
      
      // Save back to localStorage
      localStorage.setItem('assessmentHistory', JSON.stringify(updatedAssessments));
      
      // Update metadata
      setAssessmentMetadata({
        id: newAssessment.id,
        dateCreated: newAssessment.dateCreated,
        dateUpdated: newAssessment.dateUpdated,
        type: 'roadRisk'
      });
      
      alert('Assessment saved successfully!');
      
      // Navigate to the list view
      navigate('/road-risk');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment: ' + error.message);
    }
  };
  
  // Save assessment as draft
  const handleSaveDraft = () => {
    try {
      // Get existing assessments from localStorage
      const existingAssessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      
      // Prepare the assessment data
      const assessmentData = {
        basicInfo,
        hazardFactors,
        consequenceFactors,
        optionalAssessments,
        geotechnicalFactors,
        infrastructureFactors
      };
      
      // Prepare the assessment object
      const newAssessment = {
        id: isNewAssessment ? `road-risk-draft-${Date.now()}` : assessmentMetadata.id,
        type: 'roadRisk',
        status: 'draft',
        title: basicInfo.roadName || 'Draft Road Risk Assessment',
        dateCreated: isNewAssessment ? new Date().toISOString() : assessmentMetadata.dateCreated,
        dateUpdated: new Date().toISOString(),
        data: assessmentData
      };
      
      // Update or add the assessment
      let updatedAssessments;
      
      if (isNewAssessment) {
        // Add to the beginning of the array
        updatedAssessments = [newAssessment, ...existingAssessments];
      } else {
        // Replace existing assessment
        updatedAssessments = existingAssessments.map(assessment => 
          assessment.id === newAssessment.id ? newAssessment : assessment
        );
      }
      
      // Save back to localStorage
      localStorage.setItem('assessmentHistory', JSON.stringify(updatedAssessments));
      
      // Update metadata
      setAssessmentMetadata({
        id: newAssessment.id,
        dateCreated: newAssessment.dateCreated,
        dateUpdated: newAssessment.dateUpdated,
        type: 'roadRisk'
      });
      
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft: ' + error.message);
    }
  };
  
  // Reset form fields
  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset all form fields? This cannot be undone.')) {
      setBasicInfo({
        roadName: '',
        startKm: '',
        endKm: '',
        startLat: '',
        startLong: '',
        endLat: '',
        endLong: '',
        assessmentDate: new Date().toISOString().split('T')[0],
        assessor: ''
      });
      
      setHazardFactors({
        terrainStability: null,
        slopeGrade: null,
        geologySoil: null,
        drainageConditions: null,
        roadFailureHistory: null
      });

      setConsequenceFactors({
        proximityToWater: null,
        drainageStructure: null,
        publicIndustrialUse: null,
        environmentalValue: null
      });

      setOptionalAssessments({
        geotechnicalEnabled: false,
        infrastructureEnabled: false,
        comments: ''
      });

      setGeotechnicalFactors({
        cutSlopeHeight: 'low',
        fillSlopeHeight: 'low',
        bedrockCondition: 'low',
        groundwaterConditions: 'low',
        erosionEvidence: 'low'
      });

      setInfrastructureFactors({
        roadSurfaceType: 'low',
        ditchCondition: 'low',
        culvertSizing: 'low',
        culvertCondition: 'low',
        roadAge: 'low'
      });
      
      alert('Form has been reset.');
    }
  };

  // Get color class for score button
  const getScoreButtonColorClass = (score) => {
    switch (score) {
      case 2: return 'green';
      case 4: return 'yellow';
      case 6: return 'orange';
      case 10: return 'red';
      default: return '';
    }
  };
  
  return (
    <div className="road-risk-form">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/road-risk" className="breadcrumb-link">Road Risk Assessment</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{isNewAssessment ? 'New Assessment' : 'Edit Assessment'}</span>
      </div>
      
      <h1 className="form-title">
        {isNewAssessment ? 'New Road Risk Assessment' : `Edit: ${basicInfo.roadName || 'Untitled Assessment'}`}
      </h1>
      
      {/* Form Section Navigation */}
      <div className="form-nav">
        <button 
          className={`form-nav-button ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          Basic Information
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'hazard' ? 'active' : ''}`}
          onClick={() => setActiveSection('hazard')}
        >
          Hazard Factors
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'consequence' ? 'active' : ''}`}
          onClick={() => setActiveSection('consequence')}
        >
          Consequence Factors
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'optional' ? 'active' : ''}`}
          onClick={() => setActiveSection('optional')}
        >
          Optional Assessments
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'results' ? 'active' : ''}`}
          onClick={() => setActiveSection('results')}
        >
          Results
        </button>
      </div>
      
      {/* Basic Information Section */}
      {activeSection === 'basic' && (
        <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
          <h2 className="section-header" style={{ color: '#2196f3' }}>
            <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
            Basic Information
          </h2>
          
          <p className="section-description">
            Enter the general information about the road segment being assessed.
          </p>
          
          {/* Same form content as original RoadRiskForm for Basic Information section */}
          {/* ... */}
          
          <div className="section-nav-buttons">
            <div></div> {/* Empty div for spacing */}
            <button 
              type="button" 
              className="section-nav-button next"
              onClick={() => setActiveSection('hazard')}
            >
              Next: Hazard Factors
            </button>
          </div>
        </div>
      )}
      
      {/* Hazard Factors Section */}
      {activeSection === 'hazard' && (
        <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
          {/* Content same as original RoadRiskForm */}
          {/* ... */}
        </div>
      )}
      
      {/* Consequence Factors Section */}
      {activeSection === 'consequence' && (
        <div className="form-section" style={{ borderTop: '4px solid #9c27b0' }}>
          {/* Content same as original RoadRiskForm */}
          {/* ... */}
        </div>
      )}
      
      {/* Optional Assessments Section */}
      {activeSection === 'optional' && (
        <div className="form-section" style={{ borderTop: '4px solid #00bcd4' }}>
          {/* Content same as original RoadRiskForm */}
          {/* ... */}
        </div>
      )}
      
      {/* Results Section */}
      {activeSection === 'results' && (
        <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
          {/* Content same as original RoadRiskForm */}
          {/* ... */}
        </div>
      )}
      
      {/* Action Buttons - Modified from original */}
      <div className="form-actions">
        <button 
          className="action-button primary"
          onClick={handleSaveAssessment}
        >
          Save Assessment
        </button>
        <button 
          className="action-button secondary"
          onClick={handleSaveDraft}
        >
          Save Draft
        </button>
        <button 
          className="action-button tertiary"
          onClick={handleResetForm}
        >
          Reset Form
        </button>
        <Link to="/road-risk" className="action-button tertiary">Back to List</Link>
      </div>
    </div>
  );
}

export default EditScreen;
