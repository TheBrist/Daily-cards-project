import React, { useState, useEffect } from "react";
import {  login } from "../api"
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ name, password }); // wait for the response
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", name);
      onLogin(name);
    } catch (err) {
      console.error("Login error:", err);
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
