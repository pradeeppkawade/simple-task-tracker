import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authService } from './services/authService';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(() => authService.getUser());
  const navigate = useNavigate();

  // Helper to sync user state when login/register succeeds
  const handleAuthSuccess = () => {
    setCurrentUser(authService.getUser());
  };

  // Helper to handle user logout
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="app">
      <Routes>
        {/* Dashboard route: protected */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Dashboard user={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login route: redirects to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleAuthSuccess} />
            )
          }
        />

        {/* Register route: redirects to dashboard if already logged in */}
        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Register onRegisterSuccess={handleAuthSuccess} />
            )
          }
        />

        {/* Fallback route for unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
