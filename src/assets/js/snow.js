/**
 * Tholth Winter Theme - Snow Effect
 * Canvas-based snowfall animation with configurable intensity
 * Supports RTL, mobile optimization, and accessibility
 * 
 * @author Mohammed Al-Sugari
 * @version 1.0.0
 */

(function() {
  'use strict';

  // Ensure code runs only after DOM and Salla are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnowEffect);
  } else {
    initSnowEffect();
  }

  function initSnowEffect() {
    // Wait for Salla SDK to be ready
    if (typeof Salla !== 'undefined' && Salla.ready) {
      Salla.ready(function() {
        startSnow();
      });
    } else {
      // Fallback if Salla is not available
      startSnow();
    }
  }

  function startSnow() {
    const canvas = document.getElementById('snow-canvas');
    
    // Exit early if canvas doesn't exist or winter mode is disabled
    if (!canvas || !window.tholthSettings?.winterMode) {
      return;
    }

    // Check mobile setting
    const isMobile = window.innerWidth <= 768;
    const enableSnowMobile = window.tholthSettings?.enableSnowMobile || false;
    
    if (isMobile && !enableSnowMobile) {
      console.log('Tholth: Snow effect disabled on mobile');
      return;
    }

    // Get settings from data attributes or global config
    const intensity = parseInt(canvas.dataset.intensity || window.tholthSettings?.snowIntensity || 50);
    const snowColor = canvas.dataset.color || window.tholthSettings?.snowColor || '#FFFFFF';
    const mobileFactor = canvas.dataset.mobile === 'true' ? 1 : (isMobile ? 0 : 1);
    
    // Exit if intensity is 0
    if (intensity === 0 || mobileFactor === 0) {
      return;
    }

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to window size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    // Handle window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        resizeCanvas();
        // Recreate snowflakes on resize
        snowflakes = createSnowflakes();
      }, 250);
    });

    // Snowflake class
    class Snowflake {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.4;
      }

      update() {
        this.y += this.speed;
        this.x += this.wind;

        // Reset snowflake when it goes off screen
        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }

        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = hexToRGBA(snowColor, this.opacity);
        ctx.fill();
        ctx.closePath();
      }
    }

    // Create snowflakes array based on intensity
    function createSnowflakes() {
      const count = Math.floor((intensity / 100) * 150) * mobileFactor;
      const flakes = [];
      for (let i = 0; i < count; i++) {
        flakes.push(new Snowflake());
      }
      return flakes;
    }

    let snowflakes = createSnowflakes();

    // Animation loop
    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach(function(snowflake) {
        snowflake.update();
        snowflake.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Pause animation when page is hidden (performance optimization)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      } else {
        animate();
      }
    });

    // Stop animation on certain Salla events to preserve performance
    if (typeof Salla !== 'undefined' && Salla.event) {
      Salla.event.on('cart.updated', function() {
        // Temporarily reduce snow intensity during cart operations
        const currentIntensity = snowflakes.length;
        snowflakes = snowflakes.slice(0, Math.floor(currentIntensity / 2));
        
        setTimeout(function() {
          snowflakes = createSnowflakes();
        }, 2000);
      });
    }

    console.log('Tholth: Snow effect initialized with intensity ' + intensity);
  }

  /**
   * Convert hex color to RGBA
   * @param {string} hex - Hex color code
   * @param {number} alpha - Alpha value (0-1)
   * @returns {string} RGBA color string
   */
  function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  /**
   * Accessibility: Respect user's motion preferences
   */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Tholth: Snow effect disabled due to user motion preferences');
    const canvas = document.getElementById('snow-canvas');
    if (canvas) {
      canvas.style.display = 'none';
    }
  }

})();
