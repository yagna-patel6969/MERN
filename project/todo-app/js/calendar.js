// Calendar & Reminder Management

class CalendarManager {
  constructor() {
    this.init();
  }

  init() {
    // Calendar initialization
  }

  generateDailyTimetable(date) {
    const tasks = taskManager.getTasksByDate(date);
    
    // Sort tasks by time
    const sortedTasks = tasks.sort((a, b) => {
      if (!a.dueTime) return 1;
      if (!b.dueTime) return -1;
      return a.dueTime.localeCompare(b.dueTime);
    });

    return sortedTasks;
  }

  getTodayTimetable() {
    const today = new Date().toISOString().split('T')[0];
    return this.generateDailyTimetable(today);
  }

  exportToICS(task) {
    if (!task.dueDate) return null;

    const startDate = new Date(`${task.dueDate}T${task.dueTime || '09:00'}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TaskMaster//EN
BEGIN:VEVENT
UID:${task.id}@taskmaster.com
DTSTAMP:${this.formatICSDate(new Date())}
DTSTART:${this.formatICSDate(startDate)}
DTEND:${this.formatICSDate(endDate)}
SUMMARY:${task.title}
DESCRIPTION:${task.description || ''}
PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}
STATUS:${task.completed ? 'COMPLETED' : 'NEEDS-ACTION'}
END:VEVENT
END:VCALENDAR`;

    return icsContent;
  }

  exportAllTasksToICS() {
    const tasks = taskManager.getTasks({ completed: false });
    return this.exportTasksToICS(tasks);
  }

  exportTasksToICS(tasks) {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TaskMaster//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:TaskMaster Tasks
X-WR-TIMEZONE:UTC
`;

    tasks.forEach(task => {
      if (task.dueDate) {
        const startDate = new Date(`${task.dueDate}T${task.dueTime || '09:00'}`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        icsContent += `BEGIN:VEVENT
UID:${task.id}@taskmaster.com
DTSTAMP:${this.formatICSDate(new Date())}
DTSTART:${this.formatICSDate(startDate)}
DTEND:${this.formatICSDate(endDate)}
SUMMARY:${task.title}
DESCRIPTION:${task.description || ''}
PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}
CATEGORIES:${task.category.toUpperCase()}
STATUS:${task.completed ? 'COMPLETED' : 'NEEDS-ACTION'}
END:VEVENT
`;
      }
    });

    icsContent += 'END:VCALENDAR';
    return icsContent;
  }

  downloadICS(content, filename = 'tasks.ics') {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  formatICSDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  getGoogleCalendarURL(task) {
    if (!task.dueDate) return null;

    const startDate = new Date(`${task.dueDate}T${task.dueTime || '09:00'}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatGoogleDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: task.title,
      details: task.description || '',
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      sprop: 'name:TaskMaster'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  openInGoogleCalendar(task) {
    const url = this.getGoogleCalendarURL(task);
    if (url) {
      window.open(url, '_blank');
    }
  }

  getWeekView(startDate) {
    const week = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      week.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: taskManager.getTasksByDate(dateStr)
      });
    }

    return week;
  }

  getCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    return this.getWeekView(startOfWeek);
  }
}

// Initialize calendar manager
const calendarManager = new CalendarManager();
