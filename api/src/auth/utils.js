'use strict';

const crypto = require('crypto');

/**
 * Generate a random number between an upper and lower bound
 * @param min {number}
 * @param max {number}
 * @returns {number}
 */
exports.between = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Generate a random number x digits long, insecure and never starts with 0
 * @param digits {number}
 * @returns {number}
 */
exports.randomNumber = (digits) => {
    return digits <= 0 ? 0 : exports.between(10 ** (digits - 1), 10 ** digits - 1);
}

const algorithm = 'aes-256-cbc';
const key = '7x!A%D*G-JaNdRgUkXp2s5v8y/B?E(H+'; // TODO get from environment

/**
 * Encrypt any payload using AES 256 encryption
 * @param data {string | NodeJS.ArrayBufferView} encryptable data type
 * @param encoding {('base64'|'base64url'|'hex')} encoding to use, defaults to base64
 * @returns {string}
 */
exports.encrypt = (data, encoding = 'base64') =>{
    const iv = crypto.randomBytes(16); // salt included in token
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

    // iv:cipher base64 encoded
    return Buffer.from(`${iv.toString('hex')}:${encrypted.toString('hex')}`).toString(encoding);
}

/**
 * Decrypt cipher encrypted by encrypt function
 * @param text {string} encoded iv:content
 * @param encoding {('base64'|'base64url'|'hex')} encoding used
 * @returns {string}
 */
exports.decrypt = (text, encoding = 'base64') => {
    const algorithm = 'aes-256-cbc';

    // decode and split base64 string
    let [iv, content] = Buffer.from(text, encoding).toString('ascii').split(':');

    // decode the hex payloads in encoded string
    iv = Buffer.from(iv, 'hex');
    content = Buffer.from(content, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    return Buffer.concat([decipher.update(content, 'base64'), decipher.final()]).toString();
}
