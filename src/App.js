import React from 'react';

function App() {
  return (
    <div className="app-container p-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">Digital Forester App</h1>
        <p className="text-center text-gray-700 mb-6">Welcome to the Digital Forester App</p>
        
        <div className="bg-blue-100 p-4 rounded-md">
          <h2 className="text-lg font-medium text-blue-800">Test Component</h2>
          <p className="text-blue-700">If you can see this, React is rendering correctly!</p>
        </div>
        
        <div className="mt-6 grid gap-4">
          <a 
            href="/road-risk" 
            className="block bg-blue-500 text-white text-center py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Go to Road Risk Assessment
          </a>
          
          <a 
            href="/culvert-sizing" 
            className="block bg-green-500 text-white text-center py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            Go to Culvert Sizing Tool
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;