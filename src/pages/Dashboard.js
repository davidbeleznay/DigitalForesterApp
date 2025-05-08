import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <h1 style={{color: 'blue'}}>Digital Forester App</h1>
      <p style={{marginBottom: '20px'}}>Select a tool to begin:</p>
      
      <div style={{marginBottom: '10px'}}>
        <Link to="/road-risk" style={{
          display: 'block',
          background: 'blue',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          Road Risk Assessment
        </Link>
      </div>
      
      <div>
        <Link to="/culvert-sizing" style={{
          display: 'block',
          background: 'green',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center'
        }}>
          Culvert Sizing Tool
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;