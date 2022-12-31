const path = require('path');
const webpack = require("webpack");
const json5 = require('json5');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const ModuleReplacement = require('./webpack.module-replacement.config');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [

  ],


  entry: './src/ts/main.ts',
  mode: 'production',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [

      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          //"style-loader",
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
        ],
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          //"style-loader",
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",

          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              //sourceMap: true,
              sassOptions: {
                outputStyle: "expanded", // ensures output CSS is readable for the user!
              },
            },
          },

        ],
      },


      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },


      {
        test: /\.json5$/i,
        type: 'json',
        parser: {
          parse: json5.parse,
        },
      },


    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};

