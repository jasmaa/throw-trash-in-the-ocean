// world.js
// Room world

const MAX_HEALTH = 100;

/**
 * Room world
 */
class World {

    constructor(roomName) {
        this.roomName = roomName
        this.pollutionLevel = 0;
        this.isDead = false;
    }

    /**
     * Saves world state to db
     * @param {Pool} pool DB connection 
     */
    save(pool) {
        pool.query(
            `UPDATE rooms SET pollution_level=$2, is_dead=$3 WHERE room_name=$1`,
            [this.roomName, this.pollutionLevel, this.isDead],
        )
            .catch(err => console.err(err));
    }

    /**
     * Read world from db or create a new one
     * @param {Pool} pool DB connection
     */
    readOrCreate(pool) {
        pool.query(`SELECT * FROM rooms WHERE room_name=$1`, [this.roomName])
            .then(res => {
                if (res.rowCount <= 0) {
                    return pool.query(
                        `INSERT INTO rooms (room_name, pollution_level, is_dead) VALUES ($1, $2, $3)`,
                        [roomName, 0, false],
                    );
                } else {
                    const worldData = res.rows[0];
                    this.pollutionLevel = worldData['pollution_level'];
                    this.isDead = worldData['is_dead'];
                }
            })
            .catch(err => console.err(err));
    }

    /**
     * Update world
     */
    update(){
        this.recover(1);
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