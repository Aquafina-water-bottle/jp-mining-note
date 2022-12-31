const path = require('path');

//const webpack = require("webpack");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const ModuleReplacement = require('./webpack.module-replacement.config');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [

  ],


  entry: './build/tmp/ts/main.ts',
  mode: 'production',

  output: {
    filename: 'bundle.js',
    //path: path.resolve(__dirname, 'dist'),
    path: path.resolve(__dirname, 'src/_js'),
  },
  module: {
    rules: [

      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};

