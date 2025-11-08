// Snow implementation
(function() {
  'use strict';
  const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile || window.innerWidth < 768) return;
  
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;opacity:0.92';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const flakes = [];
  const flakeCount = window.SNOW_INTENSITY || 120;
  
  class Snowflake {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 3 + 2;
      this.speed = Math.random() * 1.5 + 0.5;
      this.wind = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.4;
    }
    
    update() {
      this.y += this.speed;
      this.x += this.wind;
      if (this.y > canvas.height) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  for (let i = 0; i < flakeCount; i++) {
    flakes.push(new Snowflake());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.forEach(f => { f.update(); f.draw(); });
    requestAnimationFrame(animate);
  }
  
  animate();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
})();
