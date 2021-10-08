'use strict';
const Joi = require('joi');
const {randomNumber, encrypt} = require("../utils");

// POST /sign_in
module.exports = {
    method: 'POST',
    path: '/auth/token',
    options: {
        validate: {
            payload: Joi.object({
                number: Joi.string(),
            }),
        },
    },
    handler: function (request, h) {
        const expire_minutes = 5;

        // 1. Generate OTP code
        const otp = randomNumber(6); // 6 digit one time pin code

        // 2. Send via SMS
        require('../../util/sms').send(request.payload.number,
            `Your Chaverim verification code is: ${otp}\n\n`
            + `Expires in ${expire_minutes} minutes`);

        // 3. Return encrypted token
        const token = encrypt(JSON.stringify({
            number: request.payload.number,
            otp,
            expires: new Date().getTime() + (expire_minutes * 60 * 1_000),
        }));

        return { token };
    },
}
