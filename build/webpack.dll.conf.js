const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    flowchart: ['./static/js/flowchart.js', './src/utils/cache.js']
  },
  output: {
    path: config.dll.assetsRoot,
    filename: 'js/[name].js'
    // library: utils.assetsPath(('js/[name]_library')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'static': resolve('static')
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('static'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('static'), resolve('test')]
      },
      {
        test: require.resolve('jsPlumb'),
        loaders: [
          'imports?this=>window',
          'script'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path: resolve('[name]-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // copy static css to lib css
    new CopyWebpackPlugin([
      {
        from: resolve('static/css'),
        to: 'css',
        ignore: ['index.*']
      }
    ])
  ]
};
