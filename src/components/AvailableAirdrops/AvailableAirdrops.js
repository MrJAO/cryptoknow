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
    const { error } = await supabase
      .from("to_do_list")
      .insert([{ discord_username, project_name: airdrop.project_name }]);
    if (!error) {
      alert("Added to your To-Do List!");
      setAddedProjects((prev) => [...prev, airdrop.project_name]);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🚀 Available Airdrops</h2>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {airdrops.map((airdrop, index) => (
          <div
            key={airdrop.task_link || index}
            className="border border-gray-300 rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition duration-300 ease-in-out"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{airdrop.project_name}</h3>
            <div className="text-sm text-gray-700">
              <p><strong>🔗 Chain:</strong> {airdrop.chain}</p>
              <p><strong>🎁 Airdrop Type:</strong> {airdrop.airdrop_type}</p>
              <p><strong>📱 Device Needed:</strong> {airdrop.device_needed}</p>
              <p>
                <strong>📢 Status:</strong>{" "}
                {airdrop.status ? (
                  <span className="text-green-600 font-semibold">Ongoing</span>
                ) : (
                  <span className="text-red-500 font-semibold">Ended</span>
                )}
              </p>
            </div>

            <div className="mt-4">
              <a
                href={airdrop.task_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                🌍 Task Link
              </a>
            </div>

            <div className="mt-4">
              {addedProjects.includes(airdrop.project_name) ? (
                <span className="text-green-600 font-semibold">✅ Already Added</span>
              ) : (
                <button
                  onClick={() => handleAddToDo(airdrop)}
                  className="w-full mt-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
                >
                  ➕ Add to My List
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableAirdrops;
