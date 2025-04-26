import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [ssn, setSSN] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
  
    const trimmedSSN = ssn.trim();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();
  
    try {
      const response = await fetch('https://backend-c4xe.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: trimmedName,
          ssn: trimmedSSN,
          password: trimmedPassword
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('userName', trimmedName);
        localStorage.setItem('ssn', trimmedSSN);
  
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error', error);
      setError('Something went wrong. Please try again.');
    }
  }; // <<< CLOSE handleSignup function properly here!
  
  
  
    // ✅ Navigate to dashboard after signup
    navigate("/dashboard");
  };
  
  
  

  return (
    <div className="signup-container">
      <h2>📝 Create an Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
