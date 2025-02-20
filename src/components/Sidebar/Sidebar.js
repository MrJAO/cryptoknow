import React from 'react';
import './Sidebar.css';
import logo from '../../assets/Cryptoknow Logo - Final.webp'; // Adjust path if needed

function Sidebar({ isLoggedIn }) {
  return (
    <div className="sidebar">
      {/* Logo at the top */}
      <div className="logo-container">
        <img src={logo} alt="Website Logo" className="logo" />
      </div>

      <button className="nav-button">CryptoKnow</button>
      <button className="nav-button">Search</button>
      {isLoggedIn && (
        <>
          <button className="nav-button">To Do List</button>
          <button className="nav-button">Available Airdrops</button>
          <button className="nav-button">Available Checkers</button>
        </>
      )}
      <button className="nav-button">Completed Airdrops</button>
      <button className="nav-button">Leaderboard</button>
      <button className="nav-button">Harvests</button>
      <button className="nav-button">FAQs</button>
    </div>
  );
}

export default Sidebar;
