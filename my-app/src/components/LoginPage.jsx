import React, { useState, useEffect } from "react";
import { getUsersPass } from "../api"
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState(null)

  const setUsersPass = async () => {
    const users = await getUsersPass()
    setUsers(users)
  }

  useEffect(() => {
    setUsersPass()
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.name === name && u.pass === password
    );
    if (user) {
      localStorage.setItem("currentUser", name);
      onLogin(name);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Team Daily Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
