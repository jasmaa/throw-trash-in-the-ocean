
const MAX_HEALTH = 100;

class World {

    constructor() {
        this.health = MAX_HEALTH;
    }

    pollute(n) {
        this.health -= n;
    }

    recover(n){
        this.health += n;
        this.health = Math.min(this.health, MAX_HEALTH);
    }

    getStat(){
        return {
            health: this.health,
        }
    }
}

module.exports = {
    World, World,
}