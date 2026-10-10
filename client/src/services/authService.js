// Service module for managing user authentication
// Uses native browser fetch API and localStorage

const API_BASE = '/api/auth';

export const authService = {
  // Store authentication data in localStorage
  setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Retrieve JWT token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Retrieve user object from localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Check if a user is currently logged in
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Log out user by removing stored credentials
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Register a new account
  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Automatically store token & user on successful registration
    this.setAuth(data.token, data.user);
    return data;
  },

  // Log in to an existing account
  async login(email, password) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token & user on successful login
    this.setAuth(data.token, data.user);
    return data;
  },
};
