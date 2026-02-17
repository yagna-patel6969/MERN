// Notification System (Email simulation + Browser notifications)

class NotificationManager {
  constructor() {
    this.notifications = [];
    this.init();
  }

  init() {
    this.loadNotifications();
    this.requestPermission();
    this.scheduleDailySummary();
  }

  loadNotifications() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    const notifJson = localStorage.getItem(`notifications_${user.id}`);
    this.notifications = notifJson ? JSON.parse(notifJson) : [];
  }

  saveNotifications() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(this.notifications));
  }

  requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  showNotification(data) {
    const { title, message, type = 'info' } = data;

    // Store notification
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(notification);
    this.saveNotifications();

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/assets/icons/notification.png',
        badge: '/assets/icons/badge.png'
      });
    }

    // Show in-app notification
    this.showInAppNotification(notification);

    // Log to console (simulating email)
    console.log(`📧 EMAIL SENT: ${title}\n${message}`);

    return notification;
  }

  showInAppNotification(notification) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notifEl = document.createElement('div');
    notifEl.className = `alert alert-${notification.type} fade-in`;
    notifEl.innerHTML = `
      <strong>${notification.title}</strong>
      <p>${notification.message}</p>
    `;

    container.appendChild(notifEl);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notifEl.style.opacity = '0';
      setTimeout(() => notifEl.remove(), 300);
    }, 5000);
  }

  sendDailySummary() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const tasks = taskManager.getTasks();

    // Get today's tasks
    const todayTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt).toISOString().split('T')[0];
      return taskDate === today;
    });

    const completedToday = todayTasks.filter(t => t.completed).length;
    const pendingToday = todayTasks.filter(t => !t.completed).length;

    // Get overdue tasks
    const overdueTasks = taskManager.getOverdueTasks();

    // Get all pending tasks
    const allPending = tasks.filter(t => !t.completed).length;

    const summary = `
      Daily Summary for ${new Date().toLocaleDateString()}
      
      Today's Tasks:
      ✅ Completed: ${completedToday}
      ⏳ Pending: ${pendingToday}
      
      Overall Status:
      📋 Total Pending Tasks: ${allPending}
      ⚠️ Overdue Tasks: ${overdueTasks.length}
      
      Points Earned Today: ${completedToday * 10}
      Total Points: ${user.points}
      
      Keep up the great work! 🎉
    `;

    this.showNotification({
      title: '📊 Daily Summary',
      message: summary,
      type: 'info'
    });

    // Simulate email
    console.log(`📧 DAILY SUMMARY EMAIL SENT TO: ${user.email}`);
    console.log(summary);
  }

  scheduleDailySummary() {
    // Schedule daily summary at 8 PM
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(20, 0, 0, 0);

    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilSummary = scheduledTime - now;

    setTimeout(() => {
      this.sendDailySummary();
      // Reschedule for next day
      setInterval(() => this.sendDailySummary(), 24 * 60 * 60 * 1000);
    }, timeUntilSummary);
  }

  sendTeamTaskNotification(teamMember, task, leader) {
    const message = `
      New Task Assigned!
      
      Task: ${task.title}
      Assigned by: ${leader.name}
      Due Date: ${task.dueDate || 'Not set'}
      Priority: ${task.priority}
      
      Description: ${task.description || 'No description'}
    `;

    this.showNotification({
      title: '👥 Team Task Assignment',
      message: message,
      type: 'info'
    });

    // Simulate email to team member
    console.log(`📧 EMAIL SENT TO: ${teamMember.email}`);
    console.log(message);
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(notificationId) {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.read = true;
      this.saveNotifications();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }
}

// Initialize notification manager
const notificationManager = new NotificationManager();
