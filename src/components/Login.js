// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';
import './Login.css'; // Import the CSS file for styling

const Login = () => {
  const handleDiscordLogin = async () => {
    // Initiate login with Discord provider and specify a redirect URL
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'https://cryptoknow.space'
      }
    });
    if (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <button className="discord-login-button" onClick={handleDiscordLogin}>
      <img src="/assets/discord-icon-svgrepo-com.svg" alt="Discord Icon" className="discord-icon" />
      Log in with Discord
    </button>
  );
};

export default Login;
