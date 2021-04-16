'use strict';

import express from 'express'
import cookieParser from 'cookie-parser'

// import helmet from 'helmet'
import cors from 'cors'
import session from 'express-session'
import logger from 'morgan'

import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'

const DEV_MODE = process.env.NODE_ENV !== 'production'

const options = {
    host: process.env.SERVER_HOST || '0.0.0.0',
    port: parseInt(process.env.SERVER_PORT) || 3000,
    session: {
        secret: process.env.SESSION_SECRET || 'ebo la la laaa',
        maxage: parseInt(process.env.SESSION_MAXAGE) || 3600,
        secure: process.env.SESSION_SECURE || false,
    }
}

let compiler, client, server

if (DEV_MODE) {
    const clientConfig = require('./config/client.webpack.js')
    // const serverConfig = require('./config/server.webpack.js')

    compiler = webpack([ clientConfig /** * /, serverConfig /** */ ])

    client = compiler.compilers.reduce((a, c) => c.name === 'client' && c || a)
    // server = compiler.compilers.reduce((a, c) => c.name === 'server' && c || a)
}

import Api from './src/Api';

(async () => {
    let server
    try {
        express.static.mime.define({ 'application/json': [ 'json' ] })

        const app = express()

        app.use(logger("dev"))
        app.use(cors())
        // app.use(helmet())
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser())
        app.use(session({
            secret: options.session.secret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: options.session.maxage * 1000,
                secure: options.session.secure,
                sameSite: true
            }
        }))

        if (DEV_MODE) {
            app.use(webpackDevMiddleware(compiler, {
                noInfo: true,
                publicPath: client.options.output.publicPath || '/',
                serverSideRender: true,
                index: true,
                ...client.options.devServer
            }))

            app.use(webpackHotMiddleware(compiler, {
                log: console.log,
                path: '/__webpack_hmr',
                heartbeat: 2000,
            }))
        } else {
            app.use('/', express.static('dist'));
        }

        app.use(Api);

        server = app.listen(options.port, options.host, (err) => {
            if (err) throw err

            console.log(`Listening on ${ options.host }:${ options.port }`)
        })

    } catch (err) {
        console.error(err)
        process.exitCode = 1

    } finally {
        if (server && server.listening) server.close()
    }
})()

