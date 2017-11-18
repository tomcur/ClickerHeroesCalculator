var webpack = require('webpack');

var production = (process.env.NODE_ENV === 'production');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const extractSass = new ExtractTextPlugin({ filename: '[name].css' });
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {  
    entry: {
        main: [
            __dirname + '/calculator/js/main.js'
        ],
        light: [
            __dirname + '/calculator/scss/light.scss'
        ],
        dark: [
            __dirname + '/calculator/scss/dark.scss'
        ]
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist/',
        filename: '[name]-[hash].js'
    },
  
    module: {
        rules: [{
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader", options: {
                        sourceMap: true,
                        minimize: production
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            })
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url-loader?name=./files/[hash].[ext]&limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url-loader?name=./files/[hash].[ext]&limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url-loader?name=./files/[hash].[ext]&limit=10000&mimetype=application/octet-stream"
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: "file-loader?name=./files/[hash].[ext]"
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url-loader?name=./files/[hash].[ext]&limit=10000&mimetype=image/svg+xml"
        }, {
            test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?name=./files/[hash].[ext]&limit=100000&mimetype=image/png'
        }, {
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: '$'
            }, {
                loader: 'expose-loader',
                options: 'jQuery'
            }]
        }]
    },

    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            'template': 'calculator/html/index.html',
            'excludeChunks': ['light', 'dark']
        })
    ].concat(production ? [
        new FaviconsWebpackPlugin('./calculator/images/borb.png'),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ] : [])
}
