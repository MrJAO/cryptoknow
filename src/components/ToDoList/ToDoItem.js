import React from 'react';
import { supabase } from '../../supabaseClient';

const ToDoItem = ({ task, onDelete, onMarkDone, doneTasks }) => {
  const isDone = doneTasks[task.id] || false; // ✅ Pulling state from ToDoList.js

  const handleCheckboxToggle = () => {
    onMarkDone(task.id, !isDone); // ✅ No local state, syncs properly
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${task.project_name}"?`)) {
      const { error } = await supabase.from('to_do_list').delete().eq('id', task.id);
      if (!error) {
        onDelete(task.id);
      } else {
        console.error("Error deleting task:", error.message); // ✅ Error handling
        alert("Failed to delete task. Try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg shadow-sm mb-2">
      <input 
        type="checkbox" 
        checked={isDone} 
        onChange={handleCheckboxToggle} 
        className="mr-2"
      />
      <span className={`${isDone ? 'line-through text-gray-400' : ''}`}>
        {task.project_name}
      </span>
      <button 
        onClick={handleDelete} 
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        ✖
      </button>
    </div>
  );
};

export default ToDoItem;
