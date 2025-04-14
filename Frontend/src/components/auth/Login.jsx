import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../pages/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import '../../css/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use the login function from AuthContext
      await login(email, password, rememberMe);
      
      // Redirect on success
      navigate('/admin');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthLayout 
      illustrationTitle="Welcome Back"
      illustrationText="Access your account to manage your projects, track your progress, and connect with like-minded professionals."
    >
      <div className="auth-header">
        <h1 className="auth-title">Login In</h1>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="social-buttons">
        <button className="social-button google">
          <i className="fab fa-google"></i>
          Google
        </button>
        <button className="social-button linkedin">
          <i className="fab fa-linkedin-in"></i>
          LinkedIn
        </button>
      </div>
      
      <div className="auth-divider">
        <span>or continue with</span>
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-group">
            <i className="input-icon fas fa-envelope"></i>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <div className="password-label-group">
            <label htmlFor="password">Password</label>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>
          <div className="input-group">
            <i className="input-icon fas fa-lock"></i>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="form-check">
          <input 
            type="checkbox" 
            id="remember-me" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me">Remember me</label>
        </div>
        
        <button 
          type="submit" 
          className={`auth-button ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner"></span>
          ) : (
            <>
              Login 
            </>
          )}
        </button>
      </form>
      
      <div className="auth-footer">
        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;