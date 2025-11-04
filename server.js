const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory array to store tasks
let db = [
  { id: 1, text: "My first sample task", done: false },
  { id: 2, text: "Build the CI/CD pipeline", done: true }
];
let nextId = 3;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // To serve our HTML/JS frontend

// --- API Routes ---

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.map(task => ({ _id: task.id, text: task.text, done: task.done }));
  res.json(tasks);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  const task = {
    id: nextId++,
    text: req.body.text,
    done: false
  };
  db.push(task);
  console.log('Added task:', task);
  res.json({ _id: task.id, text: task.text, done: task.done });
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  db = db.filter(task => task.id !== taskId);
  console.log('Deleted task:', taskId);
  res.status(204).send();
});

// --- Serve Frontend ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
