import React from 'react';
import Login from '../Login/Login';  // Adjust relative path if needed
import banner from '../../assets/Cryptoknow Logo - Final.webp'; // Replace with your banner image path

function CryptoKnow({ user }) {
  return (
    <div>
      {/* Banner image at the top */}
      <img src={banner} alt="Banner" style={{ width: '100%', objectFit: 'cover' }} />

      {/* Header section with title and login/greeting */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 10px'
      }}>
        <h1>Welcome to CryptoKnow</h1>
		<h2> Your Hub for Crypto Oppurtunities! </h2>
        {user ? (
          <p style={{ margin: 0, fontSize: '1.2rem' }}>
            Hello, {user.user_metadata?.full_name || user.email}
          </p>
        ) : (
          <Login />
        )}
      </div>

      <p> Your Hub for Crypto Oppurtunities!</p>
      {/* Additional content can be added below */}
    </div>
  );
}

export default CryptoKnow;
