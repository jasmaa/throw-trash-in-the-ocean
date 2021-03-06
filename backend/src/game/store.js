// store.js
// Interface with DB

const pool = require('../config/dbConfig');
const { getRandomValue, getRandomName } = require('../utils');

/**
 * User
 */
const User = {

    async create() {

        const userID = getRandomValue(30);
        const userSecret = getRandomValue(30);
        const userHandle = getRandomName();

        await pool.query(
            `INSERT INTO users (user_id, user_secret, user_handle) VALUES ($1, $2, $3)`,
            [userID, userSecret, userHandle],
        );

        return {
            userID: userID,
            userSecret: userSecret,
            userHandle: userHandle,
        }
    },

    async get(userID) {
        const res = await pool.query(`SELECT * FROM users WHERE user_id=$1`, [userID]);
        if (res.rowCount <= 0) {
            return null;
        } else {
            return {
                userID: res.rows[0]['user_id'],
                userSecret: res.rows[0]['user_secret'],
                userHandle: res.rows[0]['user_handle'],
            }
        }
    },

    async updateHandle(userID, userHandle) {
        await pool.query(
            `UPDATE users SET user_handle=$2 WHERE user_id=$1`,
            [userID, userHandle],
        );
    },
}

/**
 * Player
 */
const Player = {

    async createOrGet(userInfo, roomID) {

        const { userID, userHandle } = userInfo;

        const res = await pool.query(
            `SELECT * FROM players WHERE user_id=$1 AND room_id=$2`,
            [userID, roomID],
        );
        let playerID;
        let currProfit = 0;
        let powerClickLevel = 0;

        if (res.rowCount <= 0) {
            const insertRes = await pool.query(
                `INSERT INTO players (user_id, room_id, profit, power_click_level) VALUES ($1, $2, $3, $4) RETURNING player_id`,
                [userID, roomID, 0, 0],
            );
            playerID = insertRes.rows[0]['player_id'];

        } else {
            playerID = res.rows[0]['player_id'];
            currProfit = res.rows[0]['profit'];
            powerClickLevel = res.rows[0]['power_click_level'];
        }

        return {
            playerID: playerID,
            userID: userID,
            userHandle: userHandle,
            profit: currProfit,
            powerClickLevel: powerClickLevel,
        }
    },

    async updateProfit(playerID, profit) {
        await pool.query(
            `UPDATE players SET profit=$2 WHERE player_id=$1`,
            [playerID, profit],
        );
    },

    async updateClickLevel(playerID, level) {
        await pool.query(
            `UPDATE players SET power_click_level=$2 WHERE player_id=$1`,
            [playerID, level],
        );
    },
}

/**
 * Pet
 */
const Pet = {

    // TODO: make these funcs??
    FEED_RESTORE_TIME: 3600000, // 1hr
    MAX_LIFETIME: 24 * 3600000, // 24hr

    async createOrGet(playerID) {

        const res = await pool.query(
            `SELECT * FROM pets WHERE player_id=$1`,
            [playerID],
        );

        let expiryTimestamp = Date.now() + this.MAX_LIFETIME;
        let hatType = 0;

        if (res.rowCount <= 0) {
            await pool.query(
                `INSERT INTO pets (player_id, expiry_timestamp, hat_type) VALUES ($1, (to_timestamp($2 / 1000.0)), $3)`,
                [playerID, expiryTimestamp.valueOf(), hatType],
            )
        } else {
            expiryTimestamp = res.rows[0]['expiry_timestamp'];
            hatType = res.rows[0]['hat_type'];
        }

        return {
            expiryTimestamp: expiryTimestamp,
            hatType: hatType,
        }
    },

    async feed(playerID) {
        const res = await pool.query(
            `SELECT * FROM pets WHERE player_id=$1`,
            [playerID],
        );

        const newExpiry = Math.min(
            res.rows[0]['expiry_timestamp'].valueOf() + this.FEED_RESTORE_TIME,
            Date.now() + this.MAX_LIFETIME,
        );

        await pool.query(
            `UPDATE pets SET expiry_timestamp=(to_timestamp($2 / 1000.0)) WHERE player_id=$1`,
            [playerID, newExpiry],
        );

        return new Date(newExpiry);
    },

    async revive(playerID) {
        const newExpiry = Date.now() + this.MAX_LIFETIME;

        await pool.query(
            `UPDATE pets SET expiry_timestamp=(to_timestamp($2 / 1000.0)) WHERE player_id=$1`,
            [playerID, newExpiry],
        );

        return new Date(newExpiry);
    },
}

/**
 * Room event
 */
const Event = {

    async createEvent(roomID, userID, eventType, content = '') {

        const res = await pool.query(
            `INSERT INTO events (room_id, user_id, event_type, content, event_timestamp) VALUES ($1, $2, $3, $4, NOW()::timestamp) RETURNING event_id`,
            [roomID, userID, eventType, content],
        );

        if (res.rowCount !== 1) return;

        return {
            eventID: res.rows[0]['event_id'],
            roomID: roomID,
            userID: userID,
            eventType: eventType,
            content: content,
            eventTimestamp: new Date(),
        };
    },
}

module.exports = {
    User: User,
    Player: Player,
    Pet: Pet,
    Event: Event,
}