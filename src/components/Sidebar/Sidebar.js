import React from 'react';
import './Sidebar.css';
import logo from '../../assets/Cryptoknow Logo - Final.webp';

function Sidebar({ isLoggedIn, setActiveTab }) {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Website Logo" className="logo" />
      </div>

      <button className="nav-button" onClick={() => setActiveTab('home')}>CryptoKnow</button>
      <button className="nav-button" onClick={() => setActiveTab('search')}>Search</button>

      {isLoggedIn && (
        <>
          <button className="nav-button" onClick={() => setActiveTab('to-do-list')}>To Do List</button>
          <button className="nav-button" onClick={() => setActiveTab('available-airdrops')}>Available Airdrops</button>
          <button className="nav-button" onClick={() => setActiveTab('available-checkers')}>Available Checkers</button>
        </>
      )}

      <button className="nav-button" onClick={() => setActiveTab('completed-airdrops')}>Completed Airdrops</button>
      <button className="nav-button" onClick={() => setActiveTab('leaderboard')}>Leaderboard</button>
      <button className="nav-button" onClick={() => setActiveTab('harvests')}>Harvests</button>
      <button className="nav-button" onClick={() => setActiveTab('faqs')}>FAQs</button>
    </div>
  );
}

export default Sidebar;
