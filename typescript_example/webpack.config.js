const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
  entry: ['@babel/polyfill', './src/index.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget : 'umd',
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'awesome-typescript-loader' },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { enforce: 'pre', test: /\.ts$/, loader: 'tslint-loader' },
      
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template : './index.html',
  }),
  ],
  devtool: 'source-map',
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development',
  devServer : {
    contentBase : './dist',
    port: 9003
},
};

module.exports = config;