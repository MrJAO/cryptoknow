// src/components/ToDoList.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ToDoItem from './ToDoItem';

const ToDoList = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  // Map of task IDs to done state
  const [doneTasks, setDoneTasks] = useState({});

  // Fetch tasks for the user (filtered by discord_username)
  const fetchTasks = async () => {
    if (!currentUser) return;
    const discord_username = currentUser.user_metadata?.full_name || '';
    const { data, error } = await supabase
      .from('to_do_list')
      .select('*')
      .eq('discord_username', discord_username);
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

  // Callback for each ToDoItem to update done status
  const handleMarkDone = (taskId, isDone) => {
    setDoneTasks((prev) => ({
      ...prev,
      [taskId]: isDone,
    }));
  };

  // Callback for deleting a task
  const handleDeleteTask = (deletedTaskId) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== deletedTaskId));
    // Also remove it from doneTasks state if necessary
    setDoneTasks((prev) => {
      const newState = { ...prev };
      delete newState[deletedTaskId];
      return newState;
    });
  };

  // Submit daily finished tasks
  const handleSubmitFinishedTasks = async () => {
    if (!currentUser) return;
    const discord_username = currentUser.user_metadata?.full_name || '';
    // Filter tasks that are marked as done
    const finishedTasks = tasks.filter(task => doneTasks[task.id]);

    if (finishedTasks.length === 0) {
      alert("No tasks have been marked as finished.");
      return;
    }

    // Insert each finished task into finished_daily_tasks
    const inserts = finishedTasks.map(task => ({
      discord_username,
      project_name: task.project_name,
    }));

    const { data, error } = await supabase
      .from('finished_daily_tasks')
      .insert(inserts);

    if (error) {
      console.error("Error submitting finished tasks:", error.message);
    } else {
      alert("Finished tasks submitted! They will be refreshed daily.");
      // Optionally, you can clear the done status for a new day.
      setDoneTasks({});
    }
  };

  return (
    <div>
      <h2>Your To Do List</h2>
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        tasks.map(task => (
          <ToDoItem 
            key={task.id} 
            task={task} 
            onDelete={handleDeleteTask}
            onMarkDone={handleMarkDone}
          />
        ))
      )}

      {/* Button to submit finished tasks */}
      <button onClick={handleSubmitFinishedTasks}>
        Submit Finished Tasks
      </button>
    </div>
  );
};

export default ToDoList;
