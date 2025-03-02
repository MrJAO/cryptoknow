import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { subscribeToAirdrops } from "../../utils/supabaseSubscription"; // Import real-time subscription
import { Link } from "react-router-dom"; // Import Link for navigation

const AvailableAirdrops = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [user, setUser] = useState(null);
  const [addedProjects, setAddedProjects] = useState([]);
  const [filters, setFilters] = useState({
    chain: "",
    airdrop_type: "",
    device_needed: ""
  });

  useEffect(() => {
    const getCurrentUserAndTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: tasks } = await supabase
          .from("to_do_list")
          .select("project_name")
          .eq("discord_username", user.user_metadata?.full_name || "");
        setAddedProjects(tasks?.map((t) => t.project_name) || []);
      }
    };
    getCurrentUserAndTasks();
  }, []);

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
      .insert([{ 
        discord_username, 
        project_name: airdrop.project_name, 
        task_link: airdrop.task_link, 
        chain: airdrop.chain,
        airdrop_type: airdrop.airdrop_type,
        device_needed: airdrop.device_needed,
        status: airdrop.status,
        slug: airdrop.slug, // Include slug
        content: airdrop.content // Include content
      }]);

    if (error) {
      console.error("Error adding to To-Do List:", error);
      alert("Failed to add. Please try again.");
    } else {
      alert("Added to your To-Do List!");
      setAddedProjects((prev) => [...prev, airdrop.project_name]); 
    }
  };

  const filteredAirdrops = airdrops.filter((airdrop) => {
    return (
      (filters.chain === "" || airdrop.chain === filters.chain) &&
      (filters.airdrop_type === "" || airdrop.airdrop_type === filters.airdrop_type) &&
      (filters.device_needed === "" || airdrop.device_needed === filters.device_needed)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🚀 Available Airdrops</h2>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white text-left">
          <thead className="bg-gray-800 text-white uppercase">
            <tr>
              <th className="px-6 py-3 border-b">Project Name</th>
              <th className="px-6 py-3 border-b">Task Link</th>
              <th className="px-6 py-3 border-b">Chain</th>
              <th className="px-6 py-3 border-b">Airdrop Type</th>
              <th className="px-6 py-3 border-b">Device Needed</th>
              <th className="px-6 py-3 border-b">Status</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAirdrops.map((airdrop, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 transition">
                <td className="px-6 py-4 font-semibold">
                  <Link to={`/airdrop/${airdrop.slug}`} className="text-blue-500 hover:underline">{airdrop.project_name}</Link>
                </td>
                <td className="px-6 py-4">
                  <a href={airdrop.task_link} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white font-semibold py-1 px-3 rounded hover:bg-blue-600 transition duration-300">
                    🌍 Task
                  </a>
                </td>
                <td className="px-6 py-4">{airdrop.chain}</td>
                <td className="px-6 py-4">{airdrop.airdrop_type}</td>
                <td className="px-6 py-4">{airdrop.device_needed}</td>
                <td className="px-6 py-4">
                  {airdrop.status ? (
                    <span className="text-green-600 font-semibold">Ongoing</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Ended</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {addedProjects.includes(airdrop.project_name) ? (
                    <span className="text-green-600 font-semibold">✅ Added</span>
                  ) : (
                    <button onClick={() => handleAddToDo(airdrop)} className="bg-green-500 text-white font-semibold py-1 px-3 rounded hover:bg-green-600 transition duration-300">
                      ➕ Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableAirdrops;
