const path = require( 'path' );
const webpack = require( 'webpack' );

const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')

const ROOT_DIR = path.resolve( __dirname, ".." );
const DEV_MODE = process.env.NODE_ENV !== "production";
const BUILD_DIR = path.resolve( ROOT_DIR, "dist" )

module.exports =  {
    name: 'client',
    target: 'web',
    entry: [
        'react-hot-loader/patch',
        path.resolve( ROOT_DIR, 'src/polyfill.js' ),
        ...(DEV_MODE && ['webpack-hot-middleware/client?name=client&reload=true&path=/__webpack_hmr'] || []),
        path.resolve( ROOT_DIR, 'client.js' )
    ],
    mode: DEV_MODE ? "development" : "production",
    plugins: [
        new webpack.DefinePlugin({
    		DEV_MODE: DEV_MODE,
    		'process.env.BROWSER': true,
    		'process.env.NODE_ENV': DEV_MODE ? '"development"' : '"production"'
    	}),
        new HtmlWebpackPlugin({
            // template: path.resolve(ROOT_DIR, 'src/index.html')
        }),
        ...(DEV_MODE && [
            new webpack.HotModuleReplacementPlugin()
        ] || [
            new CleanWebpackPlugin(),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false
            })
        ]),
        new LoadablePlugin(),
    ],
    module: {
        rules: [ {
            test: /\.s?css$/,
            use: [ 'style-loader', 'css-loader' ]
        }, {
            test: /\.(mjs|jsx?)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                }
            }
        }, {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets'
                }
            }
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets'
                }
            }
        }, {
            test: /\.mdx?$/,
            use: [ 'babel-loader', '@mdx-js/loader' ]
        } ]
    },
    optimization: {
        sideEffects: true,
        usedExports: true,
        minimize: true,
        minimizer: [
            new TerserPlugin()
        ]
    },
    output: {
        path: BUILD_DIR,
        filename: DEV_MODE ? 'assets/[hash].js' : 'assets/[contenthash].js',
        publicPath: "/"
    },
    resolve: {
        modules: [
            path.resolve( ROOT_DIR, "src" ),
            path.resolve( ROOT_DIR, "node_modules" )
        ],
        alias: {
            ...(DEV_MODE && {
                'react-dom': '@hot-loader/react-dom'
            })
        }
    },
    devServer: {
        historyApiFallback: true,
        disableHostCheck: true,
        hot: true,
        watchOptions: {
            aggregateTimeout: 1000,
            poll: 350,
            ignored: /node_modules/,
        }
    },
}
