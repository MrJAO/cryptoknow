import React from 'react';
import './Sidebar.css';

function Sidebar({ isLoggedIn }) {
  return (
    <div className="sidebar">
      <button className="nav-button">CryptoKnow</button>
      {isLoggedIn && (
        <>
          <button className="nav-button">To Do List</button>
          <button className="nav-button">Available Airdrops</button>
        </>
      )}
      <button className="nav-button">How To</button>
      <button className="nav-button">Available Checkers</button>
      <button className="nav-button">Completed Airdrops</button>
      <button className="nav-button">Leaderboard</button>
      <button className="nav-button">Harvests</button>
      <button className="nav-button">About</button>
    </div>
  );
}

export default Sidebar;
