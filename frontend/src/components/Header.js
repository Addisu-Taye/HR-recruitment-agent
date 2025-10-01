import React from 'react';

export default function Header({ currentView, setCurrentView }) {
  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hibret Bank HR</h1>
              <p className="text-primary-200 text-sm">Recruitment Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-3">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${
                currentView === 'dashboard' 
                  ? 'bg-white text-primary-700 shadow-md' 
                  : 'bg-primary-600 hover:bg-primary-500'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('apply')}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${
                currentView === 'apply' 
                  ? 'bg-white text-primary-700 shadow-md' 
                  : 'bg-primary-600 hover:bg-primary-500'
              }`}
            >
              Apply Now
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}