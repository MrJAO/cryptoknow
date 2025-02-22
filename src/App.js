import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import Supabase client
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/CryptoKnow';
import ToDoList from './components/ToDoList/ToDoList';
import AvailableAirdrops from './components/AvailableAirdrops/AvailableAirdrops';
import AvailableCheckers from './components/AvailableCheckers/AvailableCheckers';
import CompletedAirdrops from './components/CompletedAirdrops/CompletedAirdrops';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Harvests from './components/Harvests/Harvests';
import FAQs from './components/FAQs/FAQs';
import './App.css';

const saveUserToDatabase = async (user) => {
  const discordUsername = user.user_metadata?.user_name || '';
  const token = user?.access_token; // Fetch user auth token

  if (!token) {
    console.error('No access token found!');
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        discord_username: discordUsername,
        email: user.email,
      },
      { returning: "minimal" } // Optimize performance
    )
    .eq('id', user.id);

  if (error) console.error('Error saving user:', error.message);
  else console.log('User saved:', data);
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error("Error fetching user session:", error.message);
      
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        saveUserToDatabase(user);
      }
    };
    checkSession();

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      if (currentUser) {
        saveUserToDatabase(currentUser);
        console.log("User updated:", currentUser);
      }
    });

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar isLoggedIn={isLoggedIn} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/to-do-list" element={<ToDoList currentUser={user} />} />
            <Route path="/available-airdrops" element={<AvailableAirdrops />} />
            <Route path="/available-checkers" element={<AvailableCheckers />} />
            <Route path="/completed-airdrops" element={<CompletedAirdrops />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/harvests" element={<Harvests />} />
            <Route path="/faqs" element={<FAQs />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
