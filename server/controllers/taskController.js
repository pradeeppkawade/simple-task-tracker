const mongoose = require('mongoose');
const Task = require('../models/Task');

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_CATEGORIES = ['College', 'Personal', 'Work', 'Other'];

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private (Auth required)
const getTasks = async (req, res) => {
  try {
    // Only fetch tasks belonging to the authenticated user from JWT
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Auth required)
const createTask = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    // 1. Validate required title
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    // 2. Validate priority if provided
    const taskPriority = priority || 'Medium';
    if (!VALID_PRIORITIES.includes(taskPriority)) {
      return res.status(400).json({ message: 'Priority must be Low, Medium, or High' });
    }

    // 3. Validate category if provided
    const taskCategory = category || 'College';
    if (!VALID_CATEGORIES.includes(taskCategory)) {
      return res.status(400).json({ message: 'Category must be College, Personal, Work, or Other' });
    }

    // 4. Validate dueDate if provided
    let parsedDueDate = null;
    if (dueDate) {
      const parsed = new Date(dueDate);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({ message: 'Invalid due date format' });
      }
      parsedDueDate = parsed;
    }

    // 5. Create task strictly associating it with req.user.id from JWT
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: taskPriority,
      category: taskCategory,
      dueDate: parsedDueDate,
      completed: false,
      user: req.user.id, // Never set from req.body
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Server error while creating task' });
  }
};

// @desc    Update a task (or toggle complete)
// @route   PUT /api/tasks/:id
// @access  Private (Auth required)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task exists AND belongs to the logged-in user
    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, priority, category, dueDate, completed } = req.body;

    // Validate title if updating title
    if (title !== undefined) {
      if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Task title cannot be empty' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: 'Priority must be Low, Medium, or High' });
      }
      task.priority = priority;
    }

    if (category !== undefined) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: 'Category must be College, Personal, Work, or Other' });
      }
      task.category = category;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        task.dueDate = null;
      } else {
        const parsed = new Date(dueDate);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ message: 'Invalid due date format' });
        }
        task.dueDate = parsed;
      }
    }

    if (completed !== undefined) {
      task.completed = Boolean(completed);
    }

    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Server error while updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Auth required)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find and delete only if the task belongs to the authenticated user
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Server error while deleting task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
