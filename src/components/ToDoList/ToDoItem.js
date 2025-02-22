import React from 'react';
import { supabase } from '../../supabaseClient';

const ToDoItem = ({ task, onDelete, onMarkDone, doneTasks }) => {
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
    <tr className="border">
      <td className="border p-2">{task.project_name}</td>
      <td className="border p-2">
        <a href={task.task_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          {task.task_link ? "Task Link" : "N/A"}
        </a>
      </td>
      <td className="border p-2">{task.chain || "N/A"}</td>
      <td className="border p-2">{task.airdrop_type || "N/A"}</td>
      <td className="border p-2">{task.device_needed || "N/A"}</td>
      <td className="border p-2 flex gap-2">
        <input 
          type="checkbox" 
          checked={isDone} 
          onChange={handleCheckboxToggle} 
        />
        <button 
          onClick={handleDelete} 
          className="ml-2 text-red-500"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ToDoItem;
