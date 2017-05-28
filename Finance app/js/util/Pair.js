export class Pair {


    constructor(name, askPrice, bidPrice) {
        this._name = name;
        this._askPrice = askPrice;
        this._bidPrice = bidPrice;
    }


    get name() {
        return this._name;
    }

    get askPrice() {
        return this._askPrice;
    }

    get bidPrice() {
        return this._bidPrice;
    }

}