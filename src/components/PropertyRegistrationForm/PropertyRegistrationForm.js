import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoForm = ({ taskToEdit, onSave }) => {
  const [task, setTask] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', task);

    try {
      if (task._id) {
        // Update existing task
        console.log('Updating task', task);
        await axios.put(`http://localhost:5000/task/${task._id}`, task); // Correct URL for PUT request
      } else {
        // Create new task
        console.log('Creating new task', task);
        await axios.post('http://localhost:5000/task', task);
      }

      // Call onSave to trigger the parent component update
      onSave();
      
      // Reset form
      setTask({
        name: '',
        description: ''
      });

      // Refresh the entire page
      window.location.reload();
    } catch (error) {
      console.error('Error saving task', error);
    }
  };

  return (
    <div className='m-5 p-5'>
      <h2>{task._id ? 'Edit Task' : 'ADD TASK'}</h2>
      <form onSubmit={handleSubmit} className='d-flex m-5 flex-column justify-content-center align-items-center'>
        <input
          className='m-2 form-control w-50'
          type="text"
          name="name"
          placeholder="Task Name"
          value={task.name}
          onChange={handleChange}
          required
        />
        <textarea
          className='m-2 form-control-lg w-50'
          type="text"
          name="description"
          placeholder="Task Description"
          value={task.description}
          onChange={handleChange}
          required
        />
        <button className='btn btn-success m-3' type="submit">Save</button>
      </form>
    </div>
  );
};

export default TodoForm;