const Lab = require('@hapi/lab');
const URL = require("url").URL;
const { expect } = require('@hapi/code');
const otp = require("../../src/auth/otp");
const { describe, it } = exports.lab = Lab.script();

describe('otp', () => {
    const secret = otp.secret();
    // console.log(otp.token('HNMNBN6VG3OVILD6MVZKEA3S7SF6WHMS'));

    it ('generates valid secrets', () => {
        const token = otp.token(secret);
        expect(otp.validate(token, secret)).to.be.true();
    });

    it ('invalidates expired tokens', () => {
        const token = otp.token(secret, 3)
        expect(otp.validate(token, secret)).to.be.false();
    });

    it ('generates valid URI\'s', () => {
        const url = new URL(otp.uri(secret, "3477702297", "CH Chaverim"));

        expect(url.protocol).to.equal('otpauth:');
        expect(url.host).to.equal('totp');
        expect(url.pathname).to.equal(encodeURI('/CH Chaverim:3477702297'));
        expect(url.searchParams.get('secret')).to.equal(secret);
        expect(url.searchParams.get('issuer')).to.equal("CH Chaverim");
        expect(url.searchParams.get('algorithm')).to.equal("SHA1");
        expect(url.searchParams.get('digits')).to.equal("6");
        expect(url.searchParams.get('period')).to.equal("30");
    });
});
