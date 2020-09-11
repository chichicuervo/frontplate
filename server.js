'use strict';

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';

import serverConfig from './config/server.webpack.js'
import clientConfig from './config/client.webpack.js'

const DEV_MODE = process.env.NODE_ENV !== 'production';

const compiler = webpack([ clientConfig, serverConfig ]);

const client = compiler.compilers.reduce((a,c) => c.name === 'client' && c || a)
const server = compiler.compilers.reduce((a,c) => c.name === 'server' && c || a)

express.static.mime.define({'application/json': ['json']});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

if (DEV_MODE) {
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: client.options.output.publicPath || '/',
        serverSideRender: true,
        index: true,
        ...client.options.devServer
    }));

    app.use(webpackHotMiddleware(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 2000,
    }));
} else {
    app.use(client.options.output.publicPath || '/', express.static('dist'));
}

import Api from './src/Api';

app.use(Api);

const options = {
    port: process.env.BIND_PORT || 80,
    host: process.env.BIND_HOST || '0.0.0.0',
    ...(DEV_MODE && server.options.devServer || undefined)
}

app.listen(options.port, options.host, (err) => {
    if (err) {
        throw err;
    }
    console.log(( DEV_MODE ? '[DEV] ' : '' ) + `Listening on ${options.host}:${options.port}`);
});
