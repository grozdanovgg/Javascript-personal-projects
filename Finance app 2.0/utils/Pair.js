const data = require('./APIDataParser/data');

class Pair {
    constructor(pairName, exchange) {
        this._name = pairName;
        this._exchange = exchange;
    }
    get name() {
        return this._name;
    }
    get exchange() {
        return this._exchange;
    }

    OHLC(interval) {
        return data.OHLC(this.name, this.exchange, interval);
    }
}

module.exports = Pair;
