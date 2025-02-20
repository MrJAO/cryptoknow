// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#7289da', // Discord's brand color
  color: 'white',
  border: 'none',
  padding: '14px 28px',
  fontSize: '18px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.2s',
  marginTop: '1rem'
};

const iconStyle = {
  width: '24px',
  height: '24px',
  marginRight: '10px'
};

const Login = () => {
  const handleDiscordLogin = async () => {
    // Initiate login with Discord provider and specify a redirect URL
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'https://cryptoknow.space' // Adjust as needed for your environment
      }
    });
    if (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <button style={buttonStyle} onClick={handleDiscordLogin}>
      <img src="/assets/discord-icon-svgrepo-com.svg" alt="Discord Icon" style={iconStyle} />
      Log in with Discord
    </button>
  );
};

export default Login;
