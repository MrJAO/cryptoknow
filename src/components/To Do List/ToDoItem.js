// src/components/ToDoItem.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './ToDoItem.css';

const ToDoItem = ({ task, onDelete, onMarkDone }) => {
  // Local state to track whether this task is marked as done
  const [isDone, setIsDone] = useState(false);

  const handleCheckboxToggle = () => {
    setIsDone(!isDone);
    // Notify parent component that this task's "done" state has changed
    onMarkDone(task.id, !isDone);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${task.project_name}" from your list?`
    );
    if (confirmDelete) {
      const { error } = await supabase
        .from('to_do_list')
        .delete()
        .eq('id', task.id);
      if (error) {
        console.error('Error deleting task:', error);
      } else {
        onDelete(task.id); // Update UI in parent component
      }
    }
  };

  return (
    <div className="todo-item">
      <input 
        type="checkbox" 
        checked={isDone} 
        onChange={handleCheckboxToggle} 
      />
      <span className={isDone ? 'done' : ''}>{task.project_name}</span>
      <button className="delete-button" onClick={handleDelete}>
        &#x2716;
      </button>
    </div>
  );
};

export default ToDoItem;
