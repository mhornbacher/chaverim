'use strict';
const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: 3000,
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

exports.init = async () => {
    await server.initialize();
    return server;
}

exports.start = async() => {
    await server.start();
    console.log('Server running on %s', server.info.uri);
    return server;
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
