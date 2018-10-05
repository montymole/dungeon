const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const config = [{
  mode: 'development',
  entry: {
    client: "./src/app/client.tsx"
  },
  output: {
    path: path.resolve(__dirname, "dist/app"),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  externals: {
    React: 'React',
    ReactDOM: 'ReactDOM',
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
},
{
  mode: 'development',
  entry: {
    server: './src/server.ts'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },
  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  // Source maps support ('inline-source-map' also works)
  // devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  target: 'node',
  externals: [nodeExternals()],
}

]
module.exports = config;