const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')


module.exports = {
    entry: path.resolve(__dirname, 'src/js/app.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/app.js'
    },
    devtool: 'eval',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        open: true,
        port: 7777
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.pug/,
                loader: 'pug-loader',
                options: {
                    pretty: false
                }
            },
            {
                test: /\.(s*)css/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/fonts',
                  }
                }]
            },
            {
                test: /.(jpg|png|svg)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/img'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/views/index.pug'
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/assets'),
                to: path.resolve(__dirname, 'dist/assets'),
                ignore: ['.*']
            }
        ]),
        // new ExtractTextPlugin('style/style.css')
    ]
}