import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Voting from './pages/Voting';
import Results from './pages/Results';
import CreateElection from './pages/CreateElection';
import OverallResults from './pages/OverallResults'; // Naya page import kiya

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/voting/:id" element={<Voting />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/create-election" element={<CreateElection />} />
        {/* Saare votes aik sath dekhne ka global route */}
        <Route path="/overall-results" element={<OverallResults />} />
      </Routes>
    </Router>
  );
}

export default App;