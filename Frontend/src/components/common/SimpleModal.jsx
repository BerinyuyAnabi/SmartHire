// src/components/common/SimpleModal.js
import React, { useEffect, useRef } from 'react';

/**
 * A simple modal component that doesn't use React portals
 * but still handles body scrolling and modal lifecycle
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
    <div 
      className="modal-wrapper" 
      ref={modalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div 
        className="modal-backdrop" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1001
        }}
      />
      <div 
        className="modal-content"
        onClick={e => e.stopPropagation()} 
        style={{
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          position: 'relative',
          zIndex: 1002,
          animation: 'modalFadeIn 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default SimpleModal;