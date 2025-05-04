// src/components/common/SimpleModal.js
import React, { useEffect, useRef } from 'react';

/**
 * An improved modal component that uses CSS classes instead of inline styles
 * for better styling consistency and visual appeal
 */
function SimpleModal({ children, isOpen, onClose }) {
  const modalRef = useRef(null);
  
  // Set up keyboard event listener for Escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    
    // Add event listener for escape key
    if (isOpen) {
      window.addEventListener('keydown', handleEscapeKey);
    }
    
    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  // Handle body scrolling when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      // Restore scrolling when modal closes
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup function to ensure body styles are reset
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);
  
  // Don't render anything if modal is closed
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" ref={modalRef}>
      <div className="modal-container">
        {children}
      </div>
    </div>
  );
}

export default SimpleModal;