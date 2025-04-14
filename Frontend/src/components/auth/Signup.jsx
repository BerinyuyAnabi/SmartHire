import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../pages/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import '../../css/Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use the register function from AuthContext
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      // Registration successful
      console.log('Registration successful');
      
      // Redirect to login page
      navigate('/login', { state: { message: 'Account created successfully. Please login.' } });
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
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
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
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
        
        <button 
          type="submit" 
          className={`auth-button ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting || !formData.agreeToTerms}
        >
          {isSubmitting ? (
            <span className="spinner"></span>
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