import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import { newLogin } from './api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(stored);
    } else {
      googleLogin();
    }
  }, []);

  const googleLogin = async () => {
    const username = await newLogin();
    if (username) {
      setCurrentUser(username);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
  
    window.location.href = "https://accounts.google.com/logout";
  };


  return (
    <div>
      <Dashboard onLogout={handleLogout} onRefreshSession={googleLogin} />
    </div>
  );
}

export default App
