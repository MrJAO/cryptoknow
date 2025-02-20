// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';

const Login = () => {
  const handleDiscordLogin = async () => {
    // Initiate login with Discord provider
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
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
