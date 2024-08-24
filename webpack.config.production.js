const { resolve } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    main: "./src/main.js"
  },
  output: {
    path: resolve(__dirname, "public"),
    publicPath: "/",
    filename: "[name].js"
  },
  mode: "production",
  // optimization: {
  //   splitChunks: {
  //     chunks: "all"
  //   },
  //   runtimeChunk: true
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src", "index.html"),
      filename: resolve(__dirname, "public", "index.html")
    }),
    new webpack.DefinePlugin({
      __NODE_ENV__: JSON.stringify("production")
    })
  ],
  module: {
    rules: 
    [
      {
        test: /\.js$/,
        include: resolve(__dirname, "src"),
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { sourceMap: true } },
        ],
      }
    ]
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src")
    },
    extensions: [".js", ".css", ".jpeg", ".png", ".jpg", ".scss"],
  }
};