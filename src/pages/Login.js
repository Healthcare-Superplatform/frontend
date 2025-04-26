import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

const Login = ({ onLoginSuccess, setIsLoggedIn }) => {
  const [ssn, setSSN] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.get("https://backend-c4xe.onrender.com/users");
      const apiUsers = res.data;
  
      const matchedUser = apiUsers.find(
        (user) => user.SSN === ssn && user.Password === password
      );
  
      if (!matchedUser) {
        setError("❌ Invalid SSN or password.");
        return;
      }
  
      // Save to localStorage
      localStorage.setItem("ssn", ssn);
      localStorage.setItem("userId", matchedUser._id);
      localStorage.setItem("userName", matchedUser.Name);
      localStorage.setItem("userPassword", matchedUser.Password);
  
      if (onLoginSuccess) {
        onLoginSuccess({
          SSN: ssn,
          id: matchedUser._id,
          name: matchedUser.Name,
        });
      }
  
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      setError("❌ Failed to login. Try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="SSN"
          value={ssn}
          onChange={(e) => setSSN(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <a href="/signup">Create an account</a>
      </p>
    </div>
  );
};

export default Login;
