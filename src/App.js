// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ Corrected import
import { createClient } from '@supabase/supabase-js';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/CryptoKnow';
import ToDoList from './components/ToDoList/ToDoList'; // ✅ Fixed folder name
import AvailableAirdrops from './components/AvailableAirdrops/AvailableAirdrops';
import AvailableCheckers from './components/AvailableCheckers/AvailableCheckers';
import CompletedAirdrops from './components/CompletedAirdrops/CompletedAirdrops';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Harvests from './components/Harvests/Harvests';
import FAQs from './components/FAQs/FAQs';
import './App.css';

// Initialize Supabase
const supabaseUrl = "https://sudquzoonuxtvmjhvjpr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZHF1em9vbnV4dHZtamh2anByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDg0ODMsImV4cCI6MjA1NTYyNDQ4M30.-9gQ6aQXagta6ZxxPNUw5qu40X0O04VfuoC3R63ZFss";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to save user data to the "users" table
const saveUserToDatabase = async (user) => {
  const discordUsername = user.user_metadata?.user_name || user.user_metadata?.full_name || '';
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      discord_username: discordUsername,
      email: user.email,
    });

  if (error) console.error('Error saving user:', error.message);
  else console.log('User saved:', data);
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        saveUserToDatabase(user);
      }
    };
    checkSession();

    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      if (currentUser) saveUserToDatabase(currentUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'https://cryptoknow.space'
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
    <BrowserRouter>
      <div className="app">
        <Sidebar isLoggedIn={isLoggedIn} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/to-do-list" element={<ToDoList user={user} />} />
            <Route path="/available-airdrops" element={<AvailableAirdrops />} />
            <Route path="/available-checkers" element={<AvailableCheckers />} />
            <Route path="/completed-airdrops" element={<CompletedAirdrops />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/harvests" element={<Harvests />} />
            <Route path="/faqs" element={<FAQs />} />
          </Routes>
          <button onClick={isLoggedIn ? handleLogout : handleLogin}>
            {isLoggedIn ? 'Log Out' : 'Log In with Discord'}
          </button>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
