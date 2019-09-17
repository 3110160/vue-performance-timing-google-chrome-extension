const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        'popup': './src/popup/main.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '../',
        filename: '[name].js'
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'popup/index.html',
            template: './index.html',
            inject: 'body',
            minify: { //压缩
                removeComments: true,
                collapseWhitespace: true,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
                from: path.resolve(__dirname, 'src/manifest.json'),
                to: ''
            },
            {
                from: path.resolve(__dirname, 'assets/'),
                to: 'assets/'
            }
        ]),
    ],
    devtool: 'source-map',
    module: {
        rules: [{
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                }]
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            },

        ]
    },
    resolve: {
        alias: {
            'src': path.resolve(__dirname, 'src'),
        }
    },
    watch: true,
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 600,
        ignored: ['node_modules']
    }
}