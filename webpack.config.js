var webpack = require('webpack');

var production = (process.env.NODE_ENV === 'production');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlMinifier = require('html-minifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: production ? 'production' : 'development',
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
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "postcss-loader",
                "sass-loader",
            ]
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
        new HtmlWebpackPlugin({
            'template': 'calculator/html/index.html',
            'excludeChunks': ['light', 'dark'],
            'minify': production ? {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                removeComments: false,
                removeEmptyAttributes: true,
            } : false
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ].concat(production ? [
        new FaviconsWebpackPlugin('./calculator/images/borb.png'),
        new CopyWebpackPlugin([
            { 
                from: __dirname + '/calculator/extra/.htaccess' 
            },
        ])
    ] : [])
}
