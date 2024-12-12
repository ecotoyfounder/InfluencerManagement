import React from 'react';
import './App.css';
import CreateInfluencer from './pages/CreateInfluencer';
import InfluencerList from './pages/InfluencerList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<InfluencerList />} />
        <Route path="/create" element={<CreateInfluencer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
