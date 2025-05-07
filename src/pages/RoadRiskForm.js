import React from 'react';
import { Link } from 'react-router-dom';

export default function RoadRiskForm() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Road Risk Assessment</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Draft</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assessment Title</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Forest Road #137 Assessment" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Forest Road #137" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Assessment Date</label>
              <input type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Inspector Name</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            
            <div className="pt-5 mt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                  Back to Dashboard
                </Link>
                <div className="flex space-x-3">
                  <button type="button" className="bg-gray-200 py-2 px-4 rounded-md text-sm font-medium text-gray-700">
                    Save Draft
                  </button>
                  <button type="button" className="bg-blue-600 py-2 px-4 rounded-md text-sm font-medium text-white">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
