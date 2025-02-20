// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';
import './Login.css'; // Import the new CSS file for styling
import logo from '../../discord-icon.png';

const Login = () => {
  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'https://cryptoknow.space' // Update this URL as needed
      }
    });
    if (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <button className="discord-login-button" onClick={handleDiscordLogin}>
      <img src={logo} alt="Discord Logo" className="logo" />
      Log in with Discord
    </button>
  );
};

export default Login;
