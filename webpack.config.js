const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "eval-source-map",
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    static: "./dist",
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "NFT Public Sale",
      template: "index.html",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    clean: true,
  },
};
