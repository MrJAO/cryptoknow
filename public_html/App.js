import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './App.css';

function App() {
  // Simulate login state; adjust as needed
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app">
      <Sidebar isLoggedIn={isLoggedIn} />
      <div className="main-content">
        {/* Main content goes here */}
        <h1>Welcome to CryptoKnow</h1>
        <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
          {isLoggedIn ? 'Log Out' : 'Log In'}
        </button>
      </div>
    </div>
  );
}

export default App;
