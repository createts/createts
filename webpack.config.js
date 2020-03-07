const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const env = process.env.NODE_ENV;

const config = {
  entry: './src/index.ts',

  output: {
    path: path.resolve(__dirname, 'dist/umd'),
    library: 'createts',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },

  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts']
  },

  externals: {},

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};

if (env === 'analyse') {
  config.plugins.push(new BundleAnalyzerPlugin());
}

if (env === 'development') {
  config.mode = 'development';
  config.devtool = 'source-map';
}

if (env === 'production') {
  config.mode = 'production';
  config.devtool = 'none';
}

module.exports = config;
