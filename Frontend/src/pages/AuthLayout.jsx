import React from 'react';
import '../css/Auth.css';

const AuthLayout = ({ children, illustrationTitle, illustrationText }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content fade-in">
          {children}
        </div>
      </div>
      
      <div className="auth-illustration">
        <div className="illustration-content">
          <div className="illustration-overlay"></div>
          <div className="illustration-text fade-in-up">
            <h2>{illustrationTitle}</h2>
            <p>{illustrationText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;