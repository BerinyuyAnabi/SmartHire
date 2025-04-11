import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../pages/AuthLayout';
import '../../css/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Your password reset logic here
      // await sendPasswordResetEmail(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthLayout
      illustrationTitle="Reset Your Password"
      illustrationText="We'll send you instructions on how to reset your password and secure your account."
    >
      <div className="auth-header">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">
          {isSubmitted 
            ? "Check your email for reset instructions" 
            : "Enter your email and we'll send you a reset link"}
        </p>
      </div>
      
      {!isSubmitted ? (
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
          
          <button 
            type="submit" 
            className={`auth-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              <>
                Send Reset Link
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="fade-in">
          <div className="form-group" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <i className="fas fa-envelope-open-text" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
            <p>We've sent reset instructions to <strong>{email}</strong>. Please check your inbox.</p>
          </div>
          
          <button 
            className="auth-button"
            onClick={() => setIsSubmitted(false)}
          >
            Try Another Email
          </button>
        </div>
      )}
      
      <div className="auth-footer">
        Remember your password? <Link to="/login" className="auth-link">Back to login</Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;