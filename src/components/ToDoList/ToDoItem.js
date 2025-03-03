import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

const ToDoItem = ({ task, onDelete, onMarkDone, doneTasks, isEven, finishedTasks }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const isDone = doneTasks[task.id] || false;

  useEffect(() => {
    setIsDisabled(!!finishedTasks[task.id]);
  }, [finishedTasks, task.id]);

  const handleCheckboxToggle = () => {
    if (!isDisabled) {
      onMarkDone(task.id, !isDone);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${task.project_name}"?`)) {
      // Delete from to_do_list
      const { error } = await supabase
        .from('to_do_list')
        .delete()
        .eq('id', task.id);

      if (error) {
        console.error("Error deleting task:", error.message);
        alert(`Failed to delete "${task.project_name}". Please try again.`);
        return;
      }

      // Reset status in available_airdrops to "Add"
      const { error: updateError } = await supabase
        .from('available_airdrops')
        .update({ status: 'Add' }) // Ensure your column name matches
        .eq('slug', task.slug);

      if (updateError) {
        console.error("Error resetting status:", updateError.message);
      }

      onDelete(task.id);
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
        <Link 
          to={`/airdrop/${task.slug}`} 
          className={`text-blue-600 hover:underline ${isDone || isDisabled ? 'line-through text-gray-500' : ''}`}
        >
          {task.available_airdrops?.project_name || task.project_name || 'Unknown'}
        </Link>
      </td>
      <td className="border p-3 text-gray-700">{task.available_airdrops?.chain || 'N/A'}</td>
      <td className="border p-3 text-gray-700">{task.available_airdrops?.airdrop_type || 'N/A'}</td>
      <td className="border p-3 text-gray-700">{task.available_airdrops?.device_needed || 'N/A'}</td>
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
