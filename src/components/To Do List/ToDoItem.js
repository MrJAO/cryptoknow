// ToDoItem.js
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

const ToDoItem = ({ task, onDelete, onMarkDone }) => {
  const [isDone, setIsDone] = useState(false);

  const handleCheckboxToggle = () => {
    setIsDone(!isDone);
    onMarkDone(task.id, !isDone);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${task.project_name}"?`)) {
      const { error } = await supabase.from('to_do_list').delete().eq('id', task.id);
      if (!error) onDelete(task.id);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <Checkbox checked={isDone} onCheckedChange={handleCheckboxToggle} />
        <span className={`ml-2 ${isDone ? 'line-through text-gray-400' : ''}`}>{task.project_name}</span>
        <Button variant="destructive" size="icon" onClick={handleDelete}>✖</Button>
      </CardContent>
    </Card>
  );
};

export default ToDoItem;
