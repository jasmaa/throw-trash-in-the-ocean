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
        this.totalPollution = 0;
        this.isDead = false;
        this.players = {};
        this.events = [];
        this.trash = [];
    }

    /**
     * Saves world state to db
     * @param {Pool} pool DB connection 
     */
    async save() {
        await pool.query(
            `UPDATE rooms SET pollution_level=$2, total_pollution=$3, is_dead=$4, destroyed_timestamp=(to_timestamp($5 / 1000.0)) WHERE room_name=$1`,
            [this.roomName, this.pollutionLevel, this.totalPollution, this.isDead, this.destroyedTimestamp.valueOf()],
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
                `INSERT INTO rooms (room_name, pollution_level, total_pollution, is_dead, created_timestamp, destroyed_timestamp) VALUES ($1, $2, $3, $4, NOW()::timestamp, NOW()::timestamp)`,
                [this.roomName, 0, 0, false],
            );
            res = await pool.query(`SELECT * FROM rooms WHERE room_name=$1`, [this.roomName]);
        }

        const worldData = res.rows[0];
        this.roomID = worldData['room_id'];
        this.pollutionLevel = worldData['pollution_level'];
        this.totalPollution = worldData['total_pollution']
        this.isDead = worldData['is_dead'];
        this.createdTimestamp = worldData['created_timestamp'];
        this.destroyedTimestamp = worldData['destroyed_timestamp'];

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
        this.events = eventRes.rows.map(v => {
            return {
                roomID: v['room_id'],
                userID: v['user_id'],
                eventType: v['event_type'],
                eventTimestamp: v['event_timestamp'],
            }
        });
    }

    /**
     * Update world
     * @param {Number} dt
     */
    update(dt) {

        const factor = 0.001 * dt;

        this.recover(factor * 30);

        // Update trash
        for (let i = 0; i < this.trash.length; i++) {
            this.trash[i].ttl -= factor;
            if (this.trash[i].ttl <= 0) {
                this.trash.splice(i, 1);
            }
        }
    }

    /**
     * Pollute world
     * @param {integer} n 
     */
    pollute(n) {
        this.pollutionLevel += n;
        this.totalPollution += n;

        for (let i = 0; i < n; i++) {
            this.trash.push({
                x: Math.floor(500 * Math.random()),
                y: Math.floor(500 * Math.random()),
                trashType: Math.floor(4 * Math.random()),
                ttl: 10,
                totalTTL: 10,
            });
        }
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
     * Kill world
     */
    kill() {
        this.isDead = true;
        this.destroyedTimestamp = new Date();
    }

    /**
     * Gets world health
     */
    getHealth() {
        return MAX_HEALTH - this.pollutionLevel;
    }

    /**
     * Get world statistics
     */
    getState() {

        const players = JSON.parse(JSON.stringify(this.players));
        for (const userID in players) {
            const player = players[userID];
            player.powerClickProfit = level2profit(player.powerClickLevel);
            player.powerClickCost = level2cost(player.powerClickLevel);
        }

        // Build JSON response
        if (this.isDead) {
            return {
                isDead: true,
                players: players,
                totalPollution: this.totalPollution,
                createdTimestamp: this.createdTimestamp,
                destroyedTimestamp: this.destroyedTimestamp,
            }
        } else {
            return {
                isDead: false,
                health: this.getHealth(),
                players: players,
                events: this.events.slice(0, 10),
                trash: this.trash,
            }
        }
    }
}

module.exports = World;