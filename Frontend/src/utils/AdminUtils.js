// AdminUtils.js
// Utility functions for the Premium Admin Dashboard

/**
 * Initialize all admin dashboard functionality
 * This should be called when the Admin component mounts
 */
export const initAdminDashboard = () => {
    // Initialize all sub-modules
    initMobileNavigation();
    initScrollAnimations();
    initNotifications();
    setupThemeToggle();
    
    // Add window resize event listener
    window.addEventListener('resize', handleWindowResize);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      // Clean up any other event listeners
    };
  };
  
  /**
   * Handle mobile navigation and responsive behavior
   */
  export const initMobileNavigation = () => {
    const sidebar = document.querySelector('.admin-sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const overlay = document.querySelector('.page-overlay');
    
    if (!sidebar || !sidebarToggle || !overlay) {
      console.warn('Mobile navigation elements not found, skipping initialization');
      return;
    }
    
    // Toggle sidebar when clicking the toggle button
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      document.body.classList.toggle('sidebar-active');
      overlay.classList.toggle('visible');
    });
    
    // Close sidebar when clicking the overlay
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      document.body.classList.remove('sidebar-active');
      overlay.classList.remove('visible');
    });
    
    // Close sidebar when clicking a link on mobile
    const navLinks = sidebar.querySelectorAll('.admin-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
          sidebar.classList.remove('open');
          document.body.classList.remove('sidebar-active');
          overlay.classList.remove('visible');
        }
      });
    });
  };
  
  /**
   * Handle window resize events
   */
  export const handleWindowResize = () => {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.page-overlay');
    
    if (window.innerWidth > 991) {
      // Close sidebar on larger screens
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-active');
        if (overlay) overlay.classList.remove('visible');
      }
    }
    
    // Adjust data tables on mobile
    makeTablesResponsive();
  };
  
  /**
   * Make tables responsive on mobile devices
   */
  export const makeTablesResponsive = () => {
    const tables = document.querySelectorAll('.table');
    
    if (window.innerWidth <= 768) {
      tables.forEach(table => {
        if (!table.classList.contains('responsive-processed')) {
          const headers = Array.from(table.querySelectorAll('thead th')).map(th => 
            th.textContent.trim()
          );
          
          const bodyRows = table.querySelectorAll('tbody tr');
          bodyRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
              if (headers[index]) {
                cell.setAttribute('data-label', headers[index]);
              }
            });
          });
          
          table.classList.add('responsive-processed');
        }
      });
    }
  };
  
  /**
   * Initialize scroll animations for elements
   */
  export const initScrollAnimations = () => {
    const scrollElements = document.querySelectorAll('.scroll-fade');
    
    if (scrollElements.length === 0) {
      return;
    }
    
    const elementInView = (el, dividend = 1) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <= 
        (window.innerHeight || document.documentElement.clientHeight) / dividend
      );
    };
  
    const displayScrollElement = (element) => {
      element.classList.add('scrolled');
    };
  
    const hideScrollElement = (element) => {
      element.classList.remove('scrolled');
    };
  
    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 1.25)) {
          displayScrollElement(el);
        } else {
          hideScrollElement(el);
        }
      });
    };
    
    // Run once on load
    setTimeout(handleScrollAnimation, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
    };
  };
  
  /**
   * Initialize notifications system
   */
  export const initNotifications = () => {
    const notificationsToggle = document.querySelector('.notifications-toggle');
    const notificationsDropdown = document.querySelector('.notifications-dropdown');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    
    if (!notificationsToggle || !notificationsDropdown) {
      return;
    }
    
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Mark all notifications as read
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        unreadNotifications.forEach(notification => {
          notification.classList.remove('unread');
        });
        
        // Remove badge
        const badge = notificationsToggle.querySelector('.badge');
        if (badge) {
          badge.style.display = 'none';
        }
      });
    }
    
    // Add click listeners to individual notifications
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.remove('unread');
        
        // Update unread count
        updateUnreadCount();
      });
    });
  };
  
  /**
   * Update the unread notifications count
   */
  export const updateUnreadCount = () => {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    const badge = document.querySelector('.notifications-toggle .badge');
    
    if (badge) {
      if (unreadNotifications.length > 0) {
        badge.textContent = unreadNotifications.length;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  };
  
  /**
   * Setup theme toggle functionality
   */
  export const setupThemeToggle = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) {
      return;
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('admin-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        localStorage.setItem('admin-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
    });
  };
  
  /**
   * Format date for display
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date string
   */
  export const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: USD)
   * @returns {string} Formatted currency string
   */
  export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  /**
   * Format number with thousand separators
   * @param {number} number - Number to format
   * @returns {string} Formatted number string
   */
  export const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };
  
  /**
   * Create a debounced function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Truncate text to a specified length
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 100) => {
    if (!text || text.length <= length) {
      return text;
    }
    
    return text.substring(0, length) + '...';
  };
  
  /**
   * Generate random ID for elements
   * @returns {string} Random ID
   */
  export const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
  
  /**
   * Create a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, warning, error, info)
   * @param {number} duration - Duration in milliseconds
   */
  export const showToast = (message, type = 'info', duration = 3000) => {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    // Add toast icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-circle';
    if (type === 'error') icon = 'times-circle';
    
    toast.innerHTML = `
      <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
      <div class="toast-content">${message}</div>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
    
    // Close toast when clicking the close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    
    // Show toast with animation
    setTimeout(() => {
      toast.classList.add('toast-visible');
    }, 10);
  };
  
  export default {
    initAdminDashboard,
    initMobileNavigation,
    initScrollAnimations,
    initNotifications,
    setupThemeToggle,
    formatDate,
    formatCurrency,
    formatNumber,
    debounce,
    truncateText,
    generateId,
    showToast
  };