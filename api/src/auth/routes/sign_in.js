'use strict';
const Joi = require('joi');
const Boom = require('@hapi/boom');
const {decrypt, encrypt} = require("../utils");

// POST /sign_in
module.exports = {
    method: 'POST',
    path: '/auth/sign_in',
    options: {
        validate: {
            payload: Joi.object({
                token: Joi.string().base64(),
                otp: Joi.number()
            }),
        },
    },
    handler: function (request, h) {
        let number, otp, expires;
        // 1. Decrypt token for number and otp
        try {
            ({ number, otp, expires } = JSON.parse(decrypt(request.payload.token)));
        } catch {
            return Boom.badRequest("Invalid Token/OTP");
        }

        // 2. Validate OTP
        if (request.payload.otp !== otp)
            throw new Boom.badRequest('Invalid Token/OTP');

        // 3. Validate token expiration
        if (new Date() - new Date(expires) >= 0)
            throw new Boom.badRequest('Invalid Token/OTP');

        // 3. Return authentication header token
        return { number, token: encrypt('hello world') };
    },
}
