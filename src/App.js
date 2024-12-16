import React, { useState } from 'react';
import TodoList from './components/property_list/property_list';
import TodoForm from './components/PropertyRegistrationForm/PropertyRegistrationForm';
import axios from 'axios';

const App = () => {
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleEdit = (task) => {
    setTaskToEdit(task);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTaskToEdit(null);
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleSave = () => {
    setTaskToEdit(null);
  };

  return (
    <div className="App text-center bg bg-success bg-opacity-50">
      <h1 className='p-5'>TO-DO LIST APPLICATION</h1>
      <hr></hr>
      <h1 className='mt-4'>LIST OF TASKS</h1>
      <div className='mt-5 d-flex align-items-center justify-content-center'>
        <TodoList onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <hr></hr>
      <TodoForm taskToEdit={taskToEdit} onSave={handleSave} />
    </div>
  );
};

export default App;