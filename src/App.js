import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import ToDoList from './components/To Do List/ToDoList';
import AvailableAirdrops from './components/Available Airdrops/AvailableAirdrops';
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
  const [activeTab, setActiveTab] = useState('home'); // Default to Home

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
    const { data, error } = await supabase.auth.signInWithOAuth({
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

  // Function to render different components based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'to-do-list': return <ToDoList />;
      case 'available-airdrops': return <AvailableAirdrops />;
      case 'available-checkers': return <AvailableCheckers />;
      case 'completed-airdrops': return <CompletedAirdrops />;
      case 'leaderboard': return <Leaderboard />;
      case 'harvests': return <Harvests />;
      case 'faqs': return <FAQs />;
      default: return <Home />;
    }
  };

  return (
    <div className="app">
      <Sidebar isLoggedIn={isLoggedIn} setActiveTab={setActiveTab} />
      <div className="main-content">
        {renderContent()}
        <button onClick={isLoggedIn ? handleLogout : handleLogin}>
          {isLoggedIn ? 'Log Out' : 'Log In with Discord'}
        </button>
      </div>
    </div>
  );
}

export default App;
