import { useState, useEffect } from 'react'
import axios from "axios"
import { getUsernames } from "./api"

import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';

function App() {
  const [respone, etRespone] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [users, setUsers] = useState(null)

  const fetchUsers = async () => {
    const users = await getUsernames()
    setUsers(users)
  }

  useEffect(() => {
    fetchUsers()
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(stored);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };


  return (
    <div>
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} users={users} />
      ) : (
        <LoginPage onLogin={setCurrentUser} />
      )}
    </div>
  );
}

export default App
