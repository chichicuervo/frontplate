const fs = require('fs')
const path = require( 'path' );
const webpack = require( 'webpack' );
const nodeExternals = require( 'webpack-node-externals' );

const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const TerserPlugin = require('terser-webpack-plugin')

const ROOT_DIR = path.resolve( __dirname, ".." );
const DEV_MODE = process.env.NODE_ENV !== 'production';
const BUILD_DIR = path.resolve( ROOT_DIR, "dist" )

const server_params = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dev.config.json')) || '')

module.exports = {
    name: 'server',
	target: 'node',
	entry: [
        path.resolve( ROOT_DIR, 'src/polyfill.js' ),
        ...(DEV_MODE && ['webpack-hot-middleware/client?name=server&reload=true'] || []),
        path.resolve( ROOT_DIR, 'server.js' ),
    ],
	mode: DEV_MODE ? "development" : "production",
    plugins: [
        new webpack.DefinePlugin({
    		DEV_MODE,
    		'process.env.BROWSER': false,
    		'process.env.NODE_ENV': DEV_MODE ? '"development"' : '"production"'
    	}),
        ...(DEV_MODE && [
            new webpack.HotModuleReplacementPlugin()
        ] || [
            new CleanWebpackPlugin({
                verbose: true,
                cleanOnceBeforeBuildPatterns: ['server.bundle.js']
            })
        ])
    ],
    module: {
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
        filename: 'server.bundle.js',
    },
    resolve: {
        modules: [
            path.resolve( ROOT_DIR, "src" ),
            path.resolve( ROOT_DIR, "node_modules" )
        ]
    },
    watch: DEV_MODE,
    externals: [ nodeExternals( { // i think we want to explictly exclude assets?
        allowlist: [] // i think we /want/ to include static files under node_modules?
    } ) ],
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
    devServer: {
        host: server_params.dev_host || '0.0.0.0',
        port: server_params.dev_port || 4000,
    }
}
