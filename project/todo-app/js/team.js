// Team Collaboration System

class TeamManager {
  constructor() {
    this.teams = [];
    this.init();
  }

  init() {
    this.loadTeams();
  }

  loadTeams() {
    const teamsJson = localStorage.getItem('teams');
    this.teams = teamsJson ? JSON.parse(teamsJson) : [];
  }

  saveTeams() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
  }

  createTeam(teamData) {
    const { name, description } = teamData;
    const user = authManager.getCurrentUser();

    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    if (!name) {
      return { success: false, message: 'Team name is required' };
    }

    const newTeam = {
      id: Date.now().toString(),
      name,
      description: description || '',
      leaderId: user.id,
      leaderName: user.name,
      members: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'leader',
          joinedAt: new Date().toISOString()
        }
      ],
      tasks: [],
      createdAt: new Date().toISOString()
    };

    this.teams.push(newTeam);
    this.saveTeams();

    return { success: true, message: 'Team created successfully', team: newTeam };
  }

  addMember(teamId, memberData) {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) {
      return { success: false, message: 'Team not found' };
    }

    const user = authManager.getCurrentUser();
    if (team.leaderId !== user.id) {
      return { success: false, message: 'Only team leader can add members' };
    }

    // Check if member already exists
    if (team.members.find(m => m.email === memberData.email)) {
      return { success: false, message: 'Member already in team' };
    }

    const newMember = {
      id: Date.now().toString(),
      name: memberData.name,
      email: memberData.email,
      role: 'member',
      joinedAt: new Date().toISOString()
    };

    team.members.push(newMember);
    this.saveTeams();

    // Send notification
    notificationManager.showNotification({
      title: 'Team Member Added',
      message: `${newMember.name} has been added to ${team.name}`,
      type: 'success'
    });

    return { success: true, message: 'Member added successfully', member: newMember };
  }

  assignTask(teamId, taskData) {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) {
      return { success: false, message: 'Team not found' };
    }

    const user = authManager.getCurrentUser();
    if (team.leaderId !== user.id) {
      return { success: false, message: 'Only team leader can assign tasks' };
    }

    const { title, description, assignedTo, dueDate, priority } = taskData;

    const assignedMember = team.members.find(m => m.id === assignedTo);
    if (!assignedMember) {
      return { success: false, message: 'Assigned member not found in team' };
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      assignedTo: assignedMember.id,
      assignedToName: assignedMember.name,
      assignedBy: user.id,
      assignedByName: user.name,
      dueDate: dueDate || null,
      priority: priority || 'medium',
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    team.tasks.push(newTask);
    this.saveTeams();

    // Send notification to assigned member
    notificationManager.sendTeamTaskNotification(assignedMember, newTask, user);

    // Simulate email
    console.log(`📧 TEAM TASK EMAIL SENT TO: ${assignedMember.email}`);
    console.log(`Task: ${title}`);
    console.log(`Assigned by: ${user.name}`);
    console.log(`Due: ${dueDate || 'Not set'}`);

    return { success: true, message: 'Task assigned successfully', task: newTask };
  }

  updateTaskStatus(teamId, taskId, status) {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) {
      return { success: false, message: 'Team not found' };
    }

    const task = team.tasks.find(t => t.id === taskId);
    if (!task) {
      return { success: false, message: 'Task not found' };
    }

    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date().toISOString();
    }

    this.saveTeams();

    return { success: true, message: 'Task status updated', task };
  }

  getUserTeams() {
    const user = authManager.getCurrentUser();
    if (!user) return [];

    return this.teams.filter(t => 
      t.members.some(m => m.id === user.id || m.email === user.email)
    );
  }

  getTeamById(teamId) {
    return this.teams.find(t => t.id === teamId);
  }

  getTeamTasks(teamId, filter = {}) {
    const team = this.getTeamById(teamId);
    if (!team) return [];

    let tasks = [...team.tasks];

    if (filter.assignedTo) {
      tasks = tasks.filter(t => t.assignedTo === filter.assignedTo);
    }

    if (filter.status) {
      tasks = tasks.filter(t => t.status === filter.status);
    }

    return tasks;
  }

  getTeamStats(teamId) {
    const team = this.getTeamById(teamId);
    if (!team) return null;

    const tasks = team.tasks;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;

    return {
      totalMembers: team.members.length,
      totalTasks: tasks.length,
      completed,
      pending,
      inProgress,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
    };
  }

  removeMember(teamId, memberId) {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) {
      return { success: false, message: 'Team not found' };
    }

    const user = authManager.getCurrentUser();
    if (team.leaderId !== user.id) {
      return { success: false, message: 'Only team leader can remove members' };
    }

    if (memberId === team.leaderId) {
      return { success: false, message: 'Cannot remove team leader' };
    }

    const memberIndex = team.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return { success: false, message: 'Member not found' };
    }

    team.members.splice(memberIndex, 1);
    this.saveTeams();

    return { success: true, message: 'Member removed successfully' };
  }
}

// Initialize team manager
const teamManager = new TeamManager();
