import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { subscribeToAirdrops } from "../../utils/supabaseSubscription"; // Import real-time subscription

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

    // Insert into the "to_do_list" table
    const { error } = await supabase
      .from("to_do_list")
      .insert([{ 
        discord_username, 
        project_name: airdrop.project_name, 
        task_link: airdrop.task_link, 
        chain: airdrop.chain,
        airdrop_type: airdrop.airdrop_type,
        device_needed: airdrop.device_needed,
        status: airdrop.status
      }]);

    if (error) {
      console.error("Error adding to To-Do List:", error);
      alert("Failed to add. Please try again.");
    } else {
      alert("Added to your To-Do List!");
      setAddedProjects((prev) => [...prev, airdrop.project_name]); // Update UI
    }
  };

  // ✅ Filter logic
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

      {/* ✅ Filter Section */}
      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        <select
          className="p-2 border rounded"
          value={filters.chain}
          onChange={(e) => setFilters({ ...filters, chain: e.target.value })}
        >
          <option value="">All Chains</option>
          {[...new Set(airdrops.map(a => a.chain))].map((chain) => (
            <option key={chain} value={chain}>{chain}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.airdrop_type}
          onChange={(e) => setFilters({ ...filters, airdrop_type: e.target.value })}
        >
          <option value="">All Airdrop Types</option>
          {[...new Set(airdrops.map(a => a.airdrop_type))].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filters.device_needed}
          onChange={(e) => setFilters({ ...filters, device_needed: e.target.value })}
        >
          <option value="">All Devices</option>
          {[...new Set(airdrops.map(a => a.device_needed))].map((device) => (
            <option key={device} value={device}>{device}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white text-left">
          {/* Table Header */}
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

          {/* Table Body */}
          <tbody>
            {filteredAirdrops.map((airdrop, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 transition">
                {/* Project Name */}
                <td className="px-6 py-4 font-semibold">{airdrop.project_name}</td>

                {/* Task Link */}
                <td className="px-6 py-4">
                  <a
                    href={airdrop.task_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white font-semibold py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
                  >
                    🌍 Task
                  </a>
                </td>

                {/* Chain */}
                <td className="px-6 py-4">{airdrop.chain}</td>

                {/* Airdrop Type */}
                <td className="px-6 py-4">{airdrop.airdrop_type}</td>

                {/* Device Needed */}
                <td className="px-6 py-4">{airdrop.device_needed}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  {airdrop.status ? (
                    <span className="text-green-600 font-semibold">Ongoing</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Ended</span>
                  )}
                </td>

                {/* Actions (Add to List) */}
                <td className="px-6 py-4">
                  {addedProjects.includes(airdrop.project_name) ? (
                    <span className="text-green-600 font-semibold">✅ Added</span>
                  ) : (
                    <button
                      onClick={() => handleAddToDo(airdrop)}
                      className="bg-green-500 text-white font-semibold py-1 px-3 rounded hover:bg-green-600 transition duration-300"
                    >
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
