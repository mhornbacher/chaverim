'use strict';

const bcrypt = require('bcrypt');
const password = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// mock list of test users for now
const users = [
    {
        name: 'Menachem Hornbacher',
        number: '3477702297',
        password: password('12345678'),
        otp: 'HNMNBN6VG3OVILD6MVZKEA3S7SF6WHMS',
    },
    {
        id: 2,
        name: 'Insecure',
        number: '5555555555',
        password: password('12345678'),
    }
]

/**
 * Find a user in the store
 * @param number {string} Users mobile phone number
 */
exports.find = (number) => {
    return users.find(user => user.number === number);
}
