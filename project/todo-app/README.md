# 📋 TaskMaster - Advanced To-Do Application

A feature-rich task management application with team collaboration, analytics, gamification, and Google Calendar integration.

## ✨ Features

### 🎯 Core Functionality

- **Smart Task Management**: Create, organize, and track tasks with color-coded categories
- **Priority Levels**: High, Medium, and Low priority tasks
- **Due Dates & Times**: Set deadlines and get automatic timetables
- **Task Filtering**: Filter by status, category, date, and search
- **Color-Coded Categories**: Work, Personal, Shopping, Health, Finance, Learning, Social, Other

### 🌓 Theme System

- **Dark/Light Mode**: Toggle between beautiful dark and light themes
- **Persistent Preference**: Your theme choice is saved automatically
- **Smooth Transitions**: Elegant theme switching animations

### 📊 Analytics & Statistics

- **Productivity Tracking**: View weekly and monthly task statistics
- **Completion Rates**: Track your task completion percentage
- **Category Breakdown**: See task distribution across categories
- **Streak Tracking**: Monitor your daily completion streaks
- **Productivity Trends**: Visualize your productivity over time

### 👥 Team Collaboration

- **Create Teams**: Build teams for collaborative work
- **Leader Assignment**: Designate team leaders with special permissions
- **Task Assignment**: Leaders can assign tasks to team members
- **Email Notifications**: Team members receive task assignment notifications
- **Team Analytics**: Track team performance and completion rates

### 🏆 Gamification

- **Points System**: Earn points for completing tasks
  - Base: 10 points per task
  - Priority Bonus: High +5, Medium +3
  - On-Time Bonus: +5 for completing before due date
- **Leaderboard**: Compete with other users
- **2-Month Cycles**: Competition resets every 2 months
- **Achievements**: Unlock badges for milestones
- **Rewards**: Top performer wins a special gift! 🎁

### 🔔 Notifications & Reminders

- **Task Reminders**: Set reminders for important tasks
- **Daily Summary**: Receive daily task summaries at 8 PM
- **Browser Notifications**: Get notified about important events
- **Email Simulation**: Console-based email notifications (for demo)

### 📅 Calendar Integration

- **Google Calendar Export**: Export tasks as .ics files
- **Daily Timetable**: Automatic schedule generation
- **Week View**: See your tasks organized by week
- **Upcoming Tasks**: View tasks due in the next 7 days

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser!

### Installation

1. **Clone or Download** the project to your computer

2. **Open the Application**
   - Navigate to the `todo-app` folder
   - Open `auth.html` in your web browser to start

3. **Create an Account**
   - Click "Sign Up" tab
   - Enter your name, email, and password (minimum 6 characters)
   - Click "Create Account"

4. **Start Using TaskMaster**
   - Login with your credentials
   - Start creating tasks and exploring features!

## 📁 Project Structure

```
todo-app/
├── index.html              # Main dashboard
├── auth.html              # Login/Sign Up page
├── analytics.html         # Statistics & analytics
├── team.html             # Team collaboration
├── leaderboard.html      # Points & leaderboard
├── about.html            # About page
├── contact.html          # Contact page
├── css/
│   ├── theme.css         # Dark/light theme variables
│   ├── main.css          # Core styles
│   └── components.css    # Reusable components
├── js/
│   ├── app.js            # Main application
│   ├── auth.js           # Authentication
│   ├── tasks.js          # Task management
│   ├── theme.js          # Theme switching
│   ├── calendar.js       # Calendar & reminders
│   ├── team.js           # Team collaboration
│   ├── analytics.js      # Statistics
│   ├── gamification.js   # Points & leaderboard
│   └── notifications.js  # Notifications
└── assets/
    └── icons/            # Icon assets
```

## 🎨 Color-Coded Categories

- 💼 **Work** - Blue (#3b82f6)
- 👤 **Personal** - Purple (#8b5cf6)
- 🛒 **Shopping** - Pink (#ec4899)
- 💪 **Health** - Green (#10b981)
- 💰 **Finance** - Orange (#f59e0b)
- 📚 **Learning** - Cyan (#06b6d4)
- 👥 **Social** - Red-Orange (#f97316)
- 📌 **Other** - Gray (#6b7280)

## 💡 How to Use

### Creating Tasks

1. Click "+ Add Task" button
2. Fill in task details (title, description, category, priority, due date)
3. Optionally set a reminder
4. Click "Add Task"

### Managing Teams

1. Go to Team page
2. Click "Create Team"
3. Add team members (name and email)
4. Assign tasks to team members
5. Track team progress

### Viewing Analytics

1. Navigate to Analytics page
2. Switch between weekly/monthly views
3. See completion rates, streaks, and trends
4. View category breakdown

### Competing on Leaderboard

1. Complete tasks to earn points
2. Check your rank on the Leaderboard page
3. View your achievements
4. Compete for the top spot to win rewards!

### Exporting to Google Calendar

1. On the home page, click "Export to Calendar"
2. Download the .ics file
3. Open Google Calendar
4. Click "+" → "Import"
5. Upload the downloaded file

## 🔧 Technical Details

### Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript ES6+**: Modular, class-based architecture
- **LocalStorage API**: Client-side data persistence
- **Notification API**: Browser notifications

### Data Storage

All data is stored locally in your browser using localStorage:

- User accounts and authentication
- Tasks and task history
- Teams and team members
- Points and leaderboard data
- Theme preferences

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚠️ Important Notes

### Email Functionality

Email notifications are **simulated** in this version:

- Notifications appear in the browser console
- In-app notifications are displayed
- For production, integrate with email services like SendGrid or Mailgun

### Google Calendar Integration

- Export feature creates .ics files for manual import
- Direct API integration requires OAuth and backend server
- Current implementation is suitable for personal use

### Data Persistence

- All data is stored in browser localStorage
- Clearing browser data will delete all tasks and user information
- For production, implement a backend database

## 🎯 Future Enhancements

- Real backend server with database
- Actual email integration
- Direct Google Calendar API integration
- Mobile apps (iOS/Android)
- Offline support with service workers
- Real-time team collaboration
- File attachments for tasks
- Subtasks and task dependencies
- Custom categories and colors
- Export/import data functionality

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Support

For questions or issues:

- Email: support@taskmaster.com
- Visit the Contact page in the application

---

**Built with ❤️ using HTML, CSS, and JavaScript**

Enjoy organizing your tasks and boosting your productivity! 🚀
