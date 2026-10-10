const mongoose = require('mongoose');

// Task Schema defines the structure of each task in the database
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be either Low, Medium, or High',
      },
      default: 'Medium',
    },
    category: {
      type: String,
      enum: {
        values: ['College', 'Personal', 'Work', 'Other'],
        message: 'Category must be College, Personal, Work, or Other',
      },
      default: 'College',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('Task', taskSchema);
