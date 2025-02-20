// src/components/AvailableAirdrops.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AvailableAirdrops = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedAirdropType, setSelectedAirdropType] = useState('');
  const [selectedDeviceNeeded, setSelectedDeviceNeeded] = useState('');
  const [user, setUser] = useState(null);
  const [addedProjects, setAddedProjects] = useState([]); // Array of project names already added

  // Fetch current user and their added projects once when component mounts
  useEffect(() => {
    const getCurrentUserAndTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const discord_username = user.user_metadata?.full_name || '';
        const { data: tasks, error } = await supabase
          .from('to_do_list')
          .select('project_name')
          .eq('discord_username', discord_username);
        if (error) {
          console.error('Error fetching to do tasks:', error.message);
        } else {
          const projects = tasks.map((t) => t.project_name);
          setAddedProjects(projects);
        }
      }
    };
    getCurrentUserAndTasks();
  }, []);

  // Fetch available airdrops whenever the filter criteria change
  useEffect(() => {
    const fetchAirdrops = async () => {
      const { data, error } = await supabase
        .from('available_airdrops')
        .select('*')
        .eq('chain', selectedChain)
        .eq('airdrop_type', selectedAirdropType)
        .eq('device_needed', selectedDeviceNeeded);

      if (error) {
        console.error('Error fetching airdrops:', error);
      } else {
        setAirdrops(data);
      }
    };

    // Only fetch if all filters have been set (or adjust as needed)
    if (selectedChain && selectedAirdropType && selectedDeviceNeeded) {
      fetchAirdrops();
    }
  }, [selectedChain, selectedAirdropType, selectedDeviceNeeded]);

  // Function to add an airdrop to the user's To Do List
  const handleAddToDo = async (airdrop) => {
    if (!user) {
      alert("Please log in to add a task to your To Do List.");
      return;
    }

    const discord_username = user.user_metadata?.full_name || '';
    const { data, error } = await supabase
      .from('to_do_list')
      .insert([
        {
          discord_username,
          project_name: airdrop.project_name,
          task_link: airdrop.task_link,
          chain: airdrop.chain,
          airdrop_type: airdrop.airdrop_type,
          device_needed: airdrop.device_needed,
        }
      ]);

    if (error) {
      console.error("Error adding to To Do List:", error.message);
    } else {
      alert("Airdrop added to your To Do List!");
      // Update the state so this project now shows as "Already Added"
      setAddedProjects((prev) => [...prev, airdrop.project_name]);
    }
  };

  return (
    <div>
      {/* Filter inputs */}
      <select onChange={(e) => setSelectedChain(e.target.value)}>
        <option value="">Select Chain</option>
        {/* Options go here */}
      </select>
      <select onChange={(e) => setSelectedAirdropType(e.target.value)}>
        <option value="">Select Airdrop Type</option>
        {/* Options go here */}
      </select>
      <select onChange={(e) => setSelectedDeviceNeeded(e.target.value)}>
        <option value="">Select Device Needed</option>
        {/* Options go here */}
      </select>

      {/* Render the list of airdrops */}
      {airdrops.map((airdrop) => (
        <div key={airdrop.id}>
          <h3>{airdrop.project_name}</h3>
          <p>{airdrop.task_link}</p>
          {/* Additional details can be rendered here */}
          {addedProjects.includes(airdrop.project_name) ? (
            <span>Already Added</span>
          ) : (
            <button onClick={() => handleAddToDo(airdrop)}>
              Add to My List
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvailableAirdrops;
