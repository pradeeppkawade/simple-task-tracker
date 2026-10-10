import React from 'react';
import TaskItem from './TaskItem';

// TaskList renders the list of filtered tasks, or a friendly empty state message
function TaskList({ tasks, totalTasksCount, onToggleComplete, onEdit, onDelete }) {
  // Case 1: The user hasn't created any tasks at all yet
  if (totalTasksCount === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">✨ No tasks yet!</p>
        <p>Use the form above to create your first task and stay organized.</p>
      </div>
    );
  }

  // Case 2: Tasks exist, but none match the user's active filter/search
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">🔍 No matching tasks</p>
        <p>Try clearing your search query or adjusting your filter criteria.</p>
      </div>
    );
  }

  // Case 3: Render matching tasks
  return (
    <div className="tasks-container">
      <div className="tasks-grid">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
