import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

const ToDoList = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState({});
  const [finishedTasks, setFinishedTasks] = useState({});

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
      fetchFinishedTasks();
    }
  }, [currentUser]);

  const fetchTasks = async () => {
    if (!currentUser) return;

    const discord_username = currentUser.user_metadata?.user_name || currentUser.user_metadata?.full_name || '';

    if (!discord_username) {
      console.error("No Discord username found for current user.");
      return;
    }

    console.log("Fetching tasks for:", discord_username);

    const { data, error } = await supabase
      .from('to_do_list')
      .select('id, project_name, chain, airdrop_type, device_needed')
      .eq('discord_username', discord_username);

    if (error) {
      console.error("❌ Error fetching tasks:", error.message);
    } else {
      console.log("✅ Fetched tasks:", data);
      setTasks(data || []);
    }
  };

  const fetchFinishedTasks = async () => {
    if (!currentUser) return;

    const discord_username = currentUser.user_metadata?.user_name || currentUser.user_metadata?.full_name || '';
    
    const { data, error } = await supabase
      .from('finished_daily_tasks')
      .select('project_name')
      .eq('discord_username', discord_username);

    if (error) {
      console.error("❌ Error fetching finished tasks:", error.message);
    } else {
      const finished = {};
      data.forEach(task => { finished[task.project_name] = true; });
      setFinishedTasks(finished);
    }
  };

  const handleDeleteTask = (deletedTaskId) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== deletedTaskId));
  };

  const handleSubmitFinishedTasks = async () => {
    if (!currentUser) return;

    const discord_username = currentUser.user_metadata?.user_name || currentUser.user_metadata?.full_name || '';
    console.log("Submitting tasks for:", discord_username);

    const newFinishedTasks = tasks.filter(task => doneTasks[task.id] && !finishedTasks[task.project_name]);

    if (newFinishedTasks.length === 0) {
      alert("No new tasks have been marked as finished.");
      return;
    }

    const inserts = newFinishedTasks.map(task => ({ discord_username, project_name: task.project_name }));

    const { error } = await supabase.from('finished_daily_tasks').insert(inserts);
    if (!error) {
      alert("✅ Finished tasks submitted! They will be refreshed daily.");
      fetchFinishedTasks();
    } else {
      console.error("❌ Error submitting tasks:", error.message);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Your To-Do List</h2>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-white text-left">
                <th className="border p-3">Project Name</th>
                <th className="border p-3">Chain</th>
                <th className="border p-3">Airdrop Type</th>
                <th className="border p-3">Device Needed</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="border p-3">
                    <Link to={`/airdrop/${task.project_name.replace(/\s+/g, '-').toLowerCase()}`} className="text-blue-600 hover:underline">
                      {task.project_name}
                    </Link>
                  </td>
                  <td className="border p-3">{task.chain}</td>
                  <td className="border p-3">{task.airdrop_type}</td>
                  <td className="border p-3">{task.device_needed}</td>
                  <td className="border p-3">
                    <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-800">❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button 
        onClick={handleSubmitFinishedTasks} 
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
      >
        ✅ Submit Finished Tasks
      </button>
    </div>
  );
};

export default ToDoList;
