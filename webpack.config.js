var path = require('path');
var webpack = require('webpack');
var packageData = require('./package.json');
var CopyWebpackPlugin = require('copy-webpack-plugin');
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
        },
      ]
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.CommonsChunkPlugin(
        'vendor', 'bundle.js')
    ]
  },
  {
    entry: {
      app: packageData.html
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: filename.join('.')
    },
    module: {
      loaders: [
        {
          test: /\.(html)$/,
          loader: 'file-loader?name=[name].[ext]!extract-loader!html-loader'
        },
        {
          test: /\.(png|jpg)$/,
          loader: 'file-loader?name=[name].[ext]'
        }
      ]
    },
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(packageData.version)
      }),
      new CopyWebpackPlugin([
        {
          from: packageData.ico, to: './'
        }
      ])
    ]
  }
]
