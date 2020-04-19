// generate.js
// Random generation functions

const crypto = require('crypto');

const names1 = ['lustful', 'gluttonous', 'greedy', 'slothful', 'wrathful', 'envious', 'prideful'];
const names2 = ['anglerfish', 'turtle', 'hippo', 'rabbit', 'duck', 'mallard', 'leopon', 'anteater', 'shark'];

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

function getRandomName() {
    return `${names1[Math.floor(Math.random() * names1.length)]}-${names2[Math.floor(Math.random() * names2.length)]}`;
}

module.exports = {
    getRandomValue: getRandomValue,
    getRandomName: getRandomName,
}