const path = require('path');
const nodeExternals = require('webpack-node-externals');


const webpack = require("webpack");
const srcMapPlugin = new webpack.SourceMapDevToolPlugin({
  filename: '[file].map',
  // absolute path so Anki can find the map file
  append: `\n//# sourceMappingURL=/_[url]\n//# sourceURL=_[file]`
})

//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const ModuleReplacement = require('./webpack.module-replacement.config');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

cacheConfig = {
  target: "node",
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

  plugins: [
    srcMapPlugin
  ],

  entry: {
    jpmn_card_cache:  './src/ts/jp-mining-note/cache.ts',
  },
  mode: 'production',
  devtool: 'source-map',

  output: {
    filename: '[name].js',
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


exportConfig = {

  plugins: [
    srcMapPlugin
  ],

  entry: {
    jpmn_main_front:           './src/ts/jp-mining-note/main/front.ts',
    jpmn_main_back:            './src/ts/jp-mining-note/main/back.ts',
    jpmn_pa_sent_front:        './src/ts/jp-mining-note/pa_sent/front.ts',
    jpmn_pa_sent_back:         './src/ts/jp-mining-note/pa_sent/back.ts',
    jpmn_pa_word_front:        './src/ts/jp-mining-note/pa_word/front.ts',
    jpmn_pa_word_back:         './src/ts/jp-mining-note/pa_word/back.ts',
    jpmn_cloze_deletion_front: './src/ts/jp-mining-note/cloze_deletion/front.ts',
    jpmn_cloze_deletion_back:  './src/ts/jp-mining-note/cloze_deletion/back.ts',
  },
  mode: 'production',

  output: {
    filename: '[name].js',
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

module.exports = [exportConfig, cacheConfig]
