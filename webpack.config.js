const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


let config = {
    entry: { app: './src/server/server.js' },
    watch: true,
    output: {
        path: path.resolve('./dist'),
        filename: '[name].[chunkhash:8].js',
        publicPath: ""
    },
    devtool: "source-map",
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[chunkhash:8].css',
            chunkFilename: '[id].css',
        }), new HtmlWebpackPlugin({
            title: 'My App',
            filename: 'index.html',
            meta: { "viewport": 'width=device-width, initial-scale=1.0' },
            meta: { "http-equiv": "X-UA-Compatible", "content": "ie=edge" },
            /*
            minify: {
                minify: false,
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
            */
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }, {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                            reloadAll: true,
                        }
                    },
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')({
                                    browsers: ['last 3 version', 'ie > 8']
                                })
                            ]
                        }
                    },
                    'sass-loader',
                ]
            },
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({ sourceMap: true }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },

}


module.exports = config