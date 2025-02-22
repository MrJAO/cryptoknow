import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import ToDoItem from './ToDoItem';

const ToDoList = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState({});

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const fetchTasks = async () => {
    if (!currentUser) return;
    const discordUsername = currentUser.user_metadata?.user_name || '';

    const { data, error } = await supabase
      .from('to_do_list')
      .select('*')
      .eq('discord_username', discordUsername);

    if (error) {
      console.error('Error fetching tasks:', error.message);
    } else {
      setTasks(data);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your To-Do List</h2>
      {tasks.length === 0 ? <p>No tasks added yet.</p> : tasks.map(task => (
        <ToDoItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default ToDoList;
