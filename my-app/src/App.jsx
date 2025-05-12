import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import { newLogin } from './api';

function App() {
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
  
    window.location.href = "https://accounts.google.com/logout";
  };


  return (
    <div>
      <Dashboard onLogout={handleLogout} />
    </div>
  );
}

export default App
