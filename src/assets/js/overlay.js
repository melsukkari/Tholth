/**
 * Tholth Winter Theme - AJAX Category Overlay System
 * Smooth category browsing without page reloads
 * Supports RTL, accessibility, and mobile touch gestures
 * 
 * @author Mohammed Al-Sugari
 * @version 1.0.0
 */

(function() {
  'use strict';

  // Configuration
  const OVERLAY_CONFIG = {
    selector: '#category-overlay',
    bodySelector: '#overlay-body',
    triggerClass: '.category-link',
    closeClass: '[data-dismiss="overlay"]',
    loadingClass: 'overlay-loading',
    animationSpeed: window.tholthSettings?.overlaySpeed || 300,
    cacheEnabled: true,
    maxCacheSize: 10
  };

  // Cache for loaded content
  const contentCache = new Map();

  // Initialize when DOM and Salla are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOverlay);
  } else {
    initOverlay();
  }

  function initOverlay() {
    if (typeof Salla !== 'undefined' && Salla.ready) {
      Salla.ready(function() {
        setupOverlay();
      });
    } else {
      setupOverlay();
    }
  }

  function setupOverlay() {
    const overlay = document.querySelector(OVERLAY_CONFIG.selector);
    
    if (!overlay) {
      console.warn('Tholth: Overlay container not found');
      return;
    }

    // Attach event listeners
    attachCategoryLinks();
    attachCloseHandlers(overlay);
    attachKeyboardHandlers(overlay);
    attachTouchHandlers(overlay);

    console.log('Tholth: AJAX overlay system initialized');
  }

  /**
   * Attach click handlers to category links
   */
  function attachCategoryLinks() {
    document.addEventListener('click', function(e) {
      const categoryLink = e.target.closest(OVERLAY_CONFIG.triggerClass);
      
      if (categoryLink) {
        e.preventDefault();
        
        const url = categoryLink.href || categoryLink.dataset.url;
        const title = categoryLink.dataset.title || categoryLink.textContent;
        
        if (url) {
          openOverlay(url, title);
        }
      }
    });
  }

  /**
   * Open overlay and load content
   * @param {string} url - URL to load
   * @param {string} title - Category title
   */
  function openOverlay(url, title) {
    const overlay = document.querySelector(OVERLAY_CONFIG.selector);
    const overlayBody = document.querySelector(OVERLAY_CONFIG.bodySelector);
    
    if (!overlay || !overlayBody) return;

    // Show overlay with animation
    overlay.classList.remove('hidden');
    overlay.classList.add('overlay-opening');
    
    // Set ARIA attributes
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    trapFocus(overlay);

    // Check cache first
    if (OVERLAY_CONFIG.cacheEnabled && contentCache.has(url)) {
      overlayBody.innerHTML = contentCache.get(url);
      overlay.classList.remove('overlay-opening');
      
      // Trigger Salla components initialization
      initializeSallaComponents(overlayBody);
      
      console.log('Tholth: Loaded from cache - ' + url);
      return;
    }

    // Show loading state
    overlayBody.innerHTML = getLoadingHTML(title);
    overlay.classList.add(OVERLAY_CONFIG.loadingClass);

    // Fetch content via AJAX
    fetchCategoryContent(url)
      .then(function(html) {
        overlayBody.innerHTML = html;
        
        // Cache content
        if (OVERLAY_CONFIG.cacheEnabled) {
          cacheContent(url, html);
        }
        
        // Initialize Salla components in loaded content
        initializeSallaComponents(overlayBody);
        
        overlay.classList.remove(OVERLAY_CONFIG.loadingClass, 'overlay-opening');
        
        console.log('Tholth: Content loaded - ' + url);
      })
      .catch(function(error) {
        overlayBody.innerHTML = getErrorHTML(error.message);
        overlay.classList.remove(OVERLAY_CONFIG.loadingClass, 'overlay-opening');
        
        console.error('Tholth: Failed to load content - ' + error.message);
      });
  }

  /**
   * Fetch category content via AJAX
   * @param {string} url - URL to fetch
   * @returns {Promise<string>} HTML content
   */
  function fetchCategoryContent(url) {
    return new Promise(function(resolve, reject) {
      // Use Salla's fetch if available
      if (typeof Salla !== 'undefined' && Salla.api) {
        Salla.api.request(url, {
          method: 'GET',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        .then(function(response) {
          if (response.success) {
            resolve(response.data.html || extractMainContent(response.data));
          } else {
            reject(new Error(response.error?.message || 'Failed to fetch content'));
          }
        })
        .catch(reject);
      } else {
        // Fallback to native fetch
        fetch(url, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        .then(function(response) {
          if (!response.ok) {
            throw new Error('HTTP ' + response.status);
          }
          return response.text();
        })
        .then(function(html) {
          resolve(extractMainContent(html));
        })
        .catch(reject);
      }
    });
  }

  /**
   * Extract main content from full HTML page
   * @param {string} html - Full HTML
   * @returns {string} Extracted content
   */
  function extractMainContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Try to find main content container
    const mainContent = doc.querySelector('#main-content, .main-content, main, .container');
    
    if (mainContent) {
      return mainContent.innerHTML;
    }
    
    return html;
  }

  /**
   * Close overlay
   */
  function closeOverlay() {
    const overlay = document.querySelector(OVERLAY_CONFIG.selector);
    
    if (!overlay) return;

    overlay.classList.add('overlay-closing');
    
    setTimeout(function() {
      overlay.classList.add('hidden');
      overlay.classList.remove('overlay-closing');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      // Clear content after animation to prevent flickering
      setTimeout(function() {
        const overlayBody = document.querySelector(OVERLAY_CONFIG.bodySelector);
        if (overlayBody) {
          overlayBody.innerHTML = '';
        }
      }, 100);
    }, OVERLAY_CONFIG.animationSpeed);
  }

  /**
   * Attach close button handlers
   * @param {HTMLElement} overlay - Overlay element
   */
  function attachCloseHandlers(overlay) {
    overlay.addEventListener('click', function(e) {
      const closeButton = e.target.closest(OVERLAY_CONFIG.closeClass);
      
      if (closeButton || e.target === overlay.querySelector('.overlay-backdrop')) {
        closeOverlay();
      }
    });
  }

  /**
   * Attach keyboard handlers (ESC to close, focus trap)
   * @param {HTMLElement} overlay - Overlay element
   */
  function attachKeyboardHandlers(overlay) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        closeOverlay();
      }
    });
  }

  /**
   * Attach touch gesture handlers for mobile
   * @param {HTMLElement} overlay - Overlay element
   */
  function attachTouchHandlers(overlay) {
    let touchStartY = 0;
    let touchEndY = 0;
    
    const overlayContent = overlay.querySelector('.overlay-content');
    
    if (!overlayContent) return;

    overlayContent.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    overlayContent.addEventListener('touchend', function(e) {
      touchEndY = e.changedTouches[0].clientY;
      
      // Swipe down to close (threshold: 100px)
      if (touchEndY - touchStartY > 100 && overlayContent.scrollTop === 0) {
        closeOverlay();
      }
    }, { passive: true });
  }

  /**
   * Trap focus within overlay for accessibility
   * @param {HTMLElement} overlay - Overlay element
   */
  function trapFocus(overlay) {
    const focusableElements = overlay.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    overlay.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  /**
   * Initialize Salla components in dynamically loaded content
   * @param {HTMLElement} container - Container with Salla components
   */
  function initializeSallaComponents(container) {
    if (typeof Salla === 'undefined') return;

    // Find and initialize Salla web components
    const sallaComponents = container.querySelectorAll('[salla-component], salla-button, salla-add-product-button, salla-quantity-input');
    
    sallaComponents.forEach(function(component) {
      if (typeof component.initialize === 'function') {
        component.initialize();
      }
    });

    // Trigger Salla event for component initialization
    if (Salla.event) {
      Salla.event.emit('overlay.content.loaded', { container: container });
    }
  }

  /**
   * Cache content with size limit
   * @param {string} url - URL key
   * @param {string} content - HTML content
   */
  function cacheContent(url, content) {
    if (contentCache.size >= OVERLAY_CONFIG.maxCacheSize) {
      // Remove oldest entry
      const firstKey = contentCache.keys().next().value;
      contentCache.delete(firstKey);
    }
    
    contentCache.set(url, content);
  }

  /**
   * Get loading HTML
   * @param {string} title - Category title
   * @returns {string} Loading HTML
   */
  function getLoadingHTML(title) {
    const rtl = window.tholthSettings?.direction === 'rtl';
    const loadingText = rtl ? 'جاري التحميل...' : 'Loading...';
    
    return '<div class="overlay-loading-state text-center py-20">' +
           '  <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>' +
           '  <h3 class="mt-4 text-xl font-semibold">' + (title || '') + '</h3>' +
           '  <p class="mt-2 text-gray-600 dark:text-gray-400">' + loadingText + '</p>' +
           '</div>';
  }

  /**
   * Get error HTML
   * @param {string} message - Error message
   * @returns {string} Error HTML
   */
  function getErrorHTML(message) {
    const rtl = window.tholthSettings?.direction === 'rtl';
    const errorTitle = rtl ? 'خطأ في التحميل' : 'Loading Error';
    const tryAgain = rtl ? 'حاول مرة أخرى' : 'Try Again';
    
    return '<div class="overlay-error-state text-center py-20">' +
           '  <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
           '    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>' +
           '  </svg>' +
           '  <h3 class="mt-4 text-xl font-semibold text-red-600">' + errorTitle + '</h3>' +
           '  <p class="mt-2 text-gray-600 dark:text-gray-400">' + message + '</p>' +
           '  <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">' +
           '    ' + tryAgain +
           '  </button>' +
           '</div>';
  }

  // Expose API for external use
  window.TholthOverlay = {
    open: openOverlay,
    close: closeOverlay,
    clearCache: function() {
      contentCache.clear();
      console.log('Tholth: Cache cleared');
    }
  };

})();
