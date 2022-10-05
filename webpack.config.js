const webpack = require("webpack");

const production = process.env.NODE_ENV === "production";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  mode: production ? "production" : "development",
  entry: {
    main: [__dirname + "/calculator/js/main.js"],
    light: [__dirname + "/calculator/scss/light.scss"],
    dark: [__dirname + "/calculator/scss/dark.scss"],
  },
  output: {
    path: __dirname + "/dist/",
    filename: "[name]-[fullhash].js",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: { exposes: ["$", "jQuery"] },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "calculator/html/index.html",
      excludeChunks: ["light", "dark"],
      minify: production
        ? {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            html5: true,
            minifyCSS: true,
            removeComments: false,
            removeEmptyAttributes: true,
          }
        : false,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new FaviconsWebpackPlugin("./calculator/images/borb.png"),
  ],
};
