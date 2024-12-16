// TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = ({ onEdit, onDelete }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
      setFilteredTasks(response.data); // Initialize filteredTasks
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleSearch = () => {
    const filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/task/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setFilteredTasks(filteredTasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      handleDelete(id);
    }
  };

  return (
    <div className='d-flex flex-column align-items-center justify-content-center'>
      <div>
        <input
          type="text"
          placeholder="Search by task name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='btn btn-success m-3' onClick={handleSearch}>Search</button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <div key={task._id} className='m-5 d-flex'>
            <div className='bg bg-light bg-opacity-25 border-0 shadow-lg card p-2'>
              <div class="d-flex justify-content-center align-items-center">
                <div className='text-dark'>
                  <input class="form-check-input"
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(task._id, e.target.checked)}
                  />
                </div>
                <div className='mx-3 fw-bold text-dark h1'>
                  {task.name}
                </div>

              </div>
              <div className='mx-5 mt-3 text-dark'>
                <p>Description: {task.description}</p>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;