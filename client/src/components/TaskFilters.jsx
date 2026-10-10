import React from 'react';

// TaskFilters component handles search, status, priority, category filters, and due date sorting
function TaskFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  onResetFilters,
}) {
  return (
    <div className="filters-container">
      {/* Search Input */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="search-input">Search Title</label>
        <input
          id="search-input"
          type="text"
          className="form-input"
          placeholder="Type to search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="status-select">Status</label>
        <select
          id="status-select"
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="priority-select">Priority</label>
        <select
          id="priority-select"
          className="form-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="category-select">Category</label>
        <select
          id="category-select"
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="College">College</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Sort By Due Date */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="sort-select">Sort Due Date</label>
        <select
          id="sort-select"
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Default (Newest)</option>
          <option value="soonest">Due Soonest</option>
          <option value="latest">Due Latest</option>
        </select>
      </div>
    </div>
  );
}

export default TaskFilters;
