// src/components/ToDoItem.js
import React from 'react';
import { supabase } from '../supabaseClient';

const ToDoItem = ({ task, onDelete }) => {
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
        onDelete(task.id); // Notify parent to update the list
      }
    }
  };

  return (
    <div className="todo-item">
      <span>{task.project_name}</span>
      <button className="delete-button" onClick={handleDelete}>
        &#x2716;
      </button>
    </div>
  );
};

export default ToDoItem;
