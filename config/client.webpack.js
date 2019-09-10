const path = require( 'path' );
const webpack = require( 'webpack' );

const {CleanWebpackPlugin} = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

const { compact } = require( 'lodash' );

const DEV_MODE = process.env.NODE_ENV !== 'production';

const ROOT_DIR = path.resolve( __dirname, ".." );
const BUILD_DIR = path.resolve( ROOT_DIR, "dist" )

// console.log(ROOT_DIR, BUILD_DIR)


const entryConfig = compact([
    '@babel/polyfill',
    DEV_MODE && 'webpack-hot-middleware/client?name=client&reload=true&path=/__webpack_hmr',
    path.resolve( ROOT_DIR, 'client.js' ),
]);

const moduleConfig = {
	rules: [ {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
            }
        }
    }, {
        test: /\.mdx?$/,
        use: [ 'babel-loader', '@mdx-js/loader' ]
	} ]
};

const pluginsConfig = compact([
    new webpack.DefinePlugin( {
		__DEV__: DEV_MODE,
		'process.env.BROWSER': true,
		'process.env.NODE_ENV': DEV_MODE ? '"development"' : '"production"'
	} ),
    new HtmlWebpackPlugin( {
        // put plugin params here
    } ),
    DEV_MODE && new webpack.HotModuleReplacementPlugin(),
    !DEV_MODE && new CleanWebpackPlugin(),
    !DEV_MODE && new BundleAnalyzerPlugin( {
        analyzerMode: 'static',
        openAnalyzer: false
    } ),
]);

const clientConfig = {
    name: 'client',
    target: 'web',
    mode: DEV_MODE ? "development" : "production",
    entry: entryConfig,
    module: moduleConfig,
    plugins: pluginsConfig,
    output: {
        path: BUILD_DIR,
        filename: 'client.bundle.js',
        publicPath: "/"
    },
	resolve: {
		modules: [
            path.resolve( ROOT_DIR, "src" ),
            path.resolve( ROOT_DIR, "node_modules" )
        ]
	},
};

module.exports = clientConfig;
