import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CoinFlip from './pages/CoinFlip';
import Admin from './pages/Admin';


function App() {
  return (
    <Router>
 
        <Routes>
          
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<CoinFlip />} />

        </Routes>
 
    </Router>
  );
}

export default App;
