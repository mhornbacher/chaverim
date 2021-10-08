'use strict';
const Joi = require('joi');

module.exports = [
    // POST /sign_in
    require('./sign_in'),
    require('./token'),
]
