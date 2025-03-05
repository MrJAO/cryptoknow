import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { subscribeToAirdrops } from "../../utils/supabaseSubscription";
import { Link } from "react-router-dom";

const AvailableAirdrops = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [user, setUser] = useState(null);
  const [addedProjects, setAddedProjects] = useState(new Set());
  const [filters, setFilters] = useState({
    chain: "",
    airdrop_type: "",
    device_needed: ""
  });

useEffect(() => {
  const getCurrentUserAndTasks = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    if (user) {
      setUser(user);  // ✅ First, set the user
      fetchToDoList(user);  // ✅ Then fetch the to-do list
    }
  };

  const fetchToDoList = async (loggedInUser) => {
    const { data: tasks, error } = await supabase
      .from("to_do_list")
      .select("slug")
      .eq("discord_username", loggedInUser.user_metadata?.full_name || "");

    if (error) {
      console.error("❌ Error fetching to-do list:", error);
      return;
    }
    setAddedProjects(new Set(tasks?.map((t) => t.slug) || []));
  };

  getCurrentUserAndTasks();
}, []);  // ✅ Runs once when component mounts

  useEffect(() => {
    const channel = subscribeToAirdrops(setAirdrops);
    return () => {
      try {
        channel?.unsubscribe();
      } catch (error) {
        console.warn("Error unsubscribing from airdrops:", error);
      }
    };
  }, []);

const handleAddToDo = async (airdrop) => {
  if (!user) {
    alert("Please log in to add a task.");
    return;
  }

  const user_id = user.id;
  const discord_username = user.user_metadata?.full_name || "Unknown User";

  // ✅ Use upsert instead of insert to prevent duplicate errors
  const { error } = await supabase
    .from("to_do_list")
    .upsert([{ 
      user_id,
      discord_username,
      slug: airdrop.slug, 
      content: `Airdrop: ${airdrop.project_name} - ${airdrop.details}`,
      created_at: new Date().toISOString()
    }], { onConflict: ["user_id", "slug"] });  // ✅ Prevents duplicate entries

  if (error) {
    console.error("❌ Error adding to To-Do List:", error);
    alert("Failed to add. Please try again.");
  } else {
    alert("Added to your To-Do List!");
    setAddedProjects((prev) => new Set(prev).add(airdrop.slug)); 
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
                  {addedProjects.has(airdrop.slug) ? (
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
