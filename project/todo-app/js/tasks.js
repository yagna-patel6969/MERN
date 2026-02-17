// Task Management System

class TaskManager {
  constructor() {
    this.tasks = [];
    this.categories = [
      { id: 'work', name: 'Work', color: '#3b82f6' },
      { id: 'personal', name: 'Personal', color: '#8b5cf6' },
      { id: 'shopping', name: 'Shopping', color: '#ec4899' },
      { id: 'health', name: 'Health', color: '#10b981' },
      { id: 'finance', name: 'Finance', color: '#f59e0b' },
      { id: 'learning', name: 'Learning', color: '#06b6d4' },
      { id: 'social', name: 'Social', color: '#f97316' },
      { id: 'other', name: 'Other', color: '#6b7280' }
    ];
    this.init();
  }

  init() {
    this.loadTasks();
  }

  loadTasks() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    const tasksJson = localStorage.getItem(`tasks_${user.id}`);
    this.tasks = tasksJson ? JSON.parse(tasksJson) : [];
  }

  saveTasks() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(this.tasks));
  }

  createTask(taskData) {
    const { title, description, category, priority, dueDate, dueTime, reminder } = taskData;

    if (!title) {
      return { success: false, message: 'Task title is required' };
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      category: category || 'other',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      reminder: reminder || false,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    this.tasks.unshift(newTask);
    this.saveTasks();

    // Set reminder if enabled
    if (reminder && dueDate && dueTime) {
      this.scheduleReminder(newTask);
    }

    return { success: true, message: 'Task created successfully', task: newTask };
  }

  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return { success: false, message: 'Task not found' };
    }

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    this.saveTasks();

    return { success: true, message: 'Task updated successfully', task: this.tasks[taskIndex] };
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return { success: false, message: 'Task not found' };
    }

    this.tasks.splice(taskIndex, 1);
    this.saveTasks();

    return { success: true, message: 'Task deleted successfully' };
  }

  toggleTaskComplete(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    // Award points if task is completed
    if (task.completed) {
      const points = this.calculatePoints(task);
      authManager.updateUserPoints(points);
    }

    this.saveTasks();

    return { success: true, message: 'Task status updated', task };
  }

  calculatePoints(task) {
    let points = 10; // Base points

    // Priority bonus
    if (task.priority === 'high') points += 5;
    else if (task.priority === 'medium') points += 3;

    // On-time bonus
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const completedDate = new Date(task.completedAt);
      if (completedDate <= dueDate) {
        points += 5; // Bonus for completing on time
      }
    }

    return points;
  }

  getTasks(filter = {}) {
    let filteredTasks = [...this.tasks];

    // Filter by category
    if (filter.category) {
      filteredTasks = filteredTasks.filter(t => t.category === filter.category);
    }

    // Filter by completion status
    if (filter.completed !== undefined) {
      filteredTasks = filteredTasks.filter(t => t.completed === filter.completed);
    }

    // Filter by date range
    if (filter.startDate && filter.endDate) {
      filteredTasks = filteredTasks.filter(t => {
        const taskDate = new Date(t.createdAt);
        return taskDate >= new Date(filter.startDate) && taskDate <= new Date(filter.endDate);
      });
    }

    // Search by title
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredTasks = filteredTasks.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }

    return filteredTasks;
  }

  getTaskById(taskId) {
    return this.tasks.find(t => t.id === taskId);
  }

  getTasksByDate(date) {
    return this.tasks.filter(t => t.dueDate === date);
  }

  getTodayTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.getTasksByDate(today);
  }

  getUpcomingTasks(days = 7) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const taskDate = new Date(t.dueDate);
      return taskDate >= today && taskDate <= futureDate;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  getOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      return t.dueDate < today;
    });
  }

  scheduleReminder(task) {
    if (!task.dueDate || !task.dueTime) return;

    const reminderDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
    const now = new Date();
    const timeUntilReminder = reminderDateTime - now;

    if (timeUntilReminder > 0) {
      setTimeout(() => {
        notificationManager.showNotification({
          title: 'Task Reminder',
          message: `Don't forget: ${task.title}`,
          type: 'info'
        });
      }, timeUntilReminder);
    }
  }

  getCategoryStats() {
    const stats = {};
    this.categories.forEach(cat => {
      const categoryTasks = this.tasks.filter(t => t.category === cat.id);
      stats[cat.id] = {
        total: categoryTasks.length,
        completed: categoryTasks.filter(t => t.completed).length,
        pending: categoryTasks.filter(t => !t.completed).length
      };
    });
    return stats;
  }
}

// Initialize task manager
const taskManager = new TaskManager();
