const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');



let config = {
    entry: {
        app: ['./src/css/app.scss', './src/server/server.js']
    },
    watch: true,
    output: {
        path: path.resolve('./dist'),
        filename: '[name].[hash:8].js',
        publicPath: ""
    },
    resolve: {
        alias: {
            '@css': path.resolve(__dirname, './src/css/'),
            '@': path.resolve(__dirname, './src/server/'),
        }
    },
    devtool: "source-map",
    devServer: {
        overlay: true,
        contentBase: path.resolve('./dist')
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[chunkhash:8].css',
            chunkFilename: '[id].css',
        }), new CleanWebpackPlugin(),
    ],
    module: {
        rules: [{
                enforce: 'pre',
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'eslint-loader'
                }]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            /*
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },*/
                            reloadAll: true,
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
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
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'file-loader'
                }]
            },

            {
                //test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|wav)(\?.*)?$/,
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash:7].[ext]',
                    }
                }, {
                    loader: 'img-loader',
                    options: {
                        enable: false,
                        plugins: []
                    }
                }]
            },
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
    },

}


//module.exports = config


module.exports = (env, argv) => {

    console.log(argv.mode)

    if (argv.mode === 'development') {
        config.plugins.push(
            new HtmlWebpackPlugin({
                title: 'My App',
                filename: 'index.html',
                meta: {
                    "viewport": 'width=device-width, initial-scale=1.0'
                },
                meta: {
                    "http-equiv": "X-UA-Compatible",
                    "content": "ie=edge"
                }
            })
        )
    }

    if (argv.mode === 'production') {
        config.plugins.push(
            new HtmlWebpackPlugin({
                title: 'My App',
                filename: 'index.html',
                meta: {
                    "viewport": 'width=device-width, initial-scale=1.0'
                },
                meta: {
                    "http-equiv": "X-UA-Compatible",
                    "content": "ie=edge"
                },
                minify: {
                    minify: false,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                },
            })
        )
    }


    return config;
};