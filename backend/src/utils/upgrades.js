// upgrades.js
// Functions for game upgrades

const presetProfits = [1, 2, 4, 8, 10, 30, 50, 80, 100, 150];
const level2profit = level => {
    return level < presetProfits.length
        ? presetProfits[level]
        : 15 * level;
};

const presetCosts = [100, 200, 400, 600, 800, 1200, 1500, 3000, 5000, 10000];
const level2cost = level => {
    return level < presetCosts.length
        ? presetCosts[level]
        : 2 ** level;
};

module.exports = {
    level2profit: level2profit,
    level2cost: level2cost,
}