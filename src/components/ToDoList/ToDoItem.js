// ToDoItem.js
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const ToDoItem = ({ task, onDelete, onMarkDone }) => {
  const [isDone, setIsDone] = useState(false);

  const handleCheckboxToggle = () => {
    setIsDone(!isDone);
    onMarkDone(task.id, !isDone);
  };

  const handleDelete = async () => {
    if (window.confirm(Are you sure you want to remove "${task.project_name}"?)) {
      const { error } = await supabase.from('to_do_list').delete().eq('id', task.id);
      if (!error) onDelete(task.id);
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
      <span className={${isDone ? 'line-through text-gray-400' : ''}}>
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