import React from 'react';

function App() {
  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <h1 style={{color: 'blue'}}>Digital Forester App</h1>
      <p>Welcome to the Digital Forester App</p>
      <div style={{backgroundColor: 'lightblue', padding: '15px', borderRadius: '8px', marginTop: '20px'}}>
        <h2>Test Component</h2>
        <p>If you can see this, React is working!</p>
      </div>
      <div style={{marginTop: '20px'}}>
        <a href="/road-risk" style={{display: 'block', backgroundColor: 'blue', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '5px', marginBottom: '10px', textDecoration: 'none'}}>
          Road Risk Assessment
        </a>
        <a href="/culvert-sizing" style={{display: 'block', backgroundColor: 'green', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '5px', textDecoration: 'none'}}>
          Culvert Sizing Tool
        </a>
      </div>
    </div>
  );
}

export default App;