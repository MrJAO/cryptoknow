// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';
import './Login.css'; // Ensure this path is correct
import discordIcon from '../assets/discord-icon.png'; // Import the icon correctly

const Login = () => {
  const handleDiscordLogin = async () => {
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
      <img src={discordIcon} alt="Discord Icon" className="discord-icon" />
      Log in with Discord
    </button>
  );
};

export default Login;
