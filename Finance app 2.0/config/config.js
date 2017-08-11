const pairs = ['ETHEUR', /*'BTCEUR'*/ ]
const exchanges = [{
    name: 'kraken',
    pairs,
    interval: 1440,
}];
const indexes = {
    nPeriod: 10
}

module.exports = {
    exchanges,
    indexes
}
