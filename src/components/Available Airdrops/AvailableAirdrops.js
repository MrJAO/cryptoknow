// AvailableAirdrops.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const AvailableAirdrops = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [user, setUser] = useState(null);
  const [addedProjects, setAddedProjects] = useState([]);

  useEffect(() => {
    const getCurrentUserAndTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: tasks } = await supabase.from('to_do_list').select('project_name').eq('discord_username', user.user_metadata?.full_name || '');
        setAddedProjects(tasks.map((t) => t.project_name));
      }
    };
    getCurrentUserAndTasks();
  }, []);

  useEffect(() => {
    const fetchAirdrops = async () => {
      const { data } = await supabase.from('available_airdrops').select('*');
      setAirdrops(data);
    };
    fetchAirdrops();
  }, []);

  const handleAddToDo = async (airdrop) => {
    if (!user) {
      alert("Please log in to add a task.");
      return;
    }
    const discord_username = user.user_metadata?.full_name || '';
    const { error } = await supabase.from('to_do_list').insert([{ discord_username, project_name: airdrop.project_name }]);
    if (!error) {
      alert("Added to your To-Do List!");
      setAddedProjects((prev) => [...prev, airdrop.project_name]);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Airdrops</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {airdrops.map((airdrop) => (
          <Card key={airdrop.id}>
            <CardContent>
              <h3 className="text-lg font-semibold">{airdrop.project_name}</h3>
              <p>Chain: {airdrop.chain}</p>
              <a href={airdrop.task_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Task Link</a>
              {addedProjects.includes(airdrop.project_name) ? (
                <span className="text-green-500 font-bold">Already Added</span>
              ) : (
                <Button className="mt-2" onClick={() => handleAddToDo(airdrop)}>Add to My List</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableAirdrops;
