const crypto = require('crypto');

/**
 * Generate cryptographically secure hex string
 * @param {integer} n Number of bytes
 */
function getRandomValue(n) {
    return crypto
        .randomBytes(Math.ceil(n / 2))
        .toString('hex')
        .slice(0, n);
}

module.exports = {
    getRandomValue: getRandomValue,
}