import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

// Initialize Supabase
const supabaseUrl = "https://sudquzoonuxtvmjhvjpr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZHF1em9vbnV4dHZtamh2anByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDg0ODMsImV4cCI6MjA1NTYyNDQ4M30.-9gQ6aQXagta6ZxxPNUw5qu40X0O04VfuoC3R63ZFss";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to save user data to the "users" table
const saveUserToDatabase = async (user) => {
  // Extract the Discord username from user metadata. Adjust the key as needed.
  const discordUsername = user.user_metadata?.user_name || user.user_metadata?.full_name || '';
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      discord_username: discordUsername,
      email: user.email,
    });
  if (error) {
    console.error('Error saving user:', error.message);
  } else {
    console.log('User saved:', data);
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        saveUserToDatabase(user);
      }
    };
    checkSession();

    // Listen for auth state changes and save the user info when logged in
    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      if (currentUser) {
        saveUserToDatabase(currentUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'https://cryptoknow.space' // Update this if needed
      }
    });
    if (error) console.error("Login Error:", error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <Sidebar isLoggedIn={isLoggedIn} />
      <div className="main-content">
        <h1>Welcome to CryptoKnow</h1>
        {user ? <p>Hello, {user.user_metadata.full_name}</p> : null}
        <button onClick={isLoggedIn ? handleLogout : handleLogin}>
          {isLoggedIn ? 'Log Out' : 'Log In with Discord'}
        </button>
      </div>
    </div>
  );
}

export default App;
