import React, { useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm'; 
import './LoginForm.css';

const SignUpForm = ({ onSignUp }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [goToLogin, setGoToLogin] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/signup", formData);
      console.log('Response:', response.data); 
      setError(null); // Reset error state
      setFormData({ email: '', password: '' }); // Clear input fields
      onSignUp();
    } catch (error) {
      console.error('Error:', error); // Log error
      setError('An error occurred. Please try again.'); // Set error message
    }
  };

  const handleGoToLogin = () => {
    setGoToLogin(true);
  };

  if (goToLogin) {
    return <LoginForm />;
  }
  
  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Hello, friend!</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="login-button">CREATE ACCOUNT</button>
          {error && <p className="error">{error}</p>}
        </form>
        <div className="sign-in-redirect">
          Already have an account? 
          <button className="go-to-login-link gotologin-button" onClick={handleGoToLogin}>Log In</button>
        </div>
      </div>
      <div className="welcome-area">
        <h3>Glad to see You!</h3>
        <p>Created By Dean Lourence Barquio</p>
        <p>Welcome to our furniture webpage, where style meets comfort in every piece. Explore our extensive collection  of high-quality furniture crafted with precision and care. From sleek and modern designs to timeless classics, we offer something to suit every taste and style. Whether you're furnishing a cozy living room, a chic dining area, or a relaxing outdoor space, we have the perfect furniture solutions to elevate your home decor. With our user-friendly website, seamless shopping experience, and excellent customer service, furnishing your dream space has never been easier.</p>
      </div>
    </div>
  );
};

export default SignUpForm;
