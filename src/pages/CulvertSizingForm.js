import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
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
    <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <h1 style={{color: 'green'}}>Culvert Sizing Tool</h1>
      <p style={{marginBottom: '20px'}}>Enter culvert assessment details below:</p>
      
      {statusMessage && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724',
          marginBottom: '15px'
        }}>
          {statusMessage}
        </div>
      )}
      
      <form>
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
            Assessment Title
          </label>
          <input 
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Maple Creek Culvert Assessment"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
            Location
          </label>
          <input 
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Maple Creek Crossing"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
            Assessment Date
          </label>
          <input 
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
            Inspector Name
          </label>
          <input 
            type="text"
            name="inspector"
            value={formData.inspector}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{marginTop: '30px', display: 'flex', justifyContent: 'space-between'}}>
          <Link to="/" style={{
            display: 'inline-block',
            background: '#ccc',
            color: '#333',
            padding: '8px 15px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Back to Dashboard
          </Link>
          
          <button 
            type="button"
            onClick={handleSaveDraft}
            style={{
              background: 'green',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
}

export default CulvertSizingForm;