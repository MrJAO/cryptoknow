// src/components/ToDoList.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ToDoItem from './ToDoItem';

const ToDoList = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const discordUsername = currentUser.user_metadata.full_name; // Adjust key as needed
    const { data, error } = await supabase
      .from('to_do_list')
      .select('*')
      .eq('discord_username', discordUsername);

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const handleDeleteTask = (deletedTaskId) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== deletedTaskId));
  };

  return (
    <div>
      <h2>Your To Do List</h2>
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        tasks.map(task => (
          <ToDoItem key={task.id} task={task} onDelete={handleDeleteTask} />
        ))
      )}
    </div>
  );
};

export default ToDoList;
