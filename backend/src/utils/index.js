const { getRandomValue, getRandomName } = require('./generate');
const { level2profit, level2cost } = require('./upgrades');

module.exports = {
    getRandomValue: getRandomValue,
    getRandomName: getRandomName,
    level2profit: level2profit,
    level2cost: level2cost,
}