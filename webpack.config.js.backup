/**
 * Webpack Configuration for Tholth Winter Theme
 * Handles JS bundling, CSS processing, and asset optimization
 * 
 * @author Mohammed Al-Sugari
 * @version 1.0.0
 */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Entry points for JavaScript
    entry: {
      app: './src/assets/js/app.js',
      snow: './src/assets/js/snow.js',
      overlay: './src/assets/js/overlay.js'
    },

    // Output configuration
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '/dist/',
      clean: true // Clean dist folder before each build
    },

    // Development server (for local testing)
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 3000,
      hot: true
    },

    // Module rules for different file types
    module: {
      rules: [
        // JavaScript files
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['defaults', 'not IE 11']
                  }
                }]
              ]
            }
          }
        },

        // CSS/SCSS files
        {
          test: /\.(css|scss|sass)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'postcss-import',
                    'tailwindcss/nesting',
                    'tailwindcss',
                    'postcss-rtl', // RTL support
                    'autoprefixer'
                  ]
                },
                sourceMap: !isProduction
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction
              }
            }
          ]
        },

        // Images
        {
          test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]'
          }
        },

        // Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        }
      ]
    },

    // Plugins
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      })
    ],

    // Optimization
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      }
    },

    // Resolve
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@js': path.resolve(__dirname, 'src/assets/js'),
        '@css': path.resolve(__dirname, 'src/assets/styles'),
        '@images': path.resolve(__dirname, 'src/assets/images')
      }
    },

    // Source maps for debugging
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // Performance hints
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },

    // Stats output
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  };
};
