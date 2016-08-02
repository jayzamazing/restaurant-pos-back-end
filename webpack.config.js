var path = require('path');
var webpack = require('webpack');
var packageData = require('./package.json');
var minify = process.argv.indexOf('--minify') != -1;
var filename = [packageData.name, packageData.version, 'js'];
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
var plugins = [];
if (minify) {
    filename.splice(filename.length - 1, 0, 'min');
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}
module.exports = [
  {
    entry: packageData.main,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: filename.join('.'),
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel'
        }
      ]
    },
    devtool: 'source-map',
    externals: nodeModules,
    plugins: plugins
  },
  {
    entry: ['babel-polyfill', packageData.server],
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server-' + filename.join('.'),
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel'
        }
      ]
    },
    devtool: 'source-map',
    externals: nodeModules,
    plugins: plugins
  },
  {
    entry:  ['babel-polyfill'].concat(packageData.tests),
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'test-' + filename.join('.'),
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel'
        }
      ]
    },
    devtool: 'source-map',
    externals: nodeModules,
    plugins: plugins
  }
];
