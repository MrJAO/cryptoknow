// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';
import './Login.css'; // Make sure this is the correct relative path
import logo from '../../assets/02_Cat General (Transparent).png'; // Adjust path if needed

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
      <img src={logo} alt="Discord Logo" className="logo" />
      Log in with Discord
    </button>
  );
};

export default Login;
