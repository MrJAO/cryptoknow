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
      const { error } = await supabase
        .from('to_do_list')
        .delete()
        .eq('id', task.id);

      if (error) {
        console.error("Error deleting task:", error.message);
        alert(`Failed to delete "${task.project_name}". Please try again.`);
        return;
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
          to={`/airdrop/${task.slug || ''}`} 
          className={`text-blue-600 hover:underline ${isDone || isDisabled ? 'line-through text-gray-500' : ''}`}
        >
          {task.project_name}
        </Link>
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
