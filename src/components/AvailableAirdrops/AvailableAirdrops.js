import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { subscribeToAirdrops } from "../../utils/supabaseSubscription"; // Import real-time subscription

const AvailableAirdrops = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [user, setUser] = useState(null);
  const [addedProjects, setAddedProjects] = useState([]);

  useEffect(() => {
    const getCurrentUserAndTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: tasks } = await supabase
          .from("to_do_list")
          .select("project_name")
          .eq("discord_username", user.user_metadata?.full_name || "");
        setAddedProjects(tasks.map((t) => t.project_name));
      }
    };
    getCurrentUserAndTasks();
  }, []);

  // ✅ Subscribe to real-time airdrops updates
  useEffect(() => {
    const channel = subscribeToAirdrops(setAirdrops);
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddToDo = async (airdrop) => {
    if (!user) {
      alert("Please log in to add a task.");
      return;
    }
    const discord_username = user.user_metadata?.full_name || "";
    const { error } = await supabase
      .from("to_do_list")
      .insert([{ discord_username, project_name: airdrop.project_name }]);
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
          <div key={airdrop.project_name} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{airdrop.project_name}</h3>
            <p>Chain: {airdrop.chain}</p>
            <a
              href={airdrop.task_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Task Link
            </a>
            {addedProjects.includes(airdrop.project_name) ? (
              <span className="text-green-500 font-bold block mt-2">
                Already Added
              </span>
            ) : (
              <button
                onClick={() => handleAddToDo(airdrop)}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Add to My List
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableAirdrops;
