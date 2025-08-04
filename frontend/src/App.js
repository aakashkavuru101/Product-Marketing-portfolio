import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import CaseStudyDetail from './components/CaseStudyDetail';
import Frameworks from './components/Frameworks';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/case-study/:id" element={<CaseStudyDetail />} />
            <Route path="/frameworks" element={<Frameworks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;