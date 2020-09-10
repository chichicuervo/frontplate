const path = require( 'path' );
const webpack = require( 'webpack' );
const nodeExternals = require( 'webpack-node-externals' );

const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const TerserPlugin = require('terser-webpack-plugin')

const { compact } = require( 'lodash' );

const ROOT_DIR = path.resolve( __dirname, ".." );
const DEV_MODE = process.env.NODE_ENV !== 'production';
const BUILD_DIR = path.resolve( ROOT_DIR, "src" )

// console.log(ROOT_DIR, BUILD_DIR)

// /*
const entryConfig = compact([
    path.resolve( ROOT_DIR, 'src/polyfill.js' ),
    DEV_MODE && 'webpack-hot-middleware/client?name=server&reload=true',
    path.resolve( ROOT_DIR, 'server.js' ),
]);

const moduleConfig = {
	rules: [ {
		test: /\.(mjs|jsx?)$/,
		exclude: /node_modules/,
		use: {
			loader: 'babel-loader',
			options: {
                cacheDirectory: true,
			}
		}
    }, {
        test: /\.mdx?$/,
        use: [ 'babel-loader', '@mdx-js/loader' ]
	} ]
};

const pluginsConfig = compact([
    new webpack.DefinePlugin( {
		DEV_MODE,
		'process.env.BROWSER': false,
		'process.env.NODE_ENV': DEV_MODE ? '"development"' : '"production"'
	} ),
    DEV_MODE && new webpack.HotModuleReplacementPlugin(),
    !DEV_MODE && new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['server.bundle.js']
    }),
])

const serverConfig = {
    name: 'server',
    target: 'node',
    mode: DEV_MODE ? "development" : "production",
    entry: entryConfig,
    module: moduleConfig,
    plugins: pluginsConfig,
    output: {
        path: BUILD_DIR,
        filename: 'server.bundle.js',
    },
    watch: DEV_MODE,
	resolve: {
		modules: [
            path.resolve( ROOT_DIR, "src" ),
            path.resolve( ROOT_DIR, "node_modules" )
        ]
	},
    externals: [ nodeExternals( { // i think we want to explictly exclude assets?
        allowlist: [] // i think we /want/ to include static files under node_modules?
    } ) ],
    optimization: {
        minimize: true,
        sideEffects: true,
        usedExports: true,
        minimizer: [
            new TerserPlugin()
        ]
    },
    performance: {
        // Turn off size warnings for entry points
        hints: false,
    },
    node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
	},
};
// */


module.exports = serverConfig;
