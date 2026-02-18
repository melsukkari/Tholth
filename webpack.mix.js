// webpack.mix.js - Laravel Mix config for Tholth Winter Theme
// Compatible with Salla Theme Raed structure

const mix = require('laravel-mix');
const path = require('path');

mix
  // ===== JavaScript Entry Points =====
  .js('src/assets/js/app.js', 'public/js')
  .js('src/assets/js/snow.js', 'public/js')
  .js('src/assets/js/overlay.js', 'public/js')
  
  // ===== CSS Processing (Tailwind + PostCSS + RTL) =====
  .postCss('src/assets/styles/app.css', 'public/css', [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-rtl'),   // Critical for Arabic RTL support
    require('autoprefixer'),
  ])
  
  // ===== Copy Static Assets =====
  .copyDirectory('src/assets/images', 'public/images')
  .copyDirectory('src/assets/fonts', 'public/fonts')
  
  // ===== Set Public Path (Salla expects files in /public) =====
  .setPublicPath('public');

// Enable versioning (cache busting) only in production
if (mix.inProduction()) {
  mix.version();
}
