// Service module for managing task CRUD operations
// Sends the JWT Bearer token in headers for authorization

import { authService } from './authService';

const API_BASE = '/api/tasks';

// Helper function to build headers including JWT token
const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const taskService = {
  // Fetch all tasks for the authenticated user
  async getTasks() {
    const res = await fetch(API_BASE, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch tasks');
    }
    return data;
  },

  // Create a new task
  async createTask(taskData) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create task');
    }
    return data;
  },

  // Update an existing task (or toggle complete)
  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update task');
    }
    return data;
  },

  // Delete a task by ID
  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete task');
    }
    return data;
  },
};
