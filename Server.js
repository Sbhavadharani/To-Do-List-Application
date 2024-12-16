const http = require('http');  
const url = require('url');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.SERVER_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// Define the Task schema and model
const TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Task = mongoose.model('Task', TaskSchema);

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && parsedUrl.pathname === '/tasks') {
    // Read all tasks
    try {
      const tasks = await Task.find({});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(tasks));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/task/')) {
    // Read a single task by ID
    const id = parsedUrl.pathname.split('/')[2];
    try {
      const task = await Task.findById(id);
      if (!task) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Task not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(task));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else if (req.method === 'POST' && parsedUrl.pathname === '/task') {
    // Create a new task
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { name, description } = JSON.parse(body);

        const newTask = new Task({
          name,
          description,
        });

        await newTask.save();
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task created successfully' }));
      } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error while saving data');
      }
    });
  } else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/task/')) {
    // Update a task by ID
    const id = parsedUrl.pathname.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { name, description } = JSON.parse(body);
        const updatedTask = await Task.findByIdAndUpdate(id, { name, description }, { new: true });

        if (!updatedTask) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Task not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedTask));
        }
      } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error while updating data');
      }
    });
  } else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/task/')) {
    // Delete a task by ID
    const id = parsedUrl.pathname.split('/')[2];
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Task not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task deleted successfully' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});