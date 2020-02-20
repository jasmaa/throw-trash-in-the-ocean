// world.js
// Room world

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
    }

    /**
     * Saves world state to db
     * @param {Pool} pool DB connection 
     */
    async save(pool) {
        await pool.query(
            `UPDATE rooms SET pollution_level=$2, is_dead=$3 WHERE room_name=$1`,
            [this.roomName, this.pollutionLevel, this.isDead],
        );
    }

    /**
     * Read world from db or create a new one
     * @param {Pool} pool DB connection
     */
    async readOrCreate(pool) {

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
        return {
            health: MAX_HEALTH - this.pollutionLevel,
        }
    }
}

module.exports = World;