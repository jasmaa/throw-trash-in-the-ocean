// upgrades.js
// Functions for game upgrades

const level2profit = level => 5 * level + 1;

const presetCosts = [100, 200, 400, 600, 800, 1200, 1500, 3000, 5000, 10000];
const level2cost = level => {
    return level < presetCosts.length
        ? presetCosts[level]
        : 2 ** level
};

module.exports = {
    level2profit: level2profit,
    level2cost: level2cost,
}