import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(stored);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };


  return (
    <div>
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={setCurrentUser} />
      )}
    </div>
  );
}

export default App
