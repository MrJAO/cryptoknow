import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const ToDoItem = ({ task, onDelete, onMarkDone, doneTasks, isEven, finishedTasks }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const isDone = doneTasks[task.id] || false;

  useEffect(() => {
    if (finishedTasks[task.project_name]) { // Fix: Check existence in object
      setIsDisabled(true);
    }
  }, [finishedTasks, task.project_name]);

  const handleCheckboxToggle = () => {
    if (!isDisabled) {
      onMarkDone(task.id, !isDone);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${task.project_name}"?`)) {
      // Fetch the user's Discord username
      const { data: userData, error: userError } = await supabase
        .from('to_do_list')
        .select('discord_username')
        .eq('id', task.id)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user data:", userError?.message);
        alert("Failed to retrieve user data. Try again.");
        return;
      }

      const discordUsername = userData.discord_username;
      
      // Delete all entries with the same project_name and discord_username
      const { error } = await supabase
        .from('to_do_list')
        .delete()
        .eq('project_name', task.project_name)
        .eq('discord_username', discordUsername);

      if (!error) {
        onDelete(task.id);
      } else {
        console.error("Error deleting task:", error.message);
        alert("Failed to delete task. Try again.");
      }
    }
  };

  return (
    <tr className={`${isEven ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition duration-200`}>
      <td className="border p-3 flex items-center space-x-3">
        {isDisabled ? (
          <span className="text-green-500 font-semibold">✔ Done</span>
        ) : (
          <input 
            type="checkbox" 
            checked={isDone} 
            onChange={handleCheckboxToggle} 
            className="w-5 h-5 cursor-pointer accent-blue-500"
          />
        )}
        <span className={`text-gray-800 ${isDone || isDisabled ? 'line-through text-gray-500' : ''}`}>
          {task.project_name}
        </span>
      </td>
      <td className="border p-3 text-gray-700">{task.chain}</td>
      <td className="border p-3 text-gray-700">{task.airdrop_type}</td>
      <td className="border p-3 text-gray-700">{task.device_needed}</td>
      <td className="border p-3 text-center">
        <button 
          onClick={handleDelete} 
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
        >
          ✖
        </button>
      </td>
    </tr>
  );
};

export default ToDoItem;
