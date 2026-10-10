import React from 'react';

// Formats a date string into readable user friendly date (e.g., Oct 15, 2026)
function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// TaskItem displays an individual task card with controls to toggle, edit, and delete
function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const handleDeleteClick = () => {
    // Beginner-friendly browser confirmation prompt before deletion
    const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
    if (confirmed) {
      onDelete(task._id);
    }
  };

  const formattedDue = formatDate(task.dueDate);

  return (
    <div className={`task-card ${task.completed ? 'is-completed' : ''}`}>
      {/* Checkbox to toggle complete / pending */}
      <div className="task-checkbox-wrapper">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          title={task.completed ? 'Mark as pending' : 'Mark as completed'}
        />
      </div>

      {/* Task Content */}
      <div className="task-body">
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
        </div>

        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          {/* Priority Badge */}
          <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>
            {task.priority} Priority
          </span>

          {/* Category Badge */}
          <span className={`badge badge-cat-${task.category.toLowerCase()}`}>
            {task.category}
          </span>

          {/* Due Date */}
          {formattedDue && (
            <span className="task-due-date">
              📅 Due: {formattedDue}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="task-actions">
        <button
          onClick={() => onEdit(task)}
          className="btn btn-secondary btn-sm"
          title="Edit this task"
        >
          Edit
        </button>

        <button
          onClick={handleDeleteClick}
          className="btn btn-danger-outline btn-sm"
          title="Delete this task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
