'use strict';

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';

const DEV_MODE = process.env.NODE_ENV !== 'production';

let compiler, client, server

if (DEV_MODE) {
    const serverConfig = require('./config/server.webpack.js')
    const clientConfig = require('./config/client.webpack.js')

    compiler = webpack([ clientConfig, serverConfig ]);

    client = compiler.compilers.reduce((a,c) => c.name === 'client' && c || a)
    server = compiler.compilers.reduce((a,c) => c.name === 'server' && c || a)
}

express.static.mime.define({'application/json': ['json']});

const app = express();

app.use(cors())

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
    app.use(client && client.options.output.publicPath || '/', express.static('dist'));
}

import Api from './src/Api';

app.use(Api);

const options = {
    port: process.env.BIND_PORT || 80,
    host: process.env.BIND_HOST || '0.0.0.0',
    ...(DEV_MODE && server && server.options.devServer || undefined)
}

app.listen(options.port, options.host, (err) => {
    if (err) {
        throw err;
    }
    console.log(( DEV_MODE ? '[DEV] ' : '' ) + `Listening on ${options.host}:${options.port}`);
});
