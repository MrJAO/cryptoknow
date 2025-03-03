import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/CryptoKnow';
import Search from './components/Search/Search';
import ToDoList from './components/ToDoList/ToDoList';
import AvailableAirdrops from './components/AvailableAirdrops/AvailableAirdrops';
import AvailableOpportunities from './components/AvailableOpportunities/AvailableOpportunities';
import Contribute from './components/Contribute/ContributeSubmissionForm';
import Quests from './components/Quests/Quests';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Harvests from './components/Harvests/Harvests';
import FAQs from './components/FAQs/FAQs';
import About from './components/About/About';
import GuidePage from './components/guides/GuidePage';
import AirdropPages from './components/AirdropPages/AirdropPages';
import './App.css';

const supabaseUrl = "https://sudquzoonuxtvmjhvjpr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZHF1em9vbnV4dHZtamh2anByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDg0ODMsImV4cCI6MjA1NTYyNDQ4M30.-9gQ6aQXagta6ZxxPNUw5qu40X0O04VfuoC3R63ZFss";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        saveUserToDatabase(user);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        saveUserToDatabase(session.user);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const saveUserToDatabase = async (user) => {
    if (!user) return;

    const discordUsername = user.user_metadata?.user_name || user.user_metadata?.full_name || '';

    await supabase
      .from('users')
      .upsert({
        id: user.id,
        discord_username: discordUsername,
        email: user.email,
      });
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: 'https://cryptoknow.space' }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar isLoggedIn={!!user} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/search" element={<Search />} />
            <Route path="/to-do-list" element={<ToDoList currentUser={user} />} />
            <Route path="/available-airdrops" element={<AvailableAirdrops />} />
            <Route path="/available-opportunities" element={<AvailableOpportunities />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/harvests" element={<Harvests />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/about" element={<About />} />
            <Route path="/airdrop/:slug" element={<AirdropPages />} />
            <Route path="/guides/:slug" element={<GuidePage />} />
          </Routes>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '20px' }}>
            <button onClick={user ? handleLogout : handleLogin}>
              {user ? 'Log Out' : 'Log In with Discord'}
            </button>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
