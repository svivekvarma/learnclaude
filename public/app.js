const API = '/tasks';

// DOM elements
const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-description');
const prioritySelect = document.getElementById('task-priority');
const dueDateInput = document.getElementById('task-due-date');
const searchInput = document.getElementById('search-input');
const taskList = document.getElementById('task-list');
const statsEl = document.getElementById('stats');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// Fetch and render tasks
async function loadTasks() {
  const params = new URLSearchParams();

  if (currentFilter === 'active') params.set('completed', 'false');
  if (currentFilter === 'completed') params.set('completed', 'true');
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());

  const query = params.toString() ? `?${params}` : '';
  const res = await fetch(`${API}${query}`);
  const tasks = await res.json();

  renderTasks(tasks);
  updateStats(tasks);
}

// Check if a due date is overdue (past today and not completed)
function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate + 'T00:00:00');
  return due < today;
}

// Check if due today
function isDueToday(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date().toISOString().split('T')[0];
  return task.dueDate === today;
}

// Format due date for display
function formatDueDate(task) {
  if (!task.dueDate) return '';
  const due = new Date(task.dueDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let label;
  if (due.getTime() === today.getTime()) {
    label = 'Today';
  } else if (due.getTime() === tomorrow.getTime()) {
    label = 'Tomorrow';
  } else {
    label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  let className = 'due-date';
  if (task.completed) {
    className += ' due-done';
  } else if (isOverdue(task)) {
    className += ' due-overdue';
  } else if (isDueToday(task)) {
    className += ' due-today';
  }

  return `<span class="${className}">${label}</span>`;
}

// Render task list
function renderTasks(tasks) {
  if (tasks.length === 0) {
    taskList.innerHTML = '<div class="empty-state">No tasks found</div>';
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}" data-id="${task.id}">
      <div class="task-checkbox ${task.completed ? 'checked' : ''}"
           onclick="toggleTask(${task.id}, ${!task.completed})"></div>
      <div class="task-content">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
      </div>
      ${formatDueDate(task)}
      <span class="priority-badge priority-${task.priority}">${task.priority}</span>
      <button class="task-delete" onclick="deleteTask(${task.id})" title="Delete task">&times;</button>
    </div>
  `).join('');
}

// Update stats bar
function updateStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const overdue = tasks.filter(t => isOverdue(t)).length;

  statsEl.innerHTML = `
    <span class="stat-item"><strong>${total}</strong> total</span>
    <span class="stat-item"><strong>${completed}</strong> completed</span>
    <span class="stat-item"><strong>${total - completed}</strong> remaining</span>
    ${overdue > 0 ? `<span class="stat-item stat-overdue"><strong>${overdue}</strong> overdue</span>` : ''}
  `;
}

// Create a task
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    priority: prioritySelect.value
  };

  if (dueDateInput.value) {
    body.dueDate = dueDateInput.value;
  }

  if (!body.title) return;

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  titleInput.value = '';
  descInput.value = '';
  dueDateInput.value = '';
  prioritySelect.value = 'medium';
  titleInput.focus();
  loadTasks();
});

// Toggle task completion
async function toggleTask(id, completed) {
  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  loadTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTasks();
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    loadTasks();
  });
});

// Search with debounce
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadTasks, 300);
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initial load
loadTasks();
