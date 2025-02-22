import React from 'react';
import { supabase } from '../../supabaseClient';

const ToDoItem = ({ task, onDelete, onMarkDone, doneTasks, isEven }) => {
  const isDone = doneTasks[task.id] || false; 

  const handleCheckboxToggle = () => {
    onMarkDone(task.id, !isDone);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${task.project_name}"?`)) {
      const { error } = await supabase.from('to_do_list').delete().eq('id', task.id);
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
      <td className="border p-3 flex items-center space-x-2">
        <input 
          type="checkbox" 
          checked={isDone} 
          onChange={handleCheckboxToggle} 
          className="w-5 h-5 cursor-pointer"
        />
        <span>{task.project_name}</span>
      </td>
      <td className="border p-3">
        <a 
          href={task.task_link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline"
        >
          View Task
        </a>
      </td>
      <td className="border p-3">{task.chain}</td>
      <td className="border p-3">{task.airdrop_type}</td>
      <td className="border p-3">{task.device_needed}</td>
      <td className="border p-3">
        <button 
          onClick={handleDelete} 
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
        >
          ✖
        </button>
      </td>
    </tr>
  );
};

export default ToDoItem;
