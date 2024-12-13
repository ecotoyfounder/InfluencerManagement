import React from 'react';
import './App.css';
import CreateInfluencer from './pages/CreateInfluencer/CreateInfluencer';
import InfluencerList from './pages/InfluencerList/InfluencerList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <div className="main-container">
          <Routes>
            <Route path="/" element={<InfluencerList />} />
            <Route path="/create" element={<CreateInfluencer />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;