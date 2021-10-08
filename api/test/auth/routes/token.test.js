'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../../src/server');

describe('POST /auth/token', () => {
    let server;
    beforeEach(async () => server = await init());
    afterEach(async () => await server.stop());

    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/auth/token',
            payload: {
                number: '3477702297'
            }
        });
        expect(res.statusCode).to.equal(200);
    });
});
