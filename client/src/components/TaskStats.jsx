import React from 'react';

// TaskStats component calculates and renders summary metrics
function TaskStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Total Tasks</span>
        <span className="stat-number">{total}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Completed</span>
        <span className="stat-number completed">{completed}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Pending</span>
        <span className="stat-number pending">{pending}</span>
      </div>
    </div>
  );
}

export default TaskStats;
