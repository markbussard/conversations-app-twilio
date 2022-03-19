const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const paths = require('./config/paths');
const getClientEnvironment = require('./config/env');

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const env = getClientEnvironment();
  const mode = isProduction ? 'production' : 'development';

  const plugins = [new CleanWebpackPlugin()];
  let optimization = {};
  let performance = {};

  let stats = {
    colors: true,
    children: true,
    assets: false,
    warnings: false,
    modules: false,
    entrypoints: false
  };

  if (process.env.SERVE) {
    plugins.push(new ReactRefreshWebpackPlugin());
  }

  if (isProduction) {
    optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin()
      ],
      splitChunks: { chunks: 'all' }
    };
  } else {
    performance = {
      hints: false,
      maxEntrypointSize: 10000000,
      maxAssetSize: 10000000
    };
    stats = {
      ...stats,
      assets: false,
      builtAt: false
    };
  }

  return {
    mode,
    entry: paths.appIndex,
    output: {
      path: paths.appBuild,
      publicPath: '/',
      filename: 'bundle.js'
    },
    resolve: {
      alias: {
        components: paths.components,
        config: paths.config,
        constants: paths.constants,
        features: paths.features,
        store: paths.store,
        utils: paths.utils
      },
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    plugins: [
      ...plugins,
      new HtmlWebpackPlugin({
        template: paths.appHTML,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyURLs: true,
          minifyJS: true,
          minifyCSS: true
        }
      }),
      // Generates all the process.env variables
      // that are prefixed with REACT_APP_
      new webpack.DefinePlugin(env.stringified)
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      port: 8080,
      hot: true
    },
    optimization,
    performance,
    stats
  };
};
