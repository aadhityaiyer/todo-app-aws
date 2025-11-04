document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');

  // Fetch and display all tasks
  async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    taskList.innerHTML = ''; // Clear list
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.text;
      li.dataset.id = task._id;

      const deleteBtn = document.createElement('span');
      deleteBtn.textContent = '✖';
      deleteBtn.className = 'delete';
      deleteBtn.addEventListener('click', deleteTask);

      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  // Add a new task
  async function addTask() {
    const text = taskInput.value;
    if (text === '') return;

    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    });
    taskInput.value = '';
    loadTasks();
  }

  // Delete a task
  async function deleteTask(e) {
    const taskId = e.target.parentElement.dataset.id;
    await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
    loadTasks();
  }

  addTaskBtn.addEventListener('click', addTask);
  loadTasks();
});
