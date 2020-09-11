module.exports = function (api) {

    const presets = [
		['minify', {
			keepFnName: true,
			keepClassName: true,
		}],
		["@babel/preset-react", {
			useBuiltIns: true,
			// useSpread: true,
			// development: process.env.BABEL_ENV === "development"
		}],
		["@babel/preset-env", {
            targets: {
                esmodules: true,
                node: true,
            },
			useBuiltIns: "usage",
            corejs: {
				version: 3,
				proposals: true
			},
            modules: 'auto',
            shippedProposals: true,
            loose: true,
            bugfixes: true,
		}],
	]

    const plugins = [
        'react-hot-loader/babel',
        ["@babel/plugin-proposal-decorators", {
            legacy: true,
        }],
        ['@babel/plugin-proposal-class-properties', {
            loose: true
        }],
        ["@babel/plugin-proposal-private-methods", {
            loose: true
        }],
        '@loadable/babel-plugin'
    ]

    api.cache(false);

    return {
        presets,
        plugins
    };
}
