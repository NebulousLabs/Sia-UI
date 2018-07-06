import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { spawn, execSync } from 'child_process'
import baseConfig from './webpack.config.base'
import CheckNodeEnv from '../scripts/CheckNodeEnv'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import glob from 'glob'

CheckNodeEnv('development')

const port = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`

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

entrypoints['renderer'] = [
  'babel-polyfill',
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://localhost:${port}/`,
  'webpack/hot/only-dev-server',
  path.resolve('./js/rendererjs/index.js')
]

export default merge.smart(baseConfig, {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-renderer',

  entry: entrypoints,

  output: {
    publicPath,
    filename: '[name].dev.js'
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: [
              // Here, we include babel plugins that are only required for the
              // renderer process. The 'transform-*' plugins must be included
              // before react-hot-loader/babel
              'transform-class-properties',
              'transform-es2015-classes',
              'react-hot-loader/babel'
            ]
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

  node: {
    global: true,
    __dirname: false,
    __filename: false
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),

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
      NODE_ENV: 'development'
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false
    },
    before () {
      if (process.env.START_HOT) {
        console.log('Starting Main Process...')
        spawn('npm', ['run', 'start-main-dev'], {
          shell: true,
          env: process.env,
          stdio: 'inherit'
        })
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError))
      }
    }
  }
})
