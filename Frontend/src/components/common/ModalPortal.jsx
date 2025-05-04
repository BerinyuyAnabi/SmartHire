// src/components/common/ModalPortal.js
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * A Portal component for modals that prevents DOM manipulation conflicts
 * by properly managing modal mount/unmount cycles.
 */
function ModalPortal({ children, isOpen }) {
  const [portalNode, setPortalNode] = useState(null);
  
  useEffect(() => {
    // Only create the portal node when the modal is opening
    if (isOpen && !portalNode) {
      const node = document.createElement('div');
      node.className = 'modal-portal-container';
      document.body.appendChild(node);
      
      // Important: Mark the new node with a data attribute so we can identify it later
      node.setAttribute('data-modal-portal', 'true');
      
      setPortalNode(node);
      
      // Important: Prevent background scrolling
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    }
    
    // Clean up function that runs when modal closes or component unmounts
    return () => {
      if (portalNode) {
        // Important: Check to ensure this node still exists in the DOM and is our node
        if (document.body.contains(portalNode) && 
            portalNode.getAttribute('data-modal-portal') === 'true') {
          
          try {
            document.body.removeChild(portalNode);
          } catch (error) {
            console.warn('Could not remove portal node:', error);
            // If removal fails, at least hide the node
            portalNode.style.display = 'none';
          }
        }
        
        setPortalNode(null);
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
      }
    };
  }, [isOpen, portalNode]);
  
  // Only render into the portal if the node exists and modal is open
  if (!isOpen || !portalNode) return null;
  
  return createPortal(children, portalNode);
}

export default ModalPortal;