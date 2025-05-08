import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RoadRiskForm() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    inspector: ''
  });
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState('');
  
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
    localStorage.setItem('roadRiskForm', JSON.stringify(data));
  };
  
  // Save draft explicitly
  const handleSaveDraft = () => {
    saveToLocalStorage(formData);
    setStatusMessage('Draft saved successfully!');
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('roadRiskForm');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);
  
  return (
    <div className="app-container">
      <div className="card">
        <h1>Road Risk Assessment</h1>
        <p style={{marginBottom: '20px'}}>Enter road assessment details below:</p>
        
        {statusMessage && (
          <div className="status-message status-success">
            {statusMessage}
          </div>
        )}
        
        <form>
          <div className="form-group">
            <label htmlFor="title">Assessment Title</label>
            <input 
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Forest Road #137 Assessment"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input 
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Forest Road #137"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Assessment Date</label>
            <input 
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="inspector">Inspector Name</label>
            <input 
              type="text"
              id="inspector"
              name="inspector"
              value={formData.inspector}
              onChange={handleInputChange}
              placeholder="e.g., John Smith"
            />
          </div>
          
          <div className="actions">
            <Link to="/" className="btn btn-secondary">
              Back to Dashboard
            </Link>
            
            <button 
              type="button"
              onClick={handleSaveDraft}
              className="btn btn-primary"
            >
              Save Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoadRiskForm;