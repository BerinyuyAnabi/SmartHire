// src/components/common/ModalPortal.js
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * A Portal component for modals that prevents DOM manipulation conflicts
 * by properly managing modal mount/unmount cycles.
 */
function ModalPortal({ children, isOpen }) {
  const [mounted, setMounted] = useState(false);
  const portalNodeRef = useRef(null);
  
  useEffect(() => {
    // Only create the portal node when the modal is opening
    if (isOpen && !mounted) {
      // Create the portal container if it doesn't exist
      if (!portalNodeRef.current) {
        const node = document.createElement('div');
        node.className = 'modal-portal-container';
        node.setAttribute('data-modal-portal', 'true');
        portalNodeRef.current = node;
      }
      
      // Append the node to document body only if it's not already there
      if (!document.body.contains(portalNodeRef.current)) {
        document.body.appendChild(portalNodeRef.current);
      }
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      setMounted(true);
    } else if (!isOpen && mounted) {
      // Reset body styles first
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      
      // Set mounted to false, actual DOM node removal happens in the cleanup function
      setMounted(false);
    }
    
    // Cleanup function that runs when component unmounts
    return () => {
      if (portalNodeRef.current) {
        // Reset body styles
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        
        // Safe node removal, only if it's still in the DOM and a child of document.body
        try {
          if (document.body.contains(portalNodeRef.current)) {
            document.body.removeChild(portalNodeRef.current);
          }
        } catch (error) {
          console.warn('Could not remove portal node:', error);
          // If removal fails, at least hide the node
          if (portalNodeRef.current) {
            portalNodeRef.current.style.display = 'none';
          }
        }
        
        // Clear the ref
        portalNodeRef.current = null;
        setMounted(false);
      }
    };
  }, [isOpen, mounted]);
  
  // Only render into the portal if node exists and modal is open
  if (!isOpen || !mounted || !portalNodeRef.current) {
    return null;
  }
  
  return createPortal(children, portalNodeRef.current);
}

export default ModalPortal;