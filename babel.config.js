const DEV_MODE = process.env.NODE_DEV !== 'production'

module.exports = {

    presets: [
        [ "@babel/preset-react", {
            useBuiltIns: true,
            // useSpread: true,
            // development: process.env.BABEL_ENV === "development"
        } ],
        [ "@babel/preset-env", {
            targets: {
                esmodules: true,
                node: "current",
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
        } ],
    ].filter(Boolean),

    plugins: [
        ...(DEV_MODE && [ 'react-hot-loader/babel' ]),
        [ "@babel/plugin-proposal-decorators", {
            legacy: true,
        } ],
        [ '@babel/plugin-proposal-class-properties', {
            loose: true
        } ],
        [ "@babel/plugin-proposal-private-methods", {
            loose: true
        } ],
        [ "@babel/plugin-transform-runtime", {
            corejs: {
                version: 3,
                proposals: true
            },
        } ],
        '@loadable/babel-plugin'
    ].filter(Boolean)

}
