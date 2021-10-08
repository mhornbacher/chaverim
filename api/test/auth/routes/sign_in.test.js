'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../../src/server');
const otp = require('../../../src/auth/otp')

// set environment variables
process.env.AUTH_TOKEN_SECRET = '7x!A%D*G-JaNdRgUkXp2s5v8y/B?E(H+';

describe('POST /auth/sign_in', () => {
    let server;
    beforeEach(async () => server = await init());
    afterEach(async () => await server.stop());

    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/auth/sign_in',
            payload: {
                phone: '5555555555',
                password: '12345678'
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result.token).to.not.be.undefined();
    });

    it('responds with 401 for invalid login', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/auth/sign_in',
            payload: {
                phone: '5555555551',
                password: '12345678'
            }
        });
        expect(res.statusCode).to.equal(400);
    });

    it('responds with 401 for invalid otp', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/auth/sign_in',
            payload: {
                phone: '3477702297',
                password: '12345678',
                otp: '123456',
            }
        });
        expect(res.statusCode).to.equal(400);
    });

    it('responds with 200 for missing otp', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/auth/sign_in',
            payload: {
                phone: '3477702297',
                password: '12345678',
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result.token).to.be.undefined();
        expect(res.result.tfa_required).to.be.true();
    });

    it('responds with 200 and token for valid otp', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/auth/sign_in',
            payload: {
                phone: '3477702297',
                password: '12345678',
                otp: otp.token('HNMNBN6VG3OVILD6MVZKEA3S7SF6WHMS'),
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result.token).to.not.be.undefined();
        expect(res.result.tfa_required).to.be.undefined();
    });
});
