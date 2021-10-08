'use strict';

// POST /sign_in
module.exports = {
    method: 'POST',
    path: '/auth/token',
    handler(request) {
        return {
            token: require('../jwt').generate(request.auth.credentials.user)
        }
    },
}
