import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import baseConfig from './webpack.config.base'
import CheckNodeEnv from '../scripts/CheckNodeEnv'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import glob from 'glob'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

CheckNodeEnv('production')

// Compute entrypoints for Sia-UI
const entrypoints = {}
const plugins = glob.sync('./plugins/*/js/index.js')
plugins.forEach(plugin => {
  entrypoints[path.dirname(path.dirname(plugin))] = [
    'babel-polyfill',
    path.resolve('./js/rendererjs/pluginapi.js'),
    plugin
  ]
})

entrypoints['renderer'] = [path.resolve('./js/rendererjs/index.js')]

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-renderer',

  entry: entrypoints,

  output: {
    path: path.resolve('./dist'),
    publicPath: './dist/',
    filename: '[name].prod.js'
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },

  node: {
    global: true,
    __dirname: false,
    __filename: false
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new UglifyJsPlugin({
      parallel: true,
      sourceMap: true
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true'
        ? 'server'
        : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    })
  ]
})
