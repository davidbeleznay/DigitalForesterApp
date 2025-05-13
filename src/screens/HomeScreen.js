// src/screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { formatDate } from '../constants/constants';

const HomeScreen = () => {
  // Mock draft data - in a real app, this would come from localStorage or an API
  const [drafts, setDrafts] = useState([
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
  ]);

  return (
    <div className="container">
      <ThemeToggle />
      
      <h1 className="main-title">Digital Forester App</h1>
      
      <p style={{ textAlign: 'center', marginBottom: '32px' }}>
        Select a tool to begin:
      </p>
      
      <div className="tool-container">
        <button className="tool-btn primary">
          Road Risk Assessment
        </button>
        
        <Link to="/culvert" style={{ textDecoration: 'none' }}>
          <button className="tool-btn success">
            Culvert Sizing Tool
          </button>
        </Link>
        
        <button className="tool-btn secondary">
          Assessment History
        </button>
      </div>
      
      {drafts.length > 0 && (
        <>
          <h2 className="section-title">Recent Drafts</h2>
          
          <div>
            {drafts.map(draft => (
              <div key={draft.id} className="draft-card">
                <div className="draft-row">
                  <div className="draft-info">
                    <h3 className="draft-title">{draft.title}</h3>
                    <p className="draft-subtitle">{draft.location}</p>
                  </div>
                  
                  <div className="draft-meta">
                    <span className={`draft-type ${draft.type}`}>
                      {draft.type === 'risk' ? 'Road Risk' : 'Culvert Sizing'}
                    </span>
                    <span className="draft-date">{formatDate(draft.date)}</span>
                  </div>
                </div>
                
                <Link to={draft.path} className="draft-action">
                  Continue editing →
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