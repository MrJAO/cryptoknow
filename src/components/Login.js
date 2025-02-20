// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';

const Login = () => {
  const handleDiscordLogin = async () => {
    // Initiate login with Discord provider and specify a redirect URL
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        // Replace with your production URL or 'http://localhost:3000' for local testing
        redirectTo: 'https://cryptoknow.space'
      }
    });
    if (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <button onClick={handleDiscordLogin}>
      Log in with Discord
    </button>
  );
};

export default Login;
