import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState(null); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend API
      const response = await axios.post("/user/login", formData);
      console.log('Response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setLoggedInEmail(formData.email);
        setError(null);
        if (onLogin) {
          onLogin(response.data.token);
        }
      } else {
        setError('Login failed. Please try again.');
      }      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred during login.');
    }
    
  };


  if (loggedInEmail) {
    return <Dashboard loggedInEmail={loggedInEmail} />;
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Welcome Back!</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
          <button type="submit" className="login-button">Log In</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="welcome-area">
        <h3>Happy to have you back!</h3>
        <p>If you already have an account, sign in with your email and password.</p>
      </div>
    </div>
  );
};

export default LoginForm;
