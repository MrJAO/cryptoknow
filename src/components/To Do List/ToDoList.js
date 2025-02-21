// ToDoList.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import ToDoItem from './ToDoItem';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

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
    const discord_username = currentUser.user_metadata?.full_name || '';
    const { data, error } = await supabase.from('to_do_list').select('*').eq('discord_username', discord_username);
    if (!error) setTasks(data);
  };

  const handleMarkDone = (taskId, isDone) => {
    setDoneTasks((prev) => ({ ...prev, [taskId]: isDone }));
  };

  const handleDeleteTask = (deletedTaskId) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== deletedTaskId));
    setDoneTasks((prev) => {
      const newState = { ...prev };
      delete newState[deletedTaskId];
      return newState;
    });
  };

  const handleSubmitFinishedTasks = async () => {
    if (!currentUser) return;
    const discord_username = currentUser.user_metadata?.full_name || '';
    const finishedTasks = tasks.filter(task => doneTasks[task.id]);

    if (finishedTasks.length === 0) {
      alert("No tasks have been marked as finished.");
      return;
    }

    const inserts = finishedTasks.map(task => ({ discord_username, project_name: task.project_name }));

    const { error } = await supabase.from('finished_daily_tasks').insert(inserts);
    if (!error) {
      alert("Finished tasks submitted! They will be refreshed daily.");
      setDoneTasks({});
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Your To-Do List</h2>
        {tasks.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          tasks.map(task => (
            <ToDoItem key={task.id} task={task} onDelete={handleDeleteTask} onMarkDone={handleMarkDone} />
          ))
        )}
        <Button onClick={handleSubmitFinishedTasks} className="mt-4 w-full">Submit Finished Tasks</Button>
      </CardContent>
    </Card>
  );
};

export default ToDoList;
