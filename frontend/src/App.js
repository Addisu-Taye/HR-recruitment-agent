import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ApplicationForm from './components/ApplicationForm';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' ? <Dashboard /> : <ApplicationForm />}
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Hibret Bank S.C. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-1">Ethiopia's Leading Commercial Bank</p>
        </div>
      </footer>
    </div>
  );
}

export default App;