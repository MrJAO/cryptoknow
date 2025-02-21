import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import './ToDoItem.css';

const ToDoItem = ({ task, onDelete, onMarkDone }) => {
  const [isDone, setIsDone] = useState(false);

  const handleCheckboxToggle = () => {
    setIsDone(!isDone);
    onMarkDone(task.id, !isDone);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to remove "${task.project_name}" from your list?`);
    if (confirmDelete) {
      const { error } = await supabase.from('to_do_list').delete().eq('id', task.id);
      if (error) {
        console.error('Error deleting task:', error);
      } else {
        onDelete(task.id);
      }
    }
  };

  return (
    <Card className="todo-card">
      <CardContent className="todo-content">
        <Checkbox checked={isDone} onCheckedChange={handleCheckboxToggle} className="todo-checkbox" />
        <span className={`todo-text ${isDone ? 'done' : ''}`}>{task.project_name}</span>
        <Button variant="destructive" size="icon" onClick={handleDelete} className="delete-button">
          ✖
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToDoItem;
