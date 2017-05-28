export class Ticker {

    constructor(name) {
        this._name = name;
    }


    get name() {
        return this._name;
    }


    set prices(pricesObj) {
        this._prices = pricesObj;
    }
    get prices() {
        return this._prices;
    }


    set diference(obj) {
        this._diference = obj;
    }
    get diference() {
        return this._diference;
    }
}



class Validator {

    static string(input) {
        if (typeof input !== 'string') {
            throw Error('input is not a string');
        }
    }
    static stringLength(input, minLength, maxlength) {
        if (input.length < minLength || input.length > maxlength) {
            throw Error('input is below or above lenght limit')
        }
    }
    static isNumeric(input) {
        if (isNaN(input)) {
            throw Error('input is not a number')
        }
    }
}