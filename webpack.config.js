const path = require('path');

//const webpack = require("webpack");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const ModuleReplacement = require('./webpack.module-replacement.config');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [

  ],


  entry: {
    jpmn_main_front:           './build/tmp/ts/jp-mining-note/main/front.ts',
    jpmn_main_back:            './build/tmp/ts/jp-mining-note/main/back.ts',
    jpmn_pa_sent_front:        './build/tmp/ts/jp-mining-note/pa_sent/front.ts',
    jpmn_pa_sent_back:         './build/tmp/ts/jp-mining-note/pa_sent/back.ts',
    jpmn_pa_word_front:        './build/tmp/ts/jp-mining-note/pa_word/front.ts',
    jpmn_pa_word_back:         './build/tmp/ts/jp-mining-note/pa_word/back.ts',
    jpmn_cloze_deletion_front: './build/tmp/ts/jp-mining-note/cloze_deletion/front.ts',
    jpmn_cloze_deletion_back:  './build/tmp/ts/jp-mining-note/cloze_deletion/back.ts',
  },
  mode: 'production',

  output: {
    filename: '[name].js',
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

