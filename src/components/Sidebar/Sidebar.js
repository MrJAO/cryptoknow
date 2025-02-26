// src/components/Sidebar/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../assets/Cryptoknow Logo - Final.webp';

function Sidebar({ isLoggedIn }) {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Website Logo" className="logo" />
      </div>

      <button className="nav-button" onClick={() => navigate('/')}>CryptoKnow</button>
      <button className="nav-button" onClick={() => navigate('/search')}>Search</button>

      {isLoggedIn && (
        <>
          <button className="nav-button" onClick={() => navigate('/to-do-list')}>To Do List</button>
          <button className="nav-button" onClick={() => navigate('/available-airdrops')}>Available Airdrops</button>
		  <button className="nav-button" onClick={() => navigate('/available-opportunities')}>Available Opportunities</button>		  
		  <button className="nav-button" onClick={() => navigate('/contribute')}>Contribute</button>
          <button className="nav-button" onClick={() => navigate('/quests')}>Quests</button>		  
      )}

      <button className="nav-button" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
      <button className="nav-button" onClick={() => navigate('/harvests')}>Harvests</button>
      <button className="nav-button" onClick={() => navigate('/faqs')}>FAQs</button>
      <button className="nav-button" onClick={() => navigate('/about')}>About</button>	  
    </div>
  );
}

export default Sidebar;
