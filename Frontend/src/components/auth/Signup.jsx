import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../pages/AuthLayout';
import '../../css/Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  // Use state for controlling visibility instead of step numbers
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const selectRole = (role) => {
    setUserData({
      ...userData,
      role
    });
  };
  
  const handleContinue = (e) => {
    e.preventDefault();
    // Instead of changing a step number, control component visibility
    setShowPersonalInfo(false);
    setShowRoleSelection(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const submitData = new FormData();
      submitData.append('username', userData.fullName);
      submitData.append('email', userData.email);
      submitData.append('password', userData.password);
      submitData.append('confirmPassword', userData.password);
      submitData.append('agreeTerms', userData.agreeToTerms ? 'on' : 'off');
      
      const response = await fetch('/api/signup', {
        method: 'POST',
        body: submitData
      });
      
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      
      // Set session storage to indicate successful signup
      sessionStorage.setItem('isLoggedIn', 'true');
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate current step for the UI indicator
  const currentStep = showPersonalInfo ? 1 : 2;
  
  return (
    <AuthLayout
      illustrationTitle="Join Our Community"
      illustrationText="Create an account to access all features, connect with professionals, and start your journey with us."
    >
      <div className="auth-header">
        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-subtitle">Create your account in just a few steps.</p>
      </div>
      
      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step-line ${currentStep > 1 ? 'completed' : ''}`}></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showPersonalInfo && (
        <form className="auth-form" onSubmit={handleContinue}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-group">
              <i className="input-icon fas fa-user"></i>
              <input 
                type="text" 
                id="fullName" 
                name="fullName"
                placeholder="Enter your full name" 
                value={userData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <i className="input-icon fas fa-envelope"></i>
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder="Enter your email" 
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <i className="input-icon fas fa-lock"></i>
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="Create a password" 
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
          >
            Continue
          </button>
        </form>
      )}
      
      {showRoleSelection && (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Your Role</label>
            <div className="role-selector">
              <div 
                className={`role-option ${userData.role === 'professional' ? 'selected' : ''}`}
                onClick={() => selectRole('professional')}
              >
                <i className="fas fa-briefcase"></i>
                <span>Professional</span>
              </div>
              <div 
                className={`role-option ${userData.role === 'student' ? 'selected' : ''}`}
                onClick={() => selectRole('student')}
              >
                <i className="fas fa-graduation-cap"></i>
                <span>Student</span>
              </div>
            </div>
          </div>
          
          <div className="form-check terms-check">
            <input 
              type="checkbox" 
              id="terms" 
              name="agreeToTerms"
              checked={userData.agreeToTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="terms">
              I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
            </label>
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting || (!userData.role || !userData.agreeToTerms)}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              <>
                Create Account
              </>
            )}
          </button>
          
          <button 
            type="button" 
            className="auth-button secondary"
            onClick={() => {
              setShowPersonalInfo(true);
              setShowRoleSelection(false);
            }}
          >
            Back
          </button>
        </form>
      )}
      
      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </div>
    </AuthLayout>
  );
};

export default Signup;