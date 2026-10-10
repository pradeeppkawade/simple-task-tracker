import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import TaskStats from '../components/TaskStats';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';

// Main Dashboard page
function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Filter & Search states (managed strictly on frontend for fast response)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Load tasks on initial mount
  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    try {
      setLoading(true);
      setApiError('');
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setApiError(err.message);
      // If unauthorized, token might have expired
      if (err.message.includes('401') || err.message.includes('denied') || err.message.includes('token')) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Add or update task
  const handleTaskSubmit = async (taskData) => {
    try {
      setApiError('');
      if (editingTask) {
        // Updating existing task
        const updated = await taskService.updateTask(editingTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        setEditingTask(null);
      } else {
        // Creating new task
        const created = await taskService.createTask(taskData);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      setApiError(err.message);
    }
  };

  // Toggle completion status
  const handleToggleComplete = async (task) => {
    try {
      setApiError('');
      const updated = await taskService.updateTask(task._id, {
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setApiError(err.message);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      setApiError('');
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (editingTask && editingTask._id === taskId) {
        setEditingTask(null);
      }
    } catch (err) {
      setApiError(err.message);
    }
  };

  // Set task to be edited
  const handleEditClick = (task) => {
    setEditingTask(task);
    // Smooth scroll to form if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSortBy('default');
  };

  // Compute filtered & sorted tasks using useMemo for optimal performance
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // 1. Search by title
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          if (!task.title.toLowerCase().includes(query)) {
            return false;
          }
        }

        // 2. Filter by completion status
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // 3. Filter by priority
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }

        // 4. Filter by category
        if (categoryFilter !== 'all' && task.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by due date
        if (sortBy === 'soonest') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'latest') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        // Default sort preserves list order (newest created first)
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />

      <main className="container">
        {/* Summary Statistics */}
        <TaskStats tasks={tasks} />

        {/* Global API error notification */}
        {apiError && <div className="alert alert-error">{apiError}</div>}

        {/* Add / Edit Task Form */}
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleTaskSubmit}
          onCancelEdit={handleCancelEdit}
        />

        {/* Search, Filter & Sort Controls */}
        <TaskFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* Loading Indicator or Task List */}
        {loading ? (
          <div className="loading-box">Loading your tasks...</div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            totalTasksCount={tasks.length}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
          />
        )}
      </main>
    </>
  );
}

export default Dashboard;
