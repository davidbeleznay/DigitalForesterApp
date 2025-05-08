import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/sharedStyles';

function CulvertSizingForm() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    inspector: ''
  });
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Auto-save to localStorage on change
    saveToLocalStorage({
      ...formData,
      [name]: value
    });
  };
  
  // Save form data to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('culvertSizingForm', JSON.stringify(data));
  };
  
  // Save draft explicitly
  const handleSaveDraft = () => {
    saveToLocalStorage(formData);
    setStatusMessage('Draft saved successfully!');
    setShowStatus(true);
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
  };
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('culvertSizingForm');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);
  
  return (
    <div style={styles.container}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
        <Link to="/" style={{
          ...styles.link,
          display: 'flex',
          alignItems: 'center', 
          marginRight: '12px',
          fontSize: '0.875rem'
        }}>
          <span style={{marginRight: '4px'}}>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <h1 style={{...styles.header, color: '#059669'}}>Culvert Sizing Tool</h1>
      <p style={{color: '#4b5563', marginBottom: '24px'}}>
        Enter watershed details to calculate appropriate culvert dimensions.
      </p>
      
      {showStatus && (
        <div style={styles.statusMessage}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '8px'}}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}
      
      <div style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="title">Assessment Title</label>
          <input 
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Maple Creek Culvert Assessment"
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="location">Location</label>
          <input 
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Maple Creek Crossing"
            style={styles.input}
          />
        </div>
        
        <div style={{
          display: 'grid', 
          gap: '16px', 
          gridTemplateColumns: '1fr', 
          '@media (min-width: 640px)': {
            gridTemplateColumns: '1fr 1fr'
          }
        }}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="date">Assessment Date</label>
            <input 
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="inspector">Inspector Name</label>
            <input 
              type="text"
              id="inspector"
              name="inspector"
              value={formData.inspector}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
        </div>
      </div>
      
      <div style={{marginTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
        <Link to="/" style={{
          ...styles.secondaryButton,
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          Cancel
        </Link>
        
        <div>
          <button 
            type="button"
            onClick={handleSaveDraft}
            style={{
              ...styles.primaryButton,
              backgroundColor: '#059669'
            }}
          >
            Save Draft
          </button>
        </div>
      </div>
      
      <div style={{
        marginTop: '48px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p>Data is saved locally on your device</p>
      </div>
    </div>
  );
}

export default CulvertSizingForm;