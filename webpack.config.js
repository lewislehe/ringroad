const { resolve } = require("path");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: resolve(__dirname),
  entry: {
    main: "./src/main.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
  output: {
    path: resolve(__dirname, "./public"),
    publicPath: "/",
    filename: "[name].js",
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src", "index.html"),
      filename: resolve(__dirname, "public", "index.html"),
    }),
  ],
  devtool: "cheap-module-source-map",
  module: {
    rules: [
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
    ],
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
    extensions: [".js", ".css", ".jpeg", ".png", ".jpg", ".scss"],
  },
};
