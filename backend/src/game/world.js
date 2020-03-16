// world.js
// Room world

const pool = require('../config/dbConfig');
const { level2cost, level2profit } = require('../utils');

const MAX_HEALTH = 100;

/**
 * Room world
 */
class World {

    constructor(roomName) {
        this.roomName = roomName;
        this.roomID = null;
        this.pollutionLevel = 0;
        this.isDead = false;
        this.players = {};
        this.events = [];
    }

    /**
     * Saves world state to db
     * @param {Pool} pool DB connection 
     */
    async save() {
        await pool.query(
            `UPDATE rooms SET pollution_level=$2, is_dead=$3 WHERE room_name=$1`,
            [this.roomName, this.pollutionLevel, this.isDead],
        );
    }

    /**
     * Read world from db or create a new one
     * @param {Pool} pool DB connection
     */
    async readOrCreate() {

        let res = await pool.query(`SELECT * FROM rooms WHERE room_name=$1`, [this.roomName]);

        // Create if doesn't exist
        if (res.rowCount <= 0) {
            await pool.query(
                `INSERT INTO rooms (room_name, pollution_level, is_dead) VALUES ($1, $2, $3)`,
                [this.roomName, 0, false],
            );
            res = await pool.query(`SELECT * FROM rooms WHERE room_name=$1`, [this.roomName]);

        }

        const worldData = res.rows[0];
        this.roomID = worldData['room_id'];
        this.pollutionLevel = worldData['pollution_level'];
        this.isDead = worldData['is_dead'];

        // Init player cache
        const playerRes = await pool.query(
            `SELECT users.user_id, user_handle, profit FROM users
                JOIN players ON users.user_id=players.user_id
                WHERE room_id=$1`,
            [this.roomID]
        );
        for (const player of playerRes.rows) {
            this.players[player['user_id']] = {
                userID: player['user_id'],
                userHandle: player['user_handle'],
                profit: player['profit'],
                powerClickLevel: player['power_click_level'],
                lastActionTime: 0,
            }
        }

        // Init event cache
        const eventRes = await pool.query(
            `SELECT * FROM events WHERE room_id=$1 ORDER BY event_timestamp DESC LIMIT 10`,
            [this.roomID],
        );
        eventRes.rows.forEach(data => data.event_timestamp = Date.parse(data.event_timestamp));
        this.events = eventRes.rows;
    }

    /**
     * Update world
     */
    update() {
        this.recover(30);
    }

    /**
     * Pollute world
     * @param {integer} n 
     */
    pollute(n) {
        this.pollutionLevel += n;
    }

    /**
     * Recover from pollution
     * @param {integer} n 
     */
    recover(n) {
        this.pollutionLevel -= 1 * n;
        this.pollutionLevel = Math.max(this.pollutionLevel, 0);
    }

    /**
     * Get world statistics
     */
    getStat() {

        const players = JSON.parse(JSON.stringify(this.players));
        for (const userID in players) {
            const player = players[userID];
            player.powerClickProfit = level2profit(player.powerClickLevel);
            player.powerClickCost = level2cost(player.powerClickLevel);
        }

        return {
            health: MAX_HEALTH - this.pollutionLevel,
            players: players,
            events: this.events.slice(0, 10),
        }
    }
}

module.exports = World;