// Authentication Management (localStorage-based simulation)

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }
  }

  register(userData) {
    const { name, email, password } = userData;
    
    // Validation
    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const users = this.getAllUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      points: 0,
      tasksCompleted: 0
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true, message: 'Registration successful', user: newUser };
  }

  login(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Set current user
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));

    return { success: true, message: 'Login successful', user };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  updateUserPoints(points) {
    if (!this.currentUser) return;

    this.currentUser.points += points;
    this.currentUser.tasksCompleted += 1;

    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

    // Update in users array
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = this.currentUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  getAllUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  }

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'auth.html';
      return false;
    }
    return true;
  }
}

// Initialize auth manager
const authManager = new AuthManager();
