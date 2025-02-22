import React from 'react';
import banner from '../../assets/CryptoKnow Banner.webp'; // Ensure the path is correct

function CryptoKnow({ user }) {
  console.log("Rendering CryptoKnow with user:", user); // Debug log to check if it's loading correctly

  return (
    <div>
      {/* Banner image */}
      <img src={banner} alt="Banner" style={{ width: '100%', objectFit: 'cover' }} />

      {/* Centered title and login message */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px 10px',
        width: '100%' // Ensure full width for proper alignment
      }}>
        <h1>Welcome to CryptoKnow - Your Hub for Crypto Opportunities!</h1>
        {user && (
          <p style={{ margin: '10px 0', fontSize: '1.2rem' }}>
            Hello, {user.user_metadata?.full_name || user.email}
          </p>
        )}
      </div>
    </div>
  );
}

export default CryptoKnow;
