/**
 * Tholth Winter Theme - Main Application
 * Entry point for all theme JavaScript
 * 
 * @author Mohammed Al-Sugari
 * @version 1.0.0
 */

'use strict';

/**
 * Main Theme Initialization
 * Runs after Salla SDK is ready
 */
(function () {
  // Wait for Salla SDK to be fully loaded
  if (typeof Salla !== 'undefined' && Salla.ready) {
    Salla.ready(function () {
      console.log('Tholth: Salla SDK initialized');
      initTheme();
    });
  } else {
    // Fallback for development without Salla
    document.addEventListener('DOMContentLoaded', function () {
      console.warn('Tholth: Salla SDK not found, running in fallback mode');
      initTheme();
    });
  }

  /**
   * Initialize theme components
   */
  function initTheme() {
    // Initialize cart functionality
    initCart();

    // Initialize product interactions
    initProducts();

    // Initialize wishlist
    initWishlist();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize lazy loading
    initLazyLoading();

    // Initialize notifications
    initNotifications();

    console.log('Tholth: Theme initialized successfully');
  }

  /**
   * Cart functionality
   */
  function initCart() {
    if (typeof Salla === 'undefined') return;

    // Listen for cart updates
    Salla.event.on('cart.updated', function (data) {
      console.log('Tholth: Cart updated', data);
      updateCartCount(data);
      showNotification('success', window.tholthSettings?.locale === 'ar' 
        ? 'تم تحديث السلة' 
        : 'Cart updated');
    });

    // Listen for item added to cart
    Salla.event.on('cart.item.added', function (data) {
      console.log('Tholth: Item added to cart', data);
      showNotification('success', window.tholthSettings?.locale === 'ar' 
        ? 'تمت الإضافة إلى السلة' 
        : 'Added to cart');
    });

    // Listen for item removed from cart
    Salla.event.on('cart.item.removed', function (data) {
      console.log('Tholth: Item removed from cart', data);
      showNotification('info', window.tholthSettings?.locale === 'ar' 
        ? 'تمت الإزالة من السلة' 
        : 'Removed from cart');
    });
  }

  /**
   * Update cart count in header
   * @param {Object} data - Cart data
   */
  function updateCartCount(data) {
    const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count]');
    const count = data.count || data.items_count || 0;

    cartCountElements.forEach(function (element) {
      element.textContent = count;
      element.classList.toggle('hidden', count === 0);
    });
  }

  /**
   * Product interactions
   */
  function initProducts() {
    if (typeof Salla === 'undefined') return;

    // Listen for product added event
    Salla.event.on('product.added', function (data) {
      console.log('Tholth: Product added', data);
    });

    // Listen for product options change
    Salla.event.on('product.options.changed', function (data) {
      console.log('Tholth: Product options changed', data);
    });

    // Quick view functionality
    document.addEventListener('click', function (e) {
      const quickViewBtn = e.target.closest('[data-quick-view]');
      if (quickViewBtn) {
        e.preventDefault();
        const productId = quickViewBtn.dataset.quickView;
        openQuickView(productId);
      }
    });
  }

  /**
   * Open product quick view
   * @param {string} productId - Product ID
   */
  function openQuickView(productId) {
    if (typeof Salla === 'undefined' || !Salla.api) {
      console.warn('Tholth: Quick view requires Salla API');
      return;
    }

    // This would integrate with Salla's modal system
    console.log('Tholth: Opening quick view for product', productId);
    // Implementation depends on Salla's specific API
  }

  /**
   * Wishlist functionality
   */
  function initWishlist() {
    if (typeof Salla === 'undefined') return;

    // Listen for wishlist updates
    Salla.event.on('wishlist.item.added', function (data) {
      console.log('Tholth: Item added to wishlist', data);
      showNotification('success', window.tholthSettings?.locale === 'ar' 
        ? 'تمت الإضافة إلى المفضلة' 
        : 'Added to wishlist');
    });

    Salla.event.on('wishlist.item.removed', function (data) {
      console.log('Tholth: Item removed from wishlist', data);
      showNotification('info', window.tholthSettings?.locale === 'ar' 
        ? 'تمت الإزالة من المفضلة' 
        : 'Removed from wishlist');
    });
  }

  /**
   * Mobile menu functionality
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuClose = document.querySelector('[data-mobile-menu-close]');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    if (menuClose) {
      menuClose.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close on backdrop click
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Lazy loading for images
   */
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');

      const imageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function (img) {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Show notification to user
   * @param {string} type - 'success', 'error', 'info', 'warning'
   * @param {string} message - Message to display
   */
  function showNotification(type, message) {
    // Check if Salla notification system exists
    if (typeof Salla !== 'undefined' && Salla.notify) {
      Salla.notify[type](message);
      return;
    }

    // Fallback notification system
    const notification = document.createElement('div');
    notification.className = 'tholth-notification tholth-notification-' + type;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    document.body.appendChild(notification);

    // Animate in
    setTimeout(function () {
      notification.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(function () {
      notification.classList.remove('show');
      setTimeout(function () {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Initialize notification styles if not present
   */
  function initNotifications() {
    // Check if styles already exist
    if (document.getElementById('tholth-notification-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'tholth-notification-styles';
    styles.textContent = `
      .tholth-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        max-width: 300px;
      }
      
      [dir="rtl"] .tholth-notification {
        right: auto;
        left: 20px;
      }
      
      .tholth-notification.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .tholth-notification-success {
        border-left: 4px solid #10b981;
      }
      
      .tholth-notification-error {
        border-left: 4px solid #ef4444;
      }
      
      .tholth-notification-info {
        border-left: 4px solid #3b82f6;
      }
      
      .tholth-notification-warning {
        border-left: 4px solid #f59e0b;
      }
      
      [dir="rtl"] .tholth-notification-success,
      [dir="rtl"] .tholth-notification-error,
      [dir="rtl"] .tholth-notification-info,
      [dir="rtl"] .tholth-notification-warning {
        border-left: none;
        border-right: 4px solid;
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Utility: Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Utility: Throttle function
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function () {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // Expose utilities globally for use in other scripts
  window.TholthUtils = {
    debounce: debounce,
    throttle: throttle,
    showNotification: showNotification
  };

})();

// Log theme information
console.log('%cTholth Winter Theme v1.0.0', 'font-size: 16px; font-weight: bold; color: #60A5FA;');
console.log('%c❄️ Premium Salla theme by Mohammed Al-Sugari', 'color: #94a3b8;');
