import { useState, useEffect } from 'react'
import axios from "axios"

import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';

const backgroundStyle = {
  backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqj4BxwxEmsGtIxv2gjDxu-6B4cUZ-VdsvKg&s)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100%'
}

function App() {
  const [respone, setRespone] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  const fetchAPI = async () => {
    const respone = await axios.get("http://localhost:8080/api")
    console.log("hi")
    setRespone(respone.data)
  }

  useEffect(() => {
    fetchAPI()
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
    <div style={backgroundStyle}>
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={setCurrentUser} />
      )}
    </div>
  );
}

export default App
