// Gamification System - Points & Leaderboard

class GamificationManager {
  constructor() {
    this.cycleStartDate = null;
    this.cycleDuration = 60; // 2 months in days
    this.init();
  }

  init() {
    this.loadCycleData();
    this.checkCycleReset();
  }

  loadCycleData() {
    const cycleData = localStorage.getItem('gamificationCycle');
    if (cycleData) {
      const data = JSON.parse(cycleData);
      this.cycleStartDate = new Date(data.startDate);
    } else {
      this.startNewCycle();
    }
  }

  saveCycleData() {
    localStorage.setItem('gamificationCycle', JSON.stringify({
      startDate: this.cycleStartDate.toISOString()
    }));
  }

  startNewCycle() {
    this.cycleStartDate = new Date();
    this.saveCycleData();

    // Reset all user points
    const users = authManager.getAllUsers();
    users.forEach(user => {
      user.cyclePoints = 0;
    });
    localStorage.setItem('users', JSON.stringify(users));
  }

  checkCycleReset() {
    const now = new Date();
    const daysSinceStart = (now - this.cycleStartDate) / (1000 * 60 * 60 * 24);

    if (daysSinceStart >= this.cycleDuration) {
      this.endCycle();
      this.startNewCycle();
    }
  }

  endCycle() {
    const leaderboard = this.getLeaderboard();
    
    if (leaderboard.length > 0) {
      const winner = leaderboard[0];
      
      notificationManager.showNotification({
        title: '🏆 Cycle Winner!',
        message: `Congratulations to ${winner.name} for winning this cycle with ${winner.points} points! 🎁`,
        type: 'success'
      });

      // Log winner
      console.log('🏆 CYCLE WINNER:', winner.name);
      console.log('📧 GIFT NOTIFICATION EMAIL SENT TO:', winner.email);
    }
  }

  getLeaderboard() {
    const users = authManager.getAllUsers();
    
    return users
      .map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points || 0,
        tasksCompleted: user.tasksCompleted || 0
      }))
      .sort((a, b) => b.points - a.points);
  }

  getUserRank(userId) {
    const leaderboard = this.getLeaderboard();
    const rank = leaderboard.findIndex(u => u.id === userId);
    return rank !== -1 ? rank + 1 : null;
  }

  getDaysUntilCycleEnd() {
    const now = new Date();
    const daysSinceStart = (now - this.cycleStartDate) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(this.cycleDuration - daysSinceStart));
  }

  getCycleProgress() {
    const now = new Date();
    const daysSinceStart = (now - this.cycleStartDate) / (1000 * 60 * 60 * 24);
    return Math.min(100, Math.round((daysSinceStart / this.cycleDuration) * 100));
  }

  getAchievements(userId) {
    const user = authManager.getAllUsers().find(u => u.id === userId);
    if (!user) return [];

    const achievements = [];
    const points = user.points || 0;
    const tasksCompleted = user.tasksCompleted || 0;

    // Points-based achievements
    if (points >= 1000) achievements.push({ name: 'Point Master', icon: '🌟', description: 'Earned 1000+ points' });
    if (points >= 500) achievements.push({ name: 'Rising Star', icon: '⭐', description: 'Earned 500+ points' });
    if (points >= 100) achievements.push({ name: 'Getting Started', icon: '✨', description: 'Earned 100+ points' });

    // Task-based achievements
    if (tasksCompleted >= 100) achievements.push({ name: 'Century', icon: '💯', description: 'Completed 100 tasks' });
    if (tasksCompleted >= 50) achievements.push({ name: 'Half Century', icon: '🎯', description: 'Completed 50 tasks' });
    if (tasksCompleted >= 10) achievements.push({ name: 'First Steps', icon: '🚀', description: 'Completed 10 tasks' });

    // Streak-based achievements
    const streak = analyticsManager.getStreakData();
    if (streak.longest >= 30) achievements.push({ name: 'Unstoppable', icon: '🔥', description: '30-day streak' });
    if (streak.longest >= 7) achievements.push({ name: 'Week Warrior', icon: '💪', description: '7-day streak' });

    return achievements;
  }

  getPointsBreakdown(userId) {
    const tasks = taskManager.getTasks({ completed: true });
    
    let totalPoints = 0;
    let priorityBonus = 0;
    let onTimeBonus = 0;

    tasks.forEach(task => {
      totalPoints += 10; // Base points
      
      if (task.priority === 'high') priorityBonus += 5;
      else if (task.priority === 'medium') priorityBonus += 3;

      if (task.dueDate && task.completedAt) {
        const dueDate = new Date(task.dueDate);
        const completedDate = new Date(task.completedAt);
        if (completedDate <= dueDate) {
          onTimeBonus += 5;
        }
      }
    });

    return {
      base: totalPoints,
      priorityBonus,
      onTimeBonus,
      total: totalPoints + priorityBonus + onTimeBonus
    };
  }
}

// Initialize gamification manager
const gamificationManager = new GamificationManager();
