'use strict';

// TOTP Implementation inspired by https://github.com/tacyarg/crypto-totp/blob/master/index.js

const crypto = require('crypto');
const base32 = require('hi-base32');

module.exports = {
    secret: secret,
    validate: validate,
    token: generate,
    uri: uri
}

// clock is every 30 seconds
const clock = () => Math.floor(Date.now() / 30_000);

/**
 * Generate secret for TFA tokens
 * @param length {number} optional length of key
 * @returns {string}
 */
function secret(length = 20) {
    const randomBuffer = crypto.randomBytes(length);
    return base32.encode(randomBuffer).replace(/=/g, '');
}

/**
 * Validate TOTP token
 * @param token {number|string} 7 digit TOTP token
 * @param secret {string} base32 secret to generate tokens
 * @param window {number} number of previous tokens to check
 * @returns {boolean}
 */
function validate(token, secret, window = 1) {
    for (let errorWindow = -window; errorWindow <= +window; errorWindow++) {
        const totp = generate(secret, errorWindow);
        if (token === totp) {
            return true;
        }
    }

    return false;
}

/**
 * Generate TOTP token
 * @param secret {string} Base32 secret
 * @param window {number} how far back to check for the key
 * @returns {string} 6 digit OTP code
 */
function generate(secret, window = 0) {
    let counter = clock() + window
    const decodedSecret = base32.decode.asBytes(secret);
    const buffer = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
        buffer[7 - i] = counter & 0xff;
        counter = counter >> 8;
    }

    // Step 1: Generate an HMAC-SHA-1 value
    const hmac = crypto.createHmac('SHA1', Buffer.from(decodedSecret));
    hmac.update(buffer);
    const hmacResult = hmac.digest();

    // Step 2: Generate a 4-byte string (Dynamic Truncation)
    const code = dynamicTruncationFn(hmacResult);

    // Step 3: Compute an HOTP value
    return (code % 10 ** 6).toString();

    function dynamicTruncationFn(hmacValue) {
        const offset = hmacValue[hmacValue.length - 1] & 0xf;

        return (
            ((hmacValue[offset] & 0x7f) << 24) |
            ((hmacValue[offset + 1] & 0xff) << 16) |
            ((hmacValue[offset + 2] & 0xff) << 8) |
            (hmacValue[offset + 3] & 0xff)
        );
    }
}

/**
 * Generate TOP uri for QR code
 * @param secret {string} base32 secret from secret() function
 * @param account {string} optional account name
 * @param issuer {string} optional override for "chaverim"
 * @returns {string} TOTP URL for 1Password, Google Authenticator, Authy...
 */
function uri(secret, account=undefined, issuer="CH Chaverim") {
    // Full OTPAUTH URI spec as explained at
    // https://github.com/google/google-authenticator/wiki/Key-Uri-Format
    return 'otpauth://totp/'
        + encodeURI(issuer) + ':' + encodeURI(account || secret)
        + '?secret=' + secret.replace(/[\s._\-]+/g, '').toUpperCase()
        + '&issuer=' + encodeURIComponent(issuer)
        + '&algorithm=SHA1'
        + '&digits=6'
        + '&period=30'
}
