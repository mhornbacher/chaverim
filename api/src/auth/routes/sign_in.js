'use strict';
const Joi = require('joi');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const userStore = require('../../users/store');
const { validate } = require('../otp');
const jwt = require('@hapi/jwt');
// const jwt.js = require("jsonwebtoken");

// POST /sign_in
module.exports = {
    method: 'POST',
    path: '/auth/sign_in',
    options: {
        auth: false, // do not require authentication to sign in ;)
        validate: {
            payload: Joi.object({
                phone: Joi.string().min(10).required(),
                password: Joi.string().min(8).required(),
                otp: Joi.string().length(6).optional(),
            }),
        },
    },
    handler: async function (request, h) {
        const user = userStore.find(request.payload.phone);

        // Security issue: low priority
        // subject to timing attack as if username is not present password hash is never checked
        if (!user || await bcrypt.compare(request.payload.password, user.password) === false) {
            return Boom.badRequest("Invalid username/password");
        }

        // inform client if TFA is required
        if (user.otp && !request.payload.otp) {
            return { tfa_required: true }
        }

        // validate OTP code from user, allow for one previous
        if (user.otp && !validate(request.payload.otp, user.otp, 1)) {
            return Boom.badRequest("Invalid 2fa code");
        }

        // generate JWT including user number (unique username)
        const token = require('../jwt').generate(user.number);
        return { token }
    },
}
