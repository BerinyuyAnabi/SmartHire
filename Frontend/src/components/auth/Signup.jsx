import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate import
import AuthLayout from '../../pages/AuthLayout';
import '../../css/Auth.css';

const Signup = () => {
  const navigate = useNavigate(); // Added navigate hook
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const selectRole = (role) => {
    setFormData({
      ...formData,
      role
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create a new FormData object with a different name to avoid conflict
      const submitData = new FormData();
      submitData.append('username', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('confirmPassword', formData.password);
      submitData.append('agreeTerms', formData.agreeToTerms ? 'on' : 'off');
      
      const response = await fetch('/faculty_signup', {
        method: 'POST',
        body: submitData
      });
      
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          <>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-group">
                <i className="input-icon fas fa-user"></i>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName"
                  placeholder="Enter your full name" 
                  value={formData.fullName}
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
                  value={formData.email}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Select Your Role</label>
              <div className="role-selector">
                <div 
                  className={`role-option ${formData.role === 'professional' ? 'selected' : ''}`}
                  onClick={() => selectRole('professional')}
                >
                  <i className="fas fa-briefcase"></i>
                  <span>Professional</span>
                </div>
                <div 
                  className={`role-option ${formData.role === 'student' ? 'selected' : ''}`}
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
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="terms">
                I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
              </label>
            </div>
          </>
        )}
        
        <button 
          type="submit" 
          className={`auth-button ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting || (step === 2 && (!formData.role || !formData.agreeToTerms))}
        >
          {isSubmitting ? (
            <span className="spinner"></span>
          ) : step === 1 ? (
            <>
              Continue
            </>
          ) : (
            <>
              Create Account
            </>
          )}
        </button>
      </form>
      
      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </div>
    </AuthLayout>
  );
};

export default Signup;