// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';
import discordIcon from '../assets/discord-icon.png';

const inlineButtonStyle = {
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
  marginTop: '1rem',
};

const inlineIconStyle = {
  width: '24px',
  height: '24px',
  marginRight: '10px',
};

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
    <button style={inlineButtonStyle} onClick={handleDiscordLogin}>
      <img src={discordIcon} alt="Discord Icon" style={inlineIconStyle} />
      Log in with Discord
    </button>
  );
};

export default Login;
