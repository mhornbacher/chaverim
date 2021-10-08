const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const {between, randomNumber, encrypt, decrypt} = require("../../src/auth/utils");
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();

describe('utils', () => {
    describe('between', () => {
        it('99 - 100', () => {
            expect(between(99, 100)).to.be.between(98, 100);
        });

        it ('-100 - 99999', () => {
            expect(between(-100, 99_999)).to.be.between(-101, 99_999);
        });

        it ('-100 - -10', () => {
            expect(between(-100, -10)).to.be.between(-101, -10);
        });

        it ('still works if to is less then from', () => {
            expect(between(10, 5)).to.be.between(4, 10);
        });
    });

    describe('randomNumber', () => {
        it('3 digits', () => {
            expect(randomNumber(3)).to.be.between(10 ** 2, 10 ** 3);
        });

        it('308 digits', () => {
            expect(randomNumber(308)).to.be.between(10 ** 307, 10 ** 308);
        });

        it('309 digits is infinity (Number.MAX_VALUE length)', () => {
            expect(randomNumber(309)).to.be.equal(Infinity);
        });

        it('310 digits is NaN', () => {
            expect(randomNumber(310)).to.be.equal(NaN);
        })

        it('below 0', () => {
            expect(randomNumber(-10)).to.be.equal(0);
        });
    });

    describe('encrypt/decrypt', () => {
        const message = 'hello world';
        it('Uses unique IV\'s to scramble message', () => {
            expect(encrypt(message)).to.not.equal(encrypt(message));
        });

        it('Can decrypt what it encrypts', () => {
            expect(decrypt(encrypt(message))).to.equal(message);
        });

        it('Supports base64url encoding', () => {
            expect(decrypt(encrypt(message, 'base64url'), 'base64url')).to.equal(message);
        });

        it('Supports hex encoding', () => {
            expect(decrypt(encrypt(message, 'hex'), 'hex')).to.equal(message);
        });
    });
});
