// src/components/AvailableAirdrops.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AvailableAirdrops = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedAirdropType, setSelectedAirdropType] = useState('');
  const [selectedDeviceNeeded, setSelectedDeviceNeeded] = useState('');
  const [user, setUser] = useState(null);
  const [addedProjects, setAddedProjects] = useState([]);

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
        if (!error) {
          setAddedProjects(tasks.map((t) => t.project_name));
        }
      }
    };
    getCurrentUserAndTasks();
  }, []);

  useEffect(() => {
    const fetchAirdrops = async () => {
      const { data, error } = await supabase
        .from('available_airdrops')
        .select('*')
        .eq('chain', selectedChain)
        .eq('airdrop_type', selectedAirdropType)
        .eq('device_needed', selectedDeviceNeeded);

      if (!error) {
        setAirdrops(data);
      }
    };
    if (selectedChain && selectedAirdropType && selectedDeviceNeeded) {
      fetchAirdrops();
    }
  }, [selectedChain, selectedAirdropType, selectedDeviceNeeded]);

  const handleAddToDo = async (airdrop) => {
    if (!user) {
      alert("Please log in to add a task to your To Do List.");
      return;
    }

    const discord_username = user.user_metadata?.full_name || '';
    const { error } = await supabase.from('to_do_list').insert([
      {
        discord_username,
        project_name: airdrop.project_name,
        task_link: airdrop.task_link,
        chain: airdrop.chain,
        airdrop_type: airdrop.airdrop_type,
        device_needed: airdrop.device_needed,
      }
    ]);

    if (!error) {
      alert("Airdrop added to your To Do List!");
      setAddedProjects((prev) => [...prev, airdrop.project_name]);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Available Airdrops</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select className="p-2 border rounded" onChange={(e) => setSelectedChain(e.target.value)}>
            <option value="">Select Chain</option>
          </select>
          <select className="p-2 border rounded" onChange={(e) => setSelectedAirdropType(e.target.value)}>
            <option value="">Select Airdrop Type</option>
          </select>
          <select className="p-2 border rounded" onChange={(e) => setSelectedDeviceNeeded(e.target.value)}>
            <option value="">Select Device Needed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {airdrops.map((airdrop) => (
            <div key={airdrop.id} className="bg-white shadow-md rounded-lg p-4 border">
              <h3 className="text-lg font-semibold">{airdrop.project_name}</h3>
              <p className="text-gray-600">Chain: {airdrop.chain}</p>
              <p className="text-gray-600">Airdrop Type: {airdrop.airdrop_type}</p>
              <p className="text-gray-600">Device Needed: {airdrop.device_needed}</p>
              <a href={airdrop.task_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block mb-2">Task Link</a>
              {addedProjects.includes(airdrop.project_name) ? (
                <span className="text-green-500 font-bold">Already Added</span>
              ) : (
                <button onClick={() => handleAddToDo(airdrop)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                  Add to My List
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableAirdrops;
