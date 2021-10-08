'use strict';

const Jwt = require("@hapi/jwt");
const Hapi = require("@hapi/hapi");

/**
 * Register JWT plugin with server
 * @param server {Hapi.server}
 * @param name {string}
 * @returns {Promise<void>}
 */
exports.register = async function register(server, name) {
    await server.register(Jwt);
    server.auth.strategy(name, 'jwt', {
        keys: process.env.AUTH_TOKEN_SECRET,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: 14_400, // 4 hours
        },
        validate: (artifacts, request, h) => {
            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload.user }
            };
        }
    });
}

/**
 * Generate 4 hour JWT token for application, specifically in unit tests
 * @param number {string}
 * @returns {string}
 */
exports.generate = function generate(number) {
    return Jwt.token.generate(
        { user: number }, // numbers are unique user identifiers
        { key: process.env.AUTH_TOKEN_SECRET }, // algorithm optional
        { ttl: 14_400 }); // 4 hour TTL before refresh
}
