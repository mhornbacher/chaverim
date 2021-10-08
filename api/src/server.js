'use strict';

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

let server;
async function setup() {
    if (server)
        return server;

    server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost',
        routes: {
            // return detailed errors to client
            validate: {
                async failAction(req, h, err) { throw err; },
            },
        },
    });

    server.route([
        ...require('./auth/routes')
    ]);

    await require('./auth/jwt').register(server, 'jwt_strategy');
    server.auth.default('jwt_strategy');
}

exports.init = async () => {
    await setup();
    await server.initialize();
    return server;
}

exports.start = async() => {
    await setup();
    await server.start();
    console.log('Server running on %s', server.info.uri);
    return server;
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
