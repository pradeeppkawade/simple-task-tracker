const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

// Routes: GET /api/tasks and POST /api/tasks
router.route('/').get(getTasks).post(createTask);

// Routes: PUT /api/tasks/:id and DELETE /api/tasks/:id
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;
