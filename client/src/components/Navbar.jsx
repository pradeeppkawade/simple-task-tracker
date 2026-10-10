import React from 'react';

// Navigation bar showing branding, logged-in user greeting, and logout button
function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="navbar-brand">
          <span>📋</span>
          <span>Simple Task Tracker</span>
        </div>

        <div className="navbar-right">
          {user && (
            <span className="welcome-text">
              Welcome, <strong className="welcome-name">{user.name}</strong>
            </span>
          )}
          <button onClick={onLogout} className="btn btn-secondary btn-sm" title="Log out of your account">
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
