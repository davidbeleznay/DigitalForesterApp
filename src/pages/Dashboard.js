import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Digital Forester App</h1>
          <p className="text-gray-600">Select an assessment tool to begin</p>
        </div>
        
        <div className="grid gap-6">
          <Link 
            to="/road-risk" 
            className="block bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-1">Road Risk Assessment</h2>
            <p className="text-sm text-gray-500">Evaluate road conditions and climate impact risks</p>
            
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <span>~10 min to complete</span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                Start
              </span>
            </div>
          </Link>
          
          <Link 
            to="/culvert-sizing" 
            className="block bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-1">Culvert Sizing Tool</h2>
            <p className="text-sm text-gray-500">Calculate appropriate culvert dimensions for watershed conditions</p>
            
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <span>~7 min to complete</span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                Start
              </span>
            </div>
          </Link>
        </div>
        
        {/* Static Recent Assessment placeholders (will be dynamic later) */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Assessments</h3>
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">Forest Road #137</span>
                <span className="text-xs text-gray-500">Road Risk</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">May 2, 2025</span>
                <span className="text-xs py-0.5 px-2 rounded-full bg-yellow-100 text-yellow-800">Draft</span>
              </div>
            </div>
            
            <div className="p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">Maple Creek Crossing</span>
                <span className="text-xs text-gray-500">Culvert Sizing</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Apr 29, 2025</span>
                <span className="text-xs py-0.5 px-2 rounded-full bg-green-100 text-green-800">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
