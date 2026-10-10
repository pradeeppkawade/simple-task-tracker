import React, { useState, useEffect } from 'react';

// TaskForm component handles both creating new tasks and editing existing ones
function TaskForm({ editingTask, onSubmit, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('College');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // When editingTask changes, populate or reset the form fields
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'Medium');
      setCategory(editingTask.category || 'College');
      // Format existing dueDate to YYYY-MM-DD for the date input
      if (editingTask.dueDate) {
        const dateObj = new Date(editingTask.dueDate);
        setDueDate(dateObj.toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
      setError('');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setCategory('College');
    setDueDate('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend validation
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setError('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate ? dueDate : null,
    });

    if (!editingTask) {
      resetForm();
    }
  };

  return (
    <div className="task-form-card">
      <div className="form-header">
        <h3>{editingTask ? '✏️ Edit Task' : '➕ Add New Task'}</h3>
        {editingTask && (
          <button type="button" onClick={onCancelEdit} className="btn btn-secondary btn-sm">
            Cancel Edit
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task-title">Title *</label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g., Study Database Management Systems Unit 2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-desc">Description (optional)</label>
          <textarea
            id="task-desc"
            className="form-textarea"
            placeholder="Add relevant notes, links, or instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-category">Category</label>
            <select
              id="task-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="College">College</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
