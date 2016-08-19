var path = require('path');
var webpack = require('webpack');
var packageData = require('./package.json');
var minify = process.argv.indexOf('--minify') !== -1;
var filename = [packageData.name, packageData.version, 'js'];
var plugins = [];
if (minify) {
    filename.splice(filename.length - 1, 0, 'min');
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}
module.exports = [
  {
    entry: {
      app: packageData.main,
      vendor: ['angular']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: filename.join('.')
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
    plugins: [
      new webpack.optimize.CommonsChunkPlugin(
        'vendor', 'bundle.js')
    ]
  }
];
