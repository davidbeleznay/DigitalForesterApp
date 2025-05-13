// src/screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdAdd, MdHistory, MdChevronRight } from 'react-icons/md';
import ThemeToggle from '../components/ThemeToggle';
import { formatDate } from '../constants/constants';

const HomeScreen = () => {
  const navigate = useNavigate();
  
  // Fetch drafts from localStorage on component mount
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from localStorage or API
    const storedDrafts = [
      {
        id: 1,
        title: 'yes',
        location: 'No location',
        type: 'risk',
        date: '2025-05-08',
        path: '/road-risk'
      },
      {
        id: 2,
        title: 'Culvert name',
        location: 'gps',
        type: 'culvert',
        date: '2025-05-07',
        path: '/culvert'
      }
    ];
    setDrafts(storedDrafts);
  }, []);

  // Handle starting a new assessment
  const handleNewAssessment = (type) => {
    // Clear any existing form data for the selected tool
    if (type === 'risk') {
      localStorage.removeItem('roadRiskForm');
      navigate('/road-risk');
    } else if (type === 'culvert') {
      localStorage.removeItem('culvertForm');
      navigate('/culvert');
    }
  };

  return (
    <div className="container">
      <ThemeToggle />
      
      <h1 className="main-title">Digital Forester App</h1>
      
      <p style={{ textAlign: 'center', marginBottom: '32px' }}>
        Select a tool to begin:
      </p>
      
      {/* Tool Cards Grid Layout */}
      <div className="field-card-grid">
        <div 
          className="field-card primary"
          onClick={() => handleNewAssessment('risk')}
        >
          <div className="field-card-content">
            <h2 className="field-card-title">Road Risk Assessment</h2>
            <p className="field-card-description">
              Evaluate forest road conditions and identify potential hazards
            </p>
          </div>
          <div className="field-card-icon">
            <MdAdd size={24} />
          </div>
        </div>
        
        <div 
          className="field-card success"
          onClick={() => handleNewAssessment('culvert')}
        >
          <div className="field-card-content">
            <h2 className="field-card-title">Culvert Sizing Tool</h2>
            <p className="field-card-description">
              Calculate appropriate culvert dimensions for stream crossings
            </p>
          </div>
          <div className="field-card-icon">
            <MdAdd size={24} />
          </div>
        </div>
        
        <Link to="/history" className="field-card secondary" style={{ textDecoration: 'none' }}>
          <div className="field-card-content">
            <h2 className="field-card-title">Assessment History</h2>
            <p className="field-card-description">
              View and manage your previous assessments
            </p>
          </div>
          <div className="field-card-icon">
            <MdHistory size={24} />
          </div>
        </Link>
      </div>
      
      {drafts.length > 0 && (
        <>
          <h2 className="section-title">Recent Drafts</h2>
          
          <div className="drafts-container">
            {drafts.map(draft => (
              <div key={draft.id} className="draft-card">
                <div className="draft-header">
                  <h3 className="draft-title">{draft.title}</h3>
                  <span className={`draft-type ${draft.type}`}>
                    {draft.type === 'risk' ? 'Road Risk' : 'Culvert Sizing'}
                  </span>
                </div>
                
                <div className="draft-details">
                  <p className="draft-location">{draft.location}</p>
                  <p className="draft-date">{formatDate(draft.date)}</p>
                </div>
                
                <Link to={draft.path} className="draft-action">
                  Continue editing <MdChevronRight size={18} style={{ verticalAlign: 'middle' }}/>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="footer">
        <p>Digital Forester App v0.2.0</p>
        <p>© 2025 Forest Management Technologies</p>
      </div>
    </div>
  );
};

export default HomeScreen;