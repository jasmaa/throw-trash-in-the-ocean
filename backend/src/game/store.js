// store.js
// Interface with DB

const pool = require('../config/dbConfig');
const { getRandomValue, getRandomName } = require('../utils');

/**
 * User
 */
const User = {

    async createOrGet(userID) {
        const res = await pool.query(`SELECT * FROM users WHERE user_id=$1`, [userID]);
        let userHandle;

        if (res.rowCount <= 0) {
            userID = getRandomValue(30);
            userHandle = getRandomName();

            await pool.query(
                `INSERT INTO users (user_id, user_handle) VALUES ($1, $2)`,
                [userID, userHandle],
            );
        } else {
            userHandle = res.rows[0]['user_handle']
        }

        return {
            userID: userID,
            userHandle: userHandle,
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
        let currProfit = 0;
        let powerClickLevel = 0;

        if (res.rowCount <= 0) {
            await pool.query(
                `INSERT INTO players (user_id, room_id, profit, power_click_level) VALUES ($1, $2, $3, $4)`,
                [userID, roomID, 0, 0],
            )
        } else {
            currProfit = res.rows[0]['profit'];
            powerClickLevel = res.rows[0]['power_click_level'];
        }

        return {
            userID: userID,
            userHandle: userHandle,
            profit: currProfit,
            powerClickLevel: powerClickLevel,
        }
    },

    async updateProfit(userID, roomID, profit) {
        await pool.query(
            `UPDATE players SET profit=$3 WHERE user_id=$1 AND room_id=$2`,
            [userID, roomID, profit],
        );
    },

    async updateClickLevel(userID, roomID, level) {
        await pool.query(
            `UPDATE players SET power_click_level=$3 WHERE user_id=$1 AND room_id=$2`,
            [userID, roomID, level],
        )
    },
}

/**
 * Room event
 */
const Event = {

    async createEvent(roomID, userID, eventType) {

        const res = await pool.query(
            `INSERT INTO events (room_id, user_id, event_type, event_timestamp) VALUES ($1, $2, $3, NOW()::timestamp) RETURNING event_id`,
            [roomID, userID, eventType],
        );

        if (res.rowCount != 1) {
            return;
        }

        return {
            eventID: res.rows[0]['event_id'],
            roomID: roomID,
            userID: userID,
            eventType: eventType,
            eventTimestamp: new Date(),
        };
    },
}

module.exports = {
    User: User,
    Player: Player,
    Event: Event,
}