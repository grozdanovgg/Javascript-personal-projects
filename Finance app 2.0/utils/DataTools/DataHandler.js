const Pair = require('../Pair');
async function getAllExchangePairsOHCL(exchange) {
    try {
        const pairs = exchange.pairs;
        const interval = exchange.interval;
        const result = [];
        for (let pairName of pairs) {
            const newPair = new Pair(pairName, exchange.name);
            await newPair.OHLC(interval)
                .then((info) => {
                    // console.log('Pushed one more');
                    result.push(info);
                })
                .catch((err) => {
                    console.log('in the error of newPair.OHLC');
                    return console.log(err);
                })
        };
        return result;
    } catch (err) {
        console.log('in the error of getAllExchangePairsOHCL');
        return console.log(err);
    }
}
const get = {
    getAllExchangesOHCL: async(exchanges) => {
        const exchangesResult = [];
        for (let exchange of exchanges) {
            await getAllExchangePairsOHCL(exchange)
                .then((result) => {
                    exchangesResult.push(result);
                })
        };
        return exchangesResult
    }
}
module.exports = get;
