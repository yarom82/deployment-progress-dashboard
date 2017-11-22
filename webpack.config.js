const { resolve } = require('path')

const publicPath = resolve(__dirname, 'public')

module.exports = {
  context: __dirname,
  entry: resolve(__dirname, 'src', 'index.ts'),
  output: {
    filename: 'bundle.js',
    path: publicPath
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    historyApiFallback: {
      index: '200.html'
    },
    contentBase: publicPath
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader'
      },
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}
