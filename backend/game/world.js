// world.js
// Room world

const MAX_HEALTH = 100;

/**
 * Room world
 */
class World {

    constructor(roomName, pollutionLevel, isDead) {
        this.roomName = roomName
        this.pollutionLevel = pollutionLevel;
        this.isDead = isDead;
    }

    pollute(n) {
        this.pollutionLevel += n;
    }

    recover(n){
        this.pollutionLevel -= 1*n;
        this.pollutionLevel = Math.max(this.pollutionLevel, 0);
    }

    getStat(){
        return {
            health: MAX_HEALTH - this.pollutionLevel,
        }
    }
}

module.exports = World;