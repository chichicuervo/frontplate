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
			useBuiltIns: "usage",
            corejs: {
				version: 3,
				proposals: true
			},
            modules: 'auto',
            shippedProposals: true,
		}],
	]

    const plugins = [
        'react-hot-loader/babel',
        '@babel/plugin-proposal-class-properties',
        '@loadable/babel-plugin'
    ]

    api.cache(false);

    return {
        presets,
        plugins
    };
}
