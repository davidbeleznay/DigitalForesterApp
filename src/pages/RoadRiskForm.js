import React from 'react';
import { Link } from 'react-router-dom';

function RoadRiskForm() {
  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <h1 style={{color: 'blue'}}>Road Risk Assessment</h1>
      <p style={{marginBottom: '20px'}}>Enter road assessment details below:</p>
      
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
          Assessment Title
        </label>
        <input 
          type="text" 
          placeholder="e.g., Forest Road #137 Assessment"
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
          placeholder="e.g., Forest Road #137"
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
        
        <button style={{
          background: 'blue',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Save Draft
        </button>
      </div>
    </div>
  );
}

export default RoadRiskForm;