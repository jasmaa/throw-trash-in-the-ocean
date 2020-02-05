
class Player {
    constructor(client, id) {
        this.client = client;
        this.id = id;
        this.profit = 0;
    }

    gainProfit(n) {
        this.profit += n;
    }
}

module.exports = Player;