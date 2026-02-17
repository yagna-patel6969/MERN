// Analytics & Statistics

class AnalyticsManager {
  constructor() {
    this.init();
  }

  init() {
    // Analytics initialization
  }

  getTaskStats(period = 'week') {
    const tasks = taskManager.getTasks();
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const periodTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      return taskDate >= startDate;
    });

    return {
      total: periodTasks.length,
      completed: periodTasks.filter(t => t.completed).length,
      pending: periodTasks.filter(t => !t.completed).length,
      completionRate: periodTasks.length > 0 
        ? Math.round((periodTasks.filter(t => t.completed).length / periodTasks.length) * 100)
        : 0
    };
  }

  getCategoryBreakdown() {
    const tasks = taskManager.getTasks();
    const breakdown = {};

    taskManager.categories.forEach(cat => {
      const categoryTasks = tasks.filter(t => t.category === cat.id);
      breakdown[cat.id] = {
        name: cat.name,
        color: cat.color,
        total: categoryTasks.length,
        completed: categoryTasks.filter(t => t.completed).length,
        pending: categoryTasks.filter(t => !t.completed).length,
        percentage: tasks.length > 0 
          ? Math.round((categoryTasks.length / tasks.length) * 100)
          : 0
      };
    });

    return breakdown;
  }

  getProductivityTrend(days = 30) {
    const tasks = taskManager.getTasks();
    const trend = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTasks = tasks.filter(t => {
        const taskDate = new Date(t.createdAt).toISOString().split('T')[0];
        return taskDate === dateStr;
      });

      trend.push({
        date: dateStr,
        total: dayTasks.length,
        completed: dayTasks.filter(t => t.completed).length,
        pending: dayTasks.filter(t => !t.completed).length
      });
    }

    return trend;
  }

  getPriorityDistribution() {
    const tasks = taskManager.getTasks();
    
    return {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };
  }

  getCompletionTimeStats() {
    const completedTasks = taskManager.getTasks({ completed: true });
    
    const timesToComplete = completedTasks
      .filter(t => t.completedAt)
      .map(t => {
        const created = new Date(t.createdAt);
        const completed = new Date(t.completedAt);
        return (completed - created) / (1000 * 60 * 60 * 24); // Days
      });

    if (timesToComplete.length === 0) {
      return { average: 0, fastest: 0, slowest: 0 };
    }

    return {
      average: Math.round(timesToComplete.reduce((a, b) => a + b, 0) / timesToComplete.length),
      fastest: Math.round(Math.min(...timesToComplete)),
      slowest: Math.round(Math.max(...timesToComplete))
    };
  }

  getStreakData() {
    const tasks = taskManager.getTasks({ completed: true });
    
    // Sort by completion date
    const sortedTasks = tasks
      .filter(t => t.completedAt)
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate = null;

    sortedTasks.forEach(task => {
      const taskDate = new Date(task.completedAt).toISOString().split('T')[0];
      
      if (!lastDate) {
        currentStreak = 1;
      } else {
        const dayDiff = (new Date(taskDate) - new Date(lastDate)) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          currentStreak++;
        } else if (dayDiff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
      
      lastDate = taskDate;
    });

    longestStreak = Math.max(longestStreak, currentStreak);

    // Check if streak is still active (completed task today)
    const today = new Date().toISOString().split('T')[0];
    const hasTaskToday = sortedTasks.some(t => 
      new Date(t.completedAt).toISOString().split('T')[0] === today
    );

    return {
      current: hasTaskToday ? currentStreak : 0,
      longest: longestStreak
    };
  }

  generateWeeklyReport() {
    const weekStats = this.getTaskStats('week');
    const categoryBreakdown = this.getCategoryBreakdown();
    const streak = this.getStreakData();

    return {
      period: 'Last 7 Days',
      stats: weekStats,
      categories: categoryBreakdown,
      streak: streak,
      generatedAt: new Date().toISOString()
    };
  }

  generateMonthlyReport() {
    const monthStats = this.getTaskStats('month');
    const categoryBreakdown = this.getCategoryBreakdown();
    const completionTime = this.getCompletionTimeStats();
    const trend = this.getProductivityTrend(30);

    return {
      period: 'Last 30 Days',
      stats: monthStats,
      categories: categoryBreakdown,
      completionTime: completionTime,
      trend: trend,
      generatedAt: new Date().toISOString()
    };
  }
}

// Initialize analytics manager
const analyticsManager = new AnalyticsManager();
